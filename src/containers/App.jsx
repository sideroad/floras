import React, { PropTypes } from 'react';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';
import config from '../config';

const App = props =>
  <div>
    {props.children}
    <Helmet {...config.app.head} title="Feel 4 seasons, Find best date in the place" />
  </div>;

App.propTypes = {
  children: PropTypes.element,
};

App.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

export default asyncConnect([{
  promise: ({ store: { dispatch } }) => {
    const promises = [];
    console.log(true || dispatch);
    return Promise.all(promises);
  }
}])(App);
