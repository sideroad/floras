'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

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

module.exports = bffProxy;
