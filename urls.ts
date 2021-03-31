import { Urls } from '@sideroad/redux-fetch';
import config from './config';

const urls: Urls = {
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
      url: `${config.app.base}/api/trends`,
      method: 'GET',
    },
  },
  best: {
    gets: {
      url: `${config.app.base}/api/trends`,
      method: 'GET',
      cache: true,
    },
  },
  photo: {
    gets: {
      url: `${config.app.base}/api/bff/photos`,
      method: 'GET',
      cache: true,
    },
  },
  place: {
    gets: {
      url: `${config.app.base}/api/bff/google/maps/api/place/autocomplete/json`,
      method: 'GET',
      defaults: {
        key: config.googleapis.key,
      },
    },
    get: {
      url: `${config.app.base}/api/bff/google/maps/api/place/details/json`,
      method: 'GET',
      defaults: {
        key: config.googleapis.key,
        language: 'en',
      },
      cache: true,
    },
  },
};

export default urls;