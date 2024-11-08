import type { ISdk } from "@stackla/widget-utils"
import { waitForElements } from "@stackla/widget-utils/libs"

declare const sdk: ISdk

const tileSizes: { [key: string]: number } = {
  small: 88.5,
  medium: 133.5,
  large: 269.2
}

const tilesContainer = sdk.querySelector(".ugc-tiles")!

function createTileGroup(tiles: HTMLElement[], groupStartIndex: number, tileSize: number) {
  if (tiles.length - groupStartIndex < 5) {
    return
  }

  const tileGroup = document.createElement("div")
  tileGroup.classList.add("tile-group")

  const isLargeFirst = tileSize === tileSizes.large

  tileGroup.style.gridTemplateAreas = isLargeFirst
    ? `
      "small1 small2 large large"
      "small3 small4 large large"
    `
    : `
      "large large small1 small2"
      "large large small3 small4"
    `

  const largeTileIndex = isLargeFirst ? 4 : 0

  const largeTile = tiles[groupStartIndex + largeTileIndex]
  largeTile.classList.add("large", "processed")
  tileGroup.appendChild(largeTile)

  const startOffset = isLargeFirst ? 0 : 1
  for (let tileOffset = startOffset; tileOffset < startOffset + 4; tileOffset++) {
    const smallTile = tiles[groupStartIndex + tileOffset]
    smallTile.classList.add("small", "processed")
    tileGroup.appendChild(smallTile)
  }

  return tileGroup
}

export function addQuadrantTiles(tiles: HTMLElement[], tileSize: number, startIndex: number = 0) {
  if (tilesContainer) {
    for (let groupStartIndex = startIndex; groupStartIndex < tiles.length; groupStartIndex += 5) {
      const tileGroup = createTileGroup(tiles, groupStartIndex, tileSize)
      if (tileGroup) {
        tilesContainer?.appendChild(tileGroup)
      }
    }
  }
}

export async function preloadTileImagesAndRemoveBrokenTiles(tiles: NodeListOf<HTMLElement>): Promise<HTMLElement[]> {
  const promises = Array.from(tiles).map(async tile => {
    const tileElement = tile.querySelector<HTMLElement>(".tile")
    const tileImage = tileElement?.getAttribute("data-background-image") ?? ""
    return new Promise(resolve => {
      const image = new Image()
      image.onload = () => resolve(tile)
      image.onerror = () => {
        tile.remove()
        resolve(null)
      }
      if (!tileImage) {
        resolve(null)
      }
      image.src = tileImage

      if (!tileElement) {
        resolve(null)
        return
      }

      tileElement.style.backgroundImage = `url(${tileImage})`
    })

    return Promise.resolve(tile)
  })

  const loadedTiles = await Promise.all(promises)
  return loadedTiles.filter(tile => tile !== null) as HTMLElement[]
}

export function getQuadrantTiles() {
  const { inline_tile_size } = sdk.getStyleConfig()
  sdk.addEventListener("moreLoad", () => {
    const tileSize = tileSizes[inline_tile_size ?? "medium"]

    waitForElements(tilesContainer, ".ugc-tile:not(.processed)", async newTiles => {
      if (newTiles && newTiles.length >= 5) {
        const loadedTiles = await preloadTileImagesAndRemoveBrokenTiles(newTiles)
        addQuadrantTiles(loadedTiles, tileSize)
      }
    })
  })

  sdk.addEventListener("load", async () => {
    const tiles = sdk.querySelectorAll<HTMLElement>(".ugc-tile")

    if (!tiles || tiles.length === 0) {
      return
    }

    const loadedTiles = await preloadTileImagesAndRemoveBrokenTiles(tiles)
    const tileSize = tileSizes[inline_tile_size ?? "medium"]

    if (tiles && tiles.length > 0) {
      addQuadrantTiles(loadedTiles, tileSize)
    }
  })
}
