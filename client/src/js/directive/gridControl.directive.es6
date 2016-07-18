angular.module('app').directive('dawGridControl', ['partialsPath', 'sortTypes', (partialsPath, sortTypes) => {
  'use strict';

  return {
    restrict: 'EC',
    scope: {
      action: '&',
      sort: '='
    },
    templateUrl: `${partialsPath}/gridControl.html`,
    link(scope) {
      scope.options = sortTypes;

      scope.$watch('options', newVal => {
        scope.action(newVal);
      });
    }
  };
}]);
