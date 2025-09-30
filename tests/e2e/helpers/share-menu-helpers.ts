import { Page, expect } from "@playwright/test"
import { getExpandedTile } from "./widget-helpers"
import { clickFirstWidgetTile } from "../actions/widgets"

/**
 * Test share menu functionality
 */
export async function shouldLoadShareMenu(page: Page, widgetType: string): Promise<void> {
  // Click on the first tile
  await clickFirstWidgetTile(page, widgetType)

  // Click on the share button
  const expandedTile = await getExpandedTile(page)
  const shareButton = expandedTile.locator(".share-button").first()
  await expect(shareButton).toBeVisible()
  await shareButton.click()

  // Check that share popup is visible and interact with copy button
  const sharePopup = expandedTile.locator(".share-socials-popup-wrapper")
  const urlCopy = sharePopup.locator(".url-copy").first()
  await expect(urlCopy).toBeVisible()

  const copyButton = urlCopy.locator(".copy-button").first()
  await expect(copyButton).toBeVisible()
  await copyButton.click()

  // Close the share modal
  const shareModalExit = sharePopup.locator(".share-modal-exit").first()
  await expect(shareModalExit).toBeVisible()
  await shareModalExit.click()

  // Check that the share popup is no longer visible
  await expect(sharePopup.first()).toBeHidden()
}
