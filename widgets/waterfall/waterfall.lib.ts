import { ISdk } from "@stackla/widget-utils"
import { ShareMenu } from "packages/widget-utils/src/libs/templates/share-menu/share-menu.lib"
import { copyToClipboard } from "packages/widget-utils/src/libs/templates/share-menu/share-menu.listener"

declare const sdk: ISdk

export function loadWaterfallLayout(reset = false) {
  const allTiles = Array.from(sdk.querySelectorAll<HTMLElement>(".grid-item") ?? [])
  const ugcTiles = reset ? allTiles : allTiles.filter(tile => tile.getAttribute("height-set") !== "true")

  if (!ugcTiles || ugcTiles.length === 0) {
    return
  }

  const rowHeight = 10
  const { margin } = sdk.getStyleConfig()
  const gap = parseInt(margin)

  ugcTiles.forEach(async (tile: HTMLElement) => {
    const imageElement = tile.querySelector("img")
    if (imageElement && imageElement.complete) {
      const height = imageElement?.naturalHeight

      const rowSpan = Math.floor((height + gap) / (rowHeight + gap))

      tile.style.gridRowEnd = `span ${rowSpan}`

      tile.setAttribute("height-set", "true")
      tile.classList.add("processed")
    }

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

          if (container.contains(overlayElement)) {
            container.removeChild(overlayElement)
          }
        })

        const shareMenuWrapper = sdk.querySelector(".share-socials-popup-wrapper")
        shareMenuWrapper.style.display = "flex"

        const clipboardElement = shareMenuWrapper?.querySelector<HTMLElement>(".url-copy .copy-button")
        const shareUrlElement = shareMenuWrapper?.querySelector<HTMLInputElement>(".url-copy .share-url")

        clipboardElement?.addEventListener("click", async () => {
          if (shareUrlElement) {
            await copyToClipboard(shareUrlElement)
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
}
