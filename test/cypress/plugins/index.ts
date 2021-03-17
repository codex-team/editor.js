/**
 * This file contains connection of Cypres plugins
 */
import codeCoverageTask from '@cypress/code-coverage/task';
import preprocessor from '@cypress/webpack-preprocessor';
import webpackConfig from '../../../webpack.config.js';

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
