// src/tests/homepage.spec.ts
import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { assertKeyUIElements, assertProductCatalogVisible, navigateToHome } from '../utils/helpers';
import { testData } from '../utils/testData';
import { dismissCommonOverlays } from '../utils/dialogs';

test.describe('Homepage Load', () => {
  test('should load homepage and display product catalog and key UI elements', async ({ page }) => {
    await navigateToHome(page, testData.baseUrl);
    await dismissCommonOverlays(page);

    const home = new HomePage(page);
    await home.isCatalogVisible();
    await home.hasProducts();
    await home.areKeyUIElementsVisible();

    // Optionally, use helpers for additional assertions
    await assertProductCatalogVisible(page);
    await assertKeyUIElements(page);
  });
});
