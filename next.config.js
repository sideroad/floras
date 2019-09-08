const withLess = require('@zeit/next-less');

module.exports = withLess({
  cssModules: true,
  webpack(config) {
    config.node = { fs: 'empty' };
    return config;
  },
});
