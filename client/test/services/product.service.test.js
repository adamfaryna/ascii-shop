'use strict';

const sinon = require('sinon');
const Sort = require('../../src/js/model/sort');
const ProductsQueryParam = require('../../src/js/model/productsQueryParam');

describe('productService', () => {
  let $rootScope, $q, $timeout, $http, productService;
  let sandbox;

  beforeEach(angular.mock.module('app'));

  beforeEach(angular.mock.module('app', ($provide, productServiceProvider) => {
    $provide.service('$http', function () {
      return {
        get() {}
      };
    });
    productServiceProvider.setPrefetch(false);
  }));

  beforeEach( () => {
    angular.mock.inject( (_$rootScope_, _$q_, _$timeout_, _$http_, _productService_) => {
      $rootScope = _$rootScope_;
      $q = _$q_;
      $timeout = _$timeout_;
      $http = _$http_;
      productService = _productService_;
    });

    sandbox = sinon.sandbox.create();
  });

  afterEach( () => {
    sandbox.restore();
  });

  fdescribe('prepareQueryParams', () => {
    it('should generate proper query param string for limit parameter only', () => {
      const queryParam = new ProductsQueryParam(15);
      expect(productService.prepareQueryParams(queryParam)).toBe('?limit=15');
    });

    it('should generate proper query param string for sortType parameter only', () => {
      const queryParam = new ProductsQueryParam(undefined, { sortType: 'size' });
      expect(productService.prepareQueryParams(queryParam)).toBe('?sort=size');
    });

    it('should generate proper query param string for skip parameter only', () => {
      const queryParam = new ProductsQueryParam(undefined, undefined, 10);
      expect(productService.prepareQueryParams(queryParam)).toBe('?skip=10');
    });

    it('should generate proper query param string for all parameters passed', () => {
      const queryParam = new ProductsQueryParam(15, { sortType: 'price', sortOrder: 'ascending' }, 10);
      const result = productService.prepareQueryParams(queryParam);
      const exampleExpectedResult = '?skip=10&limit=15&sort=price';
      expect(result.length).toBe(exampleExpectedResult.length);
      expect(result.indexOf('skip=10')).not.toBe(-1);
      expect(result.indexOf('limit=15')).not.toBe(-1);
      expect(result.indexOf('sort=price')).not.toBe(-1);
    });
  });

  describe('getProducts', () => {
    let products = [];

    beforeEach( () => {
      for (let i = 0; i !== 20; i++) {
        products.push({
          id: i,
          size: i * 10,
          price: i * 100,
          face: i,
          date: moment()
        });
      }

      sandbox.stub($http, 'get').returns($q.resolve({products}));
    });

    afterEach( () => {
      products = [];
    });

    it("emit 'productsReady' on succesfull products fetch", done => {
      $rootScope.$on('productsReady', () => {
        expect(true).toBeTruthy();
        done();
      });

      productService.getProducts(new Sort('size'), 20);
      $timeout.flush();
    });

    it("should return cached products when no more products to fetch", done => {
      productService.getProducts(new Sort('size'), 20)
        .then( products => {
          expect(products.length).toBe(0);
          done();
        });
      $timeout.flush();
    });
  });
});

