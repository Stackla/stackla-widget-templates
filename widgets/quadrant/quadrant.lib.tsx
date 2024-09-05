import type { Sdk } from "@stackla/ugc-widgets"
import { createElement } from "jsx-html"
import { BigTile } from "./components/big-tile/base.template"
import { SmallTile } from "./components/small-tile/index"

declare const sdk: Sdk

export function initializeQuadrant(): void {
  const imagesPerGroup = 5
  let groupCount = 0

  const ugcTiles = sdk.tiles.getEnabledTiles()
  const container = sdk.querySelector(".quadrant-grid-container")

  if (!container) {
    throw new Error("Container not found")
  }

  while (groupCount * imagesPerGroup < ugcTiles.length) {
    const currentStartIndex = groupCount * imagesPerGroup
    const endIndex = Math.min(currentStartIndex + imagesPerGroup, ugcTiles.length)
    const prependBigTile = groupCount % 4 === 0

    // Create small tiles in array
    const smallTiles: JSX.Element[] = []
    for (let offset = 0; offset < imagesPerGroup - 1 && currentStartIndex + offset < endIndex; offset++) {
      const currentTile = ugcTiles[currentStartIndex + offset]
      smallTiles.push(<SmallTile tile={currentTile} onClick={handleClickedTileEvents} />)
    }

    // Create big tile if available
    let bigTileDiv: JSX.Element | null = null
    if (currentStartIndex + imagesPerGroup - 1 < ugcTiles.length) {
      const bigTile = ugcTiles[currentStartIndex + imagesPerGroup - 1]
      bigTileDiv = <BigTile tile={bigTile} onClick={handleClickedTileEvents} />
    }

    // append all to group div
    const groupDiv = (
      <div className="group-container" key={`group-${groupCount}`}>
        {prependBigTile ? [bigTileDiv, ...smallTiles] : [...smallTiles, bigTileDiv]}
      </div>
    )

    container.appendChild(groupDiv)
    groupCount++
  }

  const loadMoreButton = sdk.querySelector("#load-more")

  if (!loadMoreButton) {
    throw new Error("Load more button not found")
  }

  loadMoreButton.style.display = groupCount >= Math.ceil(ugcTiles.length / imagesPerGroup) ? "none" : "block"
}

function handleClickedTileEvents(tileId: number): void {
  const ugcTiles = sdk.tiles.getEnabledTiles()
  const tileData = {
    tileData: ugcTiles.find(tile => Number(tile.id) === tileId),
    widgetId: sdk.placement.getWidgetId(),
    filterId: sdk.placement.getWidgetContainer().widgetOptions?.filterId
  }
  const expandedTileWrapper = document.createElement("div")
  expandedTileWrapper.className = "expanded-tile-wrapper"
  sdk.triggerEvent("expandedTileClose")
  sdk.triggerEvent("tileExpand", tileData)
}
