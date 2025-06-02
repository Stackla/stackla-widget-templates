import { ISdk } from "@stackla/widget-utils"
import { createElement } from "@stackla/widget-utils/jsx"
import { ExpandedTile } from "./tile.template"

declare const sdk: ISdk

export function ExpandedTiles() {
  const tiles = sdk.getTiles()
  const { show_nav } = sdk.getExpandedTileConfig()
  const navigationArrowsEnabled = show_nav

  return (
    <div class="expanded-tile-wrapper">
      <a class="exit" href="#">
        <span class="widget-icon close-white"></span>
      </a>
      <BackArrowIcon />
      <div class="swiper swiper-expanded">
        <div class="swiper-wrapper ugc-tiles">
          {tiles.map(tile => (
            <div
              class="ugc-tile swiper-slide"
              data-id={tile.id}
              data-yt-id={tile.youtube_id || ""}
              data-tiktok-id={tile.tiktok_id || ""}>
              <ExpandedTile sdk={sdk} tile={tile} />
            </div>
          ))}
        </div>
      </div>
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

function BackArrowIcon() {
  return (
    <a class="back" href="#">
      <span class="widget-icon back-arrow"></span>
    </a>
  )
}
