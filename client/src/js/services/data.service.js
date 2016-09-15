angular.module('app').provider('dataService',
  ['defaultAdOffset',
  function(defaultAdOffset) {
    'use strict';

    let adOffset = defaultAdOffset;

    this.setAdOffset = offset => {
      adOffset = offset;
    };

    this.$get =
      ['$rootScope', '$log', '$q', 'productService', 'adService', '$timeout',
      ($rootScope, $log, $q, productService, adService, $timeout) => {
        let lastAddedAdId;
        let getProductsWithAdsPromise;

        $rootScope.$on('productsReady', (event, products) => {
          $rootScope.$emit('elementsReady', addAdsInternal(products));
        });

        function processGetProductsWithAds(sort, limit) {
          return productService.getProducts(sort, limit)
          .then( products => { return addAds(products); });
        }

        function addAdsInternal(products) {
          for (let i = adOffset, adId = 0; i <= products.length; i += adOffset + 1, adId++) {
            const ad = adService.getAd(lastAddedAdId, adId);
            lastAddedAdId = ad.id;
            products.splice(i, 0, ad);
          }

          return products;
        }

        function addAds(products) {
          const result = addAdsInternal(products);
          return $q.resolve(result);
        }

        function getProductsWithAds(sort, limit) {
          if (getProductsWithAdsPromise) {
            $timeout.cancel(getProductsWithAdsPromise);
          }

          const deferred = $q.defer();

          getProductsWithAdsPromise = $timeout( () => {
            processGetProductsWithAds(sort, limit).then(deferred.resolve);
          }, 150);

          return deferred.promise;
        }

        function getData(sort, limit) {
          $rootScope.$emit('elementsLoading');
          return getProductsWithAds(sort, limit);
        }

        return {
          /* test-code */
          getProductsWithAds,
          addAds,
          addAdsInternal,
          processGetProductsWithAds,
          /* end-test-code */
          getData
        };
      }];
  }]
);
