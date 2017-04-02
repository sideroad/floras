import config from './config';

export default {
  event: {
    gets: {
      url: `${config.app.base}/events`,
      method: 'GET',
      cache: {
        client: true
      }
    }
  },
  trend: {
    gets: {
      url: `${config.app.base}/trends`,
      method: 'GET'
    }
  },
  best: {
    gets: {
      url: `${config.app.base}/trends`,
      method: 'GET',
      cache: {
        client: true
      }
    }
  },
  photo: {
    gets: {
      url: `${config.app.base}/bff/photos`,
      method: 'GET',
      cache: {
        client: true
      }
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
      url: `${config.app.base}/bff/google/maps/api/place/details/json`,
      method: 'GET',
      defaults: {
        key: config.googleapis.key,
        language: 'en'
      },
      cache: {
        client: true
      }
    }
  }
};
