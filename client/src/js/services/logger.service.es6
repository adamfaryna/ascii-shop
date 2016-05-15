angular.module('app').service('loggerService', [function () {
  'use strict';

  this.log = message => console.log;
  this.err = message => console.err;

}]);
