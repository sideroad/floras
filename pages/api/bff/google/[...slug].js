import config from '../../../../config';

import matcher from 'path-to-regexp';
import util from 'util';
import 'node-fetch';
import UrlPattern from 'url-pattern';

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

export default (req, res) => {
  proxy({
    req,
    res,
    protocol: 'https',
    host: config.googleapis.host,
    prefix: '/api/bff/google',
  });
};
