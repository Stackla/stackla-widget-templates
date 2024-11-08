import { ISdk } from "@stackla/widget-utils"

declare const sdk: ISdk

export function reinitialiseWaterfallLayout() {
  loadWaterfallLayout(true)
}

/**
 * Generate random heights for the tiles in the waterfall layout
 * @param minHeight Minimum height for each tile
 * @param maxHeight Maximum height for each tile
 * @returns
 */
export function generateRandomHeights(minHeight: number, maxHeight: number) {
  return Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight
}

export function loadWaterfallLayout(reset = false) {
  const allTiles = Array.from(sdk.querySelectorAll<HTMLElement>(".grid-item") ?? [])
  const ugcTiles = reset ? allTiles : allTiles.filter(tile => tile.getAttribute("height-set") !== "true")
  // const [minHeight, maxHeight] = minmax

  if (!ugcTiles || ugcTiles.length === 0) {
    return
  }

  const rowHeight = 10
  const { margin } = sdk.getStyleConfig()
  const gap = parseInt(margin)

  ugcTiles.forEach(async (tile: HTMLElement) => {
    const imageElement = tile.querySelector("img")
    if (imageElement && imageElement.complete) {
      const height = imageElement?.naturalHeight

      const rowSpan = Math.floor((height + gap) / (rowHeight + gap))

      tile.style.gridRowEnd = `span ${rowSpan}`

      tile.setAttribute("height-set", "true")
      tile.classList.add("processed")
    }
  })
}
