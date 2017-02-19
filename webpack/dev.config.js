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

var babelrc = fs.readFileSync('./.babelrc');
var babelrcObject = {};

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};

// merge global and dev-only plugins
var combinedPlugins = babelrcObject.plugins || [];
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins);

var babelLoaderQuery = Object.assign({}, babelrcObjectDevelopment, babelrcObject, {plugins: combinedPlugins});
delete babelLoaderQuery.env;
module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    'main': [
      `webpack-dev-server/client?http://${host}:${port}/`,
      './src/client.js'
    ]
  },
  inline: true,
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + host + ':' + port + '/dist/'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel?' + JSON.stringify(babelLoaderQuery), 'eslint-loader']},
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.less$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!less?outputStyle=expanded&sourceMap' },
      // { test: /\.scss$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
      { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' }
    ],
    postLoaders: [{
      include: /node_modules\/mapbox-gl/,
      loader: 'transform-loader',
      query: 'brfs',
    }],
  },
  progress: true,
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules',
      'i18n'
    ],
    extensions: ['', '.json', '.js', '.jsx', '.properties'],
    alias: {
      webworkify: 'webworkify-webpack-dropin',
      'gl-matrix': path.resolve('./node_modules/gl-matrix/dist/gl-matrix.js'),
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
        RYORAN_MAPBOX_TOKEN: '"' + process.env.RYORAN_MAPBOX_TOKEN + '"',
        RYORAN_GOOGLE_API_KEY: '"' + process.env.RYORAN_GOOGLE_API_KEY + '"',
        RYORAN_INSTAGRAM_APP_ID: '"' + process.env.RYORAN_INSTAGRAM_APP_ID + '"',
        RYORAN_INSTAGRAM_APP_SECRET: '""',
      }
    }),
    webpackIsomorphicToolsPlugin.development()
  ],
  node: {
    fs: 'empty',
  }
};
