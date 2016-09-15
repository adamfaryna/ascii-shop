angular.module('app').provider('productService',
  ['defaultProductFetchLimit', function(defaultProductFetchLimit) {
    'use strict';

    let fetchLimit = defaultProductFetchLimit;
    let prefetchOn = true;

    this.setFetchLimit = limit => {
      fetchLimit = limit;
    };

    this.setPrefetch = prefetch => {
      prefetchOn = prefetch;
    };

    this.$get =
      ['$rootScope', '$log', '$q', '$http', 'serverAddress', 'sortTypes', 'utils',
      ($rootScope, $log, $q, $http, serverAddress, sortTypes, utils) => {
        const Sort = require('../model/sort');
        const ProductElement = require('../directive/grid/productElement.component');
        const ProductsQueryParam = require('../model/productsQueryParam');

        const cacheByPrice = [];
        const cacheBySize = [];
        const cacheById = [];

        let noMoreData = false;

        let fetchPromise = $q.resolve();

        if (prefetchOn) {
          prefetchData();
        }

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

          fetchPromise = fetchPromise
          .then( () => pullProducts(sort, limit))
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
          const sortParam = queryParams.sort.sortType ? `sort=${queryParams.sort.sortType}` : '';
          const skipParam = queryParams.skip ? `skip=${queryParams.skip}` : '';
          let queryString = '';

          [limitParam, sortParam, skipParam].forEach( elem => {
            queryString += elem ? `&${elem}` : '';
          });

          // remove ampersand from the beginning and add question mark
          return queryString.length === 0 ? '' : '?' + queryString.slice(1);
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

        function pullProducts(sort, limit) {
          const queryParams = new ProductsQueryParam(limit, sort, getCache(sort).length);
          const queryString = prepareQueryParams(queryParams);
          return $http.get(`${serverAddress}/api/products${queryString}`, {
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
          /* test-code */
          pullProducts,
          newLineJSONTransform,
          prepareQueryParams,
          getCache,
          sortCache,
          fetchProductsInternal,
          fetchProducts,
          prefetchData,
          /* end-test-code */
          getProducts
        };
      }];
  }]
);
