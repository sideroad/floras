import React, { PropTypes } from 'react';
import { stringify } from 'koiki';
import { Link } from 'react-router';
import BestDate from '../components/BestDate';
import uris from '../uris';

const styles = require('../css/place-detail.less');

const PlaceDetail = props =>
  <div
    className={styles.placeDetail}
  >
    <ul className={styles.list}>
      <li className={styles.best} >
        <BestDate
          item={props.best.item}
          items={props.best.items}
          type={props.type}
          types={props.types}
          name={props.types[props.best.item.type].name}
        />
      </li>
      {
        props.photos.map(
          item =>
            <li key={item.id} className={styles.item}>
              <Link
                to={{
                  pathname: stringify(uris.pages.photos, {
                    lang: props.lang,
                    place: props.place,
                    photo: item.id
                  }),
                  query: {
                    type: props.type
                  }
                }}
                className={styles.link}
              >
                <div
                  className={styles.photo}
                  style={{
                    backgroundImage: `url(${item.thumbnail})`
                  }}
                />
              </Link>
            </li>
        )
      }
    </ul>
  </div>;

PlaceDetail.propTypes = {
  //eslint-disable-next-line react/no-unused-prop-types
  place: PropTypes.string.isRequired,
  //eslint-disable-next-line react/no-unused-prop-types
  lang: PropTypes.string.isRequired,
  best: PropTypes.object.isRequired,
  photos: PropTypes.array.isRequired,
  type: PropTypes.string,
  types: PropTypes.object.isRequired,
};


export default PlaceDetail;
