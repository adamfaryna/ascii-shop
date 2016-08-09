'use strict';

describe('productService', () => {
  let productService;
  let $rootScope;

  beforeEach( () => {
    angular.mock.module('app');
    angular.mock.inject( (_productService_, _$rootScope_) => {
      productService = _productService_;
      $rootScope = _$rootScope_;
    });
  });

  describe('getData', () => {
    it("emit 'elementsLoading'", done => {
      $rootScope.$on('elementsLoading', () => {
        expect(true).toBeTruthy();
        done();
      });

      productService.getData('size', 20);
    });

    it("emit 'elementsReady' on 'productsReady' event");
    it("should call once productService.getProducts");
    it("should add ads to result");
  });
});

