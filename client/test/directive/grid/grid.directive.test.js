'use strict';

const sinon = require('sinon');
const AdElement = require('../../../src/js/directive/grid/adElement.component');
const ProductElement = require('../../../src/js/directive/grid/productElement.component');

describe('grid directive', () => {
  let sandbox;
  let $rootScope, $compile, $q, $timeout;
  let scope, element;
  let elements = [];

  let defaultGridDefaultColumnNum, defaultGridProductDisplayLimit,
    defaultGridSortType, defaultGridShowControls, dataService;

  const templateUrl = 'partials/directive/grid.html';

  let dataServiceStub;

  beforeEach( () => {
    sandbox = sinon.sandbox.create();
    let adsAdded = 0;

    for (let i = 0; i !== 100; i++) {
      elements.push(new ProductElement(i + 1, i * 10, i * 15, i * 20, moment()));

      if ((elements.length - adsAdded) % 20 === 0) {
        elements.push(new AdElement(i, 'www.abc.com'));
        adsAdded++;
      }
    }
  });

  beforeEach(angular.mock.module('app', 'templates', $provide => {
    $provide.service('dataService', function () {
      this.getData = () => {};
    })
  }));

  beforeEach(angular.mock.inject( (_$q_, _$timeout_, $templateCache, partialsPath, _$rootScope_, _$compile_, _defaultGridDefaultColumnNum_, _defaultGridProductDisplayLimit_,
    _defaultGridSortType_, _defaultGridShowControls_, _dataService_) => {
    $q = _$q_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    defaultGridDefaultColumnNum = _defaultGridDefaultColumnNum_;
    defaultGridProductDisplayLimit = _defaultGridProductDisplayLimit_;
    defaultGridSortType = _defaultGridSortType_;
    defaultGridShowControls = _defaultGridShowControls_;
    dataService = _dataService_;
    scope = $rootScope.$new();

    dataServiceStub = sandbox.stub(dataService, 'getData').returns($q.resolve(elements));

    const template = $templateCache.get(templateUrl);
    $templateCache.put(templateUrl, template);
  }));

  afterEach( () => {
    sandbox.restore();
    elements = [];
  })

  function testAfterElementsReadyEventBehaviour(done) {
    $rootScope.$emit('elementsReady', elements);
    const isolated = element.isolateScope();
    isolated.getData();

    setTimeout( () => {
      expect($('.element.product', element).length).toBe(100);
      expect($('.element.ad', element).length).toBe(5);
      expect(isolated.data.elements).toBe(elements);
      done();
    }, 100);

    $timeout.flush();
  }

  function testSortChangeMethod(element) {
    return () => {
      const ctrl = element.data('$dawGridController');
      const isolated = elements.isolateScope();
      ctrl.sortChange('price');
      const gridElements = isolated.data.elements;

      gridElements.forEach( (elem, index) => {
        if (index !== 0) {
          expect(elem.price).toBeLessThan(gridElements[index].price);
        }
      });
    };
  }

  function testGetDataMethodShowProgressBar() {
    element.isolateScope().getData();
    expect(scope.showProgressBar).toBeTruthy;
  }

  function testGetDataMethodGetsDataFromService() {
    element.isolateScope().getData();
    expect(dataServiceStub.calledOnce).toBeTruthy();
  }

  describe('with all attributes set', () => {
    const limit = 50;
    const showControls = true;
    const sortType = 'size';
    const sortOrder = 'descending';
    const columns = 5;

    beforeEach( () => {
      const elementTemplate = angular.element(`<daw-grid limit="${limit}" show-controls="${showControls}" sort-type="${sortType}" sort-order="${sortOrder}" columns="${columns}"></daw-grid>`);

      element = $compile(elementTemplate)(scope);
      scope.$apply();
    });

    it('should set properly all parameters', () => {
      const isolated = element.isolateScope();
      expect(isolated.limit).toBe(limit);
      expect(isolated.columns).toBe(columns);
      expect(isolated.showControls).toBe(showControls);
      expect(isolated.sortType).toBe(sortType);
      expect(isolated.sortOrder).toBe(sortOrder);
    });

    it("should listen on 'elementsReady' event and generate child elements from event data",
      done => testAfterElementsReadyEventBehaviour(done));

    describe('has sortChange method', () => {
      it("should change sort order", () => testSortChangeMethod(element));
    });

// aaa
    describe('has getData method', () => {
      it("should show progressbar", testGetDataMethodShowProgressBar);
      it("should get elements from service once", testGetDataMethodGetsDataFromService);
    });
  });

  describe('with no attributes set', () => {
    beforeEach( () => {
      const elementTemplate = angular.element('<daw-grid></daw-grid>');

      element = $compile(elementTemplate)(scope);
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

    it("should listen on 'elementsReady' event and generate child elements from event data",
      done => testAfterElementsReadyEventBehaviour(done));

    describe('has sortChange method', () => {
      it("should change sort order", () => testSortChangeMethod(element));
    });

    describe('has getData method', () => {
      it("should show progressbar", testGetDataMethodShowProgressBar);
      it("should get elements from service", testGetDataMethodGetsDataFromService);
    });
  });
});
