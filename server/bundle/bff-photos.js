'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var request = _interopDefault(require('superagent'));
var _ = _interopDefault(require('lodash'));
require('jsdom');
require('fs-extra');
require('async/mapSeries');
require('async/eachOfSeries');
require('moment');
require('path');
require('url');
require('bezier');
require('querystring');

function normalize(url) {
  let protocol = (url.match(/(http|https)\:\/\//) || [])[1];
  if (/\:443$/.test(url)) {
    protocol = protocol || 'https';
  } else {
    protocol = 'http';
  }
  return `${protocol}://${url.replace(/(\:80|\:443)$/, '')}`;
}

const title = 'flora';
const description = 'Visualize 4 seasons';

const environment = {
  development: {
    isProduction: false,
    GLOBAL_HOST: 'localhost',
    GLOBAL_PORT: 5432,
    HOST: 'localhost',
    PORT: '5432',
  },
  production: {
    isProduction: true,
    GLOBAL_HOST: 'floras.now.sh',
    GLOBAL_PORT: 443,
  },
}[process.env.NODE_ENV || 'development'];

const appHost = environment.GLOBAL_HOST;
const appPort = Number(environment.GLOBAL_PORT || 5432);
const base = normalize(`${appHost}:${appPort}`);

var config = Object.assign(
  {
    host: environment.HOST || 'localhost',
    port: Number(5432),
    api: {
      host: 'chaus.herokuapp.com',
      port: Number('443'),
    },
    flickr: {
      key: process.env.KOIKI_FLORAS_FLICKR_API_KEY,
    },
    googleapis: {
      key: 'AIzaSyD-cN8kJmyaYkxOfYfda-MC4Llb62LpMOE',
      host: 'maps.googleapis.com',
    },
    mapbox: {
      token:
        'pk.eyJ1Ijoic2lkZXJvYWQiLCJhIjoiY2l5ems4dHB0MDQyczJxcDh3Nmhjc2h3eCJ9.4vItskqhevUMLJv2ogNdlA',
    },
    app: {
      base,
      host: appHost,
      port: appPort,
      title,
      description,
    },
  },
  environment
);

require('superagent-charset')(request);

const cache = {};

function cachedRequest(apiUrl) {
  return new Promise((resolve) => {
    if (cache[apiUrl]) {
      resolve(cache[apiUrl]);
    } else {
      request(apiUrl).then((res) => {
        cache[apiUrl] = res;
        resolve(res);
      });
    }
  });
}

function getTypes() {
  return cachedRequest('https://chaus.herokuapp.com/apis/fs/types?limit=100').then(
    res => res.body.items
  );
}
function get({ place, type }) {
  return request(
    `https://chaus.herokuapp.com/apis/fs/events?limit=1&place=${place}&type=${type}`
  ).then(res => res.body.items.map(item => ({ ...item, type: item.type.id }))[0]);
}

var bffPhotos = (req, res) => {
  getTypes().then(types =>
    get({ place: req.query.place, type: req.query.type }).then((event) => {
      Promise.all([
        request.get('https://api.flickr.com/services/rest/').query({
          method: 'flickr.photos.licenses.getInfo',
          api_key: config.flickr.key,
          format: 'json',
          nojsoncallback: 1,
        }),
        request.get('https://api.flickr.com/services/rest/').query({
          method: 'flickr.photos.search',
          api_key: config.flickr.key,
          tags: _.find(types, { id: event.type }).tag,
          lat: req.query.lat,
          lon: req.query.lng,
          radius: 1,
          radius_units: 'km',
          extras: 'owner_name,url_z,url_l,license',
          format: 'json',
          media: 'photos',
          nojsoncallback: '1',
        }),
      ])
        .then((responses) => {
          console.log(responses, config.flickr.key);
          const [licenses, photos] = responses;
          if (!photos.body.photos || !photos.body.photos.photo) {
            res.send({
              items: [],
            });
            return;
          }
          res.send({
            items: photos.body.photos.photo
              .map(item => ({
                id: item.id,
                title: item.title,
                url: `https://www.flickr.com/photos/${item.owner}/${item.id}`,
                owner: item.ownername,
                thumbnail: item.url_z,
                image: item.url_l,
                license: _.find(licenses.body.licenses.license, { id: item.license }),
              }))
              .filter(item => item.thumbnail && item.image),
          });
        })
        .catch((error) => {
          console.log(error);
          res.send({ items: [] });
        });
    })
  );
};

module.exports = bffPhotos;
