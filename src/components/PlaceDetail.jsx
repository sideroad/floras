import React, { PropTypes } from 'react';
import { stringify } from 'koiki';
import { Link } from 'react-router';
import uris from '../uris';

const styles = require('../css/place-detail.less');

const PlaceDetail = props =>
  <div
    className={styles.placeDetail}
  >
    {
      <ul className={styles.list}>
        {
          props.items.map(
            item =>
              <Link
                key={item.id}
                to={{
                  pathname: stringify(uris.pages.photos, {
                    lang: props.lang,
                    id: props.id,
                    photo: item.id
                  }),
                  query: {
                    day: props.day
                  }
                }}
                className={styles.link}
              >
                <li
                  className={styles.item}
                  style={{
                    backgroundImage: `url(${item.thumbnail})`
                  }}
                />
              </Link>
          )
        }
      </ul>
    }
  </div>;

PlaceDetail.propTypes = {
  //eslint-disable-next-line
  id: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  day: PropTypes.string,
};


export default PlaceDetail;
