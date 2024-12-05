import { SdkSwiper } from "types"
import { Features, getTileSizeByWidget } from "@stackla/widget-utils"

declare const sdk: SdkSwiper

type SwiperDirection = "none" | "left" | "right" | "up" | "down"

export default function (settings: Features["tileSizeSettings"]) {
  const sliderScrollUpButton = sdk.querySelector("#scroll-up")
  const sliderScrollDownButton = sdk.querySelector("#scroll-down")
  const tileBlockElement = sdk.querySelector(".ugc-tile-wrapper")
  const sliderInline = sdk.querySelector(".slider-inline")

  const tilesContainer = sliderInline.querySelector<HTMLElement>(".ugc-tiles")

  const scrollHistory: Array<number> = [0]

  let scrollIndex = 0

  const tileSizeConfig = getTileSizeByWidget(settings)

  if (!sliderInline) {
    throw new Error("Slider inline container not found")
  }

  if (!tileBlockElement) {
    throw new Error("Slider Tiles Scroll Container not found")
  }

  if (!tilesContainer) {
    throw new Error("Slider Tiles Scroll Container not found")
  }

  if (!sliderScrollUpButton) {
    throw new Error("Slider Tiles Scroll Up Button not found")
  }

  if (!sliderScrollDownButton) {
    throw new Error("Slider Tiles Scroll Down Button not found")
  }

  function gridGap() {
    const parsed = parseInt(getComputedStyle(tilesContainer!).gap)
    return isNaN(parsed) ? 0 : parsed
  }

  const style = sdk.getStyleConfig()
  const { inline_tile_size } = style

  tilesContainer.setAttribute("variation", inline_tile_size)

  const tileSizeUnitless = Number(tileSizeConfig["--tile-size-unitless"])
  const defaultBlockHeight = isNaN(tileSizeUnitless) ? 220 : tileSizeUnitless

  function getTopElementHeight() {
    const elements = Array.from(tilesContainer!.querySelectorAll<HTMLElement>(".ugc-tile"))
    const topElement = elements.find(element => {
      const top = element.getBoundingClientRect().top
      return top > 0 && top < 50
    })
    return topElement?.getBoundingClientRect().height || defaultBlockHeight
  }

  function calcHeightAndRecordHistory(value: number) {
    if (scrollHistory.length === 1) {
      scrollHistory.push(value + gridGap())
      return value + gridGap()
    } else {
      const totalHeight = scrollHistory.slice(-1)[0] + value + gridGap()
      scrollHistory.push(totalHeight)
      return totalHeight
    }
  }

  function getBlockHeight() {
    switch (getRenderMode()) {
      case "mobile": {
        return calcHeightAndRecordHistory(window.screen.height ?? defaultBlockHeight)
      }
      case "tablet": {
        return calcHeightAndRecordHistory(getTopElementHeight())
      }
      default:
        return calcHeightAndRecordHistory(defaultBlockHeight)
    }
  }

  function getRenderMode() {
    return getComputedStyle(sliderInline).getPropertyValue("--render-mode")
  }

  const resizeObserver = new ResizeObserver(() =>
    requestAnimationFrame(() => {
      scrollIndex = 0
      tilesContainer.scrollTop = 0
      if (getRenderMode() === "desktop") {
        controlNavigationButtonVisibility()
      }
    })
  )

  resizeObserver.observe(sliderInline)

  controlNavigationButtonVisibility()

  tilesContainer.addEventListener("scroll", () => {
    sliderScrollUpButton.style.pointerEvents = "none"
    sliderScrollDownButton.style.pointerEvents = "none"
  })

  sliderScrollUpButton.addEventListener("click", () => {
    if (tilesContainer.scrollTop > 0 && scrollIndex > 0) {
      scrollUp()
    }
  })

  sliderScrollDownButton.addEventListener("click", () => scrollDown())

  function scrollUp() {
    scrollIndex--
    tilesContainer!.scrollTo({
      top: scrollHistory.pop(),
      left: 0,
      behavior: "smooth"
    })
    setTimeout(() => controlNavigationButtonVisibility(), 500)
  }

  function scrollDown() {
    scrollIndex++
    tilesContainer!.scrollTo({
      top: getBlockHeight(),
      left: 0,
      behavior: "smooth"
    })
    setTimeout(() => controlNavigationButtonVisibility(), 500)
  }

  swipeDetect(tilesContainer, direction => {
    if (direction === "up") {
      scrollDown()
    } else if (direction === "down") {
      scrollUp()
    }
  })

  function controlNavigationButtonVisibility() {
    if (getRenderMode() !== "desktop") {
      return
    }

    if (tilesContainer!.scrollTop > 0 && scrollIndex > 0) {
      sliderScrollUpButton.style.visibility = "visible"
    } else {
      sliderScrollUpButton.style.visibility = "hidden"
    }

    const offset = tilesContainer!.scrollHeight - tilesContainer!.scrollTop - tilesContainer!.offsetHeight

    if (offset === 0 || (tilesContainer!.scrollHeight > 0 && offset >= defaultBlockHeight / 2)) {
      sliderScrollDownButton.style.visibility = "visible"
    } else {
      sliderScrollDownButton.style.visibility = "hidden"
    }

    sliderScrollUpButton.style.pointerEvents = "auto"
    sliderScrollDownButton.style.pointerEvents = "auto"
  }

  function swipeDetect(el: HTMLElement, callback: (swipeDirection: SwiperDirection) => void) {
    const allowedTime = 1500,
      threshold = 150,
      restraint = 100
    let startX: number, startY: number, startTime: number

    el.addEventListener(
      "touchstart",
      (event: TouchEvent) =>
        requestAnimationFrame(() => {
          const touchObject = event.changedTouches[0]
          startX = touchObject.pageX
          startY = touchObject.pageY
          startTime = new Date().getTime()
          event.preventDefault()
        }),
      false
    )

    el.addEventListener("touchmove", (event: TouchEvent) => event.preventDefault())

    el.addEventListener("touchend", (event: TouchEvent) =>
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
    )
  }
}
