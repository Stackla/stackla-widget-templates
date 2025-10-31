/**
 * Shared inline swiper loader utility
 * Consolidates duplicate swiper initialization code used across carousel, shortvideo, and storyline widgets
 */

import { ISdk } from "types"
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
import {
  SWIPER_BREAKPOINT_MOBILE,
  SWIPER_BREAKPOINT_TABLET,
  SWIPER_BREAKPOINT_DESKTOP,
  SWIPER_SLIDES_MOBILE,
  SWIPER_SLIDES_TABLET,
  SWIPER_SLIDES_DESKTOP,
  SWIPER_LOADING_CHECK_INTERVAL,
  SWIPER_INITIAL_SLIDE,
  SWIPER_DEFAULT_SLIDES_PER_VIEW,
  SWIPER_DEFAULT_GRAB_CURSOR,
  SWIPER_DEFAULT_ALLOW_TOUCH_MOVE,
  SWIPER_DEFAULT_MOUSEWHEEL,
  SWIPER_DEFAULT_KEYBOARD_ENABLED,
  SWIPER_DEFAULT_KEYBOARD_ONLY_IN_VIEWPORT
} from "./constants"

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
  sdk: ISdk
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
      slidesPerView: SWIPER_DEFAULT_SLIDES_PER_VIEW,
      grabCursor: SWIPER_DEFAULT_GRAB_CURSOR,
      allowTouchMove: SWIPER_DEFAULT_ALLOW_TOUCH_MOVE,
      mousewheel: SWIPER_DEFAULT_MOUSEWHEEL,
      breakpointsBase: "container",
      breakpoints: {
        [SWIPER_BREAKPOINT_MOBILE]: {
          slidesPerView: SWIPER_SLIDES_MOBILE
        },
        [SWIPER_BREAKPOINT_TABLET]: {
          slidesPerView: SWIPER_SLIDES_TABLET
        },
        [SWIPER_BREAKPOINT_DESKTOP]: {
          slidesPerView: SWIPER_SLIDES_DESKTOP
        }
      },
      keyboard: {
        enabled: SWIPER_DEFAULT_KEYBOARD_ENABLED,
        onlyInViewport: SWIPER_DEFAULT_KEYBOARD_ONLY_IN_VIEWPORT
      },
      on: {
        reachEnd: () => {
          sdk.triggerEvent(EVENT_LOAD_MORE)
        },
        beforeInit: (swiper: Swiper) => {
          enableLoadedTiles(sdk)
          swiper.slideToLoop(SWIPER_INITIAL_SLIDE, SWIPER_INITIAL_SLIDE, false)
        },
        afterInit: (swiper: Swiper) => {
          setSwiperLoadingStatus(sdk, swiperId, true)
          void loadTilesAsync(swiper, sdk, swiperId)
        },
        activeIndexChange: (swiper: Swiper) => {
          if (swiper.navigation.prevEl) {
            if (swiper.realIndex === SWIPER_INITIAL_SLIDE && isSwiperLoading(sdk, swiperId)) {
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

function enableLoadedTiles(sdk: ISdk) {
  sdk
    .querySelectorAll<HTMLElement>(".ugc-tiles > .ugc-tile[style*='display: none']")
    ?.forEach((tileElement: HTMLElement) => (tileElement.style.display = ""))
}

async function loadTilesAsync(swiper: Swiper, sdk: ISdk, swiperId: string) {
  const observer = registerObserver(swiper)

  loadAllUnloadedTiles(sdk)
  swiper.update()

  observer.disconnect()
  swiper.navigation.nextEl.classList.remove("swiper-button-hidden")
  updateLoadingStateInterval(swiper.el, sdk, swiperId)
}

function updateLoadingStateInterval(swiperElem: HTMLElement, sdk: ISdk, swiperId: string) {
  const intervalId = setInterval(function () {
    const elements = swiperElem.querySelectorAll<HTMLElement>(".swiper-slide:has(.icon-section.hidden)")
    if (elements.length === SWIPER_INITIAL_SLIDE) {
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
  }, SWIPER_LOADING_CHECK_INTERVAL)
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
