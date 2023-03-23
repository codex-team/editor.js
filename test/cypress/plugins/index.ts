/**
 * This file contains connection of Cypres plugins
 */
const codeCoverageTask = require('@cypress/code-coverage/task');

module.exports = (on, config): unknown => {
  /**
   * Add Cypress task to get code coverage
   */
  codeCoverageTask(on, config);

  // It's IMPORTANT to return the config object
  // with any changed environment variables
  return config;
};
