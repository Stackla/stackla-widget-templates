import { Locator, Page } from "playwright/test"
import { getWidget } from "../helpers/widget-helpers"

export interface ExpandedTileTileWrapper {
  getCurrentTile: () => Promise<Locator>
  getTile: (index: number) => Locator
  getTileId: (index: number) => Promise<string>
  locate: (location: string) => Locator
  get: () => Locator
}

export async function getExpandedTile(page: Page): Promise<Locator> {
  const shadowRoot = await getWidget(page)

  const expandedTile = shadowRoot.locator("expanded-tiles")
  return expandedTile.first()
}

export async function createExpandedTileWrapper(page: Page): Promise<ExpandedTileTileWrapper> {
  const expandedTile = await getExpandedTile(page)
  const firstTile = expandedTile.locator(".ugc-tile").first()
  const secondTile = expandedTile.locator(".ugc-tile").nth(1)

  if (!firstTile || !secondTile) {
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
    }
  }
}
