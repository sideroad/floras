import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import { default as Home } from './containers/Home';
import { default as Place } from './containers/Place';
import { default as PrivacyPolicy } from './containers/PrivacyPolicy';
import NotFound from './containers/NotFound';
import uris from './uris';

export default () =>
  /**
   * Please keep routes in alphabetical order
   */
  <Route path={uris.pages.root} component={App} >
    <IndexRoute path={uris.pages.home} component={Home} />
    <Route path={uris.pages.home} component={Home} >
      <Route path={uris.pages.place} component={Place} />
      <Route path={uris.pages.privacy} component={PrivacyPolicy} />
    </Route>
    { /* Catch all route */ }
    <Route path="*" component={NotFound} status={404} />
  </Route>;
