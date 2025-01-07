module.exports = function override(config) {
    config.resolve.fallback = {
      fs: false,
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
    };
    return config;
  };
  