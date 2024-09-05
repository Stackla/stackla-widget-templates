import type { Sdk } from "@stackla/ugc-widgets"
import { createElement } from "jsx-html"
import Panel from "./components/Panel"
import PanelRight from "./components/PanelRight"
import PanelLeft from "./components/PanelLeft"
import { getConfig } from "../../widget.config"

export default (sdk: Sdk) => {
  const tile = sdk.tiles.getTile()
  const widgetContainer = sdk.placement.getWidgetContainer()
  const widgetSettings = getConfig(widgetContainer)

  if (!tile) {
    throw new Error("Failed to find expanded tile")
  }

  return (
    <Panel>
      <PanelLeft tile={tile} widgetSettings={widgetSettings} />
      <PanelRight tile={tile} widgetSettings={widgetSettings} />
    </Panel>
  )
}
