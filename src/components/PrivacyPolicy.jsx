import React, { PropTypes } from 'react';

const styles = require('../css/privacy-policy.less');

const PrivacyPolicy = ({ i18n }) =>
  <div
    className={styles.privacyPolicy}
  >
    <div className={styles.contents}>
      {i18n.privacyPolicy}
    </div>
    <h2 className={styles.lead}>
      What kinds of information do we collect?
    </h2>
    <div className={styles.contents}>
      {i18n.privacyInformation}
    </div>
    <h2 className={styles.lead}>
      How to contact floras with questions
    </h2>
    <div className={styles.contents}>
      {i18n.privacyContact}
    </div>
  </div>;

PrivacyPolicy.propTypes = {
  i18n: PropTypes.object.isRequired,
};

export default PrivacyPolicy;
