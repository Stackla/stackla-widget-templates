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

function makeTile(offsetTop: number) {
  return { offsetTop } as unknown as HTMLElement
}

function createMockSdk(style: Record<string, unknown>, containerWidth: number, tiles: HTMLElement[] = [], page = 1) {
  const container = { clientWidth: containerWidth }
  const loadMoreElement = { classList: { add: vi.fn() } }
  let gridItems = tiles
  let currentPage = page

  const mocks = {
    setRowsPerLoadCalculator: vi.fn(),
    setVisibleTilesCount: vi.fn()
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
  test("returns 0 when there are no tiles", () => {
    expect(calculateVisibleTileCountForRows([], 2)).toBe(0)
  })

  test("counts only the tiles that fall within the first N rows", () => {
    // row 0: 3 tiles, row 100: 2 tiles, row 200: 4 tiles - first 2 rows = 3 + 2 = 5
    const tiles = [
      makeTile(0),
      makeTile(0),
      makeTile(0),
      makeTile(100),
      makeTile(100),
      makeTile(200),
      makeTile(200),
      makeTile(200),
      makeTile(200)
    ]

    expect(calculateVisibleTileCountForRows(tiles, 2)).toBe(5)
  })

  test("sorts rows by offsetTop instead of assuming DOM order", () => {
    const tiles = [makeTile(200), makeTile(0), makeTile(0), makeTile(100)]

    expect(calculateVisibleTileCountForRows(tiles, 1)).toBe(2)
  })

  test("returns every tile when rowsPerPage exceeds the number of rows present", () => {
    const tiles = [makeTile(0), makeTile(0), makeTile(100)]

    expect(calculateVisibleTileCountForRows(tiles, 5)).toBe(3)
  })
})

describe("applyRowsPerPageLimit", () => {
  test("does nothing when custom_tile_per_page_type is not 'rows'", () => {
    const { sdk, mocks } = createMockSdk({ ...ROWS_STYLE, custom_tile_per_page_type: "tiles" }, 1000, [makeTile(0)])

    applyRowsPerPageLimit(sdk)

    expect(mocks.setVisibleTilesCount).not.toHaveBeenCalled()
  })

  test("no-ops while tiles aren't rendered/positioned yet, then applies once they are (matching the retry in widget.tsx)", () => {
    const { sdk, mocks, setGridItems } = createMockSdk(ROWS_STYLE, 1000, [])

    applyRowsPerPageLimit(sdk)

    expect(mocks.setVisibleTilesCount).not.toHaveBeenCalled()

    setGridItems([makeTile(0), makeTile(0), makeTile(100)])
    applyRowsPerPageLimit(sdk)

    expect(mocks.setVisibleTilesCount).toHaveBeenCalledWith(3)
  })

  test("calls setVisibleTilesCount with the exact tile count needed for the configured rows", () => {
    const tiles = [makeTile(0), makeTile(0), makeTile(0), makeTile(100), makeTile(100), makeTile(200)]
    const { sdk, mocks } = createMockSdk(ROWS_STYLE, 1000, tiles)

    applyRowsPerPageLimit(sdk)

    expect(mocks.setVisibleTilesCount).toHaveBeenCalledWith(5)
  })

  test("multiplies rows_per_page by the current load-more page, so page 2 shows twice as many rows", () => {
    // rows_per_page 2, page 2 -> 4 rows worth of tiles: row 0 (2), row 100 (2), row 200 (2),
    // row 300 (2) = 8 tiles: the row 400 tile is beyond the 4th row and stays hidden.
    const tiles = [
      makeTile(0),
      makeTile(0),
      makeTile(100),
      makeTile(100),
      makeTile(200),
      makeTile(200),
      makeTile(300),
      makeTile(300),
      makeTile(400)
    ]
    const { sdk, mocks } = createMockSdk(ROWS_STYLE, 1000, tiles, 2)

    applyRowsPerPageLimit(sdk)

    expect(mocks.setVisibleTilesCount).toHaveBeenCalledWith(8)
  })

  test("recomputes on every call so a later load-more page reveals more rows", () => {
    const tiles = [makeTile(0), makeTile(0), makeTile(100), makeTile(100), makeTile(200), makeTile(200)]
    const { sdk, mocks, setPage } = createMockSdk(ROWS_STYLE, 1000, tiles, 1)

    applyRowsPerPageLimit(sdk)
    expect(mocks.setVisibleTilesCount).toHaveBeenLastCalledWith(4)

    setPage(2)
    applyRowsPerPageLimit(sdk)
    expect(mocks.setVisibleTilesCount).toHaveBeenLastCalledWith(6)
  })

  test("applies independently for a second masonry widget instance on the same page", () => {
    const tiles = [makeTile(0), makeTile(100)]
    const first = createMockSdk(ROWS_STYLE, 1000, tiles)
    const second = createMockSdk(ROWS_STYLE, 1000, tiles)

    applyRowsPerPageLimit(first.sdk)
    applyRowsPerPageLimit(second.sdk)

    expect(first.mocks.setVisibleTilesCount).toHaveBeenCalledTimes(1)
    expect(second.mocks.setVisibleTilesCount).toHaveBeenCalledTimes(1)
  })
})
