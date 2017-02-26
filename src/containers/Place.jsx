import React, { PropTypes } from 'react';
import { stringify } from 'koiki';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import uris from '../uris';
import Page from '../components/Page';
import PlaceDetail from '../components/PlaceDetail';

const Place = (props, context) =>
  <div>
    <Page
      lead={props.place.name.replace(/ō/g, 'ou')}
      onClose={
        () => {
          props.push(stringify(uris.pages.root, { lang: context.lang }));
        }
      }
    >
      <PlaceDetail />
    </Page>
  </div>;

Place.propTypes = {
  push: PropTypes.func.isRequired,
  place: PropTypes.object.isRequired,
};

Place.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

const connected = connect(
  state => ({
    place: state.place.item
  }),
  { push }
)(Place);

const asynced = asyncConnect([{
  promise: ({ helpers: { fetcher }, params }) => {
    const promises = [];
    promises.push(fetcher.place.get({
      placeid: params.id
    }));
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
