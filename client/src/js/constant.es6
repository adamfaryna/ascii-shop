angular.module('app')
  .constant('serverAddress', 'http://localhost:8000')
  .constant('partialsPath', 'partials/directive')
  .constant('sortTypes', [ 'id', 'size', 'price' ])
  .constant('sortOrders', [ 'ascending', 'descending' ])
  .constant('defaultProductFetchLimit', 20)
  .constant('defaultAdOffset', 20);
