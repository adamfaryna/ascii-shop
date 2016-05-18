angular.module('app').directive('dawProductGrid', [()=> {
  'use strict';

  const component = require('./productGrid');

  return {
    restrict: 'E',
    scope: {
      products: '='
    },
    controller() {

    },
    link(scope, elm) {
      scope.$watch('products', () => {
        React.render(component, elm[0]);
      });
    }
  };
}]);
