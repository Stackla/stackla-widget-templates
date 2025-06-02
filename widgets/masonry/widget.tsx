import { ISdk, loadWidget } from "@stackla/widget-utils"

declare const sdk: ISdk

loadWidget(sdk, {
  extensions: {
    masonry: true
  }
})
