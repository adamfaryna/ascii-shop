angular.module('app').provider('dataService',
  ['defaultAdOffset',
  function(defaultAdOffset) {
    'use strict';

    let adOffset = defaultAdOffset;

    this.setAdOffset = offset => {
      adOffset = offset;
    };

    this.$get =
      ['$log', '$q', 'productService', 'adService', '$timeout',
      ($log, $q, productService, adService, $timeout) => {
        class DataService {
          processGetProductsWithAds(sort, limit) {
            return productService.getProducts(sort, limit)
            .then( products => this.addAds(products));
          }

          addAds(products) {
            for (let i = adOffset + 1; i <= products.length; i += adOffset + 1) {
              const ad = adService.getAd(this.lastAddedAdId);
              this.lastAddedAdId = ad.id;
              products.splice(i, 0, ad);
            }

            return $q.resolve(products);
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
