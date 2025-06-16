// cypress/support/pageObjects/ProductDetailsPage.js

export class ProductDetailsPage {
  getProductName() {
    return cy.get('h1');
  }

  getProductPrice() {
    return cy.get('p.item-price');
  }

  getProductDescription() {
    // Cypress does not support XPath by default, so use a CSS workaround
    return cy.get('h1 + div');
  }

  getProductImage() {
    return cy.get('mat-dialog-content img');
  }
}
