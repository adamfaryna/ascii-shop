angular.module('app').provider('productService',
  ['defaultProductFetchLimit', function(defaultProductFetchLimit) {
    'use strict';

    let fetchLimit = defaultProductFetchLimit;

    this.setFetchLimit = limit => {
      fetchLimit = limit;
    };

    this.$get =
      ['$log', '$q', '$http', 'serverAddress', 'sortTypes', 'utils',
      ($log, $q, $http, serverAddress, sortTypes, utils) => {
        const Sort = require('../model/sort.es6');
        const ProductElement = require('../view/grid/productElement.es6');

        const cacheByPrice = [];
        const cacheBySize = [];
        const cacheById = [];

        let noMoreData = false;

        let fetchPromise = $q.resolve();

        prefetchData();

        function prefetchData() {
          return $q( resolve => {
            sortTypes.forEach( sort => fetchProducts(new Sort(sort, null)));
            resolve();
          });
        }

        function fetchProducts(sort, limit = fetchLimit) {
          const cache = getCache(sort);

          fetchPromise = fetchPromise
          .then( () => pullProducts(cache.length, calcFetchLimit(limit)))
          .then( res => {
            if (res && res.length !== 0) {
              noMoreData = false;

              res.data.forEach( item => {
                cache.push(new ProductElement(item));
              });

            } else {
              noMoreData = true;
            }
          })
          .catch($log.error);

          return fetchPromise;
        }

        /**
         * Change cache elements order. Chainable.
         */
        function sortCache(sortObj) {
          let sortCallback;

          if (sortObj.sortOrder === 'ascending') {
            sortCallback = (a, b) => a[sortObj.sortType] - b[sortObj.sortType];

          } else {
            sortCallback = (a, b) => b[sortObj.sortType] - a[sortObj.sortType]
          }

          return getCache(sortObj).sort(sortCallback);
        }

        function calcFetchLimit(clientLimit = fetchLimit) {
          return clientLimit <= fetchLimit ? fetchLimit : clientLimit;
        }

        function getCache(sort) {
          switch (sort.sortType) {
          case 'price': return cacheByPrice;
          case 'size': return cacheBySize;
          case 'id': return cacheById;
          default: throw Error('Invalid sort type');
          }
        }

        function prepareQueryParams(limit, sort) {
          let limitParam = limit ? 'limit=' + limit : '';
          let sortParam = sort ? 'sort=' + sort : '';
          sortParam = limit ? '&' + sortParam : sortParam;
          return `${limitParam || sortParam ? '?' : ''}${limitParam}${sortParam}`;
        }

        function newLineJSONTransform(response) {
          if (response === null) {
            return null;

          } else {
            let result = utils.replaceAll(response, '}', '},');
            result = result.slice(0, -2); // remove trailing ','
            return JSON.parse(`[${result}]`);
          }
        }

        function pullProducts(limit, sort) {
          const queryParams = prepareQueryParams(limit, sort);

          return $http.get(`${serverAddress}/api${queryParams}`, {
            transformResponse: newLineJSONTransform
          })
          .then( items => {
            return items;
          })
          .catch($log.error);
        }

        function getProducts(sort, limit) {
          let promise = $q.resolve();

          if (getCache(sort).length < limit && !noMoreData) {
            promise = promise.then( () => fetchProducts(sort, limit));

          } else if (getCache(sort).length + fetchLimit <= limit) {
            // if we have less products cached in case of another take, we fetch more product to keep in cache
            fetchProducts(sort);
          }

          return promise
            .then( () => sortCache(sort))
            .then( cache => cache.slice(0, limit));
        }

        return {
          getProducts
        };
      }];
  }]
);
