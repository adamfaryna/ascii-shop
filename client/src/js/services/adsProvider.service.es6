angular.module('app').service('adsProviderService', ['$http', 'serverAddress', 'loggerService', function($http, serverAddress, loggerService) {
  'use strict';

  let lastAdHash;

  this.getAd = () =>
    $http.get(`${serverAddress}/api`)
      .then( res => {
        console.log(res);
      })
      .catch(loggerService.err);
}]);
