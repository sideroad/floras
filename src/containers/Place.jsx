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
        id={props.params.id}
        best={props.best}
        trends={props.bests}
        trendLoading={props.trendLoading}
        photos={props.photos}
        lang={context.lang}
        day={props.day}
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
              id: props.params.id
            }),
            query: {
              day: props.day
            }
          })
      }
      onPrevNext={
        photo =>
          props.push({
            pathname: stringify(uris.pages.photos, {
              lang: context.lang,
              id: props.params.id,
              photo: photo.id
            }),
            query: {
              day: props.day
            }
          })
      }
    />
  </div>;

Place.propTypes = {
  push: PropTypes.func.isRequired,
  name: PropTypes.string,
  best: PropTypes.object.isRequired,
  bests: PropTypes.array.isRequired,
  photos: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
  day: PropTypes.string,
  trendLoading: PropTypes.bool.isRequired,
};

Place.defaultProps = {
  name: '',
  day: ''
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
    best: {
      ...state.best.item,
      date: moment().dayOfYear(state.best.item.day).format('MMM D')
    },
    bests: state.best.items.map(item => ({
      ...item,
      date: moment().dayOfYear(item.day).format('MMM D')
    })),
    bestLoading: state.best.loading,
    photos: state.photo.items,
    day: ownProps.location.query.day,
  }),
  { push }
)(Place);

const asynced = asyncConnect([{
  promise: ({ helpers: { fetcher }, params, location, store: { dispatch } }) => {
    const promises = [];
    dispatch(transactionStart());
    promises.push(
      fetcher.place.get({
        placeid: params.id
      }).then(
        (res) => {
          const geolocation = res.body.result.geometry.location;
          return fetcher.photo.gets({
            id: params.id,
            lat: geolocation.lat,
            lng: geolocation.lng,
            day: location.query.day
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
        id: params.id,
        day: location.query.day,
      })
    );
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
