import React, { PropTypes } from 'react';

const styles = require('../css/heat-map-button.less');
const ui = {
  // eslint-disable-next-line global-require
  fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
};

const HeatMapButton = props =>
  <div className={styles.filter} >
    <button
      className={`${styles.favorite} ${props.filtered ? styles.filtered : ''}`}
      onClick={props.onClickFilter}
    >
      <i className={`${ui.fa.fa} ${ui.fa['fa-signal']}`} />
    </button>
  </div>;

HeatMapButton.propTypes = {
  filtered: PropTypes.bool.isRequired,
  onClickFilter: PropTypes.func.isRequired,
};

export default HeatMapButton;
