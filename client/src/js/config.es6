angular.module('app').config(['$routeProvider', '$locationProvider',  ($routeProvider, $locationProvider) => {
  'use strict';

  console.log('aaaaa');
  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/', {
      templateUrl: 'partials/main.html',
      controller: 'MainCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
