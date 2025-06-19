// cypress/support/pageObjects/ProfilePage.js
export class ProfilePage {
  nameInput = 'input[name="username"]';
  saveButton = 'button[id="submit"]';
  displayName = 'div.mdl-cell img + p';

  updateName(name) {
    cy.get(this.nameInput).clear().type(name);
  }

  saveChanges() {
    cy.get(this.saveButton).click();
  }

  getDisplayedName() {
    return cy.get(this.displayName);
  }
}
