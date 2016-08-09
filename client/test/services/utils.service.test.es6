'use strict';

describe('utils service', () => {
  let utils;

  beforeEach( () => {
    console.log('module: ' + JSON.stringify(angular.module('app')));
    angular.mock.inject( _utils_ => {
      utils = _utils_;
      console.log('_utils_: ' + JSON.stringify(_utils_.replaceAll));
    });
  })

  fit('should replace all occurrences of the string with passed string', () => {
    console.log('utils: ' + JSON.stringify(utils));
  });
});
