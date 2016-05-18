angular.module('app')
  .constant('serverAddress', 'http://localhost:8000')
  .constant('partialsPath', 'partials/directive/')
  .constant('sortType', {
    size: 'size',
    price: 'price',
    id: 'id'
  })
;
