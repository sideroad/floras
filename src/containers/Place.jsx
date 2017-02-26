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
      <PlaceDetail
        user={props.user}
        onClickLogin={
          () => {
            context.cookie.set('redirect', location.href, {
              path: '/'
            });
            location.href = uris.pages.auth;
          }
        }
        items={props.photos}
      />
    </Page>
  </div>;

Place.propTypes = {
  push: PropTypes.func.isRequired,
  place: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  photos: PropTypes.array.isRequired
};

Place.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  cookie: PropTypes.object.isRequired,
};

const connected = connect(
  state => ({
    place: state.place.item,
    user: state.user.item,
    photos: state.photo.items,
  }),
  { push }
)(Place);

const asynced = asyncConnect([{
  promise: ({ store: { getState }, helpers: { fetcher }, params }) => {
    const promises = [];
    const user = getState().user.item;
    promises.push(
      fetcher.place.get({
        placeid: params.id
      }).then(
        (res) => {
          if (user.token) {
            const location = res.body.result.geometry.location;
            return fetcher.photo.gets({
              access_token: user.token,
              lat: location.lat,
              lng: location.lng,
              distance: 5000,
            });
          }
          return Promise.resolve();
        }
      )
    );
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
