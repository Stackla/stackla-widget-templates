import type { Tile } from "@stackla/ugc-widgets"
import { IWidgetSettings } from "types/IWidgetSettings"
import { createElement } from "jsx-html"
import { UserInfo } from "./user.info"
import { Timestamp } from "./timestamp"
import { Caption } from "./captions"

export const PanelRight = ({
  tile,
  widgetSettings,
  parent,
  productsEnabled
}: {
  tile: Tile
  widgetSettings: IWidgetSettings
  parent: string
  productsEnabled: boolean
}) => {
  return (
    <div className="panel-right">
      <div className="panel-right-wrapper">
        <div className="content-wrapper">
          <div className="content-inner-wrapper">
            <UserInfo tile={tile} />
            <Timestamp tile={tile} widgetSettings={widgetSettings} />
            <Caption tile={tile} widgetSettings={widgetSettings} />
            {productsEnabled ? <ugc-products parent={parent}></ugc-products> : null}
            <div className="sharethis-inline-share-buttons"></div>
            <div className="footer">
              <span className="base-v2 source source-instagram">
                <i className="fs fs-instagram"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
