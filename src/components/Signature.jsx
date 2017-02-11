import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const styles = require('../css/signature.less');
const src = require('../images/logo.png');

const Signature = props =>
  <header
    className={styles.signature}
  >
    <Link
      className={styles.link}
      to={props.link}
    >
      <img
        alt="logo"
        className={styles.logo}
        src={src}
      />
      <h1>{props.lead}</h1>
    </Link>
  </header>;

Signature.propTypes = {
  lead: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
};

export default Signature;
