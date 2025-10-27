import { ISdk } from "@stackla/widget-utils"

import {
  getActiveSlide,
  getActiveSlideElement,
  getSwiperIndexForTile,
  LookupAttr
} from "@stackla/widget-utils/extensions"

import { type SwiperType as Swiper } from "@stackla/widget-utils/types"
import { setupTikTokPlayerReadyEvent, setupVideoEvents, setupYoutubeEvents } from "./expanded-tile-video"

export function storyAutoplayProgress(swiper: Swiper, progress: number) {
  const activeSlideElement = getActiveSlideFromSlides(swiper)
  const progressLine = activeSlideElement?.querySelector<HTMLElement>(".story-autoplay-progress > .progress-content")

  if (!progressLine) {
    return
  }

  progressLine.style.width = `${100 - Math.round(progress * 100)}%`
}

export function getSwiperSlideById(swiper: Swiper, id: number): HTMLElement | undefined {
  return swiper.slides[id]
}

export function getActiveSlideFromSlides(swiper: Swiper): HTMLElement | undefined {
  return swiper.slides.find(slide => slide.classList.contains("swiper-slide-active"))
}

/*
 Get Tile ID
*/

export function getTileIdFromSlide(swiper: Swiper, index: number) {
  const element = getSwiperSlideById(swiper, index)
  return element?.getAttribute("data-id")
}

/**
 * Triggered after all slides in expanded tiles are loaded
 * Setup onload and onerror events for media sources (video/youtube/tiktok)
 */
export function onTileRendered(event: CustomEvent) {
  const widgetSelectorId = event.detail.widgetSelector as string
  const sdk = window.ugc.getWidgetBySelector(widgetSelectorId).sdk as ISdk
  const expandedTilesElement = sdk.getExpandedTiles()
  const tiles = expandedTilesElement.querySelectorAll(".swiper-slide")

  const widgetSelector = expandedTilesElement.querySelector<HTMLElement>(".swiper-expanded")

  if (!widgetSelector) {
    throw new Error("Widget selector for expanded tile (swiper-expanded) is not found")
  }

  setupTikTokPlayerReadyEvent(sdk)

  tiles?.forEach(tile => {
    setupVideoEvents(sdk, tile, widgetSelector)
    setupYoutubeEvents(sdk, tile, widgetSelector)
  })
}

/**
 * Reduces visibility of swiper controls when share menu is opened
 */
export function reduceBackgroundControlsVisibility(sdk: ISdk, sourceId: string) {
  if (!isValidEventSource(sdk, sourceId)) {
    return
  }

  const expandedTile = sdk.getExpandedTiles()
  const navigationPrevButton = expandedTile.querySelector<HTMLElement>(".swiper-expanded-button-prev")
  const navigationNextButton = expandedTile.querySelector<HTMLElement>(".swiper-expanded-button-next")
  const exitTileButtons = expandedTile.querySelectorAll<HTMLElement>(".exit")

  navigationNextButton?.classList.add("swiper-button-disabled")
  navigationPrevButton?.classList.add("swiper-button-disabled")

  exitTileButtons.forEach(button => {
    button.style.opacity = "0.4"
  })
}

/**
 * Resets visibility of swiper controls when share menu is closed
 */
export function resetBackgroundControlsVisibility(sdk: ISdk, sourceId: string) {
  if (!isValidEventSource(sdk, sourceId)) {
    return
  }

  const expandedTile = sdk.getExpandedTiles()
  const wrapper = expandedTile.querySelector<HTMLElement>(".expanded-tile-wrapper")

  if (!wrapper) {
    return
  }

  const navigationPrevButton = wrapper.querySelector<HTMLElement>(".swiper-expanded-button-prev")
  const navigationNextButton = wrapper.querySelector<HTMLElement>(".swiper-expanded-button-next")
  const exitTileButton = wrapper.querySelector<HTMLElement>(".exit")

  navigationNextButton?.classList.remove("swiper-button-disabled")
  navigationPrevButton?.classList.remove("swiper-button-disabled")

  if (exitTileButton) {
    exitTileButton.removeAttribute("style")
  }
}

/**
 * Checks if the source id from the event matches the active slide tile id
 * TODO - Improve this if the tile id can be repeated real time
 *
 * @param { string } sourceId - an event identifier. usually a tileId or a combinations of ids
 * @returns
 */
function isValidEventSource(sdk: ISdk, sourceId: string) {
  const activeSlideElement = getActiveSlideElement(sdk, "expanded")
  return activeSlideElement?.getAttribute("data-id") === sourceId
}

/**
 * Checks if the supplied tile element is currently active in the slide
 *
 * @param { Element } tile - tile element to check
 * @param { HTMLElement } widgetSelector - the container of the swiper element
 * @param { LookupAttr } lookupAttr - additional attribute lookup options for finding the first slide to load
 * @param { LookupAttr.name } lookupAttr.name - name of the attribute for e.g. data-yt-id or data-tiktok-id
 * @param { LookupAttr.value } lookupAttr.value - required value of the attribute
 * @returns true if the supplied tile element is the currently displayed element. false, otherwise.
 */
export function isActiveTile(sdk: ISdk, tile: Element, widgetSelector: HTMLElement, lookupAttr?: LookupAttr) {
  const tileId = tile.getAttribute("data-id")

  if (lookupAttr) {
    const originalLookupAttrValue = tile.getAttribute(lookupAttr.name)
    const activeSwiperElement = getActiveSlideElement(sdk, "expanded")
    const activeElementTileId = activeSwiperElement?.getAttribute("data-id")
    const activeElementLookupAttrValue = activeSwiperElement?.getAttribute(lookupAttr.name)
    return originalLookupAttrValue === activeElementLookupAttrValue && tileId === activeElementTileId
  }
  const tileIndex = tileId ? getSwiperIndexForTile(widgetSelector, tileId) : 0
  return getActiveSlide(sdk, "expanded") === tileIndex
}
