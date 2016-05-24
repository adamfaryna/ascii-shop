angular.module('app').directive('dawProductGrid', [()=> {
  'use strict';

  const ProductGrid = require('./productGrid.component.es6');

  return {
    restrict: 'E',
    scope: {
      products: '='
    },
    controller() {

    },
    link(scope, elm) {
      scope.$watch('products', products => {
        ReactDOM.render(<ProductGrid {products} />, elm[0]);
      });
    }
  };
}]);
