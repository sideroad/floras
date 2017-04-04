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
        <BestDate item={props.best} type={props.type} />
      </li>
      {
        props.photos.map(
          item =>
            <li key={item.id} className={styles.item}>
              <Link
                to={{
                  pathname: stringify(uris.pages.photos, {
                    lang: props.lang,
                    id: props.id,
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
  //eslint-disable-next-line
  id: PropTypes.string.isRequired,
  best: PropTypes.object.isRequired,
  photos: PropTypes.array.isRequired,
  type: PropTypes.string,
};


export default PlaceDetail;
