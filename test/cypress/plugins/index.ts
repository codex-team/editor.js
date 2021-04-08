/* tslint:disable:no-var-requires */
/**
 * This file contains connection of Cypres plugins
 */
const webpackConfig = require('../../../webpack.config.js');
const preprocessor = require('@cypress/webpack-preprocessor');
const codeCoverageTask = require('@cypress/code-coverage/task');

module.exports = (on, config): any => {
  /**
   * Add Cypress task to get code coverage
   */
  codeCoverageTask(on, config);

  /**
   * Prepare webpack preprocessor options
   */
  const options = preprocessor.defaultOptions;

  /**
   * Provide path to typescript package
   */
  options.typescript = require.resolve('typescript');

  /**
   * Provide our webpack config
   */
  options.webpackOptions = webpackConfig({}, { mode: 'test' });

  /**
   * Register webpack preprocessor
   */
  on('file:preprocessor', preprocessor(options));

  // It's IMPORTANT to return the config object
  // with any changed environment variables
  return config;
};
