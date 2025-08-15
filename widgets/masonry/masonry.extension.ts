import { ISdk } from "@stackla/widget-utils"

let screenWidth = 0
let previousWidthHandled = 0

export function handleTileImageRendered(sdk: ISdk, tileId?: string) {
  if (!tileId) {
    return
  }

  const gridItemElement = sdk.getShadowRoot().querySelector(`.grid-item[data-id*="${tileId}"]`)
  const tileLoadingElement = gridItemElement?.querySelector(".tile-loading.loading")
  tileLoadingElement?.classList.remove("loading")
}

export function handleAllTileImageRendered(sdk: ISdk) {
  const tileLoadingElements = sdk.getShadowRoot().querySelectorAll(".grid-item .tile-loading.loading")
  tileLoadingElements?.forEach(element => element.classList.remove("loading"))

  const loadMoreHiddenElement = sdk.getShadowRoot().querySelector("#buttons > #load-more.hidden")
  loadMoreHiddenElement?.classList.remove(".hidden")
}

function getGridItemRowIds(sdk: ISdk) {
  const gridItems = sdk.getShadowRoot().querySelectorAll(".grid-item:not(hidden)[row-id]")
  const allRowIds = Array.from(gridItems)
    .map(item => item.getAttribute("row-id"))
    .filter(rowIdString => rowIdString && !Number.isNaN(+rowIdString))
    .map(rowId => +rowId!)

  return [...new Set(allRowIds)]
}

export function handleTileImageError(sdk: ISdk, tileWithError: HTMLElement) {
  const errorTileRowIdString = tileWithError.getAttribute("row-id")

  tileWithError.classList.remove("grid-item")
  tileWithError.classList.remove("ugc-tile")

  // add class
  tileWithError.classList.add("grid-item-error")
  tileWithError.classList.add("ugc-tile-error")
  tileWithError.classList.add("hidden")

  if (!errorTileRowIdString || Number.isNaN(+errorTileRowIdString)) {
    return
  }

  const errorTileRowId = +errorTileRowIdString
  const uniqueRowIds = getGridItemRowIds(sdk)

  const rowIdSelectors = uniqueRowIds.filter(rowId => rowId >= errorTileRowId).map(matched => `[row-id="${matched}"]`)

  const matchedGridItems = Array.from(
    sdk.querySelectorAll<HTMLElement>(`.grid-item:is(${rowIdSelectors})`) ?? []
  ) as HTMLElement[]

  resizeTiles(matchedGridItems)
}

export function renderMasonryLayout(sdk: ISdk, reset = false, resize = false) {
  if (resize || reset) {
    screenWidth = 0
  }

  // If screenWidth is not stored or has changed, reinitialize the widths array
  const ugcContainer = sdk.querySelector("#nosto-ugc-container")

  if (!ugcContainer) {
    throw new Error("Failed to find Nosto UGC container")
  }

  const currentScreenWidth = ugcContainer.clientWidth!

  if (currentScreenWidth === 0) {
    return
  }

  if (resize && previousWidthHandled === currentScreenWidth) {
    return
  }

  if (screenWidth == 0) {
    screenWidth = currentScreenWidth
    previousWidthHandled = currentScreenWidth
  }

  const allTiles = Array.from(sdk.querySelectorAll<HTMLElement>(".grid-item") ?? [])
  const ugcTiles =
    reset || resize
      ? allTiles
      : allTiles.filter(
          tile =>
            tile.getAttribute("width-set") !== "true" && tile.getAttribute("set-for-width") !== screenWidth.toString()
        )

  resizeTiles(ugcTiles)
}

function resizeTiles(ugcTiles: HTMLElement[]) {
  if (!ugcTiles || ugcTiles.length === 0) {
    return
  }

  ugcTiles.forEach((tile: HTMLElement) => {
    const randomFlexGrow = Math.random() * 2 + 1
    const randomWidth = Math.random() * 200 + 150

    tile.style.flex = `${randomFlexGrow} 1 auto`
    tile.style.width = `${randomWidth}px`
    tile.setAttribute("width-set", "true")
    tile.setAttribute("set-for-width", screenWidth.toString())
  })
}
