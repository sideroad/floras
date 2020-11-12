import Document, { Html, Head, Main, NextScript } from 'next/document';
import { get } from '../helpers/i18n';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const ext = /iPhone|iPad/.test(ctx.req.headers['user-agent']) ? 'png' : 'webp';
    return { ...initialProps, headers: ctx.req.headers, ext };
  }

  render() {
    const { headers, ext } = this.props;

    const i18n = get({ headers });

    return (
      <Html lang={i18n.lang}>
        <Head>
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="description" content="floras" />
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#EC6D71" />
          <meta property="og:site_name" content="floras" />
          <meta property="og:image" content={`/static/images/favicon.${ext}`} />
          <meta property="og:locale" content="en_US" />
          <meta property="og:title" content="floras" />
          <meta property="og:description" content="floras" />
          <meta property="og:card" content="summary" />
          <meta property="og:creator" content="koiki" />
          <meta property="og:image:width" content="300" />
          <meta property="og:image:height" content="300" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href={`/static/images/favicon.${ext}`} />
          <link rel="apple-touch-icon" href={`/static/images/favicon.${ext}`} />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://fonts.googleapis.com/css?family=Tangerine"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://fonts.googleapis.com/earlyaccess/hannari.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css"
          />
          <link rel="stylesheet" type="text/css" href="/static/css/rc-slider.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/recharts.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/normalize.css" />
          <script src="/static/js/analytics.js" />
        </Head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__i18n={resource: ${JSON.stringify(
                i18n.resource
              )}, lang: ${JSON.stringify(i18n.lang)}}`,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
