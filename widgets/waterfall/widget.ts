import { loadAllUnloadedTiles } from "@stackla/widget-utils/dist/libs/extensions/swiper/loader.extension"
import { ISdk, loadWidget } from "@stackla/widget-utils"
import { ShareMenu } from "@stackla/widget-utils/dist/libs/templates/share-menu/share-menu.lib"
import { copyToClipboard } from "@stackla/widget-utils/dist/libs/templates/share-menu/share-menu.listener"
import shopspotStyle from "./components/shopspot-icon/base.scss"
import { refreshWaterfallLayout, reinitialiseWaterfallLayout, resizeAllUgcTilesHeight } from "./waterfall.lib"

declare const sdk: ISdk

const settings = {
  extensions: {},
  features: {},
  callbacks: {
    onMoreLoad: [() => refreshWaterfallLayout()],
    onTilesUpdated: [() => refreshWaterfallLayout()],
    resize: [() => reinitialiseWaterfallLayout()]
  },
  templates: {
    "expanded-tiles": {
      style: {
        css: shopspotStyle,
        global: true
      }
    }
  }
}

loadWidget(settings)
resizeAllUgcTilesHeight()
loadAllUnloadedTiles()

sdk.querySelectorAll(".share-button").forEach(button => {
  button.addEventListener("click", event => {
    event.preventDefault()

    const tileElement = button.closest(".ugc-tile")
    const tileId = tileElement?.getAttribute("data-id")

    if (tileId) {
      const matchingTile = sdk.tiles.tiles[tileId]
      const container = sdk.querySelector("#nosto-ugc-container")

      container?.appendChild(ShareMenu({ tile: matchingTile }))
      const shareMenuWrapper = sdk.querySelector(".share-socials-popup-wrapper")
      shareMenuWrapper.style.display = "flex"

      const clipboardElement = shareMenuWrapper?.querySelector<HTMLElement>(".url-copy .copy-button")
      const shareUrlElement = shareMenuWrapper?.querySelector<HTMLInputElement>(".url-copy .share-url")

      clipboardElement?.addEventListener("click", () => {
        if (shareUrlElement) void copyToClipboard(shareUrlElement)
      })

      const closeButton = shareMenuWrapper.querySelector<HTMLElement>(".share-modal-exit")
      closeButton?.addEventListener("click", closeEvent => {
        closeEvent.preventDefault()
        shareMenuWrapper.style.display = "none"
      })
    }
  })
})
