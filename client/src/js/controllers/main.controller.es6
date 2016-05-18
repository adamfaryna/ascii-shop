angular.module('app').controller('MainCtrl',
  ['$scope', '$window', '$interval', '$log', 'productProviderService', 'adsProviderService',
  ($scope, $window, $interval, $log, productProviderService, adsProviderService) => {
    'use strict';

    let currentScrollPosition = 0;

    $interval( () => {
      productProviderService.getProducts().then($log.log)
      adsProviderService.getAd();

    }, 1000);


    // angular.element($window).bind('scroll', () => {
    //   if (currentScrollPosition < this.pageYOffset) {
    // productProviderService
    //   }

    //   currentScrollPosition = this.pageYOffset;
    // });


  }]
);
