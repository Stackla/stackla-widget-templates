import { ISdk } from "@stackla/widget-utils"
import { getTileSize } from "@stackla/widget-utils/libs"

declare const sdk: ISdk

export const tileSettings = {
  small: "127.75px",
  medium: "210.4px",
  large: "265.5px"
}

const styleOptions = sdk.getStyleConfig()
const { margin } = styleOptions
export const marginAsInt = parseInt(margin)

export function getRowsPerPage(tileSize: number, gap: number) {
  return Math.ceil(window.innerHeight / (tileSize + gap)) - 1
}

export function registerResizeObserver() {
  const element = sdk.getElement()
  const observer = new ResizeObserver(() => {
    calculateTilesToShow()
  })

  if (!element) {
    console.warn("Element not found in registerResizeObserver")
    return
  }

  observer.observe(element)
}

export function calculateTilesToShow() {
  const element = sdk.getElement()

  if (!element) {
    console.warn("Element not found in calculateTilesToShow")
    return
  }

  const screenWidth = element.offsetWidth

  const tileSize = parseInt(getTileSize(tileSettings).replace("px", ""))
  const tilesByScreenWidth = Math.floor(screenWidth / (tileSize + marginAsInt))
  const rows = getRowsPerPage(tileSize, marginAsInt)
  let tilesPerPage = tilesByScreenWidth * rows
  const { enable_custom_tiles_per_page, tiles_per_page } = sdk.getStyleConfig()

  if (enable_custom_tiles_per_page && tiles_per_page) {
    tilesPerPage = parseInt(tiles_per_page)
  }

  sdk.setVisibleTilesCount(tilesPerPage)
  void sdk.loadTilesUntilVisibleTilesCount()

  // Hide tiles after the calculated tiles per page
  const tiles = sdk.querySelectorAll(".ugc-tile")

  if (!tiles) {
    console.warn("Tiles not found in calculateTilesToShow")
    return
  }

  const tilesToHideArray = Array.from(tiles).slice(tilesPerPage)
  tilesToHideArray.forEach(tile => {
    tile.style.display = "none"
    tile.classList.remove("last-tile")
  })

  // Show tiles after the calculated tiles per page
  const tilesToShowArray = Array.from(tiles).slice(0, tilesPerPage)
  tilesToShowArray.forEach(tile => {
    tile.style.display = ""
    tile.classList.remove("last-tile")
  })

  // There are complications with pseudo selectors and last-child that is visible, so we need to add a class to the last tile
  if (tilesToShowArray[tilesToShowArray.length - 1]) {
    tilesToShowArray[tilesToShowArray.length - 1].classList.add("last-tile")
  }
}
