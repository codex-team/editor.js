/**
 * This file is processed and
 * loaded automatically before the test files.
 *
 * This is a great place to put global configuration and
 * behavior that modifies Cypress.
 */

/**
 * File with the helpful commands
 */
import './commands';

/**
 * Before-each hook for the cypress tests
 */
beforeEach((): void => {
  cy.visit('test/cypress/fixtures/test.html');
});
