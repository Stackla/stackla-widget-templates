import { Sdk } from "types"
import { getTileWidthBySizeString } from "@stackla/widget-utils"

declare const sdk: Sdk

export function getSlidesPerView(
  screenWidth: number = sdk.querySelector("#nosto-ugc-container")?.clientWidth ?? 0
): number {
  const {
    enable_custom_tiles_per_page: isCustomTilesPerPageEnabled,
    tiles_per_page: tilesPerPage,
    inline_tile_size: tileSizeString
  } = sdk.getStyleConfig()

  const tileSize = getTileWidthBySizeString(tileSizeString ?? "medium").replace("px", "")
  const tileSizeWithMargin = Number(tileSize) - 30
  const slidesPerView = Math.ceil(screenWidth / tileSizeWithMargin)

  if (isCustomTilesPerPageEnabled && tilesPerPage) {
    return parseInt(tilesPerPage)
  }

  return slidesPerView
}
