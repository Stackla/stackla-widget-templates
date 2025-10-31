import { createElement, createFragment } from "@stackla/widget-utils/jsx"
import { ISdk, Tile } from "@stackla/widget-utils"

type RenderConfig = {
  renderUserInfo: boolean
  renderAvatarImage: boolean
  renderUserName: boolean
  renderUserHandle: boolean
  renderDescription: boolean
  renderCaption: boolean
  renderTimephrase: boolean
  renderShareMenu: boolean
}

type UserInfoTemplateProps = {
  tile: Tile
  renderConfig: RenderConfig
  sdk: ISdk
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TileContentTemplate(sdk: ISdk, component: any) {
  const tileId = component.getTileId()
  const tile = sdk.getTileById(tileId)
  const renderConfig = component.renderConfig
  const sourceId = component.sourceId
  const mode = component.mode
  const widgetId = component.getWidgetId()

  if (!tile) {
    console.warn("No tile found")
    return <></>
  }

  let shareMenuTimephraseWrapper = <></>
  const shareMenu = renderConfig.renderShareMenu ? (
    <share-menu widgetId={widgetId} theme={mode} tile-id={tileId} source-id={sourceId}></share-menu>
  ) : (
    <></>
  )
  if (renderConfig.renderHeaderTimephrase) {
    shareMenuTimephraseWrapper = (
      <div class="share-menu-timephrase-wrapper">
        <div class="share-menu-products-icon">
          {renderConfig.renderReelIcon && <div class="shopping-icon icon-reel"></div>}
          {renderConfig.renderProductsIcon && <div class="shopping-icon icon-products"></div>}
          {shareMenu}
        </div>
        <time-phrase widgetId={widgetId} source-created-at={tile.source_created_at}></time-phrase>
      </div>
    )
  } else {
    shareMenuTimephraseWrapper = shareMenu
  }

  return (
    <>
      <div class={`tile-content-wrapper ${component.mode} ${component.context}`}>
        <div class="header">
          <UserInfoTemplate sdk={component.sdk} tile={tile} renderConfig={renderConfig} />
          {shareMenuTimephraseWrapper}
        </div>

        <Description widgetId={widgetId} tile={tile} renderConfig={renderConfig} />
      </div>
    </>
  )
}

function Description({ tile, renderConfig, widgetId }: { widgetId: string; tile: Tile; renderConfig: RenderConfig }) {
  if (!renderConfig.renderDescription) {
    return <></>
  }

  return (
    <div class="description">
      {renderConfig.renderCaption && (
        <div class="caption">
          <div class="caption-paragraph">{tile.message}</div>
        </div>
      )}

      {renderConfig.renderTimephrase && (
        <time-phrase widgetId={widgetId} source-created-at={tile.source_created_at}></time-phrase>
      )}
    </div>
  )
}

function getUsernameOrTerm(tile: Tile) {
  const contentTags = tile.tags_extended?.filter(
    tag => tag.type === "content" && tag.publicly_visible && tag.tag.includes("@")
  )

  const displayedItem = tile.user ?? (tile.terms && tile.terms.length ? tile.terms[0] : "")

  return contentTags?.length ? contentTags[0].tag : `@${displayedItem.length ? displayedItem : "nosto"}`
}

function UserInfoTemplate(props: UserInfoTemplateProps) {
  const { tile, renderConfig } = props
  const { avatar, user } = tile

  if (!renderConfig.renderUserInfo) {
    return <></>
  }

  const tileAvatar = (
    <span class="avatar-wrapper">
      <a class="avatar-link" href={"javascript:void(0)"}>
        <img loading="lazy" src={avatar} />
      </a>
    </span>
  )

  const tileUser =
    user || tile.terms ? (
      <a class="user-link" href={"javascript:void(0)"}>
        <span class="user-name">{getUsernameOrTerm(tile)}</span>
      </a>
    ) : (
      <></>
    )

  return (
    <div class="user-info">
      {tileAvatar}
      {tileUser}
    </div>
  )
}
