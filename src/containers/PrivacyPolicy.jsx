import React, { PropTypes } from 'react';
import Page from '../components/Page';
import PrivacyPolicyContents from '../components/PrivacyPolicy';

const PrivacyPolicy = () =>
  <div>
    <Page>
      <PrivacyPolicyContents />
    </Page>
  </div>;

PrivacyPolicy.propTypes = {};

PrivacyPolicy.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

export default PrivacyPolicy;
