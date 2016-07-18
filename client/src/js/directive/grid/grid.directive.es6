angular.module('app').directive('dawProductGrid',
  ['$window', '$log', '$timeout', 'dataService', 'partialsPath',
  ($window, $log, $timeout, dataService, partialsPath) => {
    'use strict';

    const Grid = require('./grid.component.es6');

    const DEFAULT_COLUMNS_NUMBER = 3;
    const DEFAULT_PRODUCTS_DISPLAY_LIMIT = 20;
    const DEFAULT_SORT = 'id';
    const DEFAULT_SHOW_CONTROLS = true;

    return {
      restrict: 'E',
      scope: {
        limit: '@',
        columns: '@',
        showControls: '@',
        sort: '@'
      },
      templateUrl: `${partialsPath}/Grid.html`,
      controller() {
        // add sort option (combo box)


      },
      link(scope, elm) {
        scope.limit = scope.limit || DEFAULT_PRODUCTS_DISPLAY_LIMIT;
        scope.columns = scope.columns || DEFAULT_COLUMNS_NUMBER;
        scope.showControls = scope.columns || DEFAULT_SHOW_CONTROLS;
        scope.sort = scope.sort || DEFAULT_SORT;

        scope.data = { products: [] };
        scope.showProgressBar = true;
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

        elm.on('scroll', () => {
          if (isScrolledToEnd()) {
            scope.prepareShowMoreProducts();
          }
        });

        scope.showMoreProducts = () => {
          scope.showProgressBar();
          const productsNumToFetch =
            scope.data.products.length ? scope.data.products.length + scope.limit : scope.limit;
          dataService.getData(scope.sort, productsNumToFetch)
          .then( products => {
            scope.data.products = products;
          }, $log.error)
          .then(scope.hideProgressBar);
        };

        // TODO  display animated loading message when loading new data

        scope.showProgressBar = () => {
          scope.showProgressBar = true;
        };

        scope.hideProgressBar = () => {
          scope.showProgressBar = false;
        };

        scope.showNoMoreProducts = () => {
          scope.noMoreProducts = true;
        };

        scope.prepareShowMoreProducts = () => {
          if (scope.showMoreProductsPromise) {
            $timeout.cancel(scope.showMoreProductsPromise);
          }

          scope.showMoreProductsPromise = $timeout(scope.showMoreProducts, 250);
        };

        // prefetch initial data
        scope.showMoreProducts();

        function isScrolledToEnd() {
          return elm.scrollTop() + elm.innerHeight() >= elm.scrollHeight
        }
      }
    };
  }]
);
