import { Page, expect } from "@playwright/test"
import { clickFirstWidgetTile } from "../actions/widgets"
import { createExpandedTileLocator, ExpandedTileLocator } from "../locators/expanded-tile.locator"
import { WidgetType } from "../../../packages/widget-utils/dist/esm/types/Widget"

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

export async function shouldNavigateExpandedTile(page: Page): Promise<void> {
  const expandedTile = await createExpandedTileLocator(page)
  await shouldHaveCorrectInitialTile(expandedTile)
  await shouldNavigateNext(expandedTile)
  await shouldNavigatePrevious(expandedTile)
}

export async function shouldHaveTimestamps(page: Page, widgetType: string): Promise<void> {
  await clickFirstWidgetTile(page, widgetType)
  const expandedTile = await createExpandedTileLocator(page)
  const currentTile = await expandedTile.getCurrentTile()
  await currentTile.getByLabel("19 months ago").first().isVisible()
}

export async function shouldHaveAvatars(page: Page, widgetType: string): Promise<void> {
  await clickFirstWidgetTile(page, widgetType)
  const expandedTile = await createExpandedTileLocator(page)
  const currentTile = await expandedTile.getTile(5)
  const avatarUrl = currentTile.locator(".avatar-link")
  await expect(avatarUrl).toHaveAttribute("href", "https://twitter.com/1708713249204817920/status/1856623620271009870")
  await expect(avatarUrl.locator("img").first()).toHaveAttribute(
    "src",
    "https://pbs.twimg.com/profile_images/1708713429945798656/DPeCtkRh_normal.jpg"
  )
}

export async function shouldHaveVideo(page: Page, widgetType: string): Promise<void> {
  await clickFirstWidgetTile(page, widgetType)
  const expandedTile = await createExpandedTileLocator(page)
  const tile = await expandedTile.getTile(5)

  const playIcon = tile.locator(".play-icon").first()
  const video = tile.locator("video").first()
  await expect(playIcon).toBeVisible()
  await expect(video).toBeVisible()
}

export async function shouldNotHaveVideo(page: Page, widgetType: string): Promise<void> {
  await clickFirstWidgetTile(page, widgetType)
  const expandedTile = await createExpandedTileLocator(page)
  const tile = await expandedTile.getTile(0)

  const playIcon = tile.locator(".play-icon").first()
  const video = tile.locator("video").first()
  await expect(playIcon).toBeHidden()
  await expect(video).toBeHidden()
}
