import React, { PropTypes } from 'react';
import { stringify } from 'koiki';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import uris from '../uris';
import Page from '../components/Page';
import PlaceDetail from '../components/PlaceDetail';
import PhotoViewer from '../components/PhotoViewer';
import { start as transactionStart, end as transactionEnd } from '../reducers/transaction';

const Place = (props, context) =>
  <div>
    <Page
      lead={props.name.replace(/ō/g, 'ou').replace(/ū/g, 'u')}
      onClose={
        () => props.push(stringify(uris.pages.root, { lang: context.lang }))
      }
    >
      <PlaceDetail
        place={props.params.place}
        best={props.best}
        photos={props.photos}
        lang={context.lang}
        type={props.type}
        types={props.types}
      />
    </Page>
    <PhotoViewer
      id={props.params.photo}
      items={props.photos}
      isOpen={props.params.photo !== undefined}
      onClose={
        () =>
          props.push({
            pathname: stringify(uris.pages.place, {
              lang: context.lang,
              place: props.params.place
            }),
            query: {
              type: props.type
            }
          })
      }
      onPrevNext={
        photo =>
          props.push({
            pathname: stringify(uris.pages.photos, {
              lang: context.lang,
              place: props.params.place,
              photo: photo.id
            }),
            query: {
              type: props.type
            }
          })
      }
    />
  </div>;

Place.propTypes = {
  push: PropTypes.func.isRequired,
  name: PropTypes.string,
  best: PropTypes.object.isRequired,
  photos: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
  type: PropTypes.string,
  types: PropTypes.object.isRequired,
};

Place.defaultProps = {
  name: '',
  type: ''
};

Place.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  cookie: PropTypes.object.isRequired,
};

const connected = connect(
  (state, ownProps) => ({
    name: state.place.item.name,
    best: state.best,
    photos: state.photo.items,
    type: ownProps.location.query.type,
    types: state.type.items,
  }),
  { push }
)(Place);

const asynced = asyncConnect([{
  promise: ({ helpers: { fetcher }, params, location, store: { dispatch } }) => {
    const promises = [];
    dispatch(transactionStart());
    promises.push(
      fetcher.place.get({
        placeid: params.place
      }).then(
        (res) => {
          const geolocation = res.body.result.geometry.location;
          return fetcher.photo.gets({
            place: params.place,
            lat: geolocation.lat,
            lng: geolocation.lng,
            type: location.query.type
          });
        }
      ).then(
        () => {
          dispatch(transactionEnd());
        }
      ).catch(
        () => {
          dispatch(transactionEnd());
        }
      )
    );
    promises.push(
      fetcher.best.gets({
        place: params.place,
        type: location.query.type,
      })
    );
    promises.push(
      fetcher.type.gets()
    );
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
