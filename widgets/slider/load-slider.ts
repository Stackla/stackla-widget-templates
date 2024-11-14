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

  sliderScrollUpButton.addEventListener("click", () => {
    if (tilesContainer.scrollTop > 0 && scrollIndex > 0) {
      scrollIndex--
      tilesContainer.scrollTo({
        top: blockHeight * scrollIndex,
        left: 0,
        behavior: "smooth"
      })
    }
  })

  sliderScrollDownButton.addEventListener("click", () => {
    scrollIndex++
    tilesContainer.scrollTo({
      top: blockHeight * scrollIndex,
      left: 0,
      behavior: "smooth"
    })
  })
}
