angular.module('app').directive('dawProductGridControl', ['partialsPath', (partialsPath) => {
  'use strict';

  return {
    restrict: 'EC',
    scope: {},
    templateUrl: `${partialsPath}/productGridControl.html`,
    link() {
      // TODO feel content
    }
  };
}]);
