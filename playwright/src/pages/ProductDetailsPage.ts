// src/pages/ProductDetailsPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class ProductDetailsPage {
  readonly page: Page;
  readonly name: Locator;
  readonly price: Locator;
  readonly description: Locator;
  readonly image: Locator;

  constructor(page: Page) {
    this.page = page;
    this.name = page.locator('h1');
    this.price = page.locator('p.item-price');
    this.description = page.locator("//h1//following-sibling::div[1]");
    this.image = page.locator("mat-dialog-content img");
  }

  async assertProductDetailsVisible() {
    await expect(this.name).toBeVisible();
    await expect(this.price).toBeVisible();
    await expect(this.description).toBeVisible();
    await expect(this.image).toBeVisible();
  }
}
