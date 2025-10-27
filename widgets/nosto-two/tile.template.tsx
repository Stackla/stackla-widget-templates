import { createElement, createFragment, ISdk, Tile } from "@stackla/widget-utils"

import { ExpandedTileProps, ShopspotProps } from "@stackla/widget-utils/components"

declare const sdk: ISdk

export function ExpandedTile({ tile }: ExpandedTileProps) {
  const { show_products } = sdk.getExpandedTileConfig()

  const productsEnabled = sdk.isComponentLoaded("products") && show_products && !!tile.tags_extended?.length

  const parent = sdk.getNodeId()

  return (
    <>
      <div class="panel">
        <div class="nosto-expandedtile-header">
          <h2>SELECT AN ITEM</h2>
        </div>
        <div class="panel-right">
          <div class="panel-right-wrapper">
            <div class="content-wrapper">
              <div class="content-inner-wrapper">
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
      <shopspot-icon widgetId={sdk.getWidgetId()} parent={parent} mode="expanded" tile-id={tileId} />
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
        <img class="image-element" src={"https://placedog.net/500"} loading="lazy" alt={tile.description || "Image"} />
      </div>
    </>
  ) : (
    <></>
  )
}
