import type { Sdk } from "@stackla/types"
import { getLoadLessButton, getLoadMoreButton } from "./widget.buttons"

declare const sdk: Sdk

export function loadListeners() {
  const buttons = sdk.querySelector("#buttons")
  const postLoad = sdk.querySelector("#postload")
  const preLoad = sdk.querySelector("#preload")

  sdk.addEventListener("tilesUpdated", () => {
    if (sdk.tiles.hasMorePages()) {
      getLoadMoreButton().style.display = ""
    }

    if (sdk.tiles.hasLessPages()) {
      getLoadLessButton().style.display = ""
    }
  })

  if (buttons) {
    sdk.addEventListener("tileExpand", () => {
      buttons.style.display = "none"
    })
    sdk.addEventListener("expandedTileClose", () => {
      buttons.style.display = ""
    })
  }

  if (postLoad && preLoad) {
    sdk.addEventListener("tilesUpdated", () => {
      postLoad.style.display = ""
      preLoad.style.display = "none"
    })
  }
}
