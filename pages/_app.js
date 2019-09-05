import React from 'react';
import Head from 'next/head';
import { Provider, connect } from 'react-redux';
import App, { Container } from 'next/app';
import withReduxStore from '../reducers/with-redux-store';
import { get } from '../helpers/i18n';
import ApiClient from '../helpers/api-client';
import Fetcher from '../helpers/fetcher';
import { Provider as ContextProvider } from '../helpers/context';
import urls from '../urls';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    const headers = ctx.req ? ctx.req.headers : {};
    const { origin } = headers;

    const client = new ApiClient({
      origin,
      referer: origin,
    });
    const fetcher = new Fetcher({
      client,
      dispatch: ctx.store.dispatch,
      urls,
      type: 'server',
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
      origin,
    };
  }

  render() {
    const { Component, pageProps, store, headers, ext, origin } = this.props;
    const i18n = get({ headers });
    const client = new ApiClient({
      origin,
      referer: origin,
    });
    const fetcher = new Fetcher({
      client,
      dispatch: store.dispatch,
      urls,
      type: 'server',
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

export default withReduxStore(MyApp);
