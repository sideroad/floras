import React from 'react';

const styles = require('../css/tooltip.less');

const Tooltip = props => (
  <div className={styles.tooltip}>
    {props.active ? <div>{props.payload[0].payload.date}</div> : ''}
  </div>
);

Tooltip.defaultProps = {
  payload: [],
};

export default Tooltip;
