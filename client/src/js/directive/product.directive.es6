angular.module('app').directive('dawProduct', ['partialsPath', (partialsPath) => {
  'use strict';

  return {
    restrict: 'E',
    require: '^dawProductGrid',
    scope: {
      product: '='
    },
    templateUrl: `${partialsPath}/product.html`,
    link(scope, elm) {

      // size
      // price
      // date

    }
  };
}]);