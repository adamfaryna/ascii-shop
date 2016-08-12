'use strict';

describe('ad service', () => {
  let adService, defaultAdOffset;

  const AdElement = require('../../src/js/directive/grid/adElement.component');

  beforeEach(angular.mock.module('app'));

  beforeEach( () => {
    angular.mock.inject( (_adService_, _defaultAdOffset_) => {
      adService = _adService_;
      defaultAdOffset = _defaultAdOffset_;
    });
  })

  it('should return ad element', () => {
    expect(adService.getAd(undefined, 0)).toEqual(jasmine.any(AdElement));
  });

  it('should not return the same ad twice in a row', () => {
    let lastAddedAd;

    for (let i = defaultAdOffset, adId = 0; i <= 1000; i += defaultAdOffset + 1, adId++) {
      const ad = adService.getAd(_.get(lastAddedAd, 'id', undefined), adId);
      expect(ad.id).not.toBe(_.get(lastAddedAd, 'id', undefined));
      expect(ad.src).not.toBe(_.get(lastAddedAd, 'src', undefined));
      lastAddedAd = ad;
    }
  });
});
