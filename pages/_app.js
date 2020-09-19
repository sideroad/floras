import React from 'react';
import Head from 'next/head';
import { Provider } from 'react-redux';
import App from 'next/app';
import withReduxStore from '@sideroad/with-redux-store';
import Fetcher from '@sideroad/redux-fetch';
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
        <Provider store={store}>
          <div className="app">
            <Head>
              <title>Feel 4 seasons, Find best date in the place</title>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, minimum-scale=1.0"
              />
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
      </ContextProvider>
    );
  }
}

export default withReduxStore(MyApp, initializeStore);
