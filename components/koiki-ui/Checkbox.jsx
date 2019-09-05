/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';

const styles = require('./less/checkbox.less');

const Checkbox = props => (
  <div className={styles.container}>
    <label className={styles.label}>
      <input
        className={styles.checkbox}
        type="checkbox"
        checked={props.checked}
        onClick={props.onClick}
        readOnly
      />
    </label>
  </div>
);

Checkbox.defaultProps = {
  onClick: () => {},
  checked: false,
};

export default Checkbox;
