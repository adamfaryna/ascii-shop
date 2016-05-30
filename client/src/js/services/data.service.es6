angular.module('app').provider('dataService',
  ['defaultAdOffset',
  function(defaultAdOffset) {
    'use strict';

    let adOffset = defaultAdOffset;

    this.setAdOffset = offset => {
      adOffset = offset;
    };

    this.$get =
      ['$log', '$q', 'productService', 'adService',
      ($log, $q, productService, adService) => {
        class DataService {
          get lastAddedAdId() {
            return this.lastAddedAdId;
          }

          set lastAddedAdId(lastAddedAdId) {
            this.lastAddedAdId = lastAddedAdId;
          }

          getProductsWithAds(sort, limit) {
            return productService.getProducts(sort, limit);
            // .then(this.addAds);
          }

          addAds(products) {
            let promise = $q.resolve();

            for (let i = adOffset; i <= products.length; i += adOffset + 1) {
              promise = promise
              .then( () => adService.getAd(this.lastAddedAdId))
              .then( ad => {
                this.lastAddedAdId = ad.id;
                products.splice(i, 0, ad)
              });
            }

            return promise;
          }

          getData(sort, limit) {
            return this.getProductsWithAds(sort, limit);
          }
        }

        return new DataService();
      }];
  }]
);
