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

  const allTiles = Array.from(sdk.querySelectorAll<HTMLElement>(".grid-item") ?? [])

  resizeTiles(matchedGridItems, allTiles)
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

  resizeTiles(ugcTiles, allTiles)
}

function resizeTiles(tilesToResize: HTMLElement[], allTiles: HTMLElement[]) {
  if (!tilesToResize || tilesToResize.length === 0) {
    return
  }

  tilesToResize.forEach((tile: HTMLElement) => {
    const randomWidth = Math.random() * TILE_WIDTH_RANGE + MIN_TILE_WIDTH

    tile.style.width = `${randomWidth}px`
    tile.setAttribute("width-set", "true")
    tile.setAttribute("set-for-width", screenWidth.toString())
  })

  growTilesExceptLastRow(allTiles)
}

// flex-grow stretches every tile in its wrapped row to fill the row's leftover space.
// A trailing row with too few tiles to fill the container would have that space dumped
// onto whichever tile lands there, blowing it far past MAX_TILE_WIDTH. Keep the last
// (possibly partial) row at its assigned width instead, so it ends early rather than stretch.
function growTilesExceptLastRow(tiles: HTMLElement[]) {
  if (!tiles || tiles.length === 0) {
    return
  }

  const rows = new Map<number, HTMLElement[]>()
  tiles.forEach(tile => {
    const rowTiles = rows.get(tile.offsetTop) ?? []
    rowTiles.push(tile)
    rows.set(tile.offsetTop, rowTiles)
  })

  const lastRowTop = Math.max(...rows.keys())

  rows.forEach((rowTiles, rowTop) => {
    const isLastRow = rowTop === lastRowTop
    rowTiles.forEach(tile => {
      const flexGrow = isLastRow ? 0 : Math.random() * 2 + 1
      tile.style.flex = `${flexGrow} 1 auto`
    })
  })
}

// How many tiles are needed to fill `rowsPerPage` rows for masonry's own layout (random-width
// bricks packed left to right). Registered with the core SDK via registerRowsPerLoadCalculator
// so tiles.service.ts can resolve the right count in one place, instead of masonry recomputing
// and re-triggering a second, separate tile load after the fact.
export function calculateTilesPerRow(containerWidth: number, gap: number, rowsPerPage: number) {
  const minTilesPerRow = Math.max(1, Math.floor((containerWidth + gap) / (MIN_TILE_WIDTH + gap)))
  return minTilesPerRow * rowsPerPage
}

// How tall the clipped grid should be for `rowsPerPage` rows - purely a function of tile height,
// row count and gap, independent of how many tiles actually end up loaded.
export function calculateClipHeight(rowsPerPage: number, gap: number, tileHeight: number) {
  return rowsPerPage * tileHeight + (rowsPerPage - 1) * gap
}

// Must run synchronously, before the widget's first tiles fetch (i.e. before EVENT_JS_RENDERED),
// so tiles.service.ts already knows this formula by the time it needs to decide how many tiles
// to load. See widget.tsx, where this is called at module top level for that reason.
export function registerRowsPerLoadCalculator(sdk: ISdk) {
  sdk.setRowsPerLoadCalculator(({ rowsPerPage, gap }) => {
    const containerWidth = sdk.querySelector("#nosto-ugc-container")?.clientWidth ?? 0

    if (containerWidth === 0) {
      return rowsPerPage
    }

    return calculateTilesPerRow(containerWidth, gap, rowsPerPage)
  })
}

// Applies the purely visual side of "rows" mode: clipping the grid to N rows tall and hiding
// load-more. The tile count itself is decided once, centrally, by tiles.service.ts via the
// calculator registered above - this no longer sets visible tile count or triggers any loads.
export function applyRowsPerPageLimit(sdk: ISdk) {
  if (rowsPerPageAppliedFor.has(sdk)) {
    return
  }

  const { enable_custom_tiles_per_page, custom_tile_per_page_type, rows_per_page, margin } = sdk.getStyleConfig()

  if (!enable_custom_tiles_per_page || custom_tile_per_page_type !== "rows") {
    return
  }

  // addWidgetCustomStyles injects a <style> tag above the shadow DOM (light DOM), so it can
  // never reach elements inside this widget's shadow root - it never actually hid anything here.
  // Style the shadow-root elements directly instead.
  const gridElement = sdk.querySelector<HTMLElement>("#nosto-ugc-container .grid")

  if (!gridElement) {
    // Grid isn't in the DOM yet - retry next time this is called (onLoad/onTilesUpdated)
    // rather than giving up, since we haven't marked this sdk as done below.
    return
  }

  rowsPerPageAppliedFor.add(sdk)

  const rowsPerPage = parseInt(rows_per_page ?? "", 10) || DEFAULT_ROWS_PER_PAGE
  const gap = Number(margin) || 0
  const tileHeight = parseFloat(getTileSize(sdk))
  const clipHeight = calculateClipHeight(rowsPerPage, gap, tileHeight)

  gridElement.style.setProperty("max-height", `${clipHeight}px`, "important")
  gridElement.style.setProperty("overflow", "hidden", "important")

  const loadMoreElement = sdk.querySelector("load-more")
  loadMoreElement?.classList.add("hidden")
}
