angular.module('app').factory('productProviderService',
  ['$log', '$q', 'Oboe', 'serverAddress',
  function($log, $q, Oboe, serverAddress) {
    'use strict';

    function prepareQueryParams(limit, sort) {
      let limitParam = limit ? 'limit=' + limit : '';
      let sortParam = sort ? 'sort=' + sort : '';
      sortParam = limit ? '&' + sortParam : sortParam;
      return `${limitParam || sortParam ? '?' : ''}${limitParam}${sortParam}`;
    }

    function getProducts(limit, sort) {
      const queryParams = prepareQueryParams(limit, sort);

      return $q( resolve => {
        Oboe({
          url: `${serverAddress}/api${queryParams}`,
          pattern: '{index}',
          done(parsedJSON) {
            resolve(parsedJSON);
          }
        }).then(angular.noop, $log.error);
      });
    }

    return {
      getProducts
    };
  }]
);
