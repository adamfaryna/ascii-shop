angular.module('app').directive('dawProductGrid', [()=> {
  'use strict';

  const ProductGrid = require('./productGrid.component.es6');

  return {
    restrict: 'E',
    scope: {
      elements: '='
    },
    controller() {

    },
    link(scope, elm) {
      scope.$on('$destroy', () => {
        React.unmountComponentAtNode(elm[0]);
      });

      scope.$watchCollection('elements', products => {
        ReactDOM.render(<ProductGrid elements={products} />, elm[0]);
      });
    }
  };
}]);
