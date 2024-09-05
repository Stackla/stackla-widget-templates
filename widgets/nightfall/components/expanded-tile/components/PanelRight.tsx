import UserInfo from "./UserInfo"
import Caption from "./Caption"
import Footer from "./Footer"
import { createElement } from "@stackla/ugc-widgets/src/ui/core/utils/jsx-html"
import { ExpandedTileProps } from "widgets/nightfall/types/ExpandedTileProps"

export default (props: ExpandedTileProps) => {
  return (
    <div class="panel-right">
      <div class="panel-right-wrapper">
        <div class="content-wrapper">
          <div class="content-inner-wrapper">
            <UserInfo {...props} />
            <Caption {...props} />
            <Footer {...props} />
          </div>
        </div>
      </div>
    </div>
  )
}
