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

declare const sdk: Sdk

export function initializeInlineSwiperListeners() {
  const swiper = sdk.querySelector(".shortvideo-inline.swiper-inline")

  if (!swiper) {
    throw new Error("Failed to find swiper element")
  }

  initializeSwiperForInlineTiles()
}

function initializeSwiperForInlineTiles() {
  const widgetSelector = sdk.querySelector<HTMLElement>(".shortvideo-inline.swiper-inline")

  if (!widgetSelector) {
    throw new Error("Failed to find widget UI element. Failed to initialise Swiper")
  }

  initializeSwiper(sdk, {
    id: "inline-shortvideo",
    mode: "inline",
    widgetSelector,
    prevButton: "swiper-inline-shortvideo-button-prev",
    nextButton: "swiper-inline-shortvideo-button-next",
    paramsOverrides: {
      slidesPerView: "auto",
      grabCursor: true,
      mousewheel: true,
      allowTouchMove: false,
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
          enableLoadedTiles()
          swiper.slideToLoop(0, 0, false)
        },
        afterInit: (swiper: Swiper) => {
          setSwiperLoadingStatus(sdk, "inline-shortvideo", true)
          void loadTilesAsync(swiper)
        },
        activeIndexChange: (swiper: Swiper) => {
          if (swiper.navigation.prevEl) {
            if (swiper.realIndex === 0 && isSwiperLoading(sdk, "inline-shortvideo")) {
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

export function enableLoadedTiles() {
  sdk
    .querySelectorAll<HTMLElement>(".ugc-tiles > .ugc-tile[style*='display: none']")
    ?.forEach((tileElement: HTMLElement) => (tileElement.style.display = ""))
}

async function loadTilesAsync(swiper: Swiper) {
  const observer = registerObserver(swiper)

  loadAllUnloadedTiles(sdk)
  swiper.update()

  observer.disconnect()
  swiper.navigation.nextEl.classList.remove("swiper-button-hidden")
  updateLoadingStateInterval(swiper.el)
}

function updateLoadingStateInterval(swiperElem: HTMLElement) {
  const intervalId = setInterval(function () {
    const elements = swiperElem.querySelectorAll<HTMLElement>(".swiper-slide:has(.icon-section.hidden)")
    if (elements.length === 0) {
      clearInterval(intervalId)
      updateSwiperInstance(sdk, "inline-shortvideo", swiperData => {
        swiperData.isLoading = false
        if (swiperData.instance) {
          swiperData.instance.off("activeIndexChange")
          swiperData.instance.setGrabCursor()
          swiperData.instance.allowTouchMove = true
          swiperData.instance.params.loop = true
          enablePrevNavigation(swiperData.instance)
        }
      })
      refreshSwiper(sdk, "inline-shortvideo")
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
