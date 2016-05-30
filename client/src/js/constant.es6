angular.module('app')
  .constant('serverAddress', 'http://localhost:8000')
  .constant('partialsPath', 'partials/directive')
  .constant('sortTypes', [ 'size', 'price', 'id' ])
  .constant('defaultProductFetchLimit', 20)
  .constant('defaultAdOffset', 20);
