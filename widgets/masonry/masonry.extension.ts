import { ISdk, getTileSize } from "@stackla/widget-utils"

let screenWidth = 0
let previousWidthHandled = 0
const rowsPerPageAppliedFor = new WeakSet<ISdk>()

const MIN_TILE_WIDTH = 150
const TILE_WIDTH_RANGE = 200
const MAX_TILE_WIDTH = MIN_TILE_WIDTH + TILE_WIDTH_RANGE
const DEFAULT_ROWS_PER_PAGE = 2

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
    const randomWidth = Math.random() * TILE_WIDTH_RANGE + MIN_TILE_WIDTH

    tile.style.flex = `${randomFlexGrow} 1 auto`
    tile.style.width = `${randomWidth}px`
    tile.setAttribute("width-set", "true")
    tile.setAttribute("set-for-width", screenWidth.toString())
  })
}

export function calculateRowsPerPageLimit(
  containerWidth: number,
  gap: number,
  rowsPerPage: number,
  tileHeight: number
) {
  const minTilesPerRow = Math.max(1, Math.floor((containerWidth + gap) / (MAX_TILE_WIDTH + gap)))
  const targetTileCount = minTilesPerRow * rowsPerPage
  const clipHeight = rowsPerPage * tileHeight + (rowsPerPage - 1) * gap

  return { targetTileCount, clipHeight }
}

export async function applyRowsPerPageLimit(sdk: ISdk) {
  if (rowsPerPageAppliedFor.has(sdk)) {
    return
  }

  const { enable_custom_tiles_per_page, custom_tile_per_page_type, rows_per_page, margin } = sdk.getStyleConfig()

  if (!enable_custom_tiles_per_page || custom_tile_per_page_type !== "rows") {
    return
  }

  const ugcContainer = sdk.querySelector("#nosto-ugc-container")
  const containerWidth = ugcContainer?.clientWidth ?? 0

  if (containerWidth === 0) {
    return
  }

  rowsPerPageAppliedFor.add(sdk)

  const rowsPerPage = parseInt(rows_per_page ?? "", 10) || DEFAULT_ROWS_PER_PAGE
  const gap = Number(margin) || 0
  const tileHeight = parseFloat(getTileSize(sdk))

  const { targetTileCount, clipHeight } = calculateRowsPerPageLimit(containerWidth, gap, rowsPerPage, tileHeight)

  sdk.setVisibleTilesCount(targetTileCount)
  await sdk.loadTilesUntilVisibleTilesCount()

  // addWidgetCustomStyles injects a <style> tag above the shadow DOM (light DOM), so it can
  // never reach elements inside this widget's shadow root - it never actually hid anything here.
  // Style the shadow-root elements directly instead.
  const gridElement = sdk.querySelector<HTMLElement>("#nosto-ugc-container .grid")
  gridElement?.style.setProperty("max-height", `${clipHeight}px`, "important")
  gridElement?.style.setProperty("overflow", "hidden", "important")

  const loadMoreElement = sdk.querySelector("load-more")
  loadMoreElement?.classList.add("hidden")
}
