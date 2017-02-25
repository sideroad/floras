import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import { default as Home } from './containers/Home';
import NotFound from './containers/NotFound';
import uris from './uris';
import config from './config';
import { set } from './reducers/user';
import { get } from './helpers/auth';


export default (store, cookie) => {
  /**
   * Please keep routes in alphabetical order
   */
  const checkAuth = (nextState, replace, cb) => {
    const isLogin = store.getState().user &&
                    store.getState().user.item &&
                    store.getState().user.item.id;
    if (isLogin) {
      cb();
    } else {
      get(`${config.app.base}/auth`, cookie)
        .then(
          // login user
          (res) => {
            store.dispatch(set({
              id: res.id,
              token: res.token
            }));
            cb();
          },
          () => {
            cb();
          }
        );
    }
  };
  const login = (nextState, replace, cb) => {
    checkAuth(nextState, replace, () => {
      const isLogin = store.getState().user &&
                      store.getState().user.item &&
                      store.getState().user.item.id;
      if (isLogin) {
        cb();
      } else {
        cookie.set('redirect', nextState.location.pathname, {
          path: '/'
        });
        if (__SERVER__) {
          replace('/auth/instagram');
        } else {
          location.href = `${config.app.base}/auth/instagram`;
        }
        cb();
      }
    });
  };

  return (
    /**
     * Please keep routes in alphabetical order
     */
    <Route path={uris.pages.root} component={App} >
      <Route path={uris.pages.home} >
        <IndexRoute component={Home} />
        <Route path={uris.pages.privacy} component={Home} />
      </Route>
      { /* Catch all route */ }
      <Route path={uris.pages.instagram} component={Home} onEnter={login} />
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
