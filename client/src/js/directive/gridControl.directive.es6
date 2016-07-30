angular.module('app').directive('dawGridControl',
  ['partialsPath', 'sortTypes', 'sortOrders',
  (partialsPath, sortTypes, sortOrders) => {
    'use strict';

    const Sort = require('../model/sort.es6');

    return {
      restrict: 'EC',
      scope: {
        sortChange: '&',
        sortType: '=',
        sortOrder: '='
      },
      templateUrl: `${partialsPath}/gridControl.html`,
      link(scope) {
        scope.sortTypeItems = sortTypes;
        scope.sortOrderItems = sortOrders;

        scope.$watchGroup([ 'sortType', 'sortOrder' ], (newVals, oldVals, scope) => {
          const sort = new Sort(newVals[0], newVals[1] === true ? 'ascending' : null);
          scope.sortChange(sort);
        });
      }
    };
  }
]);
