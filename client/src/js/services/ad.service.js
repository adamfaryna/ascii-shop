angular.module('app').factory('adService',
  ['$http', 'serverAddress', '$log', '$q', 'defaultAdsLimit',
  function($http, serverAddress, $log, $q, defaultAdsLimit) {
    'use strict';

    const AdElement = require('../directive/grid/adElement.component');
    const usedAds = [];

    function randomDifferentAdId(lastAdId) {
      let adId;

      do {
        adId = Math.floor(Math.random() * defaultAdsLimit);
      } while (adId === lastAdId);

      return adId;
    }

    function getAd(lastAdId, usedAdsIndex) {
      if (usedAdsIndex < usedAds.length) {
        return usedAds[usedAdsIndex];

      } else {
        const adId = randomDifferentAdId(lastAdId);
        const ad = new AdElement(adId, `${serverAddress}/ad?r=${adId}`);
        usedAds.push(ad);
        return ad;
      }
    }

    return {
      getAd
    };
  }]
);
