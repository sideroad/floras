import React, { PropTypes } from 'react';

const styles = require('../css/tooltip.less');

const Tooltip = props =>
  <div
    className={styles.tooltip}
  >
    {
      props.active ?
        <div>
          {props.payload[0].payload.date}
        </div>
      : ''
    }
  </div>;

Tooltip.propTypes = {
  active: PropTypes.bool.isRequired,
  payload: PropTypes.array,
};

Tooltip.defaultProps = {
  payload: []
};

export default Tooltip;
