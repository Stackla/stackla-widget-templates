import { loadAllUnloadedTiles } from "@stackla/widget-utils/extensions/swiper"
import { ISdk, loadWidget } from "@stackla/widget-utils"
import shopspotStyle from "./components/shopspot-icon/base.scss"
import { reinitialiseWaterfallLayout, loadWaterfallLayout } from "./waterfall.lib"
import { ShareMenu } from "packages/widget-utils/src/libs/templates/share-menu/share-menu.lib"
import { copyToClipboard } from "packages/widget-utils/src/libs/templates/share-menu/share-menu.listener"

declare const sdk: ISdk

loadWidget({
  extensions: {},
  features: {},
  callbacks: {
    onLoadMore: [() => loadWaterfallLayout()],
    onTilesUpdated: [() => loadWaterfallLayout()],
    onResize: [() => reinitialiseWaterfallLayout()]
  },
  templates: {
    "expanded-tiles": {
      styles: [
        {
          css: shopspotStyle,
          global: true
        }
      ]
    }
  }
})
loadWaterfallLayout()
loadAllUnloadedTiles()


sdk.querySelectorAll(".ugc-tile").forEach(tile => {
  const shareButton = tile.querySelector(".icon-share")
  shareButton?.addEventListener("click", () => {
    const tileId = tile.getAttribute("data-id")
    if (tileId) {
      const matchingTile = sdk.tiles.tiles[tileId]
      const container = sdk.querySelector("#nosto-ugc-container")

      const existingShareMenu = sdk.querySelector(".share-socials-popup-wrapper")
      if (existingShareMenu) {
        existingShareMenu.remove()
      }


      container?.appendChild(ShareMenu({ tile: matchingTile }))

      let overlayElement = container.querySelector(".overlay") as HTMLElement
      if (!overlayElement) {
        overlayElement = document.createElement("div")
        overlayElement.classList.add("overlay")
        container.appendChild(overlayElement)
      }

      overlayElement.addEventListener("click", () => {
        shareMenuWrapper.style.display = "none"
        container.removeChild(overlayElement)
      })

      const shareMenuWrapper = sdk.querySelector(".share-socials-popup-wrapper")
      shareMenuWrapper.style.display = "flex"

      const clipboardElement = shareMenuWrapper?.querySelector<HTMLElement>(".url-copy .copy-button")
      const shareUrlElement = shareMenuWrapper?.querySelector<HTMLInputElement>(".url-copy .share-url")

      clipboardElement?.addEventListener("click", () => {
        if (shareUrlElement) {
          copyToClipboard(shareUrlElement)
        }
      })

      const closeButton = shareMenuWrapper.querySelector<HTMLElement>(".share-modal-exit")
      closeButton?.addEventListener("click", closeEvent => {
        closeEvent.preventDefault()
        shareMenuWrapper.style.display = "none"
        container.removeChild(overlayElement)
      })
    }
  })
})