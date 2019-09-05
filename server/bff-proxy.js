import proxy from '../helpers/proxy';
import config from '../config';

export default (req, res) => {
  proxy({
    req,
    res,
    protocol: 'https',
    host: config.googleapis.host,
    prefix: '/bff/google',
  });
};
