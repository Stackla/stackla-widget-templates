import { Sdk, SwiperData } from "types"
import {
  initializeSwiper,
  refreshSwiper,
  enableTileImages,
  setSwiperLoadingStatus,
  isSwiperLoading,
  updateSwiperInstance
} from "@stackla/widget-utils/extensions"
import Swiper from "swiper"

declare const sdk: Sdk

export function initializeInlineSwiperListeners() {
  const swiper = sdk.querySelector(".swiper-inline")

  if (!swiper) {
    throw new Error("Failed to find swiper element")
  }

  initializeSwiperForInlineTiles()
}

function initializeSwiperForInlineTiles() {
  const { enable_custom_tiles_per_page, tiles_per_page } = sdk.getStyleConfig()
  const widgetSelector = sdk.placement.querySelector<HTMLElement>(".swiper-inline")

  if (!widgetSelector) {
    throw new Error("Failed to find widget UI element. Failed to initialise Swiper")
  }

  // TODO: remove this section after introducing css variable for Nosto container
  const tileWidth = 210
  const screenSize = window.innerWidth
  const perView = !enable_custom_tiles_per_page
    ? Math.floor(screenSize / (tileWidth + 10))
    : // FIXME: All numbers should be numbers across the board
      parseInt(tiles_per_page)

  sdk.tiles.setVisibleTilesCount(perView * 2)

  initializeSwiper({
    id: "inline",
    mode: "inline",
    widgetSelector,
    prevButton: "swiper-inline-button-prev",
    nextButton: "swiper-inline-button-next",
    paramsOverrides: {
      slidesPerView: "auto",
      grabCursor: false,
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
        beforeInit: (swiper: Swiper) => {
          enableLoadedTiles()
          swiper.slideToLoop(0, 0, false)
        },
        afterInit: (swiper: Swiper) => {
          setSwiperLoadingStatus("inline", true)
          void loadTilesAsync(swiper)
        },
        activeIndexChange: (swiper: Swiper) => {
          if (swiper.navigation.prevEl) {
            if (swiper.realIndex === 0 && isSwiperLoading("inline")) {
              disblePrevNavigation(swiper)
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
  sdk.placement
    .querySelectorAll<HTMLElement>(".ugc-tiles > .ugc-tile[style*='display: none']")
    ?.forEach((tileElement: HTMLElement) => (tileElement.style.display = ""))
}

async function loadTilesAsync(swiper: Swiper) {
  const observer = registerObserver(swiper)
  let pageIndex = 1
  while (sdk.tiles.hasMoreTiles()) {
    pageIndex++
    if (sdk.tiles.page < pageIndex) {
      sdk.tiles.page = pageIndex
    }
    await sdk.tiles.fetchTiles(pageIndex)
    enableLoadedTiles()
    swiper.update()
  }

  observer.disconnect()
  swiper.navigation.nextEl.classList.remove("swiper-button-hidden")
  updateLoadingStateInterval(swiper.el)
}

function updateLoadingStateInterval(swiperElem: HTMLElement) {
  const intervalId = setInterval(function () {
    const elements = swiperElem.querySelectorAll<HTMLElement>(".swiper-slide:has(.icon-section.hidden)")
    if (elements.length === 0) {
      clearInterval(intervalId)
      updateSwiperInstance("inline", (swiperData: SwiperData) => {
        swiperData.isLoading = false
        if (swiperData.instance) {
          swiperData.instance.off("activeIndexChange")
          swiperData.instance.setGrabCursor()
          swiperData.instance.allowTouchMove = true
          swiperData.instance.params.loop = true
          enablePrevNavigation(swiperData.instance)
        }
      })
      refreshSwiper("inline")
    }
  }, 200)
}

function enablePrevNavigation(swiper: Swiper) {
  swiper.allowSlidePrev = true
  swiper.navigation.prevEl.classList.remove("swiper-button-hidden")
}

function disblePrevNavigation(swiper: Swiper) {
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
