import { ISdk, loadWidget } from "@stackla/widget-utils"
import { config } from "./config"

declare const sdk: ISdk

loadWidget(sdk, {
  config: {
    ...config
  }
})

sdk.querySelector("#search-input")?.addEventListener("input", async e => {
  const eventTarget = e.target
  if (eventTarget instanceof HTMLInputElement) {
    const searchValue = eventTarget.value
    await sdk.searchTiles(searchValue, true)
  }
})
