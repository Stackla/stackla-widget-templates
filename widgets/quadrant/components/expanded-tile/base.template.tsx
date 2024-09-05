import type { Sdk } from "@stackla/ugc-widgets"
import { getConfig } from "../../widget.config"
import { createElement } from "jsx-html"
import { ExitButton } from "../exit.button"
import { PanelLeft } from "../panel.left"
import { PanelRight } from "../panel.right"
import { TileArrows } from "../tile.arrows"

declare const sdk: Sdk

export default function ExpandedTile() {
  const widgetContainer = sdk.placement.getWidgetContainer()
  const widgetSettings = getConfig(widgetContainer)
  const tile = sdk.tiles.getTile()

  if (!tile) {
    throw new Error("Failed to find expanded tile")
  }

  const shopspotEnabled = sdk.isComponentLoaded("shopspots") && widgetSettings.expanded_tile_show_shopspots
  const productsEnabled = sdk.isComponentLoaded("products") && widgetSettings.expanded_tile_show_products
  const parent = sdk.getNodeId() ?? ""

  return (
    <div className="panel">
      <ExitButton />
      <TileArrows />
      <PanelLeft tile={tile} shopspotEnabled={shopspotEnabled} parent={parent} />
      <PanelRight tile={tile} widgetSettings={widgetSettings} parent={parent} productsEnabled={productsEnabled} />
    </div>
  )
}
