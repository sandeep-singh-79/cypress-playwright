// src/pages/ProfilePage.ts
import { Page, Locator, expect } from '@playwright/test';

export const ProfilePageLocators = {
  nameInput: 'input[name="username"]',
  emailInput: 'input[name="email"]',
  saveButton: 'button[id="submit"]',
  displayName: "div.mdl-cell img + p",
};

export class ProfilePage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly saveButton: Locator;
  readonly displayName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator(ProfilePageLocators.nameInput);
    this.emailInput = page.locator(ProfilePageLocators.emailInput);
    this.saveButton = page.locator(ProfilePageLocators.saveButton);
    this.displayName = page.locator(ProfilePageLocators.displayName);
  }

  async updateProfile(name: string, email: string) {
    await this.nameInput.fill(name);
    // Email field should be disabled and not editable
    await expect(this.emailInput).toBeDisabled();
    // Optionally, verify the email value matches the expected value
    if (email) {
      const currentEmail = await this.emailInput.inputValue();
      expect(currentEmail).toBe(email);
    }
    await this.saveButton.click();
  }

  async getNameValue() {
    return this.nameInput.inputValue();
  }

  async getEmailValue() {
    return this.emailInput.inputValue();
  }

  async getDisplayedName() {
    // Returns the text content of the <p> tag next to the profile image
    return this.displayName.textContent();
  }
}
