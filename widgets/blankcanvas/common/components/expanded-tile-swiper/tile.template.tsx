import { ISdk, Tile, createElement, createFragment } from "@stackla/widget-utils"

export type ExpandedTileProps = {
  sdk: ISdk
  tile: Tile
}

type ShopspotProps = {
  shopspotEnabled: boolean
  parent?: string
  tileId: string
}

export function ExpandedTile({ sdk, tile }: ExpandedTileProps) {
  const { show_shopspots, show_products, show_tags, show_sharing } = sdk.getExpandedTileConfig()

  const shopspotEnabled = sdk.isComponentLoaded("shopspots") && show_shopspots && !!tile.hotspots?.length
  const productsEnabled = sdk.isComponentLoaded("products") && show_products && !!tile.tags_extended?.length
  const tagsEnabled = show_tags
  const sharingToolsEnabled = show_sharing

  const parent = sdk.getNodeId()

  return (
    <>
      <div class="panel">
        <div class="panel-overlay"></div>
        <div class="panel-left">
          <RenderIconSection tile={tile} productsEnabled={productsEnabled} />
          <div class="image-wrapper">
            <div class="image-wrapper-inner">
              {tile.media === "video" ? (
                <>
                  <VideoTemplate tile={tile} parent={parent} />
                  <RenderVideoErrorFallbackTemplate tile={tile} />
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
                <tile-content tileId={tile.id} render-share-menu={sharingToolsEnabled} />
                {tagsEnabled && <tile-tags tile-id={tile.id} />}
                {productsEnabled && (
                  <>
                    <ugc-products parent={parent} tile-id={tile.id} />
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

function RenderIconSection({ tile, productsEnabled }: { tile: Tile; productsEnabled: boolean }) {
  const topSectionIconContent = []
  const bottomSectionIconContent = []

  if (tile.attrs.includes("instagram.reel")) {
    topSectionIconContent.push(<div class="content-icon icon-reel"></div>)
  } else if (tile.attrs.includes("youtube.short")) {
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

function ShopSpotTemplate({ shopspotEnabled, parent, tileId }: ShopspotProps) {
  return shopspotEnabled ? (
    <>
      <shopspot-icon parent={parent} mode="expanded" tile-id={tileId} />
    </>
  ) : (
    <></>
  )
}

function ImageTemplate({
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
          <ShopSpotTemplate shopspotEnabled={shopspotEnabled} parent={parent} tileId={tile.id} />
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

function VideoTemplate({ tile, parent }: { tile: Tile; parent?: string }) {
  return (
    <div class="video-content-wrapper">
      <div class="image-filler" style={{ "background-image": `url('${tile.original_image_url}')` }}></div>
      <SourceVideoContent tile={tile} parent={parent} />
    </div>
  )
}

function SourceVideoContent({ tile, parent }: { tile: Tile; parent?: string }) {
  // handle unplayable tiktok source
  // TODO handle vide_source "tiktok"
  if (tile.source === "tiktok" || tile.video_source === "tiktok") {
    return <RenderTikTokTemplate tile={tile} />
  }

  if (tile.source === "youtube") {
    return <RenderYoutubeTemplate tile={tile} />
  }

  if (tile.source === "facebook") {
    const videoUrlPattern = /videos\/(\d)+?/
    if (!tile.video_files?.length || !videoUrlPattern.test(tile.video_files[0].url)) {
      return <RenderVideoErrorFallbackTemplate tile={tile} parent={parent} defaultHidden={false} />
    }
  }

  if (tile.source === "twitter") {
    return <RenderTwitterTemplate tile={tile} />
  }

  if (tile.video_files?.length) {
    return <RenderVideoTemplate tile={tile} />
  }

  return <RenderFacebookFallbackTemplate tile={tile} />
}

function RenderVideoTemplate({ tile }: { tile: Tile }) {
  const { url, width, height, mime } = tile.video_files[0]

  return (
    <video
      muted={true}
      tileid={tile.id}
      class="video-content"
      controls
      autoplay
      preload="none"
      playsinline="playsinline"
      oncanplay="this.muted=true">
      <source src={url} width={width.toString()} height={height.toString()} type={mime} />
    </video>
  )
}

function RenderTwitterTemplate({ tile }: { tile: Tile }) {
  const { standard_resolution } = tile.video

  return (
    <video
      tileid={tile.id}
      class="video-content"
      controls
      autoplay
      preload="auto"
      playsinline="playsinline"
      oncanplay="this.muted=true">
      <source src={standard_resolution.url} />
    </video>
  )
}

function RenderTikTokTemplate({ tile }: { tile: Tile }) {
  const tiktokId = tile.original_url.split("/")[5]

  return (
    <iframe
      loading="lazy"
      class="video-content"
      frameborder="0"
      allowfullscreen
      src={`https://www.tiktok.com/player/v1/${tiktokId}`}
    />
  )
}

function RenderFacebookFallbackTemplate({ tile }: { tile: Tile }) {
  const embedBlock = (
    <div class="fb-content-wrapper">
      <div id="fb-root"></div>
      <script
        async
        defer
        crossorigin="anonymous"
        src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v21.0"></script>

      <div class="fb-video" data-href={tile.original_link} data-width="500" data-show-text="false">
        <blockquote cite={tile.original_link} class="fb-xfbml-parse-ignore">
          <a href={tile.original_link}></a>
          <p></p>Posted by <a href={`https://www.facebook.com/$${tile.source_user_id}`}>{tile.name}</a> on
          {tile.time_ago}
        </blockquote>
      </div>
    </div>
  )
  return (
    <iframe loading="lazy" class="video-content" frameborder="0" allowfullscreen srcdoc={embedBlock.innerHTML}></iframe>
  )
}

function RenderYoutubeTemplate({ tile }: { tile: Tile }) {
  const youtubeId = tile.youtube_id as string
  const src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1`
  const title = tile.title as string

  return (
    <iframe
      loading="lazy"
      class="video-content"
      src={src}
      title={title}
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen></iframe>
  )
}

function RenderVideoErrorFallbackTemplate({
  tile,
  defaultHidden = true
}: {
  tile: Tile
  parent?: string
  defaultHidden?: boolean
}) {
  const originalImageUrl = tile.original_image_url as string
  const fallbackCss = `video-fallback-content${defaultHidden ? " hidden" : ""}`

  return (
    <div class={fallbackCss}>
      <div class="center-section">
        <div class="play-icon"></div>
      </div>
      <a href={tile.original_url || tile.original_link} target="_blank">
        <ImageTemplate image={originalImageUrl} tile={tile} />
        <div class="play-icon"></div>
      </a>
    </div>
  )
}
