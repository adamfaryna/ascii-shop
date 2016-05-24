angular.module('app').controller('MainCtrl',
  ['$scope', '$window', '$interval', '$log', 'productProviderService', 'adsProviderService',
  ($scope, $window, $interval, $log, productProviderService, adsProviderService) => {
    'use strict';

    // let currentScrollPosition = 0;

    $scope.products = [];

    productProviderService.getProducts(10).then( res => {
      $log.log(res);
      $scope.products.push(res);
    } );

      // adsProviderService.getAd();


    // angular.element($window).bind('scroll', () => {
    //   if (currentScrollPosition < this.pageYOffset) {
    // productProviderService
    //   }

    //   currentScrollPosition = this.pageYOffset;
    // });


  }]
);
