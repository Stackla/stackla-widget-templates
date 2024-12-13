import { Features, Sdk } from "@stackla/widget-utils"
import { getTileSizeUnitless } from "./utils"

declare const sdk: Sdk

const COLUMN_INDENT_CLASS = "grid-column-indent"

/**
 * Calculates the total column counts that can be rendered in the grid
 *
 * @param settings the tile size configuration of the widget
 * @returns the possible number of grid columns based on screen size
 */
function getColumnCount(settings: Features["tileSizeSettings"]) {
  const availableWidth = (window.screen.availWidth * 95) / 100
  const tileRenderingWidth = getTileSizeUnitless(settings) * 2 + 20
  return Math.floor(availableWidth / tileRenderingWidth)
}

function markTileFromInitialRowOffsets(tileElement: Element, indentedOffsets: number[], verticalRender: boolean) {
  const actualLeft = Math.floor(tileElement.getBoundingClientRect().left)

  if (indentedOffsets.includes(actualLeft)) {
    toggleIndentAttribute(tileElement, true, verticalRender)
  } else {
    toggleIndentAttribute(tileElement, false, verticalRender)
  }
}

/**
 * Adds/Removes grid-column-indent attribute to the supplied tile element
 *
 * @param tileElement the tile element to which the attribute gets added/removed
 * @param flag a boolean value. True value adds the attribute and false value removes it
 */
function toggleIndentAttribute(tileElement: Element | null, flag: boolean, verticalRender: boolean) {
  tileElement?.toggleAttribute(COLUMN_INDENT_CLASS, flag)

  if (verticalRender) {
    tileElement?.nextElementSibling?.toggleAttribute(COLUMN_INDENT_CLASS, flag)
  }
}

function getIndentationProps(settings: Features["tileSizeSettings"]) {
  const targetColumnCount = getColumnCount(settings)
  return {
    targetColumnCount,
    totalExpectedIndentedColumns: Math.floor(targetColumnCount / 2),
    totalTileWidth: getTileSizeUnitless(settings) * 2 + 20
  }
}

/**
 * Marks every even columns for top indent. This is to achieve the Zig-Zag rendering pattern with CSS grid rendering.
 * Note: most of these logic can be avoided when nth-col gets wider support
 *
 * @param settings the tile size configuration of the widget
 */
export function markColumns(settings: Features["tileSizeSettings"]) {
  const sliderInline = sdk.querySelector(".slider-inline")
  const tilesContainer = sliderInline.querySelector<HTMLElement>(".ugc-tiles")
  const tiles = tilesContainer!.querySelectorAll(".ugc-tile")
  const leftOffset = tiles[0].getBoundingClientRect().left
  const { targetColumnCount, totalExpectedIndentedColumns, totalTileWidth } = getIndentationProps(settings)
  const indentedOffsets: number[] = []

  let skipNext = false
  let columnCounter = 0
  let columnCount = targetColumnCount
  let verticalTileCounter = 0

  tiles.forEach(tileElement => {
    const isRowSpanCurrent = getComputedStyle(tileElement).gridRow === "span 2"
    const isRowSpanNext = tileElement.nextElementSibling
      ? getComputedStyle(tileElement.nextElementSibling).gridRow === "span 2"
      : false
    const verticalRender = isRowSpanCurrent && isRowSpanNext

    // veritcally aligned tiles are processed together.
    // When the first vertical tile is processed, the following vertical tile can be ignmored
    if (skipNext) {
      skipNext = false
      return
    }

    if (columnCounter === 0) {
      columnCount = targetColumnCount - verticalTileCounter
      verticalTileCounter = 0
    }

    columnCounter++

    if (
      columnCounter > 0 &&
      (columnCounter % 2 === 0 || indentedOffsets.length === totalExpectedIndentedColumns) &&
      columnCounter <= columnCount
    ) {
      // skip tile if it is vertically aligned but not the next tile
      if (isRowSpanCurrent && !isRowSpanNext) {
        return
      }

      if (!skipNext) {
        const actualLeft = Math.floor(tileElement.getBoundingClientRect().left)
        const expectedLeft = Math.floor(leftOffset + totalTileWidth * (columnCounter - 1))

        if (indentedOffsets.length === totalExpectedIndentedColumns) {
          markTileFromInitialRowOffsets(tileElement, indentedOffsets, verticalRender)
        } else if (actualLeft === expectedLeft) {
          toggleIndentAttribute(tileElement, true, verticalRender)

          if (indentedOffsets.length < totalExpectedIndentedColumns) {
            indentedOffsets.push(actualLeft)
          }
        } else {
          toggleIndentAttribute(tileElement, false, verticalRender)
        }
      }
    } else {
      toggleIndentAttribute(tileElement, false, verticalRender)
    }

    if (verticalRender) {
      skipNext = true
      verticalTileCounter++
    }

    // reset counter when all columns are rendered
    if (columnCounter === columnCount) {
      columnCounter = 0
    }
  })
}
