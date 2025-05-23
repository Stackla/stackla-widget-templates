import { EVENT_LOAD, EVENT_LOAD_MORE, waitForElements, type ISdk } from "@stackla/widget-utils"

declare const sdk: ISdk

const tileSizes: { [key: string]: number } = {
  small: 88.5,
  medium: 133.5,
  large: 269.2
}

const tilesContainer = sdk.querySelector(".ugc-tiles")!

export function removeEmptyTileGroups() {
  const tileGroups = sdk.querySelectorAll<HTMLElement>(".tile-group")
  tileGroups?.forEach(tileGroup => {
    if (tileGroup.children.length === 0) {
      tileGroup.remove()
    }
  })
}

export function getTileRowHeight() {
  const style = sdk.getStyleConfig()
  const { inline_tile_size } = style

  const tileSizes: { [key: string]: string } = {
    small: "15vw",
    medium: "25vw",
    large: "50vw"
  }

  if (!inline_tile_size) {
    return tileSizes["medium"]
  }

  return tileSizes[inline_tile_size]
}

function createTileGroup(tiles: HTMLElement[], groupStartIndex: number, tileSize: number) {
  if (tiles.length - groupStartIndex < 5) {
    return
  }

  const tileGroup = document.createElement("div")
  tileGroup.classList.add("tile-group")

  const isLargeFirst = tileSize === tileSizes.large

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
  const loadMore = sdk.querySelector("#load-more")
  if (loadMore) {
    loadMore.style.opacity = "0"
  }

  const promises = Array.from(tiles).map(async tile => {
    const tileElement = tile.querySelector<HTMLElement>(".tile")
    const tileImage = tileElement?.querySelector("img")?.src
    const inlineVideoPlay = tileElement?.classList.contains("inline-video-play")
    return new Promise(resolve => {
      if (inlineVideoPlay) {
        resolve(tile)
        return
      }
      const image = new Image()
      image.onload = () => resolve(tile)
      image.onerror = () => {
        tile.remove()
        resolve(null)
      }
      if (!tileImage) {
        resolve(null)
      }
      image.src = tileImage ?? ""

      if (!tileElement) {
        resolve(null)
        return
      }
    })
  })

  const loadedTiles = await Promise.all(promises)

  if (loadMore) {
    loadMore.style.opacity = "1"
  }

  return loadedTiles.filter(tile => tile !== null) as HTMLElement[]
}

export function getQuadrantTiles() {
  const { inline_tile_size } = sdk.getStyleConfig()
  sdk.addEventListener(EVENT_LOAD_MORE, () => {
    const tileSize = tileSizes[inline_tile_size ?? "medium"]

    waitForElements(tilesContainer, ".ugc-tile:not(.processed)", async newTiles => {
      if (newTiles && newTiles.length >= 5) {
        const loadedTiles = await preloadTileImagesAndRemoveBrokenTiles(newTiles)
        addQuadrantTiles(loadedTiles, tileSize)
        removeEmptyTileGroups()
      }
    })
  })

  sdk.addEventListener(EVENT_LOAD, async () => {
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
