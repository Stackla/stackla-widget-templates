import { ISdk, Tile } from "@stackla/widget-utils/types"
import { createElement, createFragment } from "@stackla/widget-utils/jsx"
import {
  ExpandedTileProps,
  VideoContainer,
  VideoErrorFallbackTemplate,
  ShopspotProps
} from "@stackla/widget-utils/components"

declare const sdk: ISdk

export function ExpandedTile({ tile }: ExpandedTileProps) {
  const { show_shopspots, show_products, show_tags, show_sharing, show_caption, show_timestamp } =
    sdk.getExpandedTileConfig()

  const shopspotEnabled = sdk.isComponentLoaded("shopspots") && show_shopspots && !!tile.hotspots?.length
  const productsEnabled = sdk.isComponentLoaded("products") && show_products && !!tile.tags_extended?.length
  const tagsEnabled = show_tags
  const sharingToolsEnabled = show_sharing

  const parent = sdk.getNodeId()

  return (
    <>
      <div class="panel">
        <div class="panel-left">
          <IconSection tile={tile} productsEnabled={productsEnabled} />
          <div class="image-wrapper">
            <div class="image-wrapper-inner">
              {tile.media === "video" ? (
                <>
                  <VideoContainer sdk={sdk} shopspotEnabled={shopspotEnabled} tile={tile} />
                  <VideoErrorFallbackTemplate sdk={sdk} tile={tile} />
                </>
              ) : tile.media === "image" ? (
                <ImageTemplate tile={tile} image={tile.image} shopspotEnabled={shopspotEnabled} parent={parent} />
              ) : tile.media === "text" ? (
                <span class="content-text">{tile.message}</span>
              ) : tile.media === "html" ? (
                <span class="content-html">{tile.html}</span>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div class="panel-right">
          <div class="panel-right-wrapper">
            <div class="content-wrapper">
              <div class="content-inner-wrapper">
                <tile-content
                  widgetId={sdk.getWidgetId()}
                  tileId={tile.id}
                  render-share-menu={sharingToolsEnabled}
                  render-caption={show_caption}
                  render-timephrase={show_timestamp}
                />
                {tagsEnabled && (
                  <tile-tags tile-id={tile.id} mode="swiper" context="expanded" navigation-arrows="true" />
                )}
                {productsEnabled && (
                  <>
                    <ugc-products widgetId={sdk.getWidgetId()} parent={parent} tile-id={tile.id} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function IconSection({ tile, productsEnabled }: { tile: Tile; productsEnabled: boolean }) {
  const topSectionIconContent = []
  const bottomSectionIconContent = []

  if (tile.attrs?.includes("instagram.reel")) {
    topSectionIconContent.push(<div class="content-icon icon-reel"></div>)
  } else if (tile.attrs?.includes("youtube.short")) {
    topSectionIconContent.push(<div class="content-icon icon-youtube-short"></div>)
  }
  if (productsEnabled) {
    topSectionIconContent.push(<div class="shopping-icon icon-products"></div>)
  }

  bottomSectionIconContent.push(<div class={`network-icon icon-${tile.source}`}></div>)

  return (
    <div class="icon-section">
      <div class="top-section">{...topSectionIconContent}</div>
      <div class="bottom-section">{...bottomSectionIconContent}</div>
    </div>
  )
}

export function ShopSpotTemplate({ shopspotEnabled, parent, tileId }: ShopspotProps) {
  return shopspotEnabled ? (
    <>
      <shopspot-icon parent={parent} mode="expanded" tile-id={tileId} widgetId={sdk.getWidgetId()} />
    </>
  ) : (
    <></>
  )
}

export function ImageTemplate({
  tile,
  image,
  shopspotEnabled = false,
  parent
}: {
  tile: Tile
  image: string
  shopspotEnabled?: boolean
  parent?: string
}) {
  return image ? (
    <>
      <div class="image-filler blurred" style={{ "background-image": `url('${image}')` }}></div>
      <div class="image">
        {shopspotEnabled ? (
          <ShopSpotTemplate sdk={sdk} shopspotEnabled={shopspotEnabled} parent={parent} tileId={tile.id} />
        ) : (
          <></>
        )}
        <img class="image-element" src={image} loading="lazy" alt={tile.description || "Image"} />
      </div>
    </>
  ) : (
    <></>
  )
}
