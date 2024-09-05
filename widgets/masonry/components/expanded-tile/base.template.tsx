import type { Sdk, Tile } from "@stackla/ugc-widgets"
import { getConfig } from "../../widget.config"
import { getTimephrase } from "../../../libs/tile.lib"
import { createElement, createFragment } from "jsx-html"
import { IWidgetSettings } from "types/IWidgetSettings"

declare const sdk: Sdk

function ExitButton() {
  return (
    <a className="exit" href="#">
      <span className="widget-icon close"></span>
    </a>
  )
}

function TileArrows() {
  return (
    <div className="tile-arrows">
      <button className="tile-arrows-btn tile-arrows-left">
        <span className="widget-icon chevron-left"></span>
      </button>
      <button className="tile-arrows-btn tile-arrows-right">
        <span className="widget-icon chevron-right"></span>
      </button>
    </div>
  )
}

function ImageWrapper({ tile, shopspotEnabled, parent }: { tile: Tile; shopspotEnabled: boolean; parent: string }) {
  return (
    <div className="image-wrapper">
      <div className="image-wrapper-inner">
        <div className="image">
          {shopspotEnabled ? <shopspot-flyout parent={parent}></shopspot-flyout> : null}
          {shopspotEnabled ? <shopspot-icon parent={parent} /> : null}
          {tile.image ? <img className="image-element" src={tile.image} /> : null}
        </div>
      </div>
    </div>
  )
}

function UserInfo({ tile }: { tile: Tile }) {
  return (
    <div className="user-info-wrapper">
      <div className="user-info">
        {tile.avatar ? (
          <span className="avatar-wrapper">
            <a className="avatar-link" href={tile.original_url} target="_blank" rel="noopener noreferrer">
              <img src={tile.avatar} alt="User Avatar" />
            </a>
          </span>
        ) : (
          <></>
        )}
        {tile.user ? (
          <a className="user-link" href={tile.original_url} target="_blank" rel="noopener noreferrer">
            <div className="user-top">
              <span className="user-name">{tile.user}</span>
            </div>
            <div className="user-bottom">
              <span className="user-handle">@{tile.user}</span>
            </div>
          </a>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

function Timestamp({ tile, widgetSettings }: { tile: Tile; widgetSettings: IWidgetSettings }) {
  return (
    <div className="tile-timestamp">
      {tile.source_created_at && widgetSettings.expanded_tile_show_timestamp
        ? getTimephrase(tile.source_created_at)
        : ""}
    </div>
  )
}

function SharingButtons({ tile }: { tile: Tile }) {
  const platforms = [
    { name: "facebook", url: "https://static.addtoany.com/buttons/facebook.svg" },
    { name: "x", url: "https://static.addtoany.com/buttons/x.svg" },
    { name: "pinterest", url: "https://static.addtoany.com/buttons/pinterest.svg" },
    { name: "linkedin", url: "https://static.addtoany.com/buttons/linkedin.svg" },
    { name: "email", url: "https://static.addtoany.com/buttons/email.svg" }
  ]

  return (
    <div className="ugc-inline-share-buttons">
      {platforms.map(platform => (
        <a
          key={platform.name}
          href={`https://www.addtoany.com/add_to/${platform.name}?linkurl=${tile.original_url}&linkname=${tile.name}`}
          target="_blank"
          rel="noopener noreferrer">
          <img
            src={platform.url}
            width="32"
            height="32"
            style={{ backgroundColor: "#333" }}
            alt={`Share on ${platform.name}`}
          />
        </a>
      ))}
    </div>
  )
}

function Caption({ tile, widgetSettings }: { tile: Tile; widgetSettings: IWidgetSettings }) {
  return (
    <div className="caption">
      <p className="caption-paragraph">
        {tile.message && widgetSettings.expanded_tile_show_caption ? tile.message : ""}
      </p>
      {widgetSettings.expanded_tile_show_sharing ? <SharingButtons tile={tile} /> : null}
    </div>
  )
}

function PanelLeft({ tile, shopspotEnabled, parent }: { tile: Tile; shopspotEnabled: boolean; parent: string }) {
  return (
    <div className="panel-left">
      <ImageWrapper tile={tile} shopspotEnabled={shopspotEnabled} parent={parent} />
      <div>
        <span className="source">
          <i className={`fs fs-${tile.source}`}></i>
        </span>
      </div>
    </div>
  )
}

function PanelRight({
  tile,
  widgetSettings,
  parent,
  productsEnabled
}: {
  tile: Tile
  widgetSettings: IWidgetSettings
  parent: string
  productsEnabled: boolean
}) {
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

export default function initializeQuadrant() {
  const widgetContainer = sdk.placement.getWidgetContainer()
  const widgetSettings = getConfig(widgetContainer)
  const tile = sdk.tiles.getTile()

  if (!tile) {
    throw new Error("Failed to find expanded tile")
  }

  const shopspotEnabled = sdk.isComponentLoaded("shopspots") && widgetSettings.expanded_tile_show_shopspots
  const productsEnabled = sdk.isComponentLoaded("products") && widgetSettings.expanded_tile_show_products
  const parent = sdk.getNodeId()

  if (!parent) {
    throw new Error("Failed to find parent node")
  }

  return (
    <div className="panel">
      <ExitButton />
      <TileArrows />
      <PanelLeft tile={tile} shopspotEnabled={shopspotEnabled} parent={parent} />
      <PanelRight tile={tile} widgetSettings={widgetSettings} parent={parent} productsEnabled={productsEnabled} />
    </div>
  )
}
