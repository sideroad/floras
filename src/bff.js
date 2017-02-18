import { proxy } from 'koiki';
import config from './config';

export default function ({ app }) {
  proxy({
    app,
    protocol: 'https',
    host: config.googleapis.host,
    prefix: '/bff',
  });
}
