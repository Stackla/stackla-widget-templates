/**
 * Shared inline swiper loader utility
 * Consolidates duplicate swiper initialization code used across carousel, shortvideo, and storyline widgets
 */

import { Sdk } from "types"
import {
  initializeSwiper,
  refreshSwiper,
  setSwiperLoadingStatus,
  isSwiperLoading,
  updateSwiperInstance
} from "@stackla/widget-utils/extensions/swiper"
import type { Swiper } from "swiper"
import { enableTileImages, loadAllUnloadedTiles } from "@stackla/widget-utils/libs"
import { EVENT_LOAD_MORE } from "@stackla/widget-utils/events"

export interface InlineSwiperConfig {
  /** Widget name (e.g., 'carousel', 'shortvideo', 'storyline') */
  widgetName: string
  /** CSS selector class for the widget (e.g., 'carousel-inline') */
  widgetClass: string
  /** Swiper instance ID (e.g., 'inline-carousel') */
  swiperId: string
  /** Whether to enable loop initially (default: false) */
  initialLoop?: boolean
  /** SDK instance */
  sdk: Sdk
}

/**
 * Initialize inline swiper for a widget with common configuration
 * This reduces duplication across carousel, shortvideo, and storyline widgets
 */
export function initializeInlineSwiper(config: InlineSwiperConfig) {
  const { widgetClass, sdk } = config

  const swiper = sdk.querySelector(`.${widgetClass}.swiper-inline`)

  if (!swiper) {
    throw new Error(`Failed to find swiper element for ${widgetClass}`)
  }

  initializeSwiperForInlineTiles(config)
}

function initializeSwiperForInlineTiles(config: InlineSwiperConfig) {
  const { widgetClass, swiperId, initialLoop = false, sdk } = config

  const widgetSelector = sdk.querySelector<HTMLElement>(`.${widgetClass}.swiper-inline`)

  if (!widgetSelector) {
    throw new Error(`Failed to find widget UI element for ${widgetClass}. Failed to initialise Swiper`)
  }

  initializeSwiper(sdk, {
    id: swiperId,
    mode: "inline",
    widgetSelector,
    prevButton: `swiper-inline-${config.widgetName}-button-prev`,
    nextButton: `swiper-inline-${config.widgetName}-button-next`,
    paramsOverrides: {
      loop: initialLoop,
      slidesPerView: "auto",
      grabCursor: true,
      allowTouchMove: false,
      mousewheel: true,
      breakpointsBase: "container",
      breakpoints: {
        0: {
          slidesPerView: 1
        },
        537: {
          slidesPerView: 3
        },
        952: {
          slidesPerView: 7
        }
      },
      keyboard: {
        enabled: true,
        onlyInViewport: false
      },
      on: {
        reachEnd: () => {
          sdk.triggerEvent(EVENT_LOAD_MORE)
        },
        beforeInit: (swiper: Swiper) => {
          enableLoadedTiles(sdk)
          swiper.slideToLoop(0, 0, false)
        },
        afterInit: (swiper: Swiper) => {
          setSwiperLoadingStatus(sdk, swiperId, true)
          void loadTilesAsync(swiper, sdk, swiperId)
        },
        activeIndexChange: (swiper: Swiper) => {
          if (swiper.navigation.prevEl) {
            if (swiper.realIndex === 0 && isSwiperLoading(sdk, swiperId)) {
              disablePrevNavigation(swiper)
            } else {
              enablePrevNavigation(swiper)
            }
          }
        }
      }
    }
  })
}

function enableLoadedTiles(sdk: Sdk) {
  sdk
    .querySelectorAll<HTMLElement>(".ugc-tiles > .ugc-tile[style*='display: none']")
    ?.forEach((tileElement: HTMLElement) => (tileElement.style.display = ""))
}

async function loadTilesAsync(swiper: Swiper, sdk: Sdk, swiperId: string) {
  const observer = registerObserver(swiper)

  loadAllUnloadedTiles(sdk)
  swiper.update()

  observer.disconnect()
  swiper.navigation.nextEl.classList.remove("swiper-button-hidden")
  updateLoadingStateInterval(swiper.el, sdk, swiperId)
}

function updateLoadingStateInterval(swiperElem: HTMLElement, sdk: Sdk, swiperId: string) {
  const intervalId = setInterval(function () {
    const elements = swiperElem.querySelectorAll<HTMLElement>(".swiper-slide:has(.icon-section.hidden)")
    if (elements.length === 0) {
      clearInterval(intervalId)
      updateSwiperInstance(sdk, swiperId, swiperData => {
        swiperData.isLoading = false
        if (swiperData.instance) {
          swiperData.instance.off("activeIndexChange")
          swiperData.instance.setGrabCursor()
          swiperData.instance.allowTouchMove = true
          swiperData.instance.params.loop = true
          enablePrevNavigation(swiperData.instance)
        }
      })
      refreshSwiper(sdk, swiperId)
    }
  }, 200)
}

function enablePrevNavigation(swiper: Swiper) {
  swiper.allowSlidePrev = true
  swiper.navigation.prevEl.classList.remove("swiper-button-hidden")
}

function disablePrevNavigation(swiper: Swiper) {
  swiper.allowSlidePrev = false
  swiper.navigation.prevEl.classList.add("swiper-button-hidden")
}

function registerObserver(swiper: Swiper) {
  const observer = new MutationObserver(() => {
    enableTileImages(swiper.wrapperEl)
  })
  observer.observe(swiper.wrapperEl, {
    childList: true
  })
  return observer
}
