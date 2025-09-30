import { Page, expect } from "@playwright/test"
import { getExpandedTile } from "./widget-helpers"
import { clickFirstWidgetTile } from "../actions/widgets"

/**
 * Test expanded tile functionality
 */
export async function shouldExpandTile(page: Page, widgetType: string): Promise<void> {
  // Click on the first tile
  await clickFirstWidgetTile(page, widgetType)

  // Check that expanded tile element exists
  await getExpandedTile(page)

  // Check that body has overflow hidden when expanded tile is open
  const body = page.locator("body")
  await expect(body).toHaveCSS("overflow", "hidden")
}
