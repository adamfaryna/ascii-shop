angular.module('app').directive('dawGrid',
  ['$document', '$log', '$timeout', 'dataService', 'partialsPath',
  ($document, $log, $timeout, dataService, partialsPath) => {
    'use strict';

    const Grid = require('./grid.component.es6');
    const Sort = require('../../model/sort.es6');

    const DEFAULT_COLUMNS_NUMBER = 3;
    const DEFAULT_PRODUCTS_DISPLAY_LIMIT = 20;
    const DEFAULT_SORT_TYPE = 'id';
    const DEFAULT_SORT_ORDER = 'descending';
    const DEFAULT_SHOW_CONTROLS = true;

    return {
      restrict: 'E',
      scope: {
        limit: '@',
        columns: '@',
        showControls: '@',
        sortType: '@',
        sortOrder: '@'
      },
      templateUrl: `${partialsPath}/Grid.html`,
      controller: ['$scope', function($scope) {
        $scope.limit = $scope.limit ? parseInt($scope.limit) : DEFAULT_PRODUCTS_DISPLAY_LIMIT;
        $scope.columns = $scope.columns ? parseInt($scope.columns) : DEFAULT_COLUMNS_NUMBER;
        $scope.showControls = $scope.showControls ? $scope.showControls === 'true' : DEFAULT_SHOW_CONTROLS;
        $scope.sortType = $scope.sortType || DEFAULT_SORT_TYPE;
        $scope.sortOrder = $scope.sortOrder || DEFAULT_SORT_ORDER;

        $scope.isShowProgressBar = true;
        $scope.data = { products: [] };
        $scope.noMoreData = false;

        $scope.showProgressBar = () => {
          $scope.isShowProgressBar = true;
        };

        $scope.hideProgressBar = () => {
          $scope.isShowProgressBar = false;
        };

        this.sortChange = sort => {
          $scope.showProgressBar();
          dataService.getData(sort, DEFAULT_PRODUCTS_DISPLAY_LIMIT)
            .then( products => {
              $scope.noMoreData = products.length === 0;
              $scope.data.products = products;
            }, $log.error)
            .then($scope.hideProgressBar);
        }
      }],
      link(scope, elm) {
        const productsContainer = $('.daw-elements', elm)[0];

        scope.$on('$destroy', () => {
          ReactDOM.unmountComponentAtNode(productsContainer);
        });

        scope.$watchCollection('data.products', newVal => {
          if (newVal) {
            ReactDOM.render(<Grid elements={newVal} />, productsContainer);
          }
        });

        $document.on('scroll', elm, () => {
          if (isScrolledToEnd(elm)) {
            scope.prepareShowMoreProducts();
          }
        });

        scope.showMoreProducts = () => {
          scope.showProgressBar();
          const productsNumToFetch =
            scope.data.products.length ? scope.data.products.length + scope.limit : scope.limit;
          const sort = new Sort(scope.sortType, scope.sortOrder);
          dataService.getData(sort, productsNumToFetch)
          .then( products => {
            scope.noMoreData = products.length === 0;
            scope.data.products = products;
          }, $log.error)
          .then(scope.hideProgressBar);
        };

        scope.prepareShowMoreProducts = () => {
          if (scope.showMoreProductsPromise) {
            $timeout.cancel(scope.showMoreProductsPromise);
          }

          scope.showMoreProductsPromise = $timeout(scope.showMoreProducts, 150);
        };

        function isScrolledToEnd(elm) {
          return -(elm[0].getBoundingClientRect().top) > $($document).height() / 4;
        }
      }
    };
  }]
);
