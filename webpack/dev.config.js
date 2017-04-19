require('babel-polyfill');

// Webpack config for development
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
var assetsPath = path.resolve(__dirname, '../static/dist');
var host = (process.env.HOST || 'localhost');
var port = parseInt(process.env.PORT) + 1 || 3001;

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    'main': [
      path.resolve(__dirname, '../src/client.js')
    ]
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + host + ':' + port + '/dist/'
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: [{
        loader: 'buble-loader',
        options: {
          objectAssign: 'Object.assign'
        }
      }, 'eslint-loader']},
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.less$/, use: [
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 2,
            sourceMap: true,
            localIdentName: '[local]___[hash:base64:5]'
          },
        },
        {
          loader: 'less-loader',
          options: {
            outputStyle: 'expanded',
            sourceMap: true
          }
        },
      ]},
      // { test: /\.scss$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: [ { loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } } ]},
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: ['file-loader'] },
      { test: webpackIsomorphicToolsPlugin.regular_expression('images'), use: ['url-loader'] }
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, '../src'),
      'node_modules',
      path.join(__dirname, '../i18n'),
    ],
    extensions: ['.json', '.js', '.jsx', '.properties'],
    alias: {
      webworkify: 'webworkify-webpack-dropin',
      'mapbox-gl$': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js'),
    }
  },
  plugins: [
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      'process.env': {
        NODE_ENV: '"' + process.env.NODE_ENV + '"',
        GLOBAL_HOST: '"' + process.env.GLOBAL_HOST + '"',
        GLOBAL_PORT: '"' + process.env.GLOBAL_PORT + '"',
        FLORAS_MAPBOX_TOKEN: '"' + process.env.FLORAS_MAPBOX_TOKEN + '"',
        FLORAS_GOOGLE_API_KEY: '"' + process.env.FLORAS_GOOGLE_API_KEY + '"',
        FLORAS_INSTAGRAM_APP_ID: '"' + process.env.FLORAS_INSTAGRAM_APP_ID + '"',
        FLORAS_INSTAGRAM_APP_SECRET: '""',
      }
    }),
    webpackIsomorphicToolsPlugin.development()
  ],
  node: {
    fs: 'empty',
  }
};
