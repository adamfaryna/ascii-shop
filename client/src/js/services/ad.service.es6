angular.module('app').factory('adService',
  ['$http', 'serverAddress', '$log', '$q',
  function($http, serverAddress, $log, $q) {
    'use strict';

    const cache = {};

    prefetch();

    function prefetch() {
      for (let i = 1; i <= 16; i++) {
        setTimeout( () => {
          if(_.get(cache, i, null) === null) {
            pullAd(i);
          }

        }, 250); // a little timeout to not get banned
      }
    }

    function randomDifferentAdId(lastAdId) {
      let adId;

      do {
        adId = Math.floor(Math.random() * 16);

      } while (adId === lastAdId);

      return adId;
    }

    let pullAdPromise = $q.resolve();

    function pullAd(adId) {
      pullAdPromise = pullAdPromise
        .then( () =>
          $http.get(`${serverAddress}/ad?r=${adId}`)
            .then( ad => {
              $log.log(ad);
              let adObj = {
                id: adId,
                data: ad
              };

              return _.set(cache, adId, adObj);
            }))
        .catch($log.error);
      return pullAdPromise
    }

    function getAd(lastAdId) {
      const adId = randomDifferentAdId(lastAdId);
      const ad = _.get(cache, adId, null);
      return ad ? $q.resolve(ad) : pullAd(adId);
    }

    return {
      getAd
    };
  }]
);
