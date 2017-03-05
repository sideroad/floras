import React, { PropTypes } from 'react';

const styles = require('../css/terms.less');

const Terms = ({ i18n }) =>
  <div
    className={styles.terms}
  >
    <div className={styles.contents}>
      {i18n.terms}
    </div>
    <h2 className={styles.lead}>
      Using our Services
    </h2>
    <div className={styles.contents}>
      {i18n.termsInformation}
    </div>
    <h2 className={styles.lead}>
      Content in our Services
    </h2>
    <div className={styles.contents}>
      {i18n.termsContents}
    </div>
    <h2 className={styles.lead}>
      About these terms
    </h2>
    <div className={styles.contents}>
      {i18n.termsContact}
    </div>
  </div>;

Terms.propTypes = {
  i18n: PropTypes.object.isRequired,
};

export default Terms;
