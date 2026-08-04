import { ISdk } from "@stackla/widget-utils"

let screenWidth = 0
let previousWidthHandled = 0

const MIN_TILE_WIDTH = 150
const TILE_WIDTH_RANGE = 200
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
export function calculateApproxTilesPerRow(containerWidth: number, gap: number, rowsPerPage: number) {
  const minTilesPerRow = Math.max(1, Math.floor((containerWidth + gap) / (MIN_TILE_WIDTH + gap)))
  return minTilesPerRow * rowsPerPage
}

// How many of `tiles` fall within the first `rowsPerPage` rows. Unlike calculateApproxTilesPerRow
// (a pre-fetch worst-case estimate), this is the exact count sdk.hideTilesAfterNth() needs.
//
// It's derived from the tiles' assigned widths rather than offsetTop: resizeTiles sets each tile's
// flex-basis via style.width, and the grid (.ugc-tiles: display:flex; flex-wrap:wrap; gap:--margin)
// wraps to a new row as soon as the next basis + gap overflows the container. Replaying that packing
// here reproduces the same row breaks without needing a real layout pass (offsetTop is 0 until the
// browser has painted, and unavailable in tests), and matches wrapping since flex-grow only
// redistributes leftover space within an already-decided row.
export function calculateVisibleTileCountForRows(
  tiles: HTMLElement[],
  rowsPerPage: number,
  containerWidth: number,
  gap: number
) {
  if (tiles.length === 0 || rowsPerPage <= 0) {
    return 0
  }

  // Without a real container width we can't tell where rows break, so treat every tile as visible.
  if (containerWidth <= 0) {
    return tiles.length
  }

  let currentRow = 0
  let rowWidth = 0
  let visibleCount = 0

  for (const tile of tiles) {
    const tileWidth = getTileWidth(tile)

    if (rowWidth === 0) {
      // First tile of a row always fits, even if it's wider than the container on its own.
      rowWidth = tileWidth
    } else if (rowWidth + gap + tileWidth <= containerWidth) {
      rowWidth += gap + tileWidth
    } else {
      // Next basis overflows: this tile wraps onto a fresh row.
      currentRow++
      if (currentRow >= rowsPerPage) {
        break
      }
      rowWidth = tileWidth
    }

    visibleCount++
  }

  return visibleCount
}

// The flex-basis assigned by resizeTiles (style.width) is what drives wrapping - not offsetWidth,
// which reflects the post-flex-grow rendered size. Fall back to the rendered width, then to the
// minimum brick width, so a tile that hasn't been sized yet still contributes something sane.
function getTileWidth(tile: HTMLElement): number {
  const basis = parseFloat(tile.style?.width ?? "")
  if (!Number.isNaN(basis) && basis > 0) {
    return basis
  }

  return tile.offsetWidth || MIN_TILE_WIDTH
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

    return calculateApproxTilesPerRow(containerWidth, gap, rowsPerPage)
  })
}

// Applies "rows" mode by hiding every tile beyond what's needed to fill rowsPerPage rows, plus
// hiding load-more. Must run after renderMasonryLayout, so tiles are already positioned and
// their real (random-width) rows can be measured - tiles.service.ts's rowsPerLoadCalculator
// only fetches a worst-case-sized batch up front; this trims it down to the exact count once
// actual layout is known.
//
// Each load-more click bumps sdk.getPage(), and every extra page should reveal another
// rowsPerPage rows on top of what's already shown (rows_per_page 2, page 2 -> 4 rows total) -
// so the row target scales with the current page instead of staying fixed at rows_per_page.
export function applyRowsPerPageLimit(sdk: ISdk) {
  const { enable_custom_tiles_per_page, custom_tile_per_page_type, rows_per_page, margin } = sdk.getStyleConfig()

  if (!enable_custom_tiles_per_page || custom_tile_per_page_type !== "rows") {
    return
  }

  const allTiles = Array.from(sdk.querySelectorAll<HTMLElement>(".grid-item") ?? [])

  if (allTiles.length === 0) {
    // Tiles aren't rendered/positioned yet - retry next time this is called (onLoad/
    // onTilesUpdated) rather than giving up, since we haven't marked this sdk as done below.
    return
  }

  const containerWidth = sdk.querySelector("#nosto-ugc-container")?.clientWidth ?? 0
  const gap = parseFloat(margin ?? "") || 0
  const rowsPerPage = parseInt(rows_per_page ?? "", 10) || DEFAULT_ROWS_PER_PAGE
  const totalRowsForCurrentPage = rowsPerPage * sdk.getPage()
  const visibleTilesCount = calculateVisibleTileCountForRows(allTiles, totalRowsForCurrentPage, containerWidth, gap)

  // Hide the surplus tiles without touching the per-page fetch count: setVisibleTilesCount would
  // overwrite tiles.service's visibleTilesCount (the load-more page size + basis for its buffer
  // math), making each load-more request grow (page 1 -> 30, page 2 -> 60, ...). hideTilesAfterNth
  // only adjusts visibility, so the fetch size set by the rows-per-load calculator stays constant.
  sdk.hideTilesAfterNth(visibleTilesCount)
}
