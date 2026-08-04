import { ISdk, loadWidget } from "@stackla/widget-utils"
import {
  applyRowsPerPageLimit,
  handleAllTileImageRendered,
  handleTileImageError,
  registerRowsPerLoadCalculator,
  renderMasonryLayout
} from "./masonry.extension"

declare const sdk: ISdk

// Must run synchronously, before loadWidget/EVENT_JS_RENDERED, so tiles.service.ts already has
// this formula by the time it resolves how many tiles to fetch for "rows" mode.
registerRowsPerLoadCalculator(sdk)

loadWidget(sdk, {
  callbacks: {
    // onLoad (EVENT_LOAD) fires once right after initial JS execution + component loading -
    // well before onTilesUpdated, which is only emitted later by fetchTiles() (load-more/search)
    // or the 10s auto-refresh poller (tiles.service.ts createNewTilesInterval). Relying on
    // onTilesUpdated alone meant rows mode didn't hide load-more/excess tiles until that first
    // poll tick, even though the initial tiles are already in the DOM by onLoad.
    // renderMasonryLayout must run first in both callbacks: applyRowsPerPageLimit measures each
    // tile's real (random-width) row via offsetTop, which only reflects reality once layout has
    // actually positioned them.
    onLoad: [
      () => {
        renderMasonryLayout(sdk)
        applyRowsPerPageLimit(sdk)
      }
    ],
    onTilesUpdated: [
      () => {
        renderMasonryLayout(sdk)
        applyRowsPerPageLimit(sdk)
      }
    ],
    onTileBgImgRenderComplete: [
      () => {
        handleAllTileImageRendered(sdk)
        setTimeout(() => handleAllTileImageRendered(sdk), 1000)
      }
    ],
    onTileBgImageError: [
      customEvent => {
        const tileWithError = customEvent.detail.data.target as HTMLElement
        handleTileImageError(sdk, tileWithError)
      }
    ]
  }
})

renderMasonryLayout(sdk)
