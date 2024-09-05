import type { Sdk } from "@stackla/ugc-widgets"
import { ExpandedTile } from "./tile.template"
import { createElement } from "@stackla/ugc-widgets/src/ui/core/utils/jsx-html"

export function ExpandedTiles(sdk: Sdk) {
  const tiles = sdk.tiles.tiles

  return Object.values(tiles).length ? (
    <div class="expanded-tile-wrapper">
      <a class="exit" href="#">
        <span class="widget-icon close"></span>
      </a>
      <div class="swiper swiper-expanded">
        <div class="swiper-wrapper">
          {Object.values(tiles).map(tile => (
            <div class="swiper-slide">
              <ExpandedTile sdk={sdk} tile={tile} />
            </div>
          ))}
        </div>
      </div>
      <div class="swiper-expanded-button-prev swiper-button-prev"></div>
      <div class="swiper-expanded-button-next swiper-button-next"></div>
    </div>
  ) : (
    <span>No tiles found</span>
  )
}
