angular.module('app').service('utils', [function() {
  'use strict';

  this.replaceAll = (target, search, replacement) => {
    return target.replace(new RegExp(search, 'g'), replacement);
  };
}]);
