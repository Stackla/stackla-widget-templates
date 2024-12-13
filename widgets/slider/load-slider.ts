import { Sdk } from "types"
import { Features } from "@stackla/widget-utils"
import { markColumns } from "./slider-design"
import navigator from "./navigator"
import { getTileSizeUnitless } from "./utils"
import { initObservers } from "./observers"

declare const sdk: Sdk

export function loadSlider(settings: Features["tileSizeSettings"]) {
  const tileBlockElement = sdk.querySelector(".ugc-tile-wrapper")
  const sliderInline = sdk.querySelector(".slider-inline")
  const loadingElement = sliderInline.querySelector(".slider-loading.loading")

  const tilesContainer = sliderInline.querySelector<HTMLElement>(".ugc-tiles")

  if (!sliderInline) {
    throw new Error("Slider inline container not found")
  }

  if (!tileBlockElement) {
    throw new Error("Slider Tiles Scroll Container not found")
  }

  if (!tilesContainer) {
    throw new Error("Slider Tiles Scroll Container not found")
  }

  const style = sdk.getStyleConfig()
  const { inline_tile_size } = style

  tilesContainer.setAttribute("variation", inline_tile_size)

  window.CSS.registerProperty({
    name: "--tile-size-prop",
    syntax: "<length>",
    inherits: false,
    initialValue: `${getTileSizeUnitless(settings)}px`
  })

  const observers = initObservers(settings)

  navigator(settings)

  markColumns(settings)
  loadingElement?.classList.add("hidden")

  function tilesUpdatedEventHandler() {
    markColumns(settings)
    observers.configTileIntersectionTargets()
  }

  return { tilesUpdatedEventHandler }
}
