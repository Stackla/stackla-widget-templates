import { Locator, Page, expect } from "@playwright/test"
import { getExpandedTile } from "./widget-helpers"
import { clickFirstWidgetTile } from "../actions/widgets"

/**
 * Test expanded tile functionality
 */
export async function shouldExpandTile(page: Page, widgetType: string) {
  // Click on the first tile
  await clickFirstWidgetTile(page, widgetType)

  // Check that expanded tile element exists
  const expandedTile = await getExpandedTile(page)

  // Check that body has overflow hidden when expanded tile is open
  const body = page.locator("body")
  await expect(body).toHaveCSS("overflow", "hidden")

  return expandedTile
}

export async function shouldNavigateExpandedTile(expandedTile: Locator) {
  const firstTile = (await expandedTile.locator(".ugc-tile").first().getAttribute("data-id")) ?? ""
  const secondTile = (await expandedTile.locator(".ugc-tile").nth(1).getAttribute("data-id")) ?? ""

  let activeSlide = expandedTile.locator(".ugc-tile.swiper-slide-active").first()
  await expect(activeSlide).toHaveAttribute("data-id", firstTile)

  const rightArrow = expandedTile.getByAltText("Next arrow")
  await rightArrow.click()

  activeSlide = expandedTile.locator(".ugc-tile.swiper-slide-active").first()

  await expect(activeSlide).toHaveAttribute("data-id", secondTile)
  await expect(activeSlide).toHaveClass(/swiper-slide-active/)

  // eslint-disable-next-line playwright/no-wait-for-timeout
  await expandedTile.page().waitForTimeout(500)

  const leftArrow = expandedTile.getByAltText("Previous arrow")
  await leftArrow.click()

  activeSlide = expandedTile.locator(".ugc-tile.swiper-slide-active").first()
  await expect(activeSlide).toHaveAttribute("data-id", firstTile)
}
