'use strict';

const ProductElement = require('../../../src/js/directive/grid/productElement.component');
const ReactTestUtils = require('react-addons-test-utils');
const moment = require('moment');

describe('product element component', () => {
  const productElementTemplate = new ProductElement(2, 10, 100, 200, moment());
  let element;

  beforeEach( () => {
    element = ReactTestUtils.renderIntoDocument(productElementTemplate.render());
    element = $(element);
  });

  it('should render div with proper style classes', () => {
    expect(element.hasClass('element')).toBeTruthy();
    expect(element.hasClass('product')).toBeTruthy();
  });

  it("should render proper 'face'", () => {
    const subElement = $('.face', element);
    expect(subElement.hasClass('face')).toBeTruthy();
  });

  it("should render proper 'size'", () => {
    const subElement = $('.size', element);
    expect(subElement.hasClass('size')).toBeTruthy();
  });

  it("should render proper 'price'", () => {
    const subElement = $('.price', element);
    expect(subElement.hasClass('price')).toBeTruthy();
  });

  it("should render proper 'date'", () => {
    const subElement = $('.date', element);
    expect(subElement.hasClass('date')).toBeTruthy();
  });
});
