import { ISdk, loadWidget } from "@stackla/widget-utils"
import {
  applyRowsPerPageLimit,
  handleAllTileImageRendered,
  handleTileImageError,
  renderMasonryLayout
} from "./masonry.extension"

declare const sdk: ISdk

loadWidget(sdk, {
  callbacks: {
    // onLoad (EVENT_LOAD) fires once right after initial JS execution + component loading -
    // well before onTilesUpdated, which is only emitted later by fetchTiles() (load-more/search)
    // or the 10s auto-refresh poller (tiles.service.ts createNewTilesInterval). Relying on
    // onTilesUpdated alone meant rows mode didn't clip/hide load-more until that first poll tick.
    onLoad: [
      () => {
        void applyRowsPerPageLimit(sdk)
      }
    ],
    onTilesUpdated: [
      () => {
        void applyRowsPerPageLimit(sdk)
        renderMasonryLayout(sdk)
      }
    ],
    onTileBgImgRenderComplete: [
      () => {
        handleAllTileImageRendered(sdk)
        setTimeout(() => handleAllTileImageRendered(sdk), 1000)
      }
    ],
    onTileBgImageError: [
      event => {
        const customEvent = event
        const tileWithError = customEvent.detail.data.target as HTMLElement
        handleTileImageError(sdk, tileWithError)
      }
    ]
  }
})

renderMasonryLayout(sdk)
