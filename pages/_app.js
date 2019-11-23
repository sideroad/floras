import React from 'react';
import Head from 'next/head';
import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withReduxStore from 'with-redux-store';
import Fetcher from 'redux-unfetch';
import initializeStore from '../reducers/index';
import { get } from '../helpers/i18n';
import { Provider as ContextProvider } from '../helpers/context';
import urls from '../urls';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    const headers = ctx.req ? {
      'user-agent': ctx.req.headers['user-agent'],
      cookie: ctx.req.headers.cookie,
    } : {};
    const fetcher = new Fetcher({
      headers,
      dispatch: ctx.store.dispatch,
      urls,
    });

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ...ctx, fetcher });
    }
    return {
      pageProps,
      headers: ctx.req ? ctx.req.headers : undefined,
      ext: /iPhone|iPad/.test(ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent)
        ? 'png'
        : 'webp',
    };
  }

  render() {
    const { Component, pageProps, store, headers, ext } = this.props;
    const i18n = get({ headers });

    const fetcher = new Fetcher({
      dispatch: store.dispatch,
      urls,
      headers,
    });
    return (
      <ContextProvider
        value={{
          i18n,
          ext,
          fetcher,
        }}
      >
        <Container>
          <Provider store={store}>
            <div className="app">
              <Head>
                <title>Feel 4 seasons, Find best date in the place</title>
              </Head>
              <Component {...pageProps} />
              <style jsx>
                {`
                  .app {
                  }
                `}
              </style>
            </div>
          </Provider>
        </Container>
      </ContextProvider>
    );
  }
}

export default withReduxStore(MyApp, initializeStore);
