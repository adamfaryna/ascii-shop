angular.module('app').directive('dawGrid',
  ['$document', '$log', '$timeout', 'dataService', 'partialsPath', '$rootScope', 'defaultGridDefaultColumnNum', 'defaultGridElementsDisplayLimit', 'defaultGridSortType', 'defaultGridShowControls',
  ($document, $log, $timeout, dataService, partialsPath, $rootScope, defaultGridDefaultColumnNum, defaultGridElementsDisplayLimit, defaultGridSortType, defaultGridShowControls) => {
    'use strict';

    const Grid = require('./grid.component');
    const Sort = require('../../model/sort');

    const DEFAULT_COLUMNS_NUMBER = defaultGridDefaultColumnNum;
    const DEFAULT_ELEMENTS_DISPLAY_LIMIT = defaultGridElementsDisplayLimit;
    const DEFAULT_SORT_TYPE = defaultGridSortType;
    const DEFAULT_SHOW_CONTROLS = defaultGridShowControls;

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
        $scope.limit = $scope.limit ? parseInt($scope.limit) : DEFAULT_ELEMENTS_DISPLAY_LIMIT;
        $scope.columns = $scope.columns ? parseInt($scope.columns) : DEFAULT_COLUMNS_NUMBER;
        $scope.showControls = $scope.showControls ? $scope.showControls === 'true' : DEFAULT_SHOW_CONTROLS;
        $scope.sortType = $scope.sortType || DEFAULT_SORT_TYPE;

        $scope.showProgressBar = false;
        $scope.data = { elements: [] };
        $scope.noMoreData = false;

        $scope.elementsReadyListener = $rootScope.$on('elementsReady', (event, elements) => {
          if (elements) {
            $scope.noMoreData = elements.length !== 0 && elements.length === $scope.data.elements.length;
            $scope.data.elements = elements;
            $scope.showProgressBar = false;
          }
        });

        $scope.getData = (sort, limit = DEFAULT_ELEMENTS_DISPLAY_LIMIT) => {
          $scope.showProgressBar = true;
          dataService.getData(sort, limit)
            .then( elements => {
              $scope.data.elements = elements;
            }, $log.error);
        };

        this.sortChange = sort => {
          $scope.getData(sort);
        }
      }],
      link(scope, elm) {
        const elementsContainer = $('.daw-elements', elm)[0];

        scope.$on('$destroy', () => {
          ReactDOM.unmountComponentAtNode(elementsContainer);
          scope.elementsReadyListener();
        });

        scope.$watchCollection('data.elements', elements => {
          ReactDOM.render(<Grid elements={elements} />, elementsContainer);
        });

        $document.on('scroll', elm, () => {
          if (isScrolledToEnd(elm)) {
            scope.prepareShowMoreElements();
          }
        });

        scope.showMoreElements = () => {
          const elementsNumToFetch =
            scope.data.elements.length ? scope.data.elements.length + scope.limit : scope.limit;
          const sort = new Sort(scope.sortType, scope.sortOrder);
          scope.getData(sort, elementsNumToFetch);
        };

        scope.prepareShowMoreElements = () => {
          if (scope.showMoreElementsPromise) {
            $timeout.cancel(scope.showMoreElementsPromise);
          }

          scope.showMoreElementsPromise = $timeout(scope.showMoreElements, 150);
        };

        function isScrolledToEnd(elm) {
          return -(elm[0].getBoundingClientRect().top) > $($document).height() / 4;
        }
      }
    };
  }]
);
