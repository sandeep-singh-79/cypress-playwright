// src/utils/dialogs.ts
import { Page } from '@playwright/test';
import logger from './logger';

/**
 * Dismisses a dialog/banner if present, with logging.
 */
export async function dismissDialog(
  page: Page,
  selector: string,
  dialogName?: string,
) {
  const dismissBtn = page.locator(selector);
  try {
    await dismissBtn.waitFor({ state: 'visible', timeout: 6000 });
    if (dialogName) logger.info(`${dialogName} is visible, dismissing...`);
    await dismissBtn.click();
    await dismissBtn.waitFor({ state: 'hidden', timeout: 6000 });
    if (dialogName) logger.info(`${dialogName} dismissed.`);
  } catch {
    if (dialogName) logger.info(`${dialogName} not found or already dismissed.`);
  }
}

/**
 * Dismisses common overlays like cookie consent and welcome banners.
 * Only use for overlays that are not part of an intended open menu/dialog.
 */
export async function dismissCommonOverlays(page: Page) {
  await dismissDialog(page, 'a[aria-label="dismiss cookie message"]', 'Cookie dialog');
  await dismissDialog(page, 'button[aria-label="Close Welcome Banner"]', 'Welcome banner');
  // Wait for Angular CDK overlay backdrop to clear after banner close animation
  await page.locator('.cdk-overlay-backdrop').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
}
