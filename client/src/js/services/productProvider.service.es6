angular.module('app').service('productProviderService', ['$http', 'serverAddress', 'loggerService', function($http, serverAddress, loggerService) {
  'use strict';

  this.getProducts = () =>
    $http.get(`${serverAddress}/api`)
      .catch(loggerService.err);
}]);
