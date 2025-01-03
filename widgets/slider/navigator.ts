import { EVENT_LOAD_MORE, Features, ISdk } from "@stackla/widget-utils"
import {
  getRenderMode,
  getSliderElement,
  getTileContainerElement,
  getTileSizeUnitless,
  getTopElementHeight,
  getWidgetDimension,
  inlineTileGap
} from "./utils"
import { initObservers } from "./observers"

type SwiperDirection = "none" | "left" | "right" | "up" | "down"

declare const sdk: ISdk

export default function (settings: Features["tileSizeSettings"], observers: ReturnType<typeof initObservers>) {
  const sliderElement = getSliderElement()
  const tilesContainerElement = getTileContainerElement()
  const scrollHistory: Array<number> = []
  const tileSizeUnitless = getTileSizeUnitless(settings)
  const defaultBlockHeight = isNaN(tileSizeUnitless) ? 220 : tileSizeUnitless

  const scrollerHandler = scroller(sliderElement)

  const swipeDetectHandler = swipeDetect(tilesContainerElement, direction => {
    if (direction === "up") {
      scrollDown()
    } else if (direction === "down") {
      scrollUp()
    }
  })

  const screenResizeObserver = new ResizeObserver(() =>
    requestAnimationFrame(() => {
      tilesContainerElement.scrollTop = 0
      if (getRenderMode(sliderElement) === "desktop") {
        controlNavigationButtonVisibility()
        swipeDetectHandler.unregister()
        scrollerHandler.register()
      } else {
        swipeDetectHandler.register()
        scrollerHandler.unregister()
      }
    })
  )

  screenResizeObserver.observe(tilesContainerElement)

  controlNavigationButtonVisibility()

  function scroller(el: HTMLElement) {
    const sliderScrollUpButton = el.querySelector<HTMLElement>("#scroll-up")
    const sliderScrollDownButton = el.querySelector<HTMLElement>("#scroll-down")

    if (!sliderScrollUpButton) {
      throw new Error("Slider Tiles Scroll Up Button not found")
    }

    if (!sliderScrollDownButton) {
      throw new Error("Slider Tiles Scroll Down Button not found")
    }

    function scrollUpEventHandler(event: Event) {
      event.preventDefault()
      event.stopImmediatePropagation()
      event.stopPropagation()
      if (tilesContainerElement.scrollTop > 0) {
        scrollUp()
      }
    }

    function scrollDownEventHandler(event: Event) {
      event.preventDefault()
      event.stopImmediatePropagation()
      event.stopPropagation()
      scrollDown()
    }

    function register() {
      toggleScrollUp("hidden")
      toggleScrollDown("visible")
      sliderScrollUpButton!.addEventListener("click", scrollUpEventHandler)
      sliderScrollDownButton!.addEventListener("click", scrollDownEventHandler)
    }

    function unregister() {
      toggleScrollUp("hidden")
      toggleScrollDown("hidden")
      sliderScrollUpButton!.removeEventListener("click", scrollUpEventHandler)
      sliderScrollDownButton!.removeEventListener("click", scrollDownEventHandler)
    }

    function toggleScrollUp(visibility: string) {
      sliderScrollUpButton!.style.visibility = visibility
    }

    function toggleScrollDown(visibility: string) {
      sliderScrollDownButton!.style.visibility = visibility
    }

    return {
      register,
      unregister,
      toggleScrollUp,
      toggleScrollDown
    }
  }

  function swipeDetect(el: HTMLElement, callback: (swipeDirection: SwiperDirection) => void) {
    const allowedTime = 1500,
      threshold = 150,
      restraint = 100
    let startX: number, startY: number, startTime: number

    function registerTouchStart(event: TouchEvent) {
      requestAnimationFrame(() => {
        const touchObject = event.changedTouches[0]
        startX = touchObject.pageX
        startY = touchObject.pageY
        startTime = new Date().getTime()
        event.preventDefault()
      })
    }

    function registerTouchEnd(event: TouchEvent) {
      requestAnimationFrame(() => {
        const touchObject = event.changedTouches[0]
        const distX = touchObject.pageX - startX
        const distY = touchObject.pageY - startY
        const elapsedTime = new Date().getTime() - startTime

        if (elapsedTime <= allowedTime) {
          if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
            callback(distX < 0 ? "left" : "right")
          } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
            callback(distY < 0 ? "up" : "down")
          }
        }
        event.preventDefault()
      })
    }

    return {
      register: () => {
        el.addEventListener("touchstart", registerTouchStart, false)
        el.addEventListener("touchmove", (event: TouchEvent) => event.preventDefault())
        el.addEventListener("touchend", registerTouchEnd)
      },

      unregister: () => {
        el.removeEventListener("touchstart", registerTouchStart, false)
        el.removeEventListener("touchmove", (event: TouchEvent) => event.preventDefault())
        el.removeEventListener("touchend", registerTouchEnd)
      }
    }
  }

  function scrollUp() {
    const scrollPosition = scrollHistory.pop()
    if (!scrollPosition) {
      tilesContainerElement.scrollTo({
        top: 0,
        left: 0
      })
    } else {
      tilesContainerElement.scrollBy({
        top: scrollPosition ? -scrollPosition : 0,
        left: 0
      })
    }

    setTimeout(() => {
      observers.cleanupStyles()
      controlNavigationButtonVisibility()
    }, 500)
  }

  function scrollDown() {
    tilesContainerElement.scrollBy({
      top: getBlockHeight(),
      left: 0
    })
    setTimeout(() => {
      controlNavigationButtonVisibility()
    }, 500)
  }

  function controlNavigationButtonVisibility() {
    if (getRenderMode(sliderElement) !== "desktop") {
      return
    }

    if (tilesContainerElement.scrollTop > 0 && scrollHistory.length > 0) {
      scrollerHandler.toggleScrollUp("visible")
    } else {
      scrollerHandler.toggleScrollUp("hidden")
    }

    const lastTile = sdk.querySelector(".ugc-tiles > .ugc-tile:last-child")

    if (
      lastTile.classList.contains("partially-visible") &&
      tilesContainerElement.scrollTop + tilesContainerElement.offsetHeight < tilesContainerElement.scrollHeight
    ) {
      scrollerHandler.toggleScrollDown("visible")
      return
    } else {
      scrollerHandler.toggleScrollDown("hidden")
    }

    if (sdk.tiles.hasMoreTiles()) {
      sdk.triggerEvent(EVENT_LOAD_MORE)
    }
  }

  function calcHeightAndRecordHistory(value: number, tileGap = 0) {
    if (!scrollHistory.length) {
      scrollHistory.push(0)
      return value + tileGap
    } else {
      const totalHeight = tilesContainerElement.scrollTop + value + tileGap
      scrollHistory.push(tilesContainerElement.scrollTop)
      return totalHeight
    }
  }

  function getNextScrollPosition() {
    const nextTarget = observers.getNextTilePosition()
    if (isFinite(nextTarget)) {
      const nextPosition = nextTarget - tilesContainerElement.getBoundingClientRect().top - inlineTileGap() / 2
      scrollHistory.push(nextPosition)
      return nextPosition
    }
    scrollHistory.push(tilesContainerElement.clientHeight)
    return tilesContainerElement.clientHeight
  }

  function getBlockHeight(useLegacy = false) {
    const renderMode = getRenderMode(sliderElement)

    if (renderMode === "mobile") {
      return calcHeightAndRecordHistory(getWidgetDimension().containerHeight ?? defaultBlockHeight)
    }

    if (useLegacy) {
      if (renderMode === "tablet") {
        return calcHeightAndRecordHistory(
          getTopElementHeight(tilesContainerElement, defaultBlockHeight),
          inlineTileGap()
        )
      }

      // scroll two tiles with grid margin
      const verticalHeight = (() => {
        const heightValue = defaultBlockHeight * 2 + inlineTileGap()
        if (heightValue > tilesContainerElement.clientHeight) {
          return defaultBlockHeight
        }
        return defaultBlockHeight * 2
      })()

      return calcHeightAndRecordHistory(verticalHeight, inlineTileGap())
    }

    return getNextScrollPosition()
  }

  return {
    controlNavigationButtonVisibility
  }
}
