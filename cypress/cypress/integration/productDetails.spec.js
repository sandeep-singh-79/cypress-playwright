// Product Details Page Test (Cypress)
// Verifies product details page displays all required info
import { HomePage } from '../support/pageObjects/HomePage';
import { ProductDetailsPage } from '../support/pageObjects/ProductDetailsPage';

describe('Product Details Page', () => {
  const homePage = new HomePage();
  const productDetails = new ProductDetailsPage();

  beforeEach(() => {
    cy.fixture('testData.json').as('testData');
    homePage.visit();
    homePage.dismissCookieDialog();
    homePage.dismissWelcomeBanner();
  });

  it('should display all product details when a product is clicked', function () {
    homePage.getProducts().first().click();
    productDetails.getProductName().should('be.visible');
    productDetails.getProductPrice().should('be.visible');
    productDetails.getProductDescription().should('be.visible');
    productDetails.getProductImage().should('be.visible');
  });
});
