import React, { useContext } from 'react';
import { stringify } from '../helpers/url';
import Router from 'next/router';
import { connect } from 'react-redux';
import Page from '../components/Page';
import { Context } from '../helpers/context';
import TermsContents from '../components/Terms';
import uris from '../uris';

const Terms = (props) => {
  const context = useContext(Context);
  return (
    <div>
      <Page
        lead="Terms of Service"
        onClose={() => {
          Router.push(stringify(uris.pages.root, { lang: context.i18n.lang }));
        }}
      >
        <TermsContents i18n={context.i18n} />
      </Page>
    </div>
  );
};

export default Terms;
