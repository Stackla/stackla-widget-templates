import { Sdk, SwiperData } from "types"
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
import { getSlidesPerView } from "./slides-per-view"

declare const sdk: Sdk

export function initializeSwiperForInlineStoryTiles() {
  const { inline_tile_size } = sdk.getStyleConfig()
  const widgetSelector = sdk.querySelector<HTMLElement>(".story-inline.swiper-inline")

  const prev = widgetSelector!.parentNode!.querySelector<HTMLElement>(".swiper-inline-story-button-prev")
  const next = widgetSelector!.parentNode!.querySelector<HTMLElement>(".swiper-inline-story-button-next")

  if (!widgetSelector) {
    throw new Error("Failed to find widget UI element. Failed to initialise Swiper")
  }

  const spaceBetween = inline_tile_size === "small" ? 5 : inline_tile_size === "medium" ? 20 : 25
  widgetSelector.setAttribute("variation", inline_tile_size)
  widgetSelector.parentElement!.style.setProperty("--spacing", `${spaceBetween}`)

  const container = sdk.querySelector("#nosto-ugc-container")
  const containerObserver = new ResizeObserver(() => {
    const slidesPerView = getSlidesPerView()
    initializeSwiper({
      id: "inline-story",
      mode: "inline",
      widgetSelector,
      prevButton: "swiper-inline-story-button-prev",
      nextButton: "swiper-inline-story-button-next",
      paramsOverrides: {
        slidesPerView: slidesPerView,
        spaceBetween: 5,
        grabCursor: true,
        slidesOffsetBefore: 0,
        allowTouchMove: true,
        shortSwipes: false,
        longSwipes: false,
        mousewheel: true,
        breakpoints: {
          300: {
            allowTouchMove: true,
            followFinger: true
          },
          400: {
            allowTouchMove: true,
            followFinger: true
          },
          500: {
            allowTouchMove: true,
            followFinger: true
          },
          800: {
            allowTouchMove: true,
            followFinger: true
          },
          993: {
            allowTouchMove: false,
            followFinger: false,
            navigation: {
              enabled: !!(prev && next),
              prevEl: prev,
              nextEl: next
            }
          }
        },
        keyboard: {
          enabled: true,
          onlyInViewport: false
        },
        on: {
          beforeInit: (swiper: Swiper) => {
            enableLoadedTiles()
            swiper.slideToLoop(0, 0, false)
          },
          reachEnd: () => {
            sdk.triggerEvent(EVENT_LOAD_MORE)
          },
          afterInit: (swiper: Swiper) => {
            setSwiperLoadingStatus("inline-story", true)
            disablePrevNavigation(swiper)
            void loadTilesAsync(swiper)
          },
          activeIndexChange: (swiper: Swiper) => {
            if (swiper.navigation.prevEl) {
              if (swiper.realIndex === 0 && isSwiperLoading("inline-story")) {
                disablePrevNavigation(swiper)
              } else {
                enablePrevNavigation(swiper)
              }
            }
          }
        }
      }
    })
  })

  if (!container) {
    throw new Error("Failed to find Nosto UGC container")
  }

  containerObserver.observe(container)
}

function getRenderMode(hostElement?: HTMLElement) {
  const widgetSelector = hostElement || sdk.querySelector<HTMLElement>(".story-inline.swiper-inline")
  if (widgetSelector) {
    return getComputedStyle(widgetSelector).getPropertyValue("--render-mode")
  }
  return "desktop"
}

export function onTilesUpdated() {
  refreshSwiper("inline-story")
  loadAllUnloadedTiles()
}

export function enableLoadedTiles() {
  sdk
    .querySelectorAll<HTMLElement>(".ugc-tiles > .ugc-tile[style*='display: none']")
    ?.forEach((tileElement: HTMLElement) => (tileElement.style.display = ""))
}

async function loadTilesAsync(swiper: Swiper) {
  const observer = registerObserver(swiper)

  loadAllUnloadedTiles()
  swiper.update()

  observer.disconnect()
  enableNextNavigation(swiper)
  updateLoadingStateInterval(swiper.el)
}

function updateLoadingStateInterval(swiperElem: HTMLElement) {
  const intervalId = setInterval(function () {
    const elements = swiperElem.querySelectorAll<HTMLElement>(".swiper-slide:has(.icon-section.hidden)")
    if (elements.length === 0) {
      clearInterval(intervalId)
      updateSwiperInstance("inline-story", (swiperData: SwiperData) => {
        swiperData.isLoading = false
        if (swiperData.instance) {
          swiperData.instance.off("activeIndexChange")
          swiperData.instance.params.loop = true
          enablePrevNavigation(swiperData.instance)
        }
      })
      refreshSwiper("inline-story")
    }
  }, 200)
}

function enableNextNavigation(swiper: Swiper) {
  if (getRenderMode() === "desktop") {
    swiper.allowSlideNext = true
    swiper.navigation.nextEl.classList.remove("swiper-button-disabled")
  }
}

function enablePrevNavigation(swiper: Swiper) {
  if (getRenderMode() === "desktop") {
    swiper.allowSlidePrev = true
    swiper.navigation.prevEl.classList.remove("swiper-button-disabled")
  }
}

function disablePrevNavigation(swiper: Swiper) {
  if (getRenderMode() === "desktop") {
    swiper.allowSlidePrev = false
    swiper.navigation.prevEl.classList.add("swiper-button-disabled")
  }
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
