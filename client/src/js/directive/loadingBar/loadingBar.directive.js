angular.module('app').directive('dawLoadingBar',
  ['partialsPath', '$timeout', '$interval',
  (partialsPath, $timeout, $interval) => {
    'use strict';

    const MAX_NUMBER_OF_DOTS = 3;

    return {
      restrict: 'EC',
      scope: {
        controlParam: '='
      },
      templateUrl: `${partialsPath}/loadingBar.html`,
      link(scope) {
        let progressIntervalPromise = null;
        scope.prompt = 'Loading';

        scope.addDot = () => {
          scope.dots += '.';
        };

        scope.resetDots = () => {
          scope.dots = '';
        };

        scope.showProgressBar = () => {
          if (!progressIntervalPromise) {
            let dotsCounter = 0;
            scope.resetDots();

            progressIntervalPromise = $interval( () => {
              if (dotsCounter === MAX_NUMBER_OF_DOTS) {
                dotsCounter = 0;
                scope.resetDots();

              } else {
                dotsCounter++;
                scope.addDot();
              }
            }, 450);
          }
        };

        scope.hideProgressBar = () => {
          $interval.cancel(progressIntervalPromise);
          progressIntervalPromise = null;
        };

        scope.$watch('controlParam', newVal => {
          if (newVal === true) {
            scope.showProgressBar();

          } else {
            scope.hideProgressBar();
          }
        });
      }
    };
  }
]);
