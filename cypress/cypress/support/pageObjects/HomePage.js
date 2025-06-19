// cypress/support/pageObjects/HomePage.js

export class HomePage {
  visit() {
    cy.visit('/');
  }

  dismissCookieDialog() {
    cy.get('a[aria-label="dismiss cookie message"]', { timeout: 5000 })
      .then($el => { if ($el.is(':visible')) cy.wrap($el).click(); });
  }

  dismissWelcomeBanner() {
    cy.get('button[aria-label="Close Welcome Banner"]', { timeout: 5000 })
      .then($el => { if ($el.is(':visible')) cy.wrap($el).click(); });
  }

  getCatalog() {
    return cy.get('mat-grid-list');
  }

  getProducts() {
    return cy.get('mat-grid-tile');
  }

  getSearchInput() {
    return cy.get('#searchQuery');
  }

  getAccountButton() {
    return cy.get('button[aria-label="Show/hide account menu"]');
  }

  getLanguageButton() {
    return cy.get('button[aria-label="Language selection menu"]');
  }

  getSidenavButton() {
    return cy.get('button[aria-label="Open Sidenav"]');
  }

  openAccountMenu() {
    this.getAccountButton().click();
  }

  getCartButton() {
    return cy.get('button[aria-label="Show the shopping cart"]');
  }

  getLoginButton() {
    return cy.get('#navbarLoginButton');
  }

  getLogoutButton() {
    return cy.get('button[aria-label="Logout"]');
  }

  getProfileButton() {
    // Assumes account menu is already open
    return cy.get('div[role="menu"] button[aria-label="Go to user profile"]');
  }
}
