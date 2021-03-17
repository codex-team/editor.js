/**
 * This file contains connection of Cypres plugins
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
// export default function(on, config): void {}
module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config);

  const preprocessor = require('@cypress/webpack-preprocessor');

  const options = preprocessor.defaultOptions;

  options.typescript = require.resolve('typescript');
  options.webpackOptions = require('../../../webpack.config.js')({}, { mode: 'test' });

  on('file:preprocessor', preprocessor(options));

  // It's IMPORTANT to return the config object
  // with any changed environment variables
  return config;
};
