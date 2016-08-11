angular.module('app').directive('dawGridControl',
  ['partialsPath', 'sortTypes', 'sortOrders',
  (partialsPath, sortTypes, sortOrders) => {
    'use strict';

    const Sort = require('../model/sort');

    return {
      restrict: 'EC',
      require: '^^dawGrid',
      scope: {
        sortType: '=',
        sortOrder: '='
      },
      templateUrl: `${partialsPath}/gridControl.html`,
      link(scope, elem, attrs, gridCtrl) {
        scope.sortTypeItems = sortTypes;
        scope.sortOrderItems = sortOrders;

        scope.$watchGroup([ 'sortType', 'sortOrder' ], newVals => {
          const sort = new Sort(newVals[0], newVals[1]);
          gridCtrl.sortChange(sort);
        });
      }
    };
  }
]);
