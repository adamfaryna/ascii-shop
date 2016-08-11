'use strict';

const sinon = require('sinon');
const moment = require('moment');
const ProductElement = require('../../src/js/directive/grid/productElement.component');
const AdElement = require('../../src/js/directive/grid/adElement.component');

describe('data service', () => {
  let $q, $timeout, $rootScope, dataService, productService;
  let sandbox;

  beforeEach(angular.mock.module('app'));

  beforeEach(angular.mock.module('app', $provide => {
    $provide.service('productService', function () {
      return {
        getProducts() {
          return [];
        }
      };
    });
  }));

  beforeEach( () => {
    angular.mock.inject( ( _$q_, _$rootScope_, _$timeout_, _dataService_, _productService_ ) => {
      $q = _$q_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
      dataService = _dataService_;
      productService = _productService_;
    });

    sandbox = sinon.sandbox.create();
  });

  afterEach( () => {
    sandbox.restore();
  });

  describe('getData', () => {
    let products = [];

    beforeEach( () => {
      for (let i = 0; i !== 20; i++) {
        const obj = {
          id: i,
          size: i * 10,
          price: i * 100,
          face: i,
          date: moment()
        };
        products.push(new ProductElement(obj));
      }
    });

    afterEach( () => {
      products = [];
    });

    it("emit 'elementsLoading'", done => {
      $rootScope.$on('elementsLoading', () => {
        expect(true).toBeTruthy();
        done();
      });

      dataService.getData('size', 20);
    });

    it("emit 'elementsReady' on 'productsReady' event", done => {
      $rootScope.$on('elementsReady', (event, elements) => {
        expect(elements.length).toBe(21);
        done();
      })

      $rootScope.$emit('productsReady', products);
    });

    it("should call once productService.getProducts", done => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
      let stub = sandbox.stub(productService, 'getProducts').returns($q.resolve([]));

      dataService.getData('size', 10)
        .then( () => {
          expect(stub.calledOnce).toBe(true);
          done();
        });

      $timeout.flush();
    });

    it("should add ads to result", done => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
      sandbox.stub(productService, 'getProducts').returns($q.resolve(products));

      dataService.getData('size', 20)
        .then( elements => {
          expect(elements[20]).toEqual(jasmine.any(AdElement));
          done();
        });

      $timeout.flush();
    });
  });
});

