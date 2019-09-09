'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var express = _interopDefault(require('express'));
var cors = _interopDefault(require('cors'));
var request = _interopDefault(require('superagent'));
var _ = _interopDefault(require('lodash'));
require('jsdom');
var fs = _interopDefault(require('fs-extra'));
var mapSeries = _interopDefault(require('async/mapSeries'));
var eachOfSeries = _interopDefault(require('async/eachOfSeries'));
var moment = _interopDefault(require('moment'));
var path = _interopDefault(require('path'));
require('url');
var bezier = _interopDefault(require('bezier'));
require('querystring');
var matcher = _interopDefault(require('path-to-regexp'));
var util = _interopDefault(require('util'));
require('isomorphic-fetch');
var UrlPattern = _interopDefault(require('url-pattern'));

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
function get({ place, type }) {
  return request(
    `https://chaus.herokuapp.com/apis/fs/events?limit=1&place=${place}&type=${type}`
  ).then(res => res.body.items.map(item => ({ ...item, type: item.type.id }))[0]);
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

const fetcher = (options, res, after, logger) => {
  logger('# Proxing', ...options);
  fetch(...options)
    .then(
      (apiRes) => {
        if (apiRes.ok) {
          apiRes
            .json()
            .then(json => after(json, converted => res.json(converted)), () => res.json({}));
        } else {
          apiRes
            .json()
            .then(
              json => res.status(apiRes.status).json(json),
              () => res.status(apiRes.status).json({})
            );
        }
      },
      err => logger('# Fetch Error ', options, err) || res.json(err)
    )
    .catch(err => logger('# Unexpected Error ', {}, err) || res.json(err));
};

function proxy({
  req,
  res,
  protocol,
  host,
  prefix,
  customizer,
  before = (url, options, cb) => cb([url, options]),
  after = (json, cb) => cb(json),
  logger = (title, data, err) => console.log(title, util.inspect(data), util.inspect(err)),
}) {
  const apiUri = (req.originalUrl || req.url).replace(new RegExp(prefix), '');
  const url = `${protocol}://${host}${apiUri}`;
  const options = [
    url,
    {
      method: req.method,
      headers: {
        ...req.headers,
        host,
      },
    },
  ];
  if (req.body) {
    options[1].body = JSON.stringify(req.body);
  }
  let customizerBefore;
  let customizerAfter;
  let customizerOverride;
  if (customizer) {
    const keys = Object.keys(Object.assign({}, req.params)).map(key => ({
      name: key,
      prefix: '/',
      delimiter: '/',
    }));
    Object.keys(customizer).some((uri) => {
      if (matcher(uri, keys).exec(url) && customizer[uri] && customizer[uri][req.method]) {
        customizerBefore = customizer[uri][req.method].before;
        customizerAfter = customizer[uri][req.method].after;
        customizerOverride = customizer[uri][req.method].override;
        const pattern = new UrlPattern(uri);
        req.params = pattern.match(url);
      }
    });
  }

  if (customizerOverride) {
    logger('# Proxing with override', url);
    customizerOverride(req, res);
  } else {
    (customizerBefore || before)(...options, fetchOptions =>
      fetcher(fetchOptions, res, customizerAfter || after, logger)
    );
  }
}

var bffProxy = (req, res) => {
  proxy({
    req,
    res,
    protocol: 'https',
    host: config.googleapis.host,
    prefix: '/bff/google',
  });
};

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

const cache$1 = {};

function cachedRequest$1(apiUrl) {
  return new Promise((resolve) => {
    if (cache$1[apiUrl]) {
      resolve(cache$1[apiUrl]);
    } else {
      request(apiUrl).then((res) => {
        cache$1[apiUrl] = res;
        resolve(res);
      });
    }
  });
}
function getAll() {
  return cachedRequest$1('https://chaus.herokuapp.com/apis/fs/events?limit=1000000').then(res =>
    res.body.items.map(item => ({ ...item, type: item.type.id }))
  );
}

function getTypes$1() {
  return cachedRequest$1('https://chaus.herokuapp.com/apis/fs/types?limit=100').then(
    res => res.body.items
  );
}

var trend = (req, res) => {
  if (req.query.place) {
    getTypes$1().then((types) => {
      getAll().then((items) => {
        const type = _.find(types, { id: req.query.type });
        res.send({
          items: items
            .filter(item => item.place === req.query.place && item.type === type.id)
            .map(item => ({
              name: item.name,
              day: item.day,
              date: moment()
                .dayOfYear(item.day)
                .format('YYYY-MM-DD'),
              [item.type]: item.strength,
              type: item.type,
              strength: item.strength,
            })),
        });
      });
    });
  } else {
    getTypes$1().then((types) => {
      const defaults = types.reduce(
        (reduced, type) => ({
          ...reduced,
          [type.id]: 0,
        }),
        {}
      );
      getAll().then((items) => {
        const [nelat, nelng] = (req.query.ne || '').split(',').map(num => Number(num));
        const [swlat, swlng] = (req.query.sw || '').split(',').map(num => Number(num));
        const trends = _.times(365, index => ({
          day: index + 1,
          date: moment()
            .dayOfYear(index + 1)
            .format('YYYY-MM-DD'),
          strength: 0,
          ...defaults,
        }));

        items.forEach((item) => {
          const day = _.find(trends, { day: item.day });
          const [lat, lng] = item.latlng.split(',').map(num => Number(num));
          if (day && lat <= nelat && lat >= swlat && lng <= nelng && lng >= swlng) {
            day[item.type] += item.strength;
            day.type = item.type;
            day.strength += item.strength;
          }
        });

        res.status(200).json({
          items: trends,
        });
      });
    });
  }
};

const app = express();
app.use(cors());
app.use('/trends', trend);
app.use('/events-crawler', eventsCrawler);
app.use('/bff/photos', bffPhotos);
app.use('/bff/google/maps/api/place/', bffProxy);

app.listen(config.port);
