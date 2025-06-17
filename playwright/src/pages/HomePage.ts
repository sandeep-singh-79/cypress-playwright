// src/pages/HomePage.ts
import { Page, Locator, expect } from '@playwright/test';
import { assertProductCatalogVisible, assertKeyUIElements, navigateToHome } from '../utils/helpers';
import logger from '../utils/logger';

export const HomePageLocators = {
  catalog: "mat-grid-list",
  products: 'div[aria-label="Click for more information about the product"]',
  searchInput: "#searchQuery",
  cartButton: 'button[aria-label="Show the shopping cart"]',
  sidenavButton: "//button[@aria-label='Open Sidenav']",
  accountButton: 'button[aria-label="Show/hide account menu"]',
  languageButton: "//button[@aria-label='Language selection menu']",
};

export class HomePage {
  readonly page: Page;
  readonly catalog: Locator;
  readonly products: Locator;
  readonly searchInput: Locator;
  readonly cartButton: Locator;
  readonly sidenavButton: Locator;
  readonly accountButton: Locator;
  readonly languageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.catalog = page.locator(HomePageLocators.catalog);
    this.products = page.locator(HomePageLocators.products);
    this.searchInput = page.locator(HomePageLocators.searchInput);
    this.cartButton = page.locator(HomePageLocators.cartButton);
    this.sidenavButton = page.locator(HomePageLocators.sidenavButton);
    this.accountButton = page.locator(HomePageLocators.accountButton);
    this.languageButton = page.locator(HomePageLocators.languageButton);
  }

  async goto(baseUrl: string) {
    await navigateToHome(this.page, baseUrl);
    // Debug screenshot after navigation
    await this.page.screenshot({ path: "homepage-after-nav.png" });

    // Dismiss cookie consent dialog if present
    await this.dismissDialog(
      'a[aria-label="dismiss cookie message"]',
      undefined,
      undefined,
      undefined,
      "Cookie dialog"
    );

    // Dismiss welcome banner if present
   /*  await this.dismissDialog(
      'button[aria-label="Close Welcome Banner"]',
      "before-welcome-dismiss.png",
      "after-welcome-dismiss.png",
      "welcome-banner-not-found.png",
      "Welcome banner"
    ); */
    await this.dismissDialog(
      'button[aria-label="Close Welcome Banner"]',
      undefined,
      undefined,
      undefined,
      "Welcome banner"
    );
  }

  /**
   * Dismiss a dialog/banner if present, with logging and optional screenshot debugging.
   * @param selector CSS or XPath selector for the dismiss button
   * @param beforeScreenshot (optional) Name for screenshot before attempting dismiss
   * @param afterScreenshot (optional) Name for screenshot after dismiss
   * @param notFoundScreenshot (optional) Name for screenshot if dialog not found
   * @param dialogName Name for logging
   */
  private async dismissDialog(
    selector: string,
    beforeScreenshot?: string,
    afterScreenshot?: string,
    notFoundScreenshot?: string,
    dialogName?: string
  ) {
    const dismissBtn = this.page.locator(selector);

    // Wait briefly in case dialog appears slightly later
    await this.page.waitForTimeout(500);

    if (await dismissBtn.isVisible().catch(() => false)) {
      if (dialogName) logger.info(`${dialogName} is visible, dismissing...`);
      if (beforeScreenshot) {
        await this.page.screenshot({ path: beforeScreenshot });
      }
      await dismissBtn.click();

      // Wait for it to become hidden (more appropriate than detached)
      await this.page
        .waitForSelector(selector, { state: "hidden", timeout: 5000 })
        .catch(() => {});

      if (dialogName) logger.info(`${dialogName} dismissed.`);
      if (afterScreenshot) {
        await this.page.screenshot({ path: afterScreenshot });
      }
    } else {
      if (dialogName) logger.info(`${dialogName} not found.`);
      if (notFoundScreenshot) {
        await this.page.screenshot({ path: notFoundScreenshot });
      }
    }
  }

  async isCatalogVisible() {
    await assertProductCatalogVisible(this.page);
  }

  async hasProducts() {
    const productCount = await this.products.count();
    expect(productCount).toBeGreaterThan(0);
  }

  async areKeyUIElementsVisible() {
    await assertKeyUIElements(this.page);
  }

  async clickFirstProduct() {
    await this.products.first().click();
  }

  async logout() {
    await this.accountButton.click();
    // The logout button is typically in the account menu
    const logoutButton = this.page.locator('button[aria-label="Logout"]');
    await logoutButton.click();
  }

  async openAccountMenu() {
    await this.accountButton.click();
  }

  async goToLoginPage() {
    // Assumes account menu is already open
    const loginButton = this.page.locator("#navbarLoginButton");
    await loginButton.click();
  }
}
