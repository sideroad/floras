import React, { PropTypes } from 'react';

const styles = require('../css/place-detail.less');

const PlaceDetail = props =>
  <div
    className={styles.placeDetail}
  >
    {props.lead}
  </div>;

PlaceDetail.propTypes = {
  lead: PropTypes.string.isRequired
};

export default PlaceDetail;
