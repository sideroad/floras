import React, { useContext } from 'react';
import { stringify } from '../../helpers/url';
import { Context } from '../../helpers/context';
import Router from 'next/router';
import { connect } from 'react-redux';
import uris from '../../uris';
import Page from '../../components/Page';
import PlaceDetail from '../../components/PlaceDetail';
import PhotoViewer from '../../components/PhotoViewer';
import { start as transactionStart, end as transactionEnd } from '../../reducers/transaction';
import { select as selectPhoto } from '../../reducers/photo';

const Place = (props) => {
  const context = useContext(Context);
  return (
    <div>
      <Page
        lead={props.name.replace(/ō/g, 'ou').replace(/ū/g, 'u')}
        onClose={() =>
          Router.push(uris.pages.root, stringify(uris.pages.root, { lang: context.i18n.lang }))
        }
      >
        <PlaceDetail
          place={props.query.place}
          best={props.best}
          photos={props.photos}
          lang={context.i18n.lang}
          type={props.query.type}
          types={props.types}
          onClick={photo => props.selectPhoto(photo)}
        />
      </Page>
      <PhotoViewer
        id={props.selected.id}
        items={props.photos}
        isOpen={props.selected.id !== undefined}
        onClose={() => props.selectPhoto({})}
        onPrevNext={photo => props.selectPhoto(photo)}
      />
    </div>
  );
};

Place.defaultProps = {
  name: '',
  type: '',
};

Place.getInitialProps = async ({ fetcher, req, store: { dispatch }, query }) => {
  dispatch(transactionStart());
  await fetcher.place
    .get({
      placeid: query.place,
    })
    .then((res) => {
      const geolocation = res.body.result.geometry.location;
      return fetcher.photo.gets({
        place: query.place,
        lat: geolocation.lat,
        lng: geolocation.lng,
        type: query.type,
      });
    })
    .then(() => {
      dispatch(transactionEnd());
    })
    .catch(() => {
      dispatch(transactionEnd());
    });
  await fetcher.best
    .gets({
      place: query.place,
      type: query.type,
    })
    .catch(() => {
      dispatch(transactionEnd());
    });
  await fetcher.event.types().catch(() => {
    dispatch(transactionEnd());
  });
  return {
    query,
  };
};

const connected = connect(
  state => ({
    name: state.best.item.name,
    best: state.best,
    photos: state.photo.items,
    selected: state.photo.selected,
    types: state.event.types,
  }),
  { selectPhoto }
)(Place);

export default connected;
