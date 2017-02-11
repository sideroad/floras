import { normalize } from 'koiki';
import config from './config';

const base = normalize(`${config.api.host}:${config.api.port}`);

export default {
  person: {
    load: {
      url: `${base}/apis/koiki/people`,
      method: 'GET'
    }
  },
  hobby: {
    load: {
      url: `${base}/apis/koiki/hobbies`
    }
  }
};
