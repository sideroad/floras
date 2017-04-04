import React, { PropTypes } from 'react';
import constants from '../constants';

const styles = require('../css/best-date.less');

const BestDate = props =>
  <div
    className={styles.bestDate}
  >
    <img
      alt="type"
      className={styles.bg}
      src={constants[props.type].image}
    />
    <p className={styles.lead}>
      Best time to visit
    </p>
    <p className={styles.date}>
      {props.item.date}
    </p>
  </div>;

BestDate.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

export default BestDate;
