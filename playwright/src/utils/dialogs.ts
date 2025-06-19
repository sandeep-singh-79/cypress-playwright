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
  beforeScreenshot?: string,
  afterScreenshot?: string,
  notFoundScreenshot?: string
) {
  const dismissBtn = page.locator(selector);
  await page.waitForTimeout(500);
  if (await dismissBtn.isVisible().catch(() => false)) {
    if (dialogName) logger.info(`${dialogName} is visible, dismissing...`);
    if (beforeScreenshot) {
      await page.screenshot({ path: beforeScreenshot });
    }
    await dismissBtn.click();
    await page.waitForSelector(selector, { state: 'hidden', timeout: 5000 }).catch(() => {});
    if (dialogName) logger.info(`${dialogName} dismissed.`);
    if (afterScreenshot) {
      await page.screenshot({ path: afterScreenshot });
    }
  } else {
    if (dialogName) logger.info(`${dialogName} not found.`);
    if (notFoundScreenshot) {
      await page.screenshot({ path: notFoundScreenshot });
    }
  }
}

/**
 * Dismisses common overlays like cookie consent and welcome banners.
 * Only use for overlays that are not part of an intended open menu/dialog.
 */
export async function dismissCommonOverlays(page: Page) {
  await dismissDialog(page, 'a[aria-label="dismiss cookie message"]', 'Cookie dialog');
  await dismissDialog(page, 'button[aria-label="Close Welcome Banner"]', 'Welcome banner');
}
