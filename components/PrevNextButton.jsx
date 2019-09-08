import React from 'react';

const styles = require('../css/prev-next-button.less');

const PrevNextButton = ({
  opened = true,
  className = '',
  icon = 'fa-angle-right',
  onClick = () => {},
}) => (
  <button
    className={`${styles.button} ${opened ? styles.open : styles.close} ${className}`}
    onClick={(evt) => {
      evt.preventDefault();
      onClick();
    }}
  >
    <i className={`fa ${icon}`} />
  </button>
);

export default PrevNextButton;
