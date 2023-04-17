/**
 * This file contains connection of Cypres plugins
 */
import * as codeCoverageTask from '@cypress/code-coverage/task';

module.exports = (on, config): unknown => {
  /**
   * Add Cypress task to get code coverage
   */
  codeCoverageTask(on, config);

  // It's IMPORTANT to return the config object
  // with any changed environment variables
  return config;
};
