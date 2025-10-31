import { ISdk, Tile } from "@stackla/widget-utils/types"
import { createElement, createFragment } from "@stackla/widget-utils"
import { VideoContainer, VideoErrorFallbackTemplate } from "@widgets/samples/expanded-tile/video.templates"
import { ExpandedTileProps, ShopspotProps } from "@widgets/samples/tile.template"

declare const sdk: ISdk

export async function togglePlayPause() {
  const expandedTiles = sdk.getExpandedTiles()
  const activeSlide = expandedTiles.querySelector(".ugc-tile.swiper-slide-active")
  const video = activeSlide?.querySelector<HTMLVideoElement>("video")
  const pauseButton = activeSlide?.querySelector(".pause-video")
  const playButton = activeSlide?.querySelector(".play-video")

  if (video?.paused) {
    void video?.play()
    pauseButton?.classList.remove("hidden")
    playButton?.classList.add("hidden")
  } else {
    void video?.pause()
    pauseButton?.classList.add("hidden")
    playButton?.classList.remove("hidden")
  }
}

export function StoryControls({ video }: { video: boolean }) {
  return (
    <div class="story-controls">
      {video ? (
        <>
          <a class="icon-story-video-pause pause-video" onClick={togglePlayPause} />
          <a class="icon-story-video-play play-video hidden" onClick={togglePlayPause} />
        </>
      ) : (
        <></>
      )}
      <a class="exit widget-icon close-cross" href="javascript:void(0);"></a>
    </div>
  )
}

export function VerticalExpandedTile({ tile }: ExpandedTileProps) {
  const { show_shopspots, show_products, show_timestamp } = sdk.getExpandedTileConfig()

  const shopspotEnabled = sdk.isComponentLoaded("shopspots") && show_shopspots && !!tile.hotspots?.length

  let productsEnabled = false

  if (sdk.isComponentLoaded("products") && show_products && sdk.getProductTagsFromTile(tile)?.length) {
    productsEnabled = true
  }

  const sharingToolsEnabled = false

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
            {tile.media === "video" ? <StoryControls video={true} /> : <StoryControls video={false} />}

            {tile.media === "video" ? (
              <>
                <VideoContainer controls={false} shopspotEnabled={shopspotEnabled} tile={tile} sdk={sdk} />
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
    </>
  )
}

export function IconSection({ tile }: { tile: Tile }) {
  const parent = sdk.getNodeId()
  const bottomSectionIconContent = []

  bottomSectionIconContent.push(
    <inline-products
      navigation-arrows={"true"}
      parent={parent}
      tile-id={tile.id}
      mode={"swiper"}
      context={"story-expanded"}
      widgetId={sdk.getWidgetId()}
    />
  )

  return (
    <div class="icon-section">
      <div class="bottom-section">{...bottomSectionIconContent}</div>
    </div>
  )
}

export function ShopSpotTemplate({ shopspotEnabled, parent, tileId }: ShopspotProps) {
  return shopspotEnabled ? (
    <>
      <shopspot-icon
        widgetId={sdk.getWidgetId()}
        parent={parent}
        mode="expanded"
        tile-id={tileId}
        show-tooltip="false"
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
