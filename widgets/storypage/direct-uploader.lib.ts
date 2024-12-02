import { getTileSize, ISdk } from "@stackla/widget-utils"

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
  const element = sdk.placement.getElement()
  const observer = new ResizeObserver(() => {
    calculateTilesToShow()
  })

  observer.observe(element)
}

export function calculateTilesToShow() {
  const screenWidth = sdk.placement.getElement().offsetWidth

  const tileSize = parseInt(getTileSize(tileSettings).replace("px", ""))
  const tilesByScreenWidth = Math.floor(screenWidth / (tileSize + marginAsInt))
  const rows = getRowsPerPage(tileSize, marginAsInt)
  let tilesPerPage = tilesByScreenWidth * rows
  const { enable_custom_tiles_per_page, tiles_per_page } = sdk.getStyleConfig()

  if (enable_custom_tiles_per_page) {
    tilesPerPage = parseInt(tiles_per_page)
  }

  sdk.tiles.setVisibleTilesCount(tilesPerPage)
  void sdk.tiles.loadTilesUntilVisibleTilesCount()

  // Hide tiles after the calculated tiles per page
  const tiles = sdk.querySelectorAll(".ugc-tile")
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
