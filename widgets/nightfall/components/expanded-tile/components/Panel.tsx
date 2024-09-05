import CloseIcon from "./CloseIcon"
import TileArrows from "./TileArrows"
import { createElement } from "@stackla/ugc-widgets/src/ui/core/utils/jsx-html"

export default (props: { children?: JSX.Element[] }) => (
  <div className="panel">
    <CloseIcon />
    <TileArrows />
    {props.children}
  </div>
)
