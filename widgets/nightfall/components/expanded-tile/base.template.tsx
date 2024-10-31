import type { ISdk } from "@stackla/public-types"
import { createElement } from "jsx-html"
import Panel from "./components/Panel"
import PanelRight from "./components/PanelRight"
import PanelLeft from "./components/PanelLeft"

export default (sdk: ISdk) => {
  const tile = sdk.tiles.getTile()

  if (!tile) {
    throw new Error("Failed to find expanded tile")
  }

  return (
    <Panel>
      <PanelLeft tile={tile} />
      <PanelRight tile={tile} />
    </Panel>
  )
}
