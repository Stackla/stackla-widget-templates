/* eslint-disable playwright/no-wait-for-timeout */
import { Locator, Page } from "playwright/test"
import { getWidget } from "../utilities/widget.utils"

export async function getExpandedTile(page: Page): Promise<Locator> {
  const shadowRoot = await getWidget(page)

  const expandedTile = shadowRoot.locator("expanded-tiles")
  return expandedTile.first()
}

export async function createExpandedTileLocator(page: Page) {
  const expandedTile = await getExpandedTile(page)
  const firstTile = expandedTile.locator(".ugc-tile").first()
  const secondTile = expandedTile.locator(".ugc-tile").nth(1)

  if (!firstTile.count() || !secondTile.count()) {
    throw new Error("Expanded tile or its tiles are not available")
  }

  return {
    get: () => expandedTile,
    locate: expandedTile.locator.bind(expandedTile),
    getCurrentTile: async () => {
      return expandedTile.locator(".ugc-tile.swiper-slide-active").first()
    },
    getTile(index: number) {
      return expandedTile.locator(".ugc-tile").nth(index)
    },
    getTileId: async (index: number) => {
      const tile = expandedTile.locator(".ugc-tile").nth(index)
      return (await tile.getAttribute("data-id")) ?? ""
    },
    navigateNext: async () => {
      const rightArrow = expandedTile.getByAltText("Next arrow")
      await rightArrow.click()
      await expandedTile.locator("[style*='transition-delay: 0ms']").waitFor({ state: "visible" })
    },
    navigatePrevious: async () => {
      const leftArrow = expandedTile.getByAltText("Previous arrow")
      await leftArrow.click()
      await expandedTile.locator("[style*='transition-delay: 0ms']").waitFor({ state: "visible" })
    }
  }
}

export type ExpandedTileLocator = Awaited<ReturnType<typeof createExpandedTileLocator>>
