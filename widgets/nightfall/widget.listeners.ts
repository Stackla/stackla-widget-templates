import { Sdk } from "@stackla/ugc-widgets"
import { refreshMasonryLayout } from "../libs/extensions/masonry.extension"
import { waitForElement } from "widgets/libs/widget.utils"
declare const sdk: Sdk

export async function onTileClose() {
  await waitForElement(".ugc-tiles", 3000)
  const tilesContainer = sdk.querySelector("#tiles")
  const ugcTiles = sdk.querySelector(".ugc-tiles")

  if (!ugcTiles) {
    throw new Error("Failed to find tiles wrapper")
  }

  if (!tilesContainer) {
    throw new Error("Failed to find tiles container")
  }

  tilesContainer.style.display = "flex"

  refreshMasonryLayout()
}
