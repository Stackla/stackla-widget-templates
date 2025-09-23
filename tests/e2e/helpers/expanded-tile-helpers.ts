import { Page, expect } from '@playwright/test'
import { getFirstTile, getExpandedTile } from './widget-helpers'

/**
 * Test expanded tile functionality
 */
export async function shouldExpandedTile(page: Page, widgetType: string): Promise<void> {
  // Check that expanded tile element exists
  const expandedTile = getExpandedTile(page)
  await expect(expandedTile).toBeVisible()

  await page.waitForTimeout(4000)

  // Click on the first tile
  const firstTile = getFirstTile(page, widgetType)
  await firstTile.click()

  await page.waitForTimeout(4000)

  // Check that expanded tile is still visible after click
  await expect(expandedTile).toBeVisible()

  // Hide image filler for consistent testing
  const imageFiller = expandedTile.locator('.image-filler')
  await expect(imageFiller).toBeVisible()
  await imageFiller.evaluate(element => {
    (element as HTMLElement).style.visibility = 'hidden'
  })

  await page.waitForTimeout(1000)

  // Check that body has overflow hidden when expanded tile is open
  const body = page.locator('body')
  await expect(body).toHaveCSS('overflow', 'hidden')
}

/**
 * Take a screenshot of the expanded tile
 */
export async function expandedTileSnapshot(page: Page, widgetType: string): Promise<void> {
  await page.waitForTimeout(4000)

  const expandedTile = getExpandedTile(page)
  const specificTile = expandedTile.locator(".ugc-tile[data-id='65e16a0b5d7e676caec68f03']").first()
  await expect(specificTile).toBeVisible()
  
  // Take screenshot of the expanded tile
  await page.screenshot({
    path: `test-results/screenshots/${widgetType}-tile.png`,
    fullPage: false
  })
}