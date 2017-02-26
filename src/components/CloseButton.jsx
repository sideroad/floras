import React, { PropTypes } from 'react';

const styles = require('../css/close-button.less');
const fa = require('../css/koiki-ui/fa/less/font-awesome.less');

const CloseButton = props =>
  <button
    className={`${styles.closeButton} ${props.opened ? styles.open : styles.close} ${props.className}`}
    onClick={(evt) => {
      evt.preventDefault();
      props.onClick();
    }}
  >
    <i className={`${fa.fa} ${fa[props.icon]}`} />
  </button>;

CloseButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  opened: PropTypes.bool,
  onClick: PropTypes.func,
};

CloseButton.defaultProps = {
  opened: true,
  className: '',
  icon: 'fa-angle-right',
  onClick: () => {},
};

export default CloseButton;
