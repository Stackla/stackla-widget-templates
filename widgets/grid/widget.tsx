import { loadWidget, loadAllUnloadedTiles, ISdk } from "@stackla/widget-utils"

declare const sdk: ISdk

loadWidget(sdk)
loadAllUnloadedTiles(sdk)
