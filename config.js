import { normalize } from './helpers/url';

const title = 'flora';
const description = 'Visualize 4 seasons';

const environment = {
  development: {
    isProduction: false,
    GLOBAL_HOST: 'localhost',
    GLOBAL_PORT: 3000,
    HOST: 'localhost',
    PORT: '3000',
  },
  production: {
    isProduction: true,
    GLOBAL_HOST: 'floras.tokyo',
    GLOBAL_PORT: 443,
  },
}[process.env.NODE_ENV || 'development'];

const appHost = environment.GLOBAL_HOST;
const appPort = Number(environment.GLOBAL_PORT || 3000);
const base = normalize(`${appHost}:${appPort}`);

export default Object.assign(
  {
    host: environment.HOST || 'localhost',
    port: Number(3000),
    api: {
      host: 'chaus.herokuapp.com',
      port: Number('443'),
    },
    flickr: {
      key: process.env.KOIKI_FLORAS_FLICKR_API_KEY,
    },
    googleapis: {
      key: 'AIzaSyD-cN8kJmyaYkxOfYfda-MC4Llb62LpMOE',
      host: 'maps.googleapis.com',
    },
    mapbox: {
      token:
        'pk.eyJ1Ijoic2lkZXJvYWQiLCJhIjoiY2l5ems4dHB0MDQyczJxcDh3Nmhjc2h3eCJ9.4vItskqhevUMLJv2ogNdlA',
    },
    app: {
      base,
      host: appHost,
      port: appPort,
      title,
      description,
    },
  },
  environment
);
