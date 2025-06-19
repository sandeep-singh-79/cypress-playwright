// cypress/integration/profileUpdate.spec.js
// User Profile Update Test (Cypress)
// Verifies that updating the username is reflected in the profile display
import { HomePage } from '../support/pageObjects/HomePage';
import { LoginPage } from '../support/pageObjects/LoginPage';
import { ProfilePage } from '../support/pageObjects/ProfilePage';

describe('User Profile Update', () => {
  const homePage = new HomePage();
  const loginPage = new LoginPage();
  const profilePage = new ProfilePage();

  beforeEach(function () {
    cy.fixture('testData.json').as('testData');
    homePage.visit();
    homePage.dismissCookieDialog();
    homePage.dismissWelcomeBanner();
  });

  it('should update user profile name and reflect in profile display', function () {
    cy.get('@testData').then((testData) => {
      // Login with admin user
      homePage.openAccountMenu();
      homePage.getLoginButton().click();
      loginPage.login(testData.admin.email, testData.admin.password);

      // Go to profile page
      homePage.openAccountMenu();
      homePage.getProfileButton().click();

      // Update profile name
      const newName = 'Test User Updated';
      profilePage.updateName(newName);
      profilePage.saveChanges();

      // Assert the <p> tag next to the profile image displays the updated name
      profilePage.getDisplayedName().should('contain', newName);
    });
  });
});
