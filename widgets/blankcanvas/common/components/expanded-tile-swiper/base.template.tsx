import type { ISdk } from "@stackla/widget-utils"
import { ExpandedTile } from "./tile.template"
import { createElement } from "@stackla/widget-utils"

export function ExpandedTiles(sdk: ISdk) {
  const tiles = sdk.tiles.tiles
  const { show_nav } = sdk.getExpandedTileConfig()
  const navigationArrowsEnabled = show_nav
  const isDesktopScreen = window.innerWidth > 992

  return (
    <div class="expanded-tile-wrapper">
      <a class="exit" href="#">
        <span class="widget-icon close-white"></span>
      </a>
      <BackArrowIcon />
      <div class="swiper swiper-expanded">
        <div class="swiper-wrapper ugc-tiles">
          {Object.values(tiles).map(tile => (
            <div class="ugc-tile swiper-slide" data-id={tile.id}>
              <ExpandedTile sdk={sdk} tile={tile} />
            </div>
          ))}
        </div>
      </div>
      <div
        class="swiper-expanded-button-prev swiper-button-prev"
        style={{ display: isDesktopScreen && navigationArrowsEnabled ? "flex" : "none" }}>
        <span class="chevron-left" alt="Previous arrow" />
      </div>
      <div
        class="swiper-expanded-button-next swiper-button-next"
        style={{ display: isDesktopScreen && navigationArrowsEnabled ? "flex" : "none" }}>
        <span class="chevron-right" alt="Next arrow" />
      </div>
    </div>
  )
}

function BackArrowIcon() {
  return (
    <a class="back" href="#">
      <span class="widget-icon back-arrow"></span>
    </a>
  )
}
