import { Features, getTileSizeByWidget, ISdk } from "packages/widget-utils"

declare const sdk: ISdk

/**
 * gets the configured tile size
 * @param settings the tile size configuration of the widget
 * @returns the tile size value without CSS unit
 */
export function getTileSizeUnitless(settings: Features["tileSizeSettings"]) {
  const tileSizeConfig = getTileSizeByWidget(sdk, settings)
  return Number(tileSizeConfig["--tile-size-unitless"])
}

/**
 * Calculates the tile render size including swiper spacing and any additional width
 *
 * @param settings the widget size configuration
 * @param hostElment the element hosting the variables
 * @returns
 */
export function getTileWidth(settings: Features["tileSizeSettings"], hostElment?: HTMLElement) {
  const tileSize = getTileSizeUnitless(settings)

  if (!hostElment) {
    return tileSize
  }

  const spacing = hostElment.parentElement ? getVariableValue(hostElment.parentElement, "--spacing") : 0
  const additionalWidth = getVariableValue(hostElment, "--additional-size")

  return tileSize + spacing + additionalWidth
}

/**
 * Gets the value of the supplied css variable and converts it to numeric value
 *
 * @param element element hosting the variable
 * @param name the css variable name
 * @returns the value if present. 0 otherwise
 */
export function getVariableValue(element: HTMLElement, name: string) {
  const content = Number(getComputedStyle(element).getPropertyValue(name))
  return isNaN(content) ? 0 : content
}

/**
 *
 * @param element element hosting the variable
 * @param name the css variable name
 * @returns the content if present. Empty string otherwise
 */
export function getVariableContent(element: HTMLElement, name: string) {
  return getComputedStyle(element).getPropertyValue(name)
}
