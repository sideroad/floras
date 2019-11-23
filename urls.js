import config from './config';

export default {
  event: {
    gets: {
      url: '/static/events.json',
      method: 'GET',
      cache: true,
    },
    types: {
      url: 'https://chaus.herokuapp.com/apis/fs/types',
      method: 'GET',
      cache: true,
    },
  },
  trend: {
    gets: {
      url: `${config.app.base}/trends`,
      method: 'GET',
    },
  },
  best: {
    gets: {
      url: `${config.app.base}/trends`,
      method: 'GET',
      cache: true,
    },
  },
  photo: {
    gets: {
      url: `${config.app.base}/bff/photos`,
      method: 'GET',
      cache: true,
    },
  },
  place: {
    gets: {
      url: `${config.app.base}/bff/google/maps/api/place/autocomplete/json`,
      method: 'GET',
      defaults: {
        key: config.googleapis.key,
      },
    },
    get: {
      url: `${config.app.base}/bff/google/maps/api/place/details/json`,
      method: 'GET',
      defaults: {
        key: config.googleapis.key,
        language: 'en',
      },
      cache: true,
    },
  },
};
