import type { Sdk } from "@stackla/ugc-widgets"
import { ExpandedTile } from "./tile.template"
import { createElement, createFragment } from "@stackla/ugc-widgets/src/ui/core/utils/jsx-html"
import { getConfig } from "@widgets/carousel/widget.config"

export function ExpandedTiles(sdk: Sdk) {
  const tiles = sdk.tiles.tiles
  const widgetContainer = sdk.placement.getWidgetContainer()
  const widgetSettings = getConfig(widgetContainer)
  const navigationArrowsEnabled = widgetSettings.expanded_tile_show_navigation_arrows

  return (
    <div class="expanded-tile-wrapper">
      <a class="exit" href="#">
        <span class="widget-icon close-white"></span>
      </a>
      <BackArrowIcon />
      <div class="swiper swiper-expanded">
        <div class="swiper-wrapper">
          {Object.values(tiles).map(tile => (
            <div class="swiper-slide" data-id={tile.id}>
              <ExpandedTile sdk={sdk} tile={tile} />
            </div>
          ))}
        </div>
      </div>
      <div
        class="swiper-expanded-button-prev swiper-button-prev"
        style={{ display: !navigationArrowsEnabled ? "none" : "flex" }}>
        <span class="chevron-left" alt="Previous arrow" />
      </div>
      <div
        class="swiper-expanded-button-next swiper-button-next"
        style={{ display: !navigationArrowsEnabled ? "none" : "flex" }}>
        <span class="chevron-right" alt="Next arrow" />
      </div>
    </div>
  )
}

function BackArrowIcon() {
  const isDesktopScreen = window.innerWidth >= 992
  return !isDesktopScreen ? (
    <a class="back" href="#">
      <span class="widget-icon back-arrow"></span>
    </a>
  ) : (
    <></>
  )
}
