'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('jsdom');
var request = _interopDefault(require('superagent'));
var fs = _interopDefault(require('fs-extra'));
var mapSeries = _interopDefault(require('async/mapSeries'));
var eachOfSeries = _interopDefault(require('async/eachOfSeries'));
var _ = _interopDefault(require('lodash'));
var moment = _interopDefault(require('moment'));
var path = _interopDefault(require('path'));
require('url');
var bezier = _interopDefault(require('bezier'));
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

function remove({ place, type }) {
  return request(
    'DELETE',
    `https://chaus.herokuapp.com/apis/fs/events?place=${place}&type=${type}`
  );
}

function crawl(season, evaluator, type) {
  return new Promise((resolve) => {
    const famous = [{ name: '弘前公園' }, { name: '高遠城址公園' }, { name: '吉野山' }];
    const file = fs.readFileSync(path.resolve(__dirname, `../data/${season}-urls.txt`), 'utf-8');
    mapSeries(file.split('\n'), evaluator, (err, response) => {
      if (err) {
        return;
      }
      const spots = _.compact(_.flatten(response));
      mapSeries(
        spots,
        (spot, callback) => {
          const query = `${spot.pref} ${spot.name}`;
          console.log(`# fetch ${query} in google place API`);
          request
            .get(
              `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
                query
              )}&key=${config.googleapis.key}&language=ja`
            )
            .end((fetchError, json) => {
              if (fetchError) {
                console.error('# fetch error: ', err);
                setTimeout(() => callback(), 100);
              } else if (!json.body.results.length) {
                console.log(`# fetch error: ${spot.name} does not found in place API`);
                setTimeout(() => callback(), 100);
              } else {
                console.log(`# fetch success: req[${spot.name}] res[${json.body.results[0].name}]`);
                const location = json.body.results[0].geometry.location;
                const start = moment(spot.start, 'YYYY-MM-DD').dayOfYear();
                const max = moment(spot.max, 'YYYY-MM-DD').dayOfYear();
                const end = moment(spot.end, 'YYYY-MM-DD').dayOfYear();
                const place = json.body.results[0].place_id;
                const name = spot.title || json.body.results[0].name;
                const latlng = `${location.lat},${location.lng}`;
                const popurarity = spot.popurarity || _.find(famous, { name }) ? 9 : 4;

                const strengths = spot.strength
                  ? [spot.strength]
                  : [].concat(
                      0,
                      _.times(max - start + 1, index => (index / (max - start)) * 9),
                      _.times(end - max, index => 9 - (index / (end - max)) * 9),
                      0
                    );
                request
                  .post(
                    `https://translation.googleapis.com/language/translate/v2?key=${
                      config.googleapis.key
                    }`
                  )
                  .send({
                    q: [name],
                    target: 'en',
                  })
                  .end((translateError, translated) => {
                    if (fetchError) {
                      console.error('# translate error: ', err);
                      setTimeout(() => callback(), 100);
                    } else if (!translated.body.data.translations.length) {
                      console.log(
                        `# translate error: ${spot.name} does not found in translation API`
                      );
                      setTimeout(() => callback(), 100);
                    } else {
                      const translatedName = translated.body.data.translations[0].translatedText;
                      console.log(`# translate success: req[${name}] res[${translatedName}]`);
                      remove({ place, type: type.id }).then(() => {
                        eachOfSeries(
                          strengths,
                          (strength, index, eachOfCallback) => {
                            request
                              .post('https://chaus.herokuapp.com/apis/fs/events')
                              .send({
                                ...spot,
                                place,
                                name: translatedName,
                                latlng: spot.latlng || latlng,
                                day: start + index,
                                strength: bezier(strengths, (1 / strengths.length) * (index + 1)),
                                popurarity,
                                type: type.id,
                              })
                              .set('Accept', 'application/json')
                              .end(() => eachOfCallback());
                          },
                          () => {
                            callback();
                          }
                        );
                      });
                    }
                  });
              }
            });
        },
        () => {
          resolve();
        }
      );
    });
  });
}

let queued = false;
var eventsCrawler = (req, res) => {
  if (queued) {
    res.send({ msg: 'already queued' });
    return;
  }
  queued = true;
  res.send({ msg: 'crawling started' });
  getTypes().then((types) => {
    types.map(item => crawl(item.name, sites[item.name], item));
  });
};

module.exports = eventsCrawler;
