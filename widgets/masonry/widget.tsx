import { ISdk, loadWidget } from "@stackla/widget-utils"
import { handleAllTileImageRendered, handleTileImageError, renderMasonryLayout } from "./masonry.extension"

declare const sdk: ISdk

loadWidget(sdk, {
  callbacks: {
    onTilesUpdated: [() => renderMasonryLayout(sdk)],
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
