angular.module('app').directive('dawGrid',
  ['$document', '$log', '$timeout', 'dataService', 'partialsPath', '$rootScope', 'defaultGridDefaultColumnNum', 'defaultGridProductDisplayLimit', 'defaultGridSortType', 'defaultGridShowControls',
  ($document, $log, $timeout, dataService, partialsPath, $rootScope, DEFAULT_COLUMNS_NUMBER,
    DEFAULT_ELEMENTS_DISPLAY_LIMIT, DEFAULT_SORT_TYPE, DEFAULT_SHOW_CONTROLS) => {
    'use strict';

    const Grid = require('./grid.component');
    const Sort = require('../../model/sort');

    return {
      restrict: 'E',
      scope: {
        limit: '@',
        columns: '@',
        showControls: '@',
        sortType: '@',
        sortOrder: '@'
      },
      templateUrl: `${partialsPath}/grid.html`,
      controller: ['$scope', function($scope) {
        $scope.elementsReadyListener = $rootScope.$on('elementsReady', (event, elements) => {
          if (elements) {
            $scope.noMoreData = elements.length !== 0 && elements.length === $scope.data.elements.length;
            $scope.data.elements = elements;
            $scope.showProgressBar = false;
          }
        });

        $scope.getData = (sort, limit = DEFAULT_ELEMENTS_DISPLAY_LIMIT) => {
          $scope.showProgressBar = true;
          $scope.fechingData = true;

          dataService.getData(sort, limit)
            .then( elements => {
              $scope.data.elements = elements;
              $scope.fechingData = false;
            }, $log.error);
        };

        this.sortChange = sort => {
          $scope.getData(sort, $scope.limit);
        }
      }],
      link(scope, elm, attrs) {
        scope.sortType = scope.sortType || DEFAULT_SORT_TYPE;
        scope.limit = scope.limit || DEFAULT_ELEMENTS_DISPLAY_LIMIT;
        scope.columns = scope.columns || DEFAULT_COLUMNS_NUMBER;
        scope.showControls = scope.showControls || DEFAULT_SHOW_CONTROLS;

        scope.showProgressBar = false;
        scope.data = { elements: [] };
        scope.noMoreData = false;
        scope.fechingData = false;

        const elementsContainer = $('.daw-elements', elm)[0];

        attrs.$observe('limit', limit => {
          scope.limit = limit ? parseInt(limit) : DEFAULT_ELEMENTS_DISPLAY_LIMIT;
        });

        attrs.$observe('columns', columns => {
          scope.columns = columns ? parseInt(columns) : DEFAULT_COLUMNS_NUMBER;
        });

        attrs.$observe('showControls', showControls => {
          scope.showControls = showControls ? showControls === 'true' : DEFAULT_SHOW_CONTROLS;
        });

        scope.$on('$destroy', () => {
          ReactDOM.unmountComponentAtNode(elementsContainer);
          scope.elementsReadyListener();
        });

        scope.$watchCollection('data.elements', elements => {
          ReactDOM.render(<Grid elements={elements} columns={scope.columns}/>, elementsContainer);
        });

        $document.on('scroll', elm, () => {
          if (isScrolledToEnd(elm) && !scope.noMoreData && !scope.fechingData) {
            scope.prepareShowMoreElements();
          }
        });

        scope.showMoreElements = () => {
          const sort = new Sort(scope.sortType, scope.sortOrder);
          scope.getData(sort, scope.limit);
        };

        scope.prepareShowMoreElements = () => {
          if (scope.showMoreElementsPromise) {
            $timeout.cancel(scope.showMoreElementsPromise);
          }

          scope.showMoreElementsPromise = $timeout(scope.showMoreElements, 350);
        };

        // initial fetch
        scope.prepareShowMoreElements();

        function isScrolledToEnd(elm) {
          return -(elm[0].getBoundingClientRect().top) > $($document).height() / 4;
        }
      }
    };
  }]
);
