'use strict';

const sinon = require('sinon');
const moment = require('moment');
const AdElement = require('../../src/js/directive/grid/adElement.component');
const ProductElement = require('../../src/js/directive/grid/productElement.component');

describe('grid directive', () => {
  let sandbox;
  let $rootScope, $compile, $q;
  let scope, element;
  let template;
  let elements = [];

  let defaultGridDefaultColumnNum, defaultGridProductDisplayLimit,
    defaultGridSortType, defaultGridShowControls, dataService;

  beforeEach( () => {
    sandbox = sinon.sandbox.create();
    let adsAdded = 0;

    for (let i = 0; i !== 100; i++) {
      elements.put(new ProductElement(i + 1, i * 10, i * 15, i * 20, moment()));

      if (i !== 0 && i % (20 + adsAdded) === 0) {
        elements.put(new AdElement(1, 'www.abc.com'));
        adsAdded++;
      }
    }
  });

  beforeEach(angular.mock.module('app', $provide => {
    $provide.service('dataService', function() {
      return { getData() { return elements; } };
    });
  }));

  beforeEach(angular.mock.inject( (_$q_, $templateCache, partialsPath, _$rootScope_, _$compile_, _defaultGridDefaultColumnNum_, _defaultGridProductDisplayLimit_,
    _defaultGridSortType_, _defaultGridShowControls_, _dataService_) => {
    $q = _$q_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    defaultGridDefaultColumnNum = _defaultGridDefaultColumnNum_;
    defaultGridProductDisplayLimit = _defaultGridProductDisplayLimit_;
    defaultGridSortType = _defaultGridSortType_;
    defaultGridShowControls = _defaultGridShowControls_;
    dataService = _dataService_;
    scope = $rootScope.$new();

    const templatePath = `client/src/${partialsPath}/grid.html`;
    template = $templateCache.get(templatePath);
    $templateCache.put(templatePath, template);
  }));

  afterEach( () => {
    sandbox.restore();
  })

  function testAfterElementsReadyEventBehaviour(scope, done) {
    $rootScope.$emit('elementsReady', elements);

    setTimeout( () => {
      expect($('.element.product', element).length).toBe(100);
      expect($('.element.ad', element).length).toBe(5);
      expect(scope.showProgressBar).toBe(false);
      expect(scope.data.elements).toBe(elements);
      done();
    }, 100);
  }

  function testSortChangeMethod() {
    scope.sortChange('price');
    const gridElements = scope.data.elements;

    gridElements.forEach( (elem, index) => {
      if (index !== 0) {
        expect(elem.price).toLt(gridElements[index].price);
      }
    });
  }

  function testGetDataMethodShowProgressBar() {
    scope.getData();
    expect(scope.showProgressBar).toBeTruthy;
  }

  function testGetDataMethodGetsDataFromService() {
    const stub = sandbox.stub(dataService, 'getData').returns($q.resolve([]));
    scope.getData();
    expect(stub.calledOnce).toBeTruthy();
  }

  describe('with all attributes set', () => {
    const limit = 50;
    const showControls = true;
    const sortType = 'size';
    const sortOrder = 'descending';
    const columns = 5;

    beforeEach( () => {
      element = `<daw-grid limit="${limit} show-controls="${showControls}" sort-type="${sortType}" sort-order="${sortOrder}" columns="${columns}"></daw-grid>`;

      element = $compile(element)(scope);
      scope.$digest();
    });

    it('should set properly all parameters', () => {
      const isolated = element.isolateScope();
      expect(isolated.limit).toBe(limit);
      expect(isolated.columns).toBe(columns);
      expect(isolated.showControls).toBe(showControls);
      expect(isolated.sortType).toBe(sortType);
      expect(isolated.sortOrder).toBe(sortOrder);
    });

    it("should listen on 'elementsReady' event and generate child elements from event data",testAfterElementsReadyEventBehaviour);

    describe('has sortChange method', () => {
      it("should change sort order", testSortChangeMethod);
    });

    describe('has getData method', () => {
      it("should show progressbar", testGetDataMethodShowProgressBar);
      it("should get elements from service", testGetDataMethodGetsDataFromService);
    });
  });

  describe('with no attributes set', () => {
    beforeEach( () => {
      element = `<daw-grid></daw-grid>`;

      element = $compile(element)(scope);
      scope.$digest();
    });

    it('should set properly all parameters', () => {
      const isolated = element.isolateScope();
      expect(isolated.limit).toBe(defaultGridProductDisplayLimit);
      expect(isolated.columns).toBe(defaultGridDefaultColumnNum);
      expect(isolated.showControls).toBe(defaultGridShowControls);
      expect(isolated.sortType).toBe(defaultGridSortType);
      expect(isolated.sortOrder).toBe(undefined);
    });

    it("should listen on 'elementsReady' event and generate child elements from event data",testAfterElementsReadyEventBehaviour);

    describe('has sortChange method', () => {
      it("should change sort order", testSortChangeMethod);
    });

    describe('has getData method', () => {
      it("should show progressbar", testGetDataMethodShowProgressBar);
      it("should get elements from service", testGetDataMethodGetsDataFromService);
    });
  });
});
