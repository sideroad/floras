import { normalize } from 'koiki';
import config from './config';

const base = normalize(`${config.api.host}:${config.api.port}`);

export default {
  event: {
    gets: {
      url: `${base}/apis/fs/events`,
      method: 'GET'
    }
  },
  place: {
    gets: {
      url: '/bff/maps/api/place/autocomplete/json',
      method: 'GET',
      defaults: {
        key: config.googleapis.key
      }
    },
    get: {
      url: '/bff/maps/api/place/details/json',
      method: 'GET',
      defaults: {
        key: config.googleapis.key
      }
    }
  }
};
