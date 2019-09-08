'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _ = _interopDefault(require('lodash'));
var moment = _interopDefault(require('moment'));
var request = _interopDefault(require('superagent'));

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
function getAll() {
  return cachedRequest('https://chaus.herokuapp.com/apis/fs/events?limit=1000000').then(res =>
    res.body.items.map(item => ({ ...item, type: item.type.id }))
  );
}

function getTypes() {
  return cachedRequest('https://chaus.herokuapp.com/apis/fs/types?limit=100').then(
    res => res.body.items
  );
}

var trend = (req, res) => {
  if (req.query.place) {
    getTypes().then((types) => {
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
    getTypes().then((types) => {
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

module.exports = trend;
