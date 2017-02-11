import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import { default as Home } from './containers/Home';
import People from './containers/People';
import NotFound from './containers/NotFound';
import uris from './uris';


export default () =>
  /**
   * Please keep routes in alphabetical order
   */
  <Route path={uris.pages.root} component={App} >
    <IndexRoute component={Home} />
    { /* Catch all route */ }
    <Route
      path={uris.pages.people}
      component={People}
    />
    <Route path="*" component={NotFound} status={404} />
  </Route>;
