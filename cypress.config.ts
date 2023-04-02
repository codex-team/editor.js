import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    NODE_ENV: 'test',
  },
  fixturesFolder: 'test/cypress/fixtures',
  screenshotsFolder: 'test/cypress/screenshots',
  videosFolder: 'test/cypress/videos',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./test/cypress/plugins/index.ts')(on, config);
    },
    specPattern: 'test/cypress/tests/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'test/cypress/support/index.ts',
  },
});
