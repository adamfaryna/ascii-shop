angular.module('app').factory('productProviderService',
  ['$http', 'serverAddress', '$log',
  function($http, serverAddress, $log) {
    'use strict';

    function getProducts() {
      return $http.get(`${serverAddress}/api`)
        .catch($log.error);
    }

    return {
      getProducts
    };
  }]
);
