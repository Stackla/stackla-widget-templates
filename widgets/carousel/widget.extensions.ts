import type { Sdk } from "@stackla/ugc-widgets"
import { IWidgetSettings } from "../../types/IWidgetSettings"
import { getConfig } from "./widget.config"
import { waitForElm } from "widgets/libs/widget.features"
import { disableSwiper, initializeSwiper, refreshSwiper } from "@widgets/libs/extensions/swiper/swiper.extension"
import { registerExpandedTileShareMenuListeners } from "@widgets/libs/templates/share-menu/share-menu.listener"

declare const sdk: Sdk

export function initializeInlineSwiperListeners() {
  const widgetContainer = sdk.placement.getWidgetContainer()
  const widgetSettings = getConfig(widgetContainer)

  const swiper = sdk.querySelector(".swiper-inline")

  if (!swiper) {
    throw new Error("Failed to find swiper element")
  }

  initializeSwiperForInlineTiles(widgetSettings)
}

function initializeSwiperForInlineTiles(widgetSettings: IWidgetSettings) {
  const widgetSelector = sdk.placement.querySelector<HTMLElement>(".swiper-inline")

  if (!widgetSelector) {
    throw new Error("Failed to find widget UI element. Failed to initialise Swiper")
  }

  const tileWidth = 210
  const screenSize = window.innerWidth
  const perView = !widgetSettings.enable_custom_tiles_per_page
    ? Math.floor(screenSize / (tileWidth + 10))
    : widgetSettings.tiles_per_page

  const width = (tileWidth + 10) * perView
  widgetSelector.style.width = `${width}px`

  sdk.tiles.setVisibleTilesCount(perView * 2)

  initializeSwiper({
    widgetSelector,
    perView,
    prevButton: "swiper-inline-button-prev",
    nextButton: "swiper-inline-button-next"
  })
}

function initializeSwiperForExpandedTiles(initialTileId: string) {
  const expandedTile = sdk.querySelector("expanded-tiles")
  if (!expandedTile?.shadowRoot) {
    throw new Error("The expanded tile element not found")
  }
  const widgetSelector = expandedTile.shadowRoot.querySelector<HTMLElement>(".swiper-expanded")

  if (!widgetSelector) {
    throw new Error("Failed to find widget UI element. Failed to initialise Glide")
  }

  sdk.tiles.setVisibleTilesCount(2)

  initializeSwiper({
    widgetSelector,
    perView: 1,
    mode: "expanded",
    prevButton: "swiper-expanded-button-prev",
    nextButton: "swiper-expanded-button-next",
    initialTileId
  })
}

export function onTileExpand(tileId: string) {
  const expandedTile = sdk.querySelector("expanded-tiles")

  if (!expandedTile?.shadowRoot) {
    throw new Error("The expanded tile element not found")
  }

  expandedTile.parentElement!.classList.add("expanded-tile-overlay")

  waitForElm(expandedTile.shadowRoot, [".swiper-expanded"], () => initializeSwiperForExpandedTiles(tileId))
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

    const videoElement = tile.querySelector<HTMLVideoElement>("video.video-js")
    if (videoElement) {
      videoElement.onerror = () => {
        videoElement.closest(".video-content-wrapper")?.classList.add("hidden")
        tile.querySelector(".video-fallback-content")?.classList.remove("hidden")
      }
    }
  })
}

export function onTileClosed() {
  const expandedTile = sdk.querySelector("expanded-tiles")

  if (!expandedTile?.shadowRoot) {
    throw new Error("The expanded tile element not found")
  }

  expandedTile.parentElement!.classList.remove("expanded-tile-overlay")

  disableSwiper("expanded")
}

export function hideSlidesWithInvisibleTilesBackup() {
  const widgetSelectorWrapper = sdk.placement.querySelector(".swiper-wrapper")
  const slides = widgetSelectorWrapper?.querySelectorAll<HTMLElement>(".swiper-slide")

  slides?.forEach(slide => {
    if (!slide.children.length || getComputedStyle(slide).display === "none") {
      slide.remove()
    }
  })
  refreshSwiper("inline")
}
