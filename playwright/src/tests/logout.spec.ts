// src/tests/logout.spec.ts
import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { testData } from '../utils/testData';

// Logout Functionality Test

test.describe('Logout Functionality', () => {
  test('should log out and deny access to user-only pages', async ({ page }) => {
    test.slow();
    // Navigate to the homepage
    const home = new HomePage(page);
    await home.goto(testData.baseUrl);

    // Navigate to login page using HomePage method
    await home.openAccountMenu();
    await home.goToLoginPage();

    // Login
    const login = new LoginPage(page);
    await login.login(testData.admin.email, testData.admin.password);

    // Validate catalog and cart icon are visible
    await home.isCatalogVisible();
    await expect(home.cartButton).toBeVisible();

    // Logout
    await home.logout();

    // After logout, validate cart icon is not visible and login option is available under Account
    await expect(home.cartButton).toBeHidden();
    await home.openAccountMenu();
    await expect(page.locator("#navbarLoginButton")).toBeVisible();
  });
});
