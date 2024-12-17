import { Features, getTileSizeByWidget, Sdk } from "@stackla/widget-utils"

declare const sdk: Sdk

/**
 * gets the configured tile size
 * @param settings the tile size configuration of the widget
 * @returns the tile size value without CSS unit
 */
export function getTileSizeUnitless(settings: Features["tileSizeSettings"]) {
  const tileSizeConfig = getTileSizeByWidget(settings)
  return Number(tileSizeConfig["--tile-size-unitless"])
}

/**
 * Fetch the inline tile grid gap from configuration
 * @returns the gap value for slider inline tile grid
 */
export function inlineTileGap() {
  const { inline_tile_margin } = sdk.getStyleConfig()
  const value = Number(inline_tile_margin)
  return isNaN(value) ? 10 : value
}

/**
 * Fetch the inline tile grid gap from configuration
 * @returns the gap value for slider inline tile grid
 */
export function inlineTileSize() {
  const { inline_tile_size } = sdk.getStyleConfig()
  return inline_tile_size
}

export function getTopElementHeight(containerElement: HTMLElement, defaultValue: number) {
  const elements = Array.from(containerElement.querySelectorAll<HTMLElement>(".ugc-tile"))
  const topElement = elements.find(element => {
    const top = element.getBoundingClientRect().top
    return top > 0 && top < 50
  })
  return topElement?.getBoundingClientRect().height || defaultValue
}

export function getRenderMode(element: HTMLElement) {
  return getComputedStyle(element).getPropertyValue("--render-mode")
}

export function getSliderElement() {
  return sdk.querySelector(".slider-inline")
}

export function getTileContainerElement() {
  return sdk.querySelector(".slider-inline .ugc-tiles")
}

export function getTileElements() {
  return sdk.querySelectorAll(".slider-inline .ugc-tiles > .ugc-tile")
}
