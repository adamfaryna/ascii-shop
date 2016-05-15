angular.module('app').directive('dawProductGrid', ['partialsPath', (partialsPath)=> {
  'use strict';

  const component = require('./productGrid.component');

  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    controller() {

    },
    link(scope, elm) {
      scope.$watch('data', () => {
        React.render(component, elm[0]);
      });
    }
  };
}]);
