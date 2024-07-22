declare const sdk: Sdk;

import { getConfig } from "./widget.config";
import type { Sdk } from "@stackla/ugc-widgets";
import {
  initializeMasonry,
  loadMoreMasonryTiles,
  refreshMasonryLayout,
} from "../libs/extensions/masonry.extension";
import {
  addAutoAddTileFeature,
  addLoadMoreButtonFeature,
  addTilesPerPageFeature,
  loadExpandedTileFeature,
  loadHoverTile,
  loadTitle,
} from "widgets/libs/widget.features";
import { loadExpandSettingComponents } from "widgets/libs/widget.components";
import { IWidgetSettings } from "types/IWidgetSettings";
import customExpandedTileTemplate from "./components/expanded-tile/base.template.hbs";
import customExpandedTileCSS from "./components/expanded-tile/base.scss";
import customProductsCSS from "./components/products/base.scss";
import shopspotStyle from "./components/shopspot-icon/base.scss";
import getCSSVariables from "../libs/css-variables";
import { addCSSVariablesToPlacement } from "widgets/libs/widget.layout";
import { onTileClose } from "./widget.listeners";
import { getTimephrase } from "widgets/libs/tile.lib";

sdk.tiles.setLoadMode("all");
sdk.tiles.hideBrokenTiles = true;
sdk.tiles.preloadImages = true;

const widgetContainer = sdk.placement.getWidgetContainer();
const widgetSettings = getConfig(widgetContainer);

const showWidget = widgetContainer.enabled;

if (!showWidget) {
  throw new Error("Widget is not enabled");
}

loadTitle();
loadExpandSettingComponents(widgetSettings);
loadHoverTile<IWidgetSettings>(widgetSettings);
addAutoAddTileFeature<IWidgetSettings>(widgetSettings);
loadExpandedTileFeature(widgetSettings, () => {}, onTileClose);
addTilesPerPageFeature<IWidgetSettings>(widgetSettings);
addLoadMoreButtonFeature<IWidgetSettings>(widgetSettings);
addCSSVariablesToPlacement(getCSSVariables(widgetSettings));

sdk.addEventListener("load", () => initializeMasonry());
sdk.addEventListener("moreLoad", () => loadMoreMasonryTiles());
sdk.addEventListener("tilesUpdated", () => refreshMasonryLayout());

sdk.addCSSToComponent(customExpandedTileCSS, "expanded-tile");
sdk.addCSSToComponent(customProductsCSS, "ugc-products");
sdk.addCSSToComponent(shopspotStyle, "shopspot-icon");

sdk.addTemplateToComponent(customExpandedTileTemplate, async () => {
  const tile = sdk.tiles.getTile();

  return {
    shopspotEnabled: sdk.isComponentLoaded('shopspots'),
    productsEnabled: sdk.isComponentLoaded('products'),
    parent: sdk.getNodeId() || '',
    tile: sdk.tiles.getTile(),
    showTimestamp: tile && tile.source_created_at && widgetSettings.expanded_tile_show_timestamp,
    timephrase: tile && getTimephrase(tile.source_created_at),
    showCaption: tile && tile.message && widgetSettings.expanded_tile_show_caption,
    showSharing: widgetSettings.expanded_tile_show_sharing
  }
},
"expanded-tile");
