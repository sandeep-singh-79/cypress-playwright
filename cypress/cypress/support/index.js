// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import '@shelex/cypress-allure-plugin';

// Juice Shop v19.2.x emits Angular/zone.js uncaught exceptions that are
// cosmetic and do not affect test outcomes. Suppress only those; let all
// other uncaught exceptions propagate so real bugs are not silently ignored.
Cypress.on('uncaught:exception', (err) => {
  if (
    err.message.includes('Non-Error promise rejection') ||
    err.message.includes('zone') ||
    err.message.includes('ngZone') ||
    err.message.includes('ExpressionChangedAfterItHasBeenCheckedError')
  ) {
    return false;
  }
});
