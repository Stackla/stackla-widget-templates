import { SdkSwiper } from "types"
import { getTileSizeByWidget } from "@stackla/widget-utils"

declare const sdk: SdkSwiper

export default function () {
  const sliderScrollUpButton = sdk.querySelector("#scroll-up")
  const sliderScrollDownButton = sdk.querySelector("#scroll-down")
  const tileBlockElement = sdk.querySelector(".ugc-tile-wrapper")
  const tilesContainer = sdk.querySelector(".ugc-tiles")

  let scrollIndex = 0

  const tileSizeConfig = getTileSizeByWidget()

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

  const tileSizeUnitless = Number(tileSizeConfig["--tile-size-unitless"])
  const blockHeight = isNaN(tileSizeUnitless) ? 220 : tileSizeUnitless

  controlNavigationButtonVisibility()

  tilesContainer.addEventListener("scroll", () => {
    sliderScrollUpButton.style.pointerEvents = "none"
    sliderScrollDownButton.style.pointerEvents = "none"
  })

  sliderScrollUpButton.addEventListener("click", () => {
    if (tilesContainer.scrollTop > 0 && scrollIndex > 0) {
      scrollIndex--
      tilesContainer.scrollTo({
        top: blockHeight * scrollIndex,
        left: 0,
        behavior: "smooth"
      })
      setTimeout(() => controlNavigationButtonVisibility(), 500)
    }
  })

  sliderScrollDownButton.addEventListener("click", () => {
    scrollIndex++
    tilesContainer.scrollTo({
      top: blockHeight * scrollIndex,
      left: 0,
      behavior: "smooth"
    })
    setTimeout(() => controlNavigationButtonVisibility(), 500)
  })

  function controlNavigationButtonVisibility() {
    if (tilesContainer.scrollTop > 0 && scrollIndex > 0) {
      sliderScrollUpButton.style.visibility = "visible"
    } else {
      sliderScrollUpButton.style.visibility = "hidden"
    }

    const offset = tilesContainer.scrollHeight - tilesContainer.scrollTop - tilesContainer.offsetHeight

    if (offset === 0 || (tilesContainer.scrollHeight > 0 && offset >= blockHeight / 2)) {
      sliderScrollDownButton.style.visibility = "visible"
    } else {
      sliderScrollDownButton.style.visibility = "hidden"
    }

    sliderScrollUpButton.style.pointerEvents = "auto"
    sliderScrollDownButton.style.pointerEvents = "auto"
  }
}
