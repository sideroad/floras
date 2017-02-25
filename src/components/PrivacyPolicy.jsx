import React, { PropTypes } from 'react';

const styles = require('../css/privacy-policy.less');

const PrivacyPolicy = () =>
  <div
    className={styles.privacyPolicy}
  >
    <h1>
      Privacy Policy
    </h1>
    <div />
  </div>;

PrivacyPolicy.propTypes = {
  lead: PropTypes.string.isRequired
};

export default PrivacyPolicy;
