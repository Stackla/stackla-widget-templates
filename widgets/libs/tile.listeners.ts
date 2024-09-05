import type { Sdk } from "@stackla/ugc-widgets"
import { handleTileClick } from "./tile.lib"
import { BaseConfig } from "../../types/IBaseConfig"

declare const sdk: Sdk

type Callback = () => void

export function registerTileClickEventListeners<T extends BaseConfig>(widgetSettings: T) {
  const urlPattern = /^https?:\/\/.+/

  const tiles = sdk.querySelectorAll(".ugc-tile")

  if (!tiles) {
    throw new Error("Failed to find tiles UI element")
  }

  tiles.forEach((tile: HTMLElement) => {
    const url = widgetSettings.click_through_url ?? ""
    const urlIsValid = urlPattern.test(url)

    if (urlIsValid) {
      tile.onclick = e => {
        handleTileClick(e, url)
      }
    }
  })
}

export function registerTileExpandListener(fn: Callback = () => {}) {
  sdk.addEventListener("tileExpand", fn)
}

export function registerTileClosedListener(fn: Callback = () => {}) {
  sdk.addEventListener("expandedTileClose", fn)
}

export function registerLoadListener(fn: Callback) {
  sdk.addEventListener("load", fn)
}

export function registerTilesUpdated(fn: Callback) {
  sdk.addEventListener("tilesUpdated", () => setTimeout(fn, 200))
}

export function registerPreloadTileHidden(fn: (id: string) => void) {
  sdk.addEventListener("preloadTileHidden", async event => {
    const tileId = (event as CustomEvent).detail.data.id
    fn(tileId)
  })
}

export function registerWidgetInitComplete(fn: Callback) {
  sdk.addEventListener("widgetInitComplete", () => setTimeout(fn, 1000))
}
