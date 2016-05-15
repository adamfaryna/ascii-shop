app.config(['$routeProvider', '$locationProvider',  ($routeProvider, $locationProvider) => {
  'use strict';

  $locationProvider.html5mode(true);

  $routeProvider
    .when('/main', {
      templateUrl: 'partials/main.html',
      controller: 'MainCtrl'
    }).otherwise({
      redirectTo: '/main'
    });
}]);
