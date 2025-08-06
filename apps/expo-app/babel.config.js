module.exports = function (api) {
      // Add a random element to the cache key to force Babel to re-transpile.
      api.cache.using(() => Math.random());
      return {
        presets: ["babel-preset-expo"],
        plugins: [
          "@babel/plugin-transform-class-static-block",
          "react-native-reanimated/plugin", // IMPORTANT: This must be last
        ],
      };
    };
