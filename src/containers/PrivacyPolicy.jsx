import React, { PropTypes } from 'react';
import { stringify } from 'koiki';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import Page from '../components/Page';
import PrivacyPolicyContents from '../components/PrivacyPolicy';
import uris from '../uris';

const PrivacyPolicy = (props, context) =>
  <div>
    <Page
      lead="Privacy Policy"
      onClose={
        () => {
          props.push(stringify(uris.pages.root, { lang: context.lang }));
        }
      }
    >
      <PrivacyPolicyContents
        i18n={context.i18n}
      />
    </Page>
  </div>;

PrivacyPolicy.propTypes = {
  push: PropTypes.func.isRequired,
};

PrivacyPolicy.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
};

const connected = connect(
  () => ({}),
  { push }
)(PrivacyPolicy);


export default connected;
