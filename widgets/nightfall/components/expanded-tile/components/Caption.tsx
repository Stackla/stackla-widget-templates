import { createElement, createFragment } from "jsx-html"
import { Sdk, Tile } from "@stackla/ugc-widgets"
import { ExpandedTileProps } from "../../../types/ExpandedTileProps"
import { IWidgetSettings } from "types/IWidgetSettings"
import { Tags } from "@widgets/libs/templates/tags.lib"
import Timestamp from "./Timestamp"

declare const sdk: Sdk

export function isCaptionEnabled(tile: Tile, widgetSettings: IWidgetSettings) {
  return tile.message.length > 0 && widgetSettings.expanded_tile_show_caption
}

export default ({ tile, widgetSettings }: ExpandedTileProps) => {
  const productsEnabled = sdk.isComponentLoaded("products")
  const parent = sdk.getNodeId()

  return (
    <div className="caption">
      <p className="caption-paragraph">{isCaptionEnabled(tile, widgetSettings) ? tile.message : <></>}</p>
      <Tags tile={tile} />
      <Timestamp tile={tile} widgetSettings={widgetSettings} />
      {productsEnabled && <ugc-products parent={parent}></ugc-products>}
    </div>
  )
}
