const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    crypto: false, // Disable crypto polyfill (because you're not using nodeCrypto)
  };

  return config;
};
