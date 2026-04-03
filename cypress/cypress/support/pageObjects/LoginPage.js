// cypress/support/pageObjects/LoginPage.js

export class LoginPage {
  getEmailInput() {
    return cy.get('#email');
  }

  getPasswordInput() {
    return cy.get('#password');
  }

  getLoginButton() {
    return cy.get('#loginButton');
  }

  login(email, password) {
    this.getEmailInput().type(email);
    this.getPasswordInput().type(password);
    this.getLoginButton().click();
    cy.get('.cdk-overlay-backdrop', { timeout: 10000 }).should('not.exist');
  }
}
