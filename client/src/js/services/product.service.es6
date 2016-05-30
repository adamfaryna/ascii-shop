angular.module('app').provider('productService',
  ['defaultProductFetchLimit', function(defaultProductFetchLimit) {
    'use strict';

    let fetchLimit = defaultProductFetchLimit;

    this.setFetchLimit = limit => {
      fetchLimit = limit;
    };

    this.$get =
      ['$log', '$q', 'Oboe', 'serverAddress', 'sortTypes',
      ($log, $q, Oboe, serverAddress, sortTypes) => {
        const ProductElement = require('../model/productElement.model.es6');

        const cacheByPrice = [];
        const cacheBySize = [];
        const cacheById = [];

        let noMoreData = false;

        let fetchPromise = $q.resolve();

        prefetchData();

        function prefetchData() {
          return $q( resolve => {
            sortTypes.forEach( sort => fetchProducts(sort));
            resolve();
          });
        }

        function fetchProducts(sort, limit = fetchLimit) {
          return fetchPromise = fetchPromise
          .then( () => pullProducts(getCache(sort).length, calcFetchLimit(limit)))
          .then( res => {
            if (res.length === 0) {
              noMoreData = true;

            } else {
              noMoreData = false;
              getCache(sort).push(new ProductElement(res));
            }
          })
          .catch($log.error);
        }

        function calcFetchLimit(clientLimit = fetchLimit) {
          return clientLimit <= fetchLimit ? fetchLimit : clientLimit;
        }

        function getCache(sort) {
          switch (sort) {
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

        function pullProducts(limit, sort) {
          const queryParams = prepareQueryParams(limit, sort);

          return $q( resolve => {
            Oboe({
              url: `${serverAddress}/api${queryParams}`,
              pattern: '{index}'
            }).then(resolve, $log.error);
          });
        }

        function getProducts(sort, limit) {
          let promise = $q.resolve();

          if (getCache(sort).length < limit && !noMoreData) {
            promise = promise.then( () => fetchProducts(sort, limit));

          } else if (getCache(sort).length + fetchLimit <= limit) {
            // if we have less products cached in case of another take, we fetch more product to keep in cache
            fetchProducts(sort);
          }

          return promise.then( () => getCache(sort).slice(0, limit));
        }

        return {
          getProducts
        };
      }];
  }]
);
