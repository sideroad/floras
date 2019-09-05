import React from 'react';

const styles = require('../css/heat-map-button.less');

const HeatMapButton = props => (
  <div className={styles.filter}>
    <button
      className={`${styles.favorite} ${props.filtered ? styles.filtered : ''}`}
      onClick={props.onClickFilter}
    >
      <i className="fa fa-signal" />
    </button>
  </div>
);

export default HeatMapButton;
