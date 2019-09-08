import React from 'react';

const styles = require('../css/terms.less');

const Terms = ({ i18n }) => (
  <div className={styles.terms}>
    <div className={styles.contents}>{i18n.t('terms')}</div>
    <h2 className={styles.lead}>Using our Services</h2>
    <div className={styles.contents}>{i18n.t('termsInformation')}</div>
    <h2 className={styles.lead}>Content in our Services</h2>
    <div className={styles.contents}>{i18n.t('termsContents')}</div>
    <h2 className={styles.lead}>About these terms</h2>
    <div className={styles.contents}>{i18n.t('termsContact')}</div>
  </div>
);

export default Terms;
