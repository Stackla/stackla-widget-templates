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
  await expect(
    currentTile.getByLabel(/^\d+\s+(seconds?|minutes?|hours?|days?|weeks?|months?|years?)\s+ago$/i).first()
  ).toBeVisible()
}

export async function shouldHaveProductButtonWithValidURL(page: Page, widgetType: string): Promise<void> {
  await clickFirstWidgetTile(page, widgetType)
  const button = page.getByRole("link", { name: "Buy product: Kathmandu 1" }).first()

  await expect(button).toHaveAttribute(
    "href",
    "/development/products/asus-tuf-f15-15-6-fhd-144hz-gaming-laptop-1tbgeforce-rtx-3050"
  )

  // Listen for new tab
  const [newPage] = await Promise.all([page.context().waitForEvent("page"), button.click()])

  // Wait for the new page to load
  await newPage.waitForLoadState()
}

export async function shouldHaveAvatars(page: Page, widgetType: string): Promise<void> {
  await clickFirstWidgetTile(page, widgetType)
  const expandedTile = await createExpandedTileLocator(page)
  const currentTile = expandedTile.locate('[data-id="6545848428436e47075464d0"]').first()

  // Wait for the tile to be available in the DOM before accessing its elements
  await expect(currentTile).toBeAttached({ timeout: 10000 })

  const avatarLink = currentTile.locator(".avatar-link")
  await expect(avatarLink).toBeVisible({ timeout: 10000 })

  const avatarUrl = await avatarLink.getAttribute("href")
  expect(avatarUrl).toContain("https://")

  const avatarImg = currentTile.locator(".avatar-link img").first()
  await expect(avatarImg).toBeVisible({ timeout: 10000 })

  const avatarSrc = await avatarImg.getAttribute("src")
  expect(avatarSrc).toContain("https://")
}

export async function shouldHaveVideo(page: Page): Promise<void> {
  const expandedTile = await createExpandedTileLocator(page)
  const tile = expandedTile.locate('[data-media="video"]').first()
  const playIcon = tile.locator(".play-icon").first()
  const video = tile.locator("video").first()
  await expect(playIcon).toHaveCount(1)
  await expect(video).toHaveCount(1)
}

export async function shouldNotHaveVideo(page: Page): Promise<void> {
  const expandedTile = await createExpandedTileLocator(page)
  const tile = expandedTile.locate('[data-media="image"]').first()
  const playIcon = tile.locator(".play-icon").first()
  const video = tile.locator("video").first()
  await expect(playIcon).toHaveCount(0)
  await expect(video).toHaveCount(0)
}

export async function shouldHaveDescription(page: Page, widgetType: string): Promise<void> {
  await clickFirstWidgetTile(page, widgetType)
  const expandedTile = await createExpandedTileLocator(page)
  const currentTile = await expandedTile.getCurrentTile()

  // Check that the description container exists
  const descriptionContainer = currentTile.locator(".description").first()
  await expect(descriptionContainer).toBeVisible()

  // Check that either caption or timephrase content is present
  const caption = currentTile.locator(".caption .caption-paragraph").first()
  const timephrase = currentTile.locator("time-phrase").first()

  // At least one of caption or timephrase should be visible if description is rendered
  const captionExists = (await caption.count()) > 0
  const timephraseExists = (await timephrase.count()) > 0

  // Verify that the description content is actually loaded
  if (captionExists) {
    await expect(caption).toBeVisible()
    // Check that the caption has actual text content (not empty)
    await expect(caption).toHaveText(/.+/)
  }

  if (timephraseExists) {
    await expect(timephrase).toBeVisible()
  }

  // At least one should exist for the description to be considered properly loaded
  expect(captionExists || timephraseExists).toBeTruthy()
}
