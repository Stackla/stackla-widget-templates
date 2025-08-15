import { ExpandedTile } from "./tile.template"
import { createElement, ISdk, Tile } from "@stackla/widget-utils"

export function getExpandedSlides(sdk: ISdk, tiles: Tile[]) {
  return tiles.map(tile => (
    <div
      class="ugc-tile swiper-slide"
      data-id={tile.id}
      data-yt-id={tile.youtube_id || ""}
      data-tiktok-id={tile.tiktok_id || ""}
      data-media={tile.media}>
      <ExpandedTile tile={tile} sdk={sdk} />
    </div>
  ))
}

function getExpandedTiles(sdk: ISdk) {
  return <div class="swiper-wrapper ugc-tiles">{getExpandedSlides(sdk, sdk.getTiles())}</div>
}

export function ExpandedTiles(sdk: ISdk) {
  const { show_nav } = sdk.getExpandedTileConfig()
  const navigationArrowsEnabled = show_nav

  return (
    <div class="expanded-tile-wrapper" variation="default">
      <div class="expanded-tile-header">
        <a class="exit" href="javascript:void(0);">
          <span class="widget-icon close-white"></span>
        </a>
        <a class="back" href="javascript:void(0);">
          <span class="widget-icon back-arrow"></span>
        </a>
      </div>
      <div class="swiper swiper-expanded">{getExpandedTiles(sdk)}</div>
      <div
        class="swiper-expanded-button-prev swiper-button-prev btn-lg"
        style={{ display: navigationArrowsEnabled ? "flex" : "none" }}>
        <span class="chevron-left" alt="Previous arrow" />
      </div>
      <div
        class="swiper-expanded-button-next swiper-button-next btn-lg"
        style={{ display: navigationArrowsEnabled ? "flex" : "none" }}>
        <span class="chevron-right" alt="Next arrow" />
      </div>
    </div>
  )
}
