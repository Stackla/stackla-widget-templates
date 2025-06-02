import type { Sdk, Tile, ITileContentComponent, ISdk } from "@stackla/widget-utils"
import { createElement, createFragment } from "@stackla/widget-utils/jsx"

type RenderConfig = {
  renderUserInfo: boolean
  renderAvatarImage: boolean
  renderUserTitle: boolean
  renderDescription: boolean
  renderCaption: boolean
  renderTimephrase: boolean
  renderShareMenu: boolean
}

type UserInfoTemplateProps = {
  avatar: string | null
  user: string | null
  originalUrl: string
  renderConfig: RenderConfig
}

declare const sdk: ISdk

export function TileContentTemplate(sdk: Sdk, component: ITileContentComponent) {
  const tileId = component.getTileId()
  const tile = sdk.getTileById(tileId)
  const renderConfig = component.renderConfig
  const sourceId = component.sourceId
  const mode = component.mode

  if (!tile) {
    throw new Error("No tile found")
  }

  return (
    <>
      <div class={`tile-content-wrapper ${component.mode} ${component.context}`}>
        <div class="header">
          <UserInfoTemplate
            avatar={tile.avatar}
            user={tile.user}
            originalUrl={tile.original_url || tile.original_link}
            renderConfig={renderConfig}
          />

          {renderConfig.renderShareMenu && (
            <share-menu widgetId={sdk.getWidgetId()} theme={mode} tile-id={tileId} source-id={sourceId}></share-menu>
          )}
        </div>

        <Description tile={tile} renderConfig={renderConfig} />
      </div>
    </>
  )
}

function Description({ tile, renderConfig }: { tile: Tile; renderConfig: RenderConfig }) {
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
        <time-phrase widgetId={sdk.getWidgetId()} source-created-at={tile.source_created_at}></time-phrase>
      )}
    </div>
  )
}

function UserInfoTemplate({ avatar, user, originalUrl, renderConfig }: UserInfoTemplateProps) {
  if (!renderConfig.renderUserInfo) {
    return <></>
  }

  const tileAvatar =
    renderConfig.renderAvatarImage && avatar ? (
      <span class="avatar-wrapper">
        <a class="avatar-link" href={originalUrl} target="_blank">
          <img
            loading="lazy"
            src={avatar}
            onerror={`this.src = "https://web-assets.stackla.com/app.stackla.com/media/images/default-avatars/default-avatar.png";`}
          />
        </a>
      </span>
    ) : (
      <></>
    )
  const tileUser =
    renderConfig.renderUserTitle && user ? (
      <a class="user-link" href={originalUrl} target="_blank">
        <span class="user-name">{user}</span>
        <span class="user-handle">@{user}</span>
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
