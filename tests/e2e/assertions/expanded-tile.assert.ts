import { Page, expect } from "@playwright/test"
import { clickFirstWidgetTile } from "../actions/widgets"
import { createExpandedTileWrapper } from "../wrappers/expanded-tile"

/**
 * Test expanded tile functionality
 */
export async function shouldExpandTile(page: Page, widgetType: string): Promise<void> {
  // Click on the first tile
  await clickFirstWidgetTile(page, widgetType)

  // Check that body has overflow hidden when expanded tile is open
  const body = page.locator("body")
  await expect(body).toHaveCSS("overflow", "hidden")
}

export async function shouldNavigateExpandedTile(page: Page): Promise<void> {
  const expandedTile = await createExpandedTileWrapper(page)

  let activeSlide = await expandedTile.getCurrentTile()
  await expect(activeSlide).toHaveAttribute("data-id", await expandedTile.getTileId(0))

  const rightArrow = expandedTile.get().getByAltText("Next arrow")
  await rightArrow.click()

  activeSlide = await expandedTile.getCurrentTile()

  await expect(activeSlide).toHaveAttribute("data-id", await expandedTile.getTileId(1))
  await expect(activeSlide).toHaveClass(/swiper-slide-active/)

  // eslint-disable-next-line playwright/no-wait-for-timeout
  await expandedTile.get().page().waitForTimeout(500)

  const leftArrow = expandedTile.get().getByAltText("Previous arrow")
  await leftArrow.click()

  activeSlide = expandedTile.get().locator(".ugc-tile.swiper-slide-active").first()
  await expect(activeSlide).toHaveAttribute("data-id", await expandedTile.getTileId(0))
}
