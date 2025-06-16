// src/utils/helpers.ts
import { Page, expect } from '@playwright/test';
import { HomePageLocators } from '../pages/HomePage';

export async function navigateToHome(page: Page, baseUrl: string) {
  await page.goto(baseUrl);
  await expect(page).toHaveURL(/.*\/#/);
}

export async function assertProductCatalogVisible(page: Page) {
  const catalog = page.locator(HomePageLocators.catalog);
  await expect(catalog).toBeVisible();
  const products = page.locator(HomePageLocators.products);
  const productCount = await products.count();
  expect(productCount).toBeGreaterThan(0);
}

export async function assertKeyUIElements(page: Page) {
  await expect(page.locator(HomePageLocators.searchInput)).toBeVisible();
  await expect(page.locator(HomePageLocators.accountButton)).toBeVisible();
  await expect(page.locator(HomePageLocators.languageButton)).toBeVisible();
  await expect(page.locator(HomePageLocators.sidenavButton)).toBeVisible();
}
