import { getTimephrase } from "../../../../libs/tile.lib"
import { createElement, createFragment } from "@stackla/ugc-widgets/src/ui/core/utils/jsx-html"
import { Sdk, Tile } from "@stackla/ugc-widgets"
import { getConfig } from "../../../widget.config"
import { ExpandedTileProps } from "../../../types/ExpandedTileProps"

declare const sdk: Sdk

function timestampEnabled(tile: Tile) {
  const widgetContainer = sdk.placement.getWidgetContainer()
  const widgetSettings = getConfig(widgetContainer)
  return tile.source_created_at && widgetSettings.expanded_tile_show_timestamp
}

export default ({ tile }: ExpandedTileProps) => {
  return <div class="tile-timestamp">{timestampEnabled(tile) ? getTimephrase(tile.source_created_at) : <></>}</div>
}
