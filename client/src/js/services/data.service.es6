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
        class DataService {
          constructor() {
            this.initEvents();
          }

          initEvents() {
            $rootScope.$on('productsReady', (event, products) => {
              $rootScope.$emit('elementsReady', this.addAdsInternal(products));
            });
          }

          processGetProductsWithAds(sort, limit) {
            return productService.getProducts(sort, limit)
            .then( products => { return this.addAds(products); });
          }

          addAdsInternal(products) {
            for (let i = adOffset + 1, adId = 0; i <= products.length; i += adOffset + 1, adId++) {
              const ad = adService.getAd(this.lastAddedAdId, adId);
              this.lastAddedAdId = ad.id;
              products.splice(i, 0, ad);
            }

            return products;
          }

          addAds(products) {
            return $q.resolve(this.addAdsInternal(products));
          }

          getProductsWithAds(sort, limit) {
            if (this.getProductsWithAdsPromise) {
              $timeout.cancel(this.getProductsWithAdsPromise);
            }

            const deferred = $q.defer();

            this.getProductsWithAdsPromise = $timeout( () => {
              this.processGetProductsWithAds(sort, limit).then(deferred.resolve);
            }, 150);

            return deferred.promise;
          }

          getData(sort, limit) {
            return this.getProductsWithAds(sort, limit);
          }
        }

        return new DataService();
      }];
  }]
);
