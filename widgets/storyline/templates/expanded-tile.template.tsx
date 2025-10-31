import { ISdk } from "@stackla/widget-utils"
import { createElement } from "@stackla/widget-utils/jsx"
import { VerticalExpandedTile } from "./tile.template"

declare const sdk: ISdk

export function ExpandedTilesTemplate() {
  const tiles = sdk.getTiles()

  return (
    <div class="expanded-tile-wrapper">
      <BackArrowIcon />
      <div class="swiper swiper-expanded">
        <div class="swiper-wrapper ugc-tiles">
          {tiles.map(tile => (
            <div
              class="ugc-tile swiper-slide"
              data-id={tile.id}
              data-yt-id={tile.youtube_id || ""}
              data-tiktok-id={tile.tiktok_id || ""}>
              <VerticalExpandedTile sdk={sdk} tile={tile} />
            </div>
          ))}
        </div>
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
