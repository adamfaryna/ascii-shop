angular.module('app').provider('productService',
  ['defaultProductFetchLimit', function(defaultProductFetchLimit) {
    'use strict';

    let fetchLimit = defaultProductFetchLimit;

    this.setFetchLimit = limit => {
      fetchLimit = limit;
    };

    this.$get =
      ['$rootScope', '$log', '$q', '$http', 'serverAddress', 'sortTypes', 'utils',
      ($rootScope, $log, $q, $http, serverAddress, sortTypes, utils) => {
        const Sort = require('../model/sort.es6');
        const ProductElement = require('../directive/grid/productElement.component.es6');
        const ProductsQueryParam = require('../model/productsQueryParam.es6');

        const cacheByPrice = [];
        const cacheBySize = [];
        const cacheById = [];

        let noMoreData = false;

        let fetchPromise = $q.resolve();

        prefetchData();

        function prefetchData() {
          return $q( resolve => {
            sortTypes.forEach( sort => { fetchProductsInternal(new Sort(sort), fetchLimit); });
            resolve();
          });
        }

        function fetchProducts(sort, limit) {
          fetchPromise = fetchProductsInternal(sort, limit)
            .then( () => { $rootScope.$emit('productsReady', _.clone(sortCache(sort))); });
        }

        function fetchProductsInternal(sort, limit = fetchLimit) {
          const cache = getCache(sort);
          const queryParams = new ProductsQueryParam(limit, sort, cache.length);

          fetchPromise = fetchPromise
          .then( () => pullProducts(queryParams))
          .then( res => {
            if (res && res.data && res.data.length !== 0) {
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

          if (sortObj.sortOrder) {
            switch(sortObj.sortOrder) {
            case 'ascending': sortCallback = (a, b) => a[sortObj.sortType] - b[sortObj.sortType]; break;
            case 'descending': sortCallback = (a, b) => b[sortObj.sortType] - a[sortObj.sortType]; break;
            default: throw new Error('Invalid sort order!');
            }

            getCache(sortObj).sort(sortCallback);
          }

          return getCache(sortObj);
        }

        function getCache(sort) {
          switch (sort.sortType) {
          case 'price': return cacheByPrice;
          case 'size': return cacheBySize;
          case 'id': return cacheById;
          default: throw new Error('Invalid sort type!');
          }
        }

        function prepareQueryParams(queryParams) {
          const limitParam = queryParams.limit ? `limit=${queryParams.limit}` : '';
          const sortParam = queryParams.sort ? `sort=${queryParams.sort}` : '';
          const skipParam = queryParams.skip ? `skip=${queryParams.skip}` : '';
          let queryString = '';

          [limitParam, sortParam, skipParam].forEach( elem => {
            queryString += elem ? `&${elem}` : '';
          });

          return queryString.slice(1);
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

        function pullProducts(queryParams) {
          const queryString = prepareQueryParams(queryParams);
          return $http.get(`${serverAddress}/api${queryString}`, {
            transformResponse: newLineJSONTransform
          }).catch($log.error);
        }

        function getProducts(sort, limit) {
          if (!noMoreData) {
            fetchProducts(sort, limit);
          }

          return $q.resolve()
            .then( () => sortCache(sort))
            .then( c => _.clone(c));
        }

        return {
          getProducts
        };
      }];
  }]
);
