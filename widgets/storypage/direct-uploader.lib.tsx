import { createElement, ISdk } from "@stackla/widget-utils"

declare const sdk: ISdk

const loadMoreJSX = (
  <div class="direct-uploader-load-more">
    <div class="direct-uploader-container">
      <div>
        <span class="icon-picture"></span>
        <p>View all</p>
      </div>
    </div>
  </div>
)

export function loadDirectUploaderTileButton() {
  sdk.querySelectorAll(".direct-uploader-load-more").forEach(button => button.remove())

  const tiles = sdk.querySelectorAll(".ugc-tile")
  const lastTile = tiles[tiles.length - 1]
  if (lastTile) {
    lastTile.appendChild(loadMoreJSX)
  }
}
