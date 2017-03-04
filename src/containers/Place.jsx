import React, { PropTypes } from 'react';
import { stringify } from 'koiki';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import moment from 'moment';
import uris from '../uris';
import Page from '../components/Page';
import PlaceDetail from '../components/PlaceDetail';
import PhotoViewer from '../components/PhotoViewer';

const Place = (props, context) =>
  <div>
    <Page
      lead={props.place.name.replace(/ō/g, 'ou').replace(/ū/g, 'u')}
      onClose={
        () => props.push(stringify(uris.pages.root, { lang: context.lang }))
      }
    >
      <PlaceDetail
        id={props.params.id}
        items={props.photos}
        lang={context.lang}
      />
    </Page>
    <PhotoViewer
      id={props.params.photo}
      items={props.photos}
      isOpen={props.params.photo !== undefined}
      onClose={
        () =>
          props.push(stringify(uris.pages.place, {
            lang: context.lang,
            id: props.params.id
          }))
      }
      onPrevNext={
        photo =>
          props.push(stringify(uris.pages.photos, {
            lang: context.lang,
            id: props.params.id,
            photo: photo.id
          }))
      }
    />
  </div>;

Place.propTypes = {
  push: PropTypes.func.isRequired,
  place: PropTypes.object.isRequired,
  photos: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
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
    photos: state.photo.items,
  }),
  { push }
)(Place);

const asynced = asyncConnect([{
  promise: ({ store, helpers: { fetcher }, params }) => {
    const promises = [];
    const dayOfYear = store.getState().date.dayOfYear || moment().dayOfYear();
    const date = moment().dayOfYear(dayOfYear);
    promises.push(
      fetcher.place.get({
        placeid: params.id
      }).then(
        (res) => {
          const location = res.body.result.geometry.location;
          return fetcher.photo.gets({
            id: params.id,
            lat: location.lat,
            lng: location.lng,
            date: date.subtract(1, 'years').subtract(3, 'days').format('YYYY-MM-DD')
          });
        }
      )
    );
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
