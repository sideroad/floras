import React, { PropTypes } from 'react';

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
              <li
                className={styles.item}
                style={{
                  backgroundImage: `url(${item.thumbnail})`
                }}
              />
          )
        }
      </ul>
    }
  </div>;

PlaceDetail.propTypes = {
  items: PropTypes.array.isRequired,
};

export default PlaceDetail;
