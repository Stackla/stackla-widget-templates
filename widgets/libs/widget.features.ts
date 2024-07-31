import type { Sdk, Tile } from "@stackla/types"
import { loadExpandSettingComponents } from "./widget.components"
import {
  registerTileClickEventListeners,
  registerTileClosedListener,
  registerTileExpandListener
} from "./tile.listeners"
import { BaseConfig } from "../../types/IBaseConfig"
import { isEnabled } from "./widget.layout"

declare const sdk: Sdk

export const getNextNavigatedTile = (currentTile: Tile, enabledTiles: HTMLElement[], direction: string) => {
  const currentIndex = enabledTiles.findIndex((tile: HTMLElement) => tile.getAttribute("data-id") === currentTile.id)

  if (direction === "previous") {
    const previousTile = getPreviousTile(enabledTiles, currentIndex)

    if (!previousTile) {
      throw new Error("Failed to find previous tile")
    }

    return previousTile.getAttribute("data-id")
  } else if (direction === "next") {
    const nextTile = getNextTile(enabledTiles, currentIndex)

    if (!nextTile) {
      throw new Error("Failed to find next tile")
    }

    return nextTile.getAttribute("data-id")
  }

  return null
}

export const getNextTile = (enabledTiles: HTMLElement[], currentIndex: number) => enabledTiles[currentIndex + 1]
export const getPreviousTile = (enabledTiles: HTMLElement[], currentIndex: number) => enabledTiles[currentIndex - 1]

export const arrowClickListener = (e: Event) => {
  if (!e.target) {
    throw new Error("Failed to find target element for arrow click listener")
  }

  const target = e.target as HTMLElement

  const type = target.classList.contains("tile-arrows-left") ? "previous" : "next"

  const currentTile = sdk.tiles.getTile()

  if (!currentTile) {
    throw new Error("Failed to find current tile")
  }

  const tilesAsHtml = sdk.querySelectorAll(".ugc-tile")

  if (!tilesAsHtml) {
    throw new Error("Failed to find tiles for arrow initialisation")
  }

  const tilesAsHtmlArray = Array.from(tilesAsHtml)

  const tileId = getNextNavigatedTile(currentTile, tilesAsHtmlArray, type)

  const tilesStore: Tile[] = Object.values(sdk.tiles.tiles)

  const tileData = {
    tileData: tilesStore.find(tile => tile.id === tileId),
    widgetId: sdk.placement.getWidgetId(),
    filterId: sdk.placement.getWidgetContainer().widgetOptions?.filterId
  }

  sdk.triggerEvent("tileExpandClose")
  sdk.triggerEvent("tileExpand", tileData)
}

export function addAutoAddTileFeature<T extends BaseConfig>(widgetSettings: T) {
  if (widgetSettings.auto_refresh === true) {
    sdk.tiles.setAutoAddNewTiles(true)
  }
}

export function showTilesView() {
  const ugcTiles = sdk.querySelector("#tiles")

  if (!ugcTiles) {
    throw new Error("Failed to find tiles UI element")
  }

  ugcTiles.style.display = "block"
}

export function hideTilesView() {
  const ugcTiles = sdk.querySelector("#tiles")

  if (!ugcTiles) {
    throw new Error("Failed to find tiles UI element")
  }

  ugcTiles.style.display = "none"
}

export function loadTileExpandArrows() {
  const expandedTile = sdk.querySelector("expanded-tile")

  if (!expandedTile) {
    throw new Error("Failed to find expanded tile UI element")
  }

  const expandedTileShadowRoot = expandedTile.shadowRoot

  if (!expandedTileShadowRoot) {
    throw new Error("Failed to find expanded tile shadow root")
  }

  // FIXME: This is a hack to wait for the shadow root to be ready, we should have a more accurate event

  setTimeout(() => {
    const prevButton = expandedTileShadowRoot.querySelector(".tile-arrows-left")
    const nextButton = expandedTileShadowRoot.querySelector(".tile-arrows-right")

    if (!prevButton || !nextButton) {
      throw new Error("Failed to find arrow UI elements")
    }

    prevButton.addEventListener("click", arrowClickListener)
    nextButton.addEventListener("click", arrowClickListener)
  }, 500)
}

export function loadWidgetIsEnabled<T extends BaseConfig>(widgetSettings: T) {
  if (isEnabled(widgetSettings)) {
    return true
  }

  const ugcContainer = sdk.querySelector("#nosto-ugc-container")

  if (!ugcContainer) {
    throw new Error("Failed to find Nosto UGC container")
  }

  ugcContainer.style.display = "none"

  throw new Error("Widget is not enabled")
}

