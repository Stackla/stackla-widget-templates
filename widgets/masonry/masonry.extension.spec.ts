import { describe, expect, test, vi } from "vitest"
import type { ISdk } from "@stackla/widget-utils"
import {
  applyRowsPerPageLimit,
  calculateApproxTilesPerRow,
  calculateVisibleTileCountForRows,
  registerRowsPerLoadCalculator
} from "./masonry.extension"

const ROWS_STYLE = {
  enable_custom_tiles_per_page: true,
  custom_tile_per_page_type: "rows",
  rows_per_page: "2",
  margin: "10",
  inline_tile_size: "medium"
}

function makeTile(width: number) {
  return { style: { width: `${width}px` }, offsetWidth: width } as unknown as HTMLElement
}

function createMockSdk(style: Record<string, unknown>, containerWidth: number, tiles: HTMLElement[] = [], page = 1) {
  const container = { clientWidth: containerWidth }
  const loadMoreElement = { classList: { add: vi.fn() } }
  let gridItems = tiles
  let currentPage = page

  const mocks = {
    setRowsPerLoadCalculator: vi.fn(),
    setVisibleTilesCount: vi.fn(),
    hideTilesAfterNth: vi.fn()
  }

  const sdk = {
    getStyleConfig: () => style,
    getPage: () => currentPage,
    querySelector: (selector: string) => {
      if (selector === "#nosto-ugc-container") return container
      if (selector === "load-more") return loadMoreElement
      return undefined
    },
    querySelectorAll: (selector: string) => {
      if (selector === ".grid-item") return gridItems
      return undefined
    },
    ...mocks
  } as unknown as ISdk

  return {
    sdk,
    container,
    loadMoreElement,
    mocks,
    setGridItems: (value: HTMLElement[]) => {
      gridItems = value
    },
    setPage: (value: number) => {
      currentPage = value
    }
  }
}

describe("calculateApproxTilesPerRow", () => {
  test("computes worst-case tile count for a wide container", () => {
    // MIN_TILE_WIDTH 150, gap 10 -> minTilesPerRow = floor((1000+10)/(150+10)) = 6
    expect(calculateApproxTilesPerRow(1000, 10, 2)).toBe(12)
  })

  test("never returns fewer than 1 tile per row even for a narrow container", () => {
    expect(calculateApproxTilesPerRow(100, 10, 3)).toBe(3)
  })

  test("handles zero gap", () => {
    // MIN_TILE_WIDTH 150, gap 0 -> minTilesPerRow = floor(700/150) = 4
    expect(calculateApproxTilesPerRow(700, 0, 4)).toBe(16)
  })
})

describe("registerRowsPerLoadCalculator", () => {
  test("registers a calculator with the sdk", () => {
    const { sdk, mocks } = createMockSdk(ROWS_STYLE, 1000)

    registerRowsPerLoadCalculator(sdk)

    expect(mocks.setRowsPerLoadCalculator).toHaveBeenCalledTimes(1)
  })

  test("falls back to one tile per row when the container has no width yet", () => {
    const { sdk, mocks } = createMockSdk(ROWS_STYLE, 0)

    registerRowsPerLoadCalculator(sdk)

    const calculator = mocks.setRowsPerLoadCalculator.mock.calls[0][0]
    expect(calculator({ rowsPerPage: 3, gap: 10 })).toBe(3)
  })

  test("uses calculateApproxTilesPerRow once the container has a real width", () => {
    const { sdk, mocks } = createMockSdk(ROWS_STYLE, 1000)

    registerRowsPerLoadCalculator(sdk)

    const calculator = mocks.setRowsPerLoadCalculator.mock.calls[0][0]
    expect(calculator({ rowsPerPage: 2, gap: 10 })).toBe(calculateApproxTilesPerRow(1000, 10, 2))
  })
})

