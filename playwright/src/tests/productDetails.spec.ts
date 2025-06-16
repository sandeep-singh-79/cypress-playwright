// src/tests/productDetails.spec.ts
import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { testData } from '../utils/testData';

// Product Details Page Test

test.describe('Product Details Page', () => {
  test('should display all product details when a product is clicked', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto(testData.baseUrl);
    await home.isCatalogVisible();
    await home.hasProducts();
    await home.clickFirstProduct();

    const details = new ProductDetailsPage(page);
    await details.assertProductDetailsVisible();
  });
});
