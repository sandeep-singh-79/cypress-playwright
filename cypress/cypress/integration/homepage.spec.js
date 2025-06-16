// Homepage Load Test (Cypress)
// Verifies homepage loads, product catalog, and key UI elements
import { HomePage } from '../support/pageObjects/HomePage';

describe('Homepage Load', () => {
  const homePage = new HomePage();

  beforeEach(() => {
    cy.fixture('testData.json').as('testData');
    homePage.visit();
    homePage.dismissCookieDialog();
    homePage.dismissWelcomeBanner();
  });

  it('should display product catalog and key UI elements', function () {
    homePage.getCatalog().should('be.visible');
    homePage.getProducts().its('length').should('be.gt', 0);
    homePage.getSearchInput().should('be.visible');
    homePage.getAccountButton().should('be.visible');
    homePage.getLanguageButton().should('be.visible');
    homePage.getSidenavButton().should('be.visible');
  });
});
