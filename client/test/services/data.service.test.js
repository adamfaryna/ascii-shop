'use strict';

describe('data service', () => {
  let dataService, $rootScope;

  beforeEach(angular.mock.module('app'));

  beforeEach( () => {
    angular.mock.inject( (_$rootScope_, _dataService_) => {
      $rootScope = _$rootScope_;
      dataService = _dataService_;
    });
  });

  describe('getData', () => {
    it("emit 'elementsLoading'", done => {
      $rootScope.$on('elementsLoading', () => {
        expect(true).toBeTruthy();
        done();
      });

      dataService.getData('size', 20);
    });

    it("emit 'elementsReady' on 'productsReady' event");
    it("should call once productService.getProducts");
    it("should add ads to result");
  });
});

