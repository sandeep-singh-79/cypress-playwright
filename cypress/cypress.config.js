const { defineConfig } = require('cypress');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Update as needed
    supportFile: 'cypress/support/index.js',
    fixturesFolder: 'cypress/fixtures',
    specPattern: 'cypress/integration/**/*.js',
    video: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    reporter: 'spec',
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      // implement node event listeners here
      return config;
    },
    env: {
      allure: true,
      allureResultsPath: 'allure-results'
    }
  },
});
