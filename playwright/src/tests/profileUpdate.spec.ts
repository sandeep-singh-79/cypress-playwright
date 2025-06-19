// src/tests/profileUpdate.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';
import { HomePage } from '../pages/HomePage';
import { testData } from '../utils/testData';
import { log, profile } from 'console';
import logger from '../utils/logger';

// TDD: Start with a failing test for user profile update

test.describe('User Profile Update', () => {
  test('should update user profile fields and verify changes', async ({ page }) => {
    // Step 1: Go to homepage
    const home = new HomePage(page);
    await home.goto(testData.baseUrl);

    // Navigate to login page using HomePage method
    await home.openAccountMenu();
    await home.goToLoginPage();

    // Login
    const login = new LoginPage(page);
    await login.login(testData.admin.email, testData.admin.password);

    // Step 4: Open account menu and go to profile page
    await home.openAccountMenu();
    await home.goToProfilePage();

    // Step 5: Update profile fields
    const profilePage = new ProfilePage(page);
    const newName = 'Test User Updated';
    const newEmail = testData.admin.email;
    await profilePage.updateProfile(newName, newEmail);

    // Step 6: Assert the displayed name in the <p> tag is updated
    const updatedName = await profilePage.getDisplayedName();
    logger.info(`Updated name: ${updatedName}`);
    await expect(profilePage.displayName).toBeVisible();
    expect(updatedName).toContain(newName);
  });
});
