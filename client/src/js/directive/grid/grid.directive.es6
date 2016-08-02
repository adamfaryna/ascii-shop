angular.module('app').directive('dawGrid',
  ['$window', '$document', '$log', '$timeout', 'dataService', 'partialsPath',
  ($window, $document, $log, $timeout, dataService, partialsPath) => {
    'use strict';

    const Grid = require('./grid.component.es6');
    const Sort = require('../../model/sort.es6');

    const DEFAULT_COLUMNS_NUMBER = 3;
    const DEFAULT_PRODUCTS_DISPLAY_LIMIT = 20;
    const DEFAULT_SORT_TYPE = 'id';
    const DEFAULT_SORT_ORDER = null;
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
        $scope.isShowProgressBar = true;

        $scope.showProgressBar = () => {
          $scope.isShowProgressBar = true;
        };

        $scope.hideProgressBar = () => {
          $scope.isShowProgressBar = false;
        };

        this.sortChange = (sort) => {
          $scope.showProgressBar();
          dataService.getData(sort, $scope.data.products.length)
            .then( products => {
              $timeout( () => {
                $scope.data.products = products;
              });
            }, $log.error)
            .then($scope.hideProgressBar);
        }
      }],
      link(scope, elm) {
        scope.limit = scope.limit || DEFAULT_PRODUCTS_DISPLAY_LIMIT;
        scope.columns = scope.columns || DEFAULT_COLUMNS_NUMBER;
        scope.showControls = scope.columns || DEFAULT_SHOW_CONTROLS;
        scope.sortType = scope.sortType || DEFAULT_SORT_TYPE;
        scope.sortOrder = scope.sortOrder || DEFAULT_SORT_ORDER;

        scope.data = { products: [] };
        scope.noMoreProducts = false;

        const productsContainer = $('.daw-elements', elm)[0];

        scope.$on('$destroy', () => {
          ReactDOM.unmountComponentAtNode(productsContainer);
        });

        scope.$watchCollection('data.products', (newVal, oldVal) => {
          if (newVal) {
            ReactDOM.render(<Grid elements={newVal} />, productsContainer);

            if (newVal.length < oldVal + scope.limit) {
              scope.noMoreProducts = true;
            }
          }
        });

        $document.on('scroll', elm, () => {
          if (isScrolledToEnd()) {
            scope.prepareShowMoreProducts();
          }
        });

        scope.showMoreProducts = () => {
          $log.log('show more');
          scope.showProgressBar();
          const productsNumToFetch =
            scope.data.products.length ? scope.data.products.length + scope.limit : scope.limit;
          const sort = new Sort(scope.sortType, scope.sortOrder);
          dataService.getData(sort, productsNumToFetch)
          .then( products => {
            scope.data.products = products;
          }, $log.error)
          .then(scope.hideProgressBar);
        };

        scope.showNoMoreProducts = () => {
          scope.noMoreProducts = true;
        };

        scope.prepareShowMoreProducts = () => {
          if (scope.showMoreProductsPromise) {
            $timeout.cancel(scope.showMoreProductsPromise);
          }

          scope.showMoreProductsPromise = $timeout(scope.showMoreProducts, 150);
        };

        // prefetch initial data
        scope.showMoreProducts();

        function isScrolledToEnd() {
          return $document.height() <= $($window).height() + $($window).scrollTop();
        }
      }
    };
  }]
);
