'use strict';

const AdElement = require('../../../src/js/directive/grid/adElement.component');
const ReactTestUtils = require('react-addons-test-utils');

describe('ad elemenent component', () => {
  const adElementTemplate = new AdElement(1, 'www.abc.com?r=1');
  let adElement;

  beforeEach( () => {
    adElement = ReactTestUtils.renderIntoDocument(adElementTemplate.render());
    adElement = $(adElement);
  });

  it('should render div with proper style classes', () => {
    expect(adElement.hasClass('ad')).toBeTruthy();
    expect(adElement.hasClass('element')).toBeTruthy();
  });

  it('should render proper img', () => {
    expect($('img', adElement).attr('src')).toBe(adElementTemplate.src);
  });
});
