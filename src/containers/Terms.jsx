import React, { PropTypes } from 'react';
import { stringify } from 'koiki';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import Page from '../components/Page';
import TermsContents from '../components/Terms';
import uris from '../uris';

const Terms = (props, context) =>
  <div>
    <Page
      lead="Terms of Service"
      onClose={
        () => {
          props.push(stringify(uris.pages.root, { lang: context.lang }));
        }
      }
    >
      <TermsContents
        i18n={context.i18n}
      />
    </Page>
  </div>;

Terms.propTypes = {
  push: PropTypes.func.isRequired,
};

Terms.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
};

const connected = connect(
  () => ({}),
  { push }
)(Terms);


export default connected;
