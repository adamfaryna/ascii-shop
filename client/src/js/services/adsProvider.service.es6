angular.module('app').factory('adsProviderService',
  ['$http', 'serverAddress', '$log',
  function($http, serverAddress, $log) {
    'use strict';

    let lastAdHash;

    function getAd() {
      return $http.get(`${serverAddress}/api`)
        .then( res => {
          $log.log(res);
        })
        .catch($log.error);
    }

    return {
      getAd
    };
  }]
);
