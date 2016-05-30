angular.module('app').controller('MainCtrl',
  ['$scope', '$window', '$interval', '$log', '$timeout',
  ($scope, $window, $interval, $log, $timeout) => {
    'use strict';

    // let currentScrollPosition = 0;

    $scope.products = [];

    // productProviderService.getProducts(10).then( res => {
    //   $log.log(res);
    //   $timeout( () => {
    //     $scope.products.push(res);
    //   });
    // } );

      // adsProviderService.getAd();


    // angular.element($window).bind('scroll', () => {
    //   if (currentScrollPosition < this.pageYOffset) {
    // productProviderService
    //   }

    //   currentScrollPosition = this.pageYOffset;
    // });


  }]
);
