import { ISdk, Tile } from "@stackla/widget-utils/types"
import { createElement, createFragment } from "@stackla/widget-utils"
import { VideoContainer, VideoErrorFallbackTemplate } from "@widgets/samples/expanded-tile/video.templates"
import { ExpandedTileProps, ShopspotProps } from "@widgets/samples/tile.template"

declare const sdk: ISdk

export function StoryExpandedTile({ tile }: ExpandedTileProps) {
  const { show_shopspots, show_products, show_sharing, show_timestamp } = sdk.getExpandedTileConfig()

  const shopspotEnabled = sdk.isComponentLoaded("shopspots") && show_shopspots && !!tile.hotspots?.length

  let productsEnabled = false

  if (sdk.isComponentLoaded("products") && show_products && sdk.getProductTagsFromTile(tile)?.length) {
    productsEnabled = true
  }

  const sharingToolsEnabled = show_sharing

  return (
    <>
      <div class="panel-active">
        <div class="overlay"></div>
        <AutoplayProgress />
        <tile-content
          widgetId={sdk.getWidgetId()}
          tileId={tile.id}
          render-share-menu={sharingToolsEnabled}
          render-description="false"
          render-caption="false"
          mode="custom"
          render-timephrase={show_timestamp}
          render-header-timephrase="true"
          render-products-icon={productsEnabled}
        />
        <IconSection tile={tile} />
        <div class="image-wrapper">
          <div class="image-wrapper-inner">
            {tile.media === "video" ? (
              <>
                <VideoContainer sdk={sdk} shopspotEnabled={shopspotEnabled} tile={tile} />
                <VideoErrorFallbackTemplate sdk={sdk} tile={tile} />
              </>
            ) : tile.media === "image" ? (
              <ImageTemplate tile={tile} image={tile.image} shopspotEnabled={shopspotEnabled} />
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
      <div class="ugc-products-wrap" data-tile-id={tile.id}>
        <ugc-products widgetId={sdk.getWidgetId()} tile-id={tile.id} down-icon={true}></ugc-products>
      </div>
    </>
  )
}

export function IconSection({ tile }: { tile: Tile }) {
  const topSectionIconContent = []
  const bottomSectionIconContent = []
  const parent = sdk.getNodeId()

  if (tile.attrs?.includes("instagram.reel")) {
    topSectionIconContent.push(<div class="content-icon icon-reel"></div>)
  } else if (tile.attrs?.includes("youtube.short")) {
    topSectionIconContent.push(<div class="content-icon icon-youtube-short"></div>)
  }

  bottomSectionIconContent.push(<div class={`network-icon icon-${tile.source}`}></div>)
  bottomSectionIconContent.push(
    <inline-products parent={parent} tile-id={tile.id} mode={"swiper"} context={"story-expanded"} />
  )
  bottomSectionIconContent.push(
    <div class="story-expanded-bottom-section">
      <tile-tags
        widgetId={sdk.getWidgetId()}
        tile-id={tile.id}
        variant="dark"
        mode="swiper"
        clickable="false"
        context="storyline-expanded-inline"></tile-tags>
    </div>
  )

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
      <shopspot-icon
        parent={parent}
        mode="expanded"
        tile-id={tileId}
        show-tooltip="false"
        widgetId={sdk.getWidgetId()}
      />
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
      <div class="image-filler" style={{ "background-image": `url('${image}')` }}></div>
      <div class="image">
        {shopspotEnabled ? (
          <ShopSpotTemplate sdk={sdk} shopspotEnabled={shopspotEnabled} parent={parent} tileId={tile.id} />
        ) : (
          <></>
        )}
      </div>
    </>
  ) : (
    <></>
  )
}

function AutoplayProgress() {
  return (
    <div class="story-progress-wrapper">
      <div class="story-autoplay-progress">
        <div class="progress-content"></div>
      </div>
    </div>
  )
}
