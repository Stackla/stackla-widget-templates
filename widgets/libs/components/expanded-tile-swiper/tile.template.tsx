import type { Sdk } from "@stackla/ugc-widgets"
import { Tile } from "@stackla/ugc-widgets"
import { getTimephrase } from "@libs/tile.lib"
import { createElement, createFragment } from "jsx-html"
import { Tags } from "@libs/templates/tags/tags.lib"
import { getConfig } from "@widgets/carousel/widget.config"
import { ShareMenu } from "@libs/templates/share-menu/share-menu.lib"

export type ExpandedTileProps = {
  sdk: Sdk
  tile: Tile
}

type ShopspotProps = {
  shopspotEnabled: boolean
  parent?: string
  tileId: string
}

export function ExpandedTile({ sdk, tile }: ExpandedTileProps) {
  const widgetContainer = sdk.placement.getWidgetContainer()
  const widgetSettings = getConfig(widgetContainer)
  const shopspotEnabled = sdk.isComponentLoaded("shopspots") && widgetSettings.expanded_tile_show_shopspots
  const productsEnabled = sdk.isComponentLoaded("products") && widgetSettings.expanded_tile_show_products
  const tagsEnabled = widgetSettings.expanded_tile_show_tags
  const sharingToolsEnabled = widgetSettings.expanded_tile_show_sharing
  const timestampEnabled = widgetSettings.expanded_tile_show_timestamp
  const captionsEnabled = widgetSettings.expanded_tile_show_caption

  const parent = sdk.getNodeId()

  return (
    <div class="panel">
      <div class="panel-overlay"></div>
      <div class="panel-left">
        <div class="image-wrapper">
          <div class="image-wrapper-inner">
            {tile.media === "video" ? (
              <>
                <VideoTemplate tile={tile} />
                <VideoErrorFallback tile={tile} parent={parent} />
              </>
            ) : tile.media === "image" ? (
              <ImageTemplate
                tile={tile}
                image={tile.image}
                productsEnabled={productsEnabled}
                shopspotEnabled={shopspotEnabled}
                parent={parent}
              />
            ) : (
              <></>
            )}
            <div>
              <span class="source">
                <i class={"fs fs-" + tile.source}></i>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-right">
        <div class="panel-right-wrapper">
          <div class="content-wrapper">
            <div class="content-inner-wrapper">
              <button class="share-button">
                <span class="widget-icon icon-share" alt="Share button"></span>
              </button>
              {sharingToolsEnabled && <ShareMenu tile={tile} />}
              <div class="user-info-wrapper">
                <UserInfoTemplate tile={tile} />
              </div>
              <div class="description">
                {captionsEnabled && (
                  <div class="caption">
                    <p class="caption-paragraph">{tile.message}</p>
                  </div>
                )}
                {timestampEnabled && (
                  <div class="tile-timestamp">{tile.source_created_at && getTimephrase(tile.source_created_at)}</div>
                )}
                {tagsEnabled && <Tags tile={tile} />}
                {productsEnabled && (
                  <>
                    <ugc-products parent={parent} tile-id={tile.id} />
                  </>
                )}
                <div class="footer">
                  <span class="base-v2 source source-instagram">
                    <i class="fs fs-instagram"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function UserInfoTemplate({ tile }: { tile: Tile }) {
  const tileAvatar = tile.avatar ? (
    <span class="avatar-wrapper">
      <a class="avatar-link" href={tile.original_url} target="_blank">
        <img src={tile.avatar} />
      </a>
    </span>
  ) : (
    <></>
  )
  const tileUser = tile.user ? (
    <a class="user-link" href={tile.original_url} target="_blank">
      <span class="user-name">{tile.user}</span>
      <span class="user-handle">@{tile.user}</span>
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
  productsEnabled,
  shopspotEnabled,
  parent
}: {
  tile: Tile
  image: string
  productsEnabled: boolean
  shopspotEnabled: ShopspotProps["shopspotEnabled"]
  parent: ShopspotProps["parent"]
}) {
  return image ? (
    <>
      <div class="image-filler" style={{ "background-image": `url('${image}')` }}></div>
      <div class="image">
        <span class="youtube-reels-icon"></span>
        <span class="instagram-icon"></span>
        {productsEnabled ? <span class="product-bag-icon" aria-label="Product bag icon"></span> : <></>}
        <ShopSpotTemplate shopspotEnabled={shopspotEnabled} parent={parent} tileId={tile.id} />
        <img class="image-element" src={image} loading="lazy" alt={tile.description || "Image"} />
        <div class="swiper-lazy-preloader swiper-lazy-preloader-black"></div>
      </div>
    </>
  ) : (
    <></>
  )
}

function VideoTemplate({ tile }: { tile: Tile }) {
  const additionalAttrs: Record<string, string> = {}
  const sourceAttrs: Record<string, string> = {}

  // handle unplayable tiktok source
  // TODO handle vide_source "tiktok"
  if (tile.source === "tiktok" || tile.video_source === "tiktok") {
    return <TiktokRenderTemplate tile={tile} />
  }

  if (tile.source === "youtube") {
    const youtubeId = tile.youtube_id as string
    const src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1`
    const title = tile.title as string
    return <YoutubeRenderTemplate src={src} title={title} />
  }

  if (tile.source === "twitter") {
    const { standard_resolution } = tile.video
    sourceAttrs["src"] = standard_resolution.url
  } else if (!tile.video_files?.length) {
    return <></>
  } else {
    const { url, width, height, mime } = tile.video_files[0]
    sourceAttrs["src"] = url
    sourceAttrs["width"] = width.toString()
    sourceAttrs["height"] = height.toString()
    sourceAttrs["type"] = mime
  }

  return (
    <div class="video-content-wrapper">
      <div class="image-filler" style={{ "background-image": `url('${tile.original_image_url}')` }}></div>
      <video
        tileid={tile.id}
        class="video-content"
        controls
        autoplay
        preload="auto"
        playsinline="playsinline"
        oncanplay="this.muted=true"
        {...additionalAttrs}>
        <source {...sourceAttrs} />
      </video>
    </div>
  )
}

function TiktokRenderTemplate({ tile }: { tile: Tile }) {
  return <iframe class="yt-video-frame" frameborder="0" allowfullscreen srcdoc={tile.full_embed_html} />
}

function YoutubeRenderTemplate({ src, title = "" }: { src: string; title?: string }) {
  return (
    <iframe
      class="yt-video-frame"
      src={src}
      title={title}
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen></iframe>
  )
}

function VideoErrorFallback({ tile, parent }: { tile: Tile; parent?: string }) {
  const originalImageUrl = tile.original_image_url as string
  return (
    <div class="video-fallback-content hidden">
      <a href={tile.original_url} target="_blank">
        <ImageTemplate
          parent={parent}
          image={originalImageUrl}
          tile={tile}
          productsEnabled={false}
          shopspotEnabled={false}
        />
        <div class="play-icon"></div>
      </a>
    </div>
  )
}
