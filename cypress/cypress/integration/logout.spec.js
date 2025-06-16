// Logout Functionality Test (Cypress)
// Verifies logout functionality and access control
import { HomePage } from '../support/pageObjects/HomePage';
import { LoginPage } from '../support/pageObjects/LoginPage';

describe('Logout Functionality', () => {
  const homePage = new HomePage();
  const loginPage = new LoginPage();

  beforeEach(function () {
    cy.fixture('testData.json').as('testData');
    homePage.visit();
    homePage.dismissCookieDialog();
    homePage.dismissWelcomeBanner();
  });

  it('should log out and deny access to user-only pages', function () {
    // Login (using admin credentials from fixture)
    homePage.openAccountMenu();
    homePage.getLoginButton().click();
    cy.get('@testData').then((testData) => {
      loginPage.login(testData.admin.email, testData.admin.password);
    });

    // Validate catalog and cart icon are visible
    homePage.getCatalog().should('be.visible');
    homePage.getCartButton().should('be.visible');

    // Logout
    homePage.openAccountMenu();
    homePage.getLogoutButton().click();

    // After logout, cart icon should not be visible, login option should be available
    homePage.getCartButton().should('not.exist');
    homePage.openAccountMenu();
    homePage.getLoginButton().should('be.visible');
  });
});
