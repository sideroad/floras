import config from './config';

export default {
  event: {
    gets: {
      url: `${config.app.base}/events`,
      method: 'GET'
    }
  },
  place: {
    gets: {
      url: '/bff/google/maps/api/place/autocomplete/json',
      method: 'GET',
      defaults: {
        key: config.googleapis.key
      }
    },
    get: {
      url: '/bff/google/maps/api/place/details/json',
      method: 'GET',
      defaults: {
        key: config.googleapis.key
      }
    }
  }
};