export function loadExpandedTileFeature<T extends BaseConfig>(
  widgetSettings: T,
  onTileExpand: () => void = () => {},
  onTileClosed: () => void = () => {}
) {
  if (widgetSettings.click_through_url === "[EXPAND]") {
    loadExpandSettingComponents<T>(widgetSettings)
    registerTileExpandListener(onTileExpand)
    registerTileClosedListener(onTileClosed)
  } else if (
    widgetSettings.click_through_url === "[ORIGINAL_URL]" ||
    /^https?:\/\/.+/.test(widgetSettings.click_through_url ?? "")
  ) {
    registerTileClickEventListeners(widgetSettings)
  }
}

function loadMore() {
  console.log("Loading more tiles")
  const EVENT_LOAD_MORE = "moreLoad"
  const loadMoreButton = sdk.querySelector("#load-more")

  if (!loadMoreButton) {
    throw new Error("Failed to find load more button")
  }

  sdk.triggerEvent(EVENT_LOAD_MORE)

  if (!sdk.tiles.hasMorePages()) {
    loadMoreButton.style.display = "none"
  }
}

export function exceedsBoundaries() {
  // get x position of last visible tile where display none is not true
  const tiles = sdk.querySelectorAll(".ugc-tile:not([style*='display: none'])")

  if (!tiles) {
    throw new Error("Failed to find tiles for boundary check")
  }

  const lastTile = tiles.item(tiles.length - 1)

  // check x position of last visible tile
  if (!lastTile) {
    throw new Error("Failed to find last tile")
  }

  const lastTilePosition = lastTile.getBoundingClientRect().top + lastTile.offsetHeight

  // check if last tile is visible

  return lastTilePosition <= window.innerHeight
}

export function loadIfScrollExceedsBoundaries() {
  // Remove event listener for a bit
  window.removeEventListener("scroll", loadIfScrollExceedsBoundaries)

  const loadMoreButton = sdk.querySelector("#load-more")

  if (!loadMoreButton) {
    throw new Error("Failed to find load more button")
  }

  if (exceedsBoundaries()) {
    window.scrollLocked = true
    loadMore()
  }

  setTimeout(() => {
    window.scrollLocked = false
    window.addEventListener("scroll", loadIfScrollExceedsBoundaries)

    // Check if user has scrolled to the bottom of the tiles list, if so, load more tiles
    if (exceedsBoundaries()) {
      loadMore()
    }
  }, 1000)
}

export function addLoadMoreButtonFeature<T extends BaseConfig>(widgetSettings: T) {
  const loadMoreButton = sdk.querySelector("#load-more")

  if (!loadMoreButton) {
    throw new Error("Failed to find load more button")
  }

  if (widgetSettings.load_more_type === "button") {
    loadMoreButton.onclick = loadMore
  } else {
    loadMoreButton.style.display = "none"
    window.addEventListener("scroll", loadIfScrollExceedsBoundaries)
  }
}

export function addTilesPerPageFeature<T extends BaseConfig>(widgetSettings: T) {
  if (widgetSettings.enable_custom_tiles_per_page) {
    sdk.tiles.setVisibleTilesCount(widgetSettings.tiles_per_page)
  } else {
    sdk.tiles.setVisibleTilesCount(3 * widgetSettings.rows_per_page)
  }
}

export function loadTitle() {
  const widgetTitle = document.createElement("p")
  const widgetContainer = sdk.placement.getWidgetContainer()
  const title = widgetContainer.title

  if (title) {
    widgetTitle.innerHTML = title
  }
}

export function toggleInlineTile(tile: HTMLElement) {
  const tags = tile.querySelector(".tile-tags")

  if (!tags) {
    throw new Error("Failed to find tile tags")
  }

  if (tags.classList.contains("inactive")) {
    tags.classList.remove("inactive")
  } else {
    tags.classList.add("inactive")
  }
}

export function loadHoverTile<T extends BaseConfig>(widgetSettings: T) {
  // Check if any features are enabled that require hover tile
  const hoverTileFeatures = [widgetSettings.show_inline_tags]

  const tiles = sdk.querySelectorAll(".ugc-tile")

  if (!tiles) {
    throw new Error("Failed to find tiles for hover tile initialisation")
  }

  if (hoverTileFeatures.some(feature => feature)) {
    tiles.forEach(tile => {
      const hoverElement = tile.querySelector(".tile-hover")

      if (!hoverElement) {
        console.error("Failed to find hover element - please check your tile template for tile-hover.", tile)
        return
      }

      tile.onmouseover = () => {
        hoverElement.classList.remove("inactive")
        toggleInlineTile(tile)
      }

      tile.onmouseout = () => {
        hoverElement.classList.add("inactive")
        toggleInlineTile(tile)
      }
    })
  }
}
