import type { Sdk } from "@stackla/ugc-widgets"
import { initializeSwiper, getClickedIndex, disableSwiper, enableSwiper } from "./swiper.extension"
import { waitForElm } from "@widgets/libs/widget.features"
import { registerExpandedTileShareMenuListeners } from "@widgets/libs/templates/share-menu/share-menu.listener"

declare const sdk: Sdk

export function initializeExtendedSwiper() {
  const expandedTile = sdk.querySelector("expanded-tiles")
  if (!expandedTile?.shadowRoot) {
    throw new Error("The expanded tile element not found")
  }
  const widgetSelector = expandedTile.shadowRoot.querySelector<HTMLElement>(".swiper-expanded")

  if (!widgetSelector) {
    throw new Error("Failed to find widget UI element. Failed to initialise Glide")
  }

  initializeSwiper({
    widgetSelector,
    perView: 1,
    mode: "expanded",
    initialIndex: getClickedIndex("inline"),
    prevButton: "swiper-expanded-button-prev",
    nextButton: "swiper-expanded-button-next"
  })
}

export function onTileExpand() {
  const expandedTile = sdk.querySelector("expanded-tiles")

  if (!expandedTile?.shadowRoot) {
    throw new Error("The expanded tile element not found")
  }

  expandedTile.parentElement!.classList.add("expanded-tile-overlay")

  disableSwiper("inline")

  waitForElm(expandedTile.shadowRoot, [".swiper-expanded"], initializeExtendedSwiper)
}

export function onTileRendered() {
  const expandedTilesElement = sdk.querySelector("expanded-tiles")

  if (!expandedTilesElement) {
    throw new Error("Expanded tiles element not found")
  }

  const tiles = expandedTilesElement.shadowRoot?.querySelectorAll(".swiper-slide")

  tiles?.forEach(tile => {
    const shareButton = tile.querySelector<HTMLElement>(".panel-right .share-button")
    if (!shareButton) {
      throw new Error(`Share button not found in expanded tile ${tile.getAttribute("data-id")}`)
    }
    registerExpandedTileShareMenuListeners(expandedTilesElement, shareButton, tile)
  })
}

export function onTileClosed() {
  const expandedTile = sdk.querySelector("expanded-tiles")

  if (!expandedTile?.shadowRoot) {
    throw new Error("The expanded tile element not found")
  }

  expandedTile.parentElement!.classList.remove("expanded-tile-overlay")

  disableSwiper("expanded")
  enableSwiper("inline")
}
