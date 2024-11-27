import { ISdk } from "@stackla/widget-utils"

declare const sdk: ISdk

export function reinitialiseWaterfallLayout() {
  loadWaterfallLayout(true)
}

export function loadWaterfallLayout(reset = false) {
  const allTiles = Array.from(sdk.querySelectorAll<HTMLElement>(".grid-item") ?? [])
  const ugcTiles = reset ? allTiles : allTiles.filter(tile => tile.getAttribute("height-set") !== "true")

  if (!ugcTiles || ugcTiles.length === 0) {
    return
  }

  const rowHeight = 10
  const { margin } = sdk.getStyleConfig()
  const gap = parseInt(margin)

  ugcTiles.forEach((tile: HTMLElement) => {
    const tileTop = tile.querySelector<HTMLElement>(".tile-top")
    const tileBottom = tile.querySelector<HTMLElement>(".tile-bottom")

    if (tileTop && tileBottom) {
      const imageElement = tileTop.querySelector<HTMLImageElement>("img")

      const calculateHeight = () => {
        const topHeight = tileTop.scrollHeight
        const bottomHeight = tileBottom.scrollHeight
        const totalHeight = topHeight + bottomHeight

        const rowSpan = Math.ceil(totalHeight / (rowHeight + gap))
        tile.style.gridRowEnd = `span ${rowSpan}`
      }

      if (imageElement && !imageElement.complete) {
        imageElement.onload = calculateHeight
      } else {
        calculateHeight()
      }
    }
  })
}
