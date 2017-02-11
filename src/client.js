/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import { client } from 'koiki';
import 'react-fastclick';

import routes from './routes';
import urls from './urls';
import reducers from './reducers';

client({
  urls,
  reducers,
  routes,
  isDevelopment: __DEVELOPMENT__
});
