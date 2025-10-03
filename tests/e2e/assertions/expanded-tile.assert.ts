import { Page, expect } from "@playwright/test"
import { clickFirstWidgetTile } from "../actions/widgets"
import { createExpandedTileLocator, ExpandedTileLocator } from "../locators/expanded-tile.locator"

export async function shouldExpandTile(page: Page, widgetType: string): Promise<void> {
  await clickFirstWidgetTile(page, widgetType)

  const body = page.locator("body")
  await expect(body).toHaveCSS("overflow", "hidden")

  const expandedTile = await createExpandedTileLocator(page)
  const firstExpandedTile = await expandedTile.getTile(0)

  await expect(firstExpandedTile).toBeVisible()
  await expect(firstExpandedTile).toHaveClass(/swiper-slide-fully-visible/)
  await expect(firstExpandedTile).toHaveClass(/swiper-slide-active/)
}

export async function shouldBeActiveWithId(expandedTile: ExpandedTileLocator, expectedId: string): Promise<void> {
  const activeSlide = await expandedTile.getCurrentTile()
  await expect(activeSlide).toHaveAttribute("data-id", expectedId)
  await expect(activeSlide).toHaveClass(/swiper-slide-active/)
  await expect(activeSlide).toHaveClass(/swiper-slide-fully-visible/)
}

export async function shouldNavigateNext(expandedTile: ExpandedTileLocator): Promise<void> {
  const secondTileId = await expandedTile.getTileId(1)
  await expandedTile.navigateNext()
  await shouldBeActiveWithId(expandedTile, secondTileId)
}

export async function shouldNavigatePrevious(expandedTile: ExpandedTileLocator): Promise<void> {
  const firstTileId = await expandedTile.getTileId(0)
  await expandedTile.navigatePrevious()
  await shouldBeActiveWithId(expandedTile, firstTileId)
}

export async function shouldHaveCorrectInitialTile(expandedTile: ExpandedTileLocator): Promise<void> {
  const firstTileId = await expandedTile.getTileId(0)
  await shouldBeActiveWithId(expandedTile, firstTileId)
}

export async function shouldHaveVideo(expandedTile: ExpandedTileLocator, shouldBeVisible: boolean): Promise<void> {
  const currentTile = await expandedTile.getCurrentTile()
  const playIcon = currentTile.locator(".play-icon").first()
  const video = currentTile.locator("video").first()

  if (shouldBeVisible) {
    await expect(playIcon).toBeVisible()
    await expect(video).toBeVisible()
  } else {
    await expect(playIcon).toBeHidden()
    await expect(video).toBeHidden()
  }
}

export async function shouldNavigateExpandedTile(page: Page): Promise<void> {
  const expandedTile = await createExpandedTileLocator(page)
  await shouldHaveCorrectInitialTile(expandedTile)
  await shouldNavigateNext(expandedTile)
  await shouldNavigatePrevious(expandedTile)
}

export async function shouldCheckTileForVideo(page: Page, tileIndex: number, shouldShow: boolean): Promise<void> {
  const expandedTile = await createExpandedTileLocator(page)
  const tile = await expandedTile.getTile(tileIndex)

  const playIcon = tile.locator(".play-icon").first()
  const video = tile.locator("video").first()
  if (shouldShow) {
    await expect(playIcon).toBeVisible()
    await expect(video).toBeVisible()
  } else {
    await expect(playIcon).toBeHidden()
    await expect(video).toBeHidden()
  }
}
