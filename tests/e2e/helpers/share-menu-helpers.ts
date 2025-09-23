import { Page, expect } from '@playwright/test'
import { getFirstTile, getExpandedTile } from './widget-helpers'

/**
 * Test share menu functionality
 */
export async function shouldLoadShareMenu(page: Page, widgetType: string): Promise<void> {
  // Click on the first tile
  const firstTile = getFirstTile(page, widgetType)
  await expect(firstTile).toBeVisible()
  await firstTile.click({ force: true })

  await page.waitForTimeout(1000)

  // Click on the share button
  const expandedTile = getExpandedTile(page)
  const shareButton = expandedTile.locator('.share-button').first()
  await expect(shareButton).toBeVisible()
  await shareButton.click({ force: true })

  // Check that share popup is visible and interact with copy button
  const sharePopup = expandedTile.locator('.share-socials-popup-wrapper')
  const urlCopy = sharePopup.locator('.url-copy')
  await expect(urlCopy).toBeVisible()
  
  const copyButton = urlCopy.locator('.copy-button').first()
  await expect(copyButton).toBeVisible()
  await copyButton.click({ force: true })

  // Close the share modal
  const shareModalExit = sharePopup.locator('.share-modal-exit')
  await expect(shareModalExit).toBeVisible()
  await shareModalExit.click({ force: true })

  // Check that the share popup is no longer visible
  await expect(sharePopup.first()).not.toBeVisible()
}