import { Page, expect } from "@playwright/test"
import { clickFirstWidgetTile } from "../actions/widgets"
import { createExpandedTileLocator } from "../locators/expanded-tile.locator"

export async function shouldExpandTile(page: Page, widgetType: string): Promise<void> {
  await clickFirstWidgetTile(page, widgetType)

  const body = page.locator("body")
  await expect(body).toHaveCSS("overflow", "hidden")

  const expandedTile = await createExpandedTileLocator(page)
  const firstExpandedTile = await expandedTile.getTile(0)

  await expect(firstExpandedTile).toBeVisible()
  await expect(firstExpandedTile).toHaveClass(/swiper-slide-fully-visible/)
}

export async function shouldNavigateExpandedTile(page: Page): Promise<void> {
  const expandedTile = await createExpandedTileLocator(page)

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