describe("calculateVisibleTileCountForRows", () => {
  // container 1000, gap 10 -> a 400px basis fits 2 per row (400, 400+10+400=810; a 3rd would be 1220)
  test("returns 0 when there are no tiles", () => {
    expect(calculateVisibleTileCountForRows([], 2, 1000, 10)).toBe(0)
  })

  test("returns 0 when rowsPerPage is not positive", () => {
    expect(calculateVisibleTileCountForRows([makeTile(400)], 0, 1000, 10)).toBe(0)
  })

  test("counts only the tiles that fall within the first N rows", () => {
    // row 0: [400, 400], row 1: [400, 400], row 2: [400] - first 2 rows = 4 tiles
    const tiles = [makeTile(400), makeTile(400), makeTile(400), makeTile(400), makeTile(400)]

    expect(calculateVisibleTileCountForRows(tiles, 2, 1000, 10)).toBe(4)
  })

  test("packs by width in DOM order, wrapping when the next basis overflows", () => {
    // row 0: [263, 267, 206] = 263 + 10 + 267 + 10 + 206 = 756; a 4th (160) would be 926 <= 1000...
    // so use widths that clearly break: row 0: [600, 350] = 960; 3rd (350) -> 1320 wraps to row 1
    const tiles = [makeTile(600), makeTile(350), makeTile(350), makeTile(600)]

    expect(calculateVisibleTileCountForRows(tiles, 1, 1000, 10)).toBe(2)
  })

  test("keeps a tile wider than the container as the sole tile of its row", () => {
    const tiles = [makeTile(1200), makeTile(400), makeTile(400)]

    // row 0: [1200] (always fits as first), row 1: [400, 400]
    expect(calculateVisibleTileCountForRows(tiles, 1, 1000, 10)).toBe(1)
    expect(calculateVisibleTileCountForRows(tiles, 2, 1000, 10)).toBe(3)
  })

  test("returns every tile when rowsPerPage exceeds the number of rows present", () => {
    const tiles = [makeTile(400), makeTile(400), makeTile(400)]

    expect(calculateVisibleTileCountForRows(tiles, 5, 1000, 10)).toBe(3)
  })

  test("treats every tile as visible when the container has no measurable width", () => {
    const tiles = [makeTile(400), makeTile(400), makeTile(400)]

    expect(calculateVisibleTileCountForRows(tiles, 2, 0, 10)).toBe(3)
  })
})

describe("applyRowsPerPageLimit", () => {
  test("does nothing when custom_tile_per_page_type is not 'rows'", () => {
    const { sdk, mocks } = createMockSdk({ ...ROWS_STYLE, custom_tile_per_page_type: "tiles" }, 1000, [makeTile(400)])

    applyRowsPerPageLimit(sdk)

    expect(mocks.hideTilesAfterNth).not.toHaveBeenCalled()
  })

  test("no-ops while tiles aren't rendered/positioned yet, then applies once they are (matching the retry in widget.tsx)", () => {
    const { sdk, mocks, setGridItems } = createMockSdk(ROWS_STYLE, 1000, [])

    applyRowsPerPageLimit(sdk)

    expect(mocks.hideTilesAfterNth).not.toHaveBeenCalled()

    // container 1000, gap 10 -> row 0: [400, 400], row 1: [400]; first 2 rows = all 3 tiles
    setGridItems([makeTile(400), makeTile(400), makeTile(400)])
    applyRowsPerPageLimit(sdk)

    expect(mocks.hideTilesAfterNth).toHaveBeenCalledWith(3)
  })

  test("hides tiles after the exact tile count needed for the configured rows", () => {
    // row 0: [400, 400], row 1: [400, 400], row 2: [400]; rows_per_page 2 -> 4 tiles
    const tiles = [makeTile(400), makeTile(400), makeTile(400), makeTile(400), makeTile(400)]
    const { sdk, mocks } = createMockSdk(ROWS_STYLE, 1000, tiles)

    applyRowsPerPageLimit(sdk)

    expect(mocks.hideTilesAfterNth).toHaveBeenCalledWith(4)
  })

  test("multiplies rows_per_page by the current load-more page, so page 2 shows twice as many rows", () => {
    // rows_per_page 2, page 2 -> 4 rows. With 2 tiles per row that's 8 tiles: the 9th tile
    // starts the 5th row and stays hidden.
    const tiles = [
      makeTile(400),
      makeTile(400),
      makeTile(400),
      makeTile(400),
      makeTile(400),
      makeTile(400),
      makeTile(400),
      makeTile(400),
      makeTile(400)
    ]
    const { sdk, mocks } = createMockSdk(ROWS_STYLE, 1000, tiles, 2)

    applyRowsPerPageLimit(sdk)

    expect(mocks.hideTilesAfterNth).toHaveBeenCalledWith(8)
  })

  test("recomputes on every call so a later load-more page reveals more rows", () => {
    // 6 tiles, 2 per row -> 3 rows. page 1 (2 rows) = 4 tiles, page 2 (4 rows) = all 6.
    const tiles = [makeTile(400), makeTile(400), makeTile(400), makeTile(400), makeTile(400), makeTile(400)]
    const { sdk, mocks, setPage } = createMockSdk(ROWS_STYLE, 1000, tiles, 1)

    applyRowsPerPageLimit(sdk)
    expect(mocks.hideTilesAfterNth).toHaveBeenLastCalledWith(4)

    setPage(2)
    applyRowsPerPageLimit(sdk)
    expect(mocks.hideTilesAfterNth).toHaveBeenLastCalledWith(6)
  })

  test("applies independently for a second masonry widget instance on the same page", () => {
    const tiles = [makeTile(400), makeTile(400)]
    const first = createMockSdk(ROWS_STYLE, 1000, tiles)
    const second = createMockSdk(ROWS_STYLE, 1000, tiles)

    applyRowsPerPageLimit(first.sdk)
    applyRowsPerPageLimit(second.sdk)

    expect(first.mocks.hideTilesAfterNth).toHaveBeenCalledTimes(1)
    expect(second.mocks.hideTilesAfterNth).toHaveBeenCalledTimes(1)
  })
})
