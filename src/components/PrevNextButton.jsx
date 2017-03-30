import React, { PropTypes } from 'react';

const styles = require('../css/prev-next-button.less');
const fa = require('../css/koiki-ui/fa/less/font-awesome.less');

const PrevNextButton = props =>
  <button
    className={`${styles.button} ${props.opened ? styles.open : styles.close} ${props.className}`}
    onClick={(evt) => {
      evt.preventDefault();
      props.onClick();
    }}
  >
    <i className={`${fa.fa} ${fa[props.icon]}`} />
  </button>;

PrevNextButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  opened: PropTypes.bool,
  onClick: PropTypes.func,
};

PrevNextButton.defaultProps = {
  opened: true,
  className: '',
  icon: 'fa-angle-right',
  onClick: () => {},
};

export default PrevNextButton;
