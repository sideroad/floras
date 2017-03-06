import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';
import config from '../config';
import Loading from '../components/Loading';

const App = props =>
  <div>
    {props.children}
    {
      props.loading ? <Loading /> : ''
    }
    <Helmet {...config.app.head} title="Feel 4 seasons, Find best date in the place" />
  </div>;

App.propTypes = {
  children: PropTypes.element,
  loading: PropTypes.bool,
};

App.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

const connected = connect(
  state => ({
    loading: state.place.loading || state.event.loading || state.photo.loading || true,
  }),
  {}
)(App);

export default asyncConnect([{
  promise: ({ store: { dispatch } }) => {
    const promises = [];
    console.log(true || dispatch);
    return Promise.all(promises);
  }
}])(connected);
