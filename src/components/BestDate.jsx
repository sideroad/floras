import React, { PropTypes } from 'react';

const styles = require('../css/best-date.less');

const BestDate = props =>
  <div
    className={styles.bestDate}
  >
    <p className={styles.lead}>
      Best time to visit
    </p>
    <p className={styles.date}>
      {props.item.date}
    </p>
  </div>;

BestDate.propTypes = {
  item: PropTypes.object.isRequired
};

export default BestDate;
