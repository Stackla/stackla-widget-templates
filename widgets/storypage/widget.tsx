import { createElement, ISdk, loadWidget } from "@stackla/widget-utils"
import "./direct-uploader.component"
import { calculateTilesToShow, registerResizeObserver, tileSettings } from "./direct-uploader.lib"

declare const sdk: ISdk

loadWidget({
  features: {
    handleLoadMore: false,
    tileSizeSettings: tileSettings,
    limitTilesPerPage: false
  },
  callbacks: {
    onLoad: [() => registerResizeObserver()],
    onTileBgImageError: [calculateTilesToShow]
  }
})

createSubmitMoreContentBtn()

function createSubmitMoreContentBtn() {
  const submitMoreContentBtn = (
    <div id="submit-more-content-btn">
      <span class="icon-upload"></span>
      <span>Submit your content</span>
    </div>
  )

  const existingBtn = sdk.querySelector("#submit-more-content-btn")
  existingBtn?.remove()

  sdk.querySelector(".ugc-tiles").appendChild(submitMoreContentBtn)
}
