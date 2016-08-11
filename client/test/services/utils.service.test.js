'use strict';

describe('utils service', () => {
  let utils;

  beforeEach(angular.mock.module('app'));

  beforeEach( () => {
    angular.mock.inject( _utils_ => {
      utils = _utils_;
    });
  })

  it('should replace all occurrences of the string with passed string', () => {
    expect(utils.replaceAll('magda', 'a', 'b')).toBe('mbgdb');
  });
});
