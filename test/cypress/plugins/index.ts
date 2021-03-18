/* tslint:disable:no-var-requires */
/**
 * This file contains connection of Cypres plugins
 */
const webpackConfig = require('../../../webpack.config.js');
const preprocessor = require('@cypress/webpack-preprocessor');
const codeCoverageTask = require('@cypress/code-coverage/task');

module.exports = (on, config): any => {
  codeCoverageTask(on, config);

  const options = preprocessor.defaultOptions;

  options.typescript = require.resolve('typescript');
  options.webpackOptions = webpackConfig({}, { mode: 'test' });

  on('file:preprocessor', preprocessor(options));

  // It's IMPORTANT to return the config object
  // with any changed environment variables
  return config;
};
