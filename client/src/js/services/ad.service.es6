angular.module('app').factory('adService',
  ['$http', 'serverAddress', '$log', '$q', 'defaultAdsLimit', 'defaultAdsFetchNumber',
  function($http, serverAddress, $log, $q, defaultAdsLimit, defaultAdsFetchNumber) {
    'use strict';

    const AdElement = require('../view/grid/adElement.es6');

    const cache = {};

    // let pullAdPromise = $q.resolve();

    prefetch();

    function prefetch() {
      for (let i = 0; i !== defaultAdsFetchNumber; i++) {
        setTimeout( () => {
          if (_.get(cache, i, null) === null) {
            pullAd(i);
          }
        }, 250); // a little timeout to not get banned
      }
    }

    function randomDifferentAdId(lastAdId) {
      let adId;

      do {
        adId = Math.floor(Math.random() * defaultAdsLimit);

      } while (adId === lastAdId);

      return adId;
    }

    function pullAd(adId) {
      const ad = new AdElement(adId, `${serverAddress}/ad?r=${adId}`);
      _.set(cache, adId, ad);
      return ad;
      // return $http.get(`${serverAddress}/ad?r=${adId}`, {responseType: 'arraybuffer'})



      //   .then( res => {
      //     const blob = new Blob([res.data], {type: 'image/jpeg'});
      //     const adObj = new AdElement(adId, (window.URL || window.webkitURL).createObjectURL(blob));

      //     _.set(cache, adId, adObj);
      //     return adObj;
      //   }, $log.error);
    }

    function getAd(lastAdId) {
      const adId = randomDifferentAdId(lastAdId);
      const ad = _.get(cache, adId, null);
      return ad ? ad : pullAd(adId);
    }

    return {
      getAd
    };
  }]
);
