import { normalize } from 'koiki';
import config from './config';

const base = normalize(`${config.api.host}:${config.api.port}`);

export default {
  event: {
    gets: {
      url: `${base}/apis/fs/events`,
      method: 'GET'
    }
  }
};
