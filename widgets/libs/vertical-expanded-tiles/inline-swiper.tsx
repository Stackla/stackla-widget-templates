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

declare const sdk: Sdk
const ids = new Set<string>()

export function initializeInlineSwiperListeners() {
  const swiper = sdk.querySelector(".carousel-inline.swiper-inline")

  if (!swiper) {
    throw new Error("Failed to find swiper element")
  }

  initializeSwiperForInlineTiles()
}

function initializeSwiperForInlineTiles() {
  const widgetSelector = sdk.querySelector<HTMLElement>(".carousel-inline.swiper-inline")

  if (!widgetSelector) {
    throw new Error("Failed to find widget UI element. Failed to initialise Swiper")
  }

  const tiles = sdk.querySelectorAll(".ugc-tile")
  const tilesLength = tiles?.length ?? 0

  initializeSwiper(sdk, {
    id: "inline-carousel",
    mode: "inline",
    widgetSelector,
    prevButton: "swiper-inline-carousel-button-prev",
    nextButton: "swiper-inline-carousel-button-next",
    paramsOverrides: {
      loop: tilesLength > 4,
      slidesPerView: "auto",
      grabCursor: true,
      allowTouchMove: true,
      breakpointsBase: "container",
      spaceBetween: 10,
      freeMode: {
        sticky: false,
        momentum: true,
        enabled: true
      },
      mousewheel: {
        enabled: true,
        forceToAxis: true,
        releaseOnEdges: true
      },
      breakpoints: {
        0: {
          slidesPerView: 1.5
        },
        600: {
          slidesPerView: 3.3
        },
        900: {
          slidesPerView: 5.3
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
          setSwiperLoadingStatus(sdk, "inline-carousel", true)
          void loadTilesAsync(swiper)
        },
        activeIndexChange: (swiper: Swiper) => {
          if (swiper.navigation.prevEl) {
            if (swiper.realIndex === 0 && isSwiperLoading(sdk, "inline-carousel")) {
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

  const nextEl = swiper.navigation?.nextEl

  loadAllUnloadedTiles(sdk)
  swiper.update()

  observer.disconnect()

  if (nextEl && nextEl instanceof HTMLElement) {
    nextEl.classList.remove("swiper-button-hidden")
  }
  updateLoadingStateInterval(swiper.el)
}

function updateLoadingStateInterval(swiperElem: HTMLElement) {
  const intervalId = setInterval(function () {
    const elements = swiperElem.querySelectorAll<HTMLElement>(".swiper-slide:has(.icon-section.hidden)")
    if (elements.length === 0) {
      clearInterval(intervalId)
      updateSwiperInstance(sdk, "inline-carousel", swiperData => {
        swiperData.isLoading = false
        if (swiperData.instance) {
          swiperData.instance.off("activeIndexChange")
          swiperData.instance.setGrabCursor()
          swiperData.instance.allowTouchMove = true
          swiperData.instance.params.loop = true
          enablePrevNavigation(swiperData.instance)
        }
      })
      refreshSwiper(sdk, "inline-carousel")
    }
  }, 200)
}

function enablePrevNavigation(swiper: Swiper) {
  swiper.allowSlidePrev = true
  swiper.navigation.prevEl?.classList.remove("swiper-button-hidden")
}

function disablePrevNavigation(swiper: Swiper) {
  swiper.allowSlidePrev = false
  swiper.navigation.prevEl?.classList.add("swiper-button-hidden")
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

async function generateUserHandleText(tileId: string, retries = 0): Promise<string> {
  const tile = sdk.getTileById(tileId)
  if (!tile) {
    console.info(`Tile with id ${tileId} not found, retrying...`)
    if (retries < 5) {
      return new Promise(resolve => {
        setTimeout(() => resolve(generateUserHandleText(tileId, retries + 1)), 500)
      })
    }

    return "@nosto"
  }

  const fallback = "nosto"

  const contentTags = tile.tags_extended?.filter(
    tag => tag.type === "content" && tag.publicly_visible && tag.tag.includes("@")
  )

  const displayedItem = tile.user && tile.user.length ? tile.user : tile.terms && tile.terms.length ? tile.terms[0] : ""

  return contentTags?.length ? contentTags[0].tag : `@${displayedItem.length ? displayedItem : fallback}`
}

function doesUserHandleExist(tile: HTMLElement): boolean {
  const userHandle = tile.querySelector<HTMLElement>(".user-handle")

  if (!userHandle) {
    return true
  }

  const trimmedContent = userHandle.textContent?.trim() || ""

  return userHandle !== null && trimmedContent.length > 0
}

export function disableExpandedTileIfProductsMissing(
  tile: HTMLElement,
  tileId: string,
  shouldDisableInactiveTiles = true,
  retries = 0
) {
  const tileMeta = sdk.getTileById(tileId)

  if (!tileMeta) {
    if (retries < 5) {
      setTimeout(() => disableExpandedTileIfProductsMissing(tile, tileId, shouldDisableInactiveTiles, retries + 1), 100)
    } else {
      console.error(`Tile with id ${tileId} not found after multiple retries.`)
    }

    return
  }

  const productTags = sdk
    .getProductTagsFromTile(tileMeta)
    .filter(productTag => productTag.availability_status == "InStock")
  const iconSection = tile.querySelector<HTMLElement>(".icon-lookup")

  if (iconSection) {
    if (!productTags || productTags.length === 0) {
      shouldDisableInactiveTiles && tile.classList.add("inactive")
    }
  }
}

export function mutateTilesOnce(shouldDisableInactiveTiles = true) {
  const tiles = sdk.querySelectorAll(".ugc-tile:not(.observed)")

  if (!tiles || tiles.length === 0) {
    return
  }

  tiles.forEach(async tile => {
    const id = tile.getAttribute("data-id")
    if (id) {
      if (ids.has(id)) {
        console.info(`Duplicate tile id found: ${id}. Removing duplicate tile.`)
        tile.remove()
      } else {
        ids.add(id)
      }

      tile.classList.add("observed")

      const userHandle = tile.querySelector(".user-handle")
      userHandle?.replaceChildren(document.createTextNode(await generateUserHandleText(id)))

      disableExpandedTileIfProductsMissing(tile, id, shouldDisableInactiveTiles)
    }
  })
}

export function observeResize(track: HTMLElement | null) {
  if (!track) {
    return
  }
  const resizeObserver = new ResizeObserver(() => {
    const swiperWrapper = sdk.querySelectorAll(".swiper-wrapper")

    if (!swiperWrapper) {
      return
    }

    swiperWrapper.forEach(wrapper => {
      wrapper.setAttribute("style", "")
    })
  })
  resizeObserver.observe(track.querySelector(".ugc-tiles")!)
  return resizeObserver
}

export function observeMutations(track: HTMLElement | null, shouldDisableInactiveTiles = true) {
  const mutationObserver = new MutationObserver(mutationList => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        const target = mutation.target as HTMLElement
        if (target.classList.contains("user-handle")) {
          continue
        }

        if (doesUserHandleExist(target)) {
          continue
        }

        mutateTilesOnce(shouldDisableInactiveTiles)
      }
    }
  })

  if (track) {
    mutationObserver.observe(track.querySelector(".ugc-tiles")!, {
      childList: true,
      subtree: false
    })

    mutateTilesOnce(shouldDisableInactiveTiles)
  }
}
