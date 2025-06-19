// src/pages/HomePage.ts
import { Page, Locator, expect } from '@playwright/test';
import { assertProductCatalogVisible, assertKeyUIElements, navigateToHome } from '../utils/helpers';
import { dismissCommonOverlays } from '../utils/dialogs';
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
    logger.info(`Navigated to home page: ${baseUrl}`);

    // Dismiss common overlays like cookie consent and welcome banners
    await dismissCommonOverlays(this.page);
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

  async goToProfilePage() {
    // Assumes account menu is already open
    const profileButton = this.page.locator('div[role="menu"] button[aria-label="Go to user profile"]');
    await profileButton.click();
  }
}
