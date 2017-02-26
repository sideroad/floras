import { proxy } from 'koiki';
import config from '../config';

export default function ({ app }) {
  proxy({
    app,
    protocol: 'https',
    host: config.googleapis.host,
    prefix: '/bff/google',
  });
  proxy({
    app,
    protocol: 'https',
    host: config.instagram.host,
    prefix: '/bff/instagram',
  });
}
