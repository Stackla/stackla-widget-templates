import type { Sdk } from "@stackla/ugc-widgets";
import { getConfig } from "./widget.config";
import expandedTileTemplate from "./components/expanded-tile/base.template.hbs";
import expandedTileStyle from "./components/expanded-tile/base.scss";
import productsStyle from "./components/products/base.scss";
import shopspotStyle from "./components/shopspot-icon/base.scss";
import {
  hideGlideArrows,
  initializeGlideListeners,
  showGlideArrows,
} from "./widget.extensions";
import { registerLoadListener } from "widgets/libs/tile.listeners";
import {
  addAutoAddTileFeature,
  loadExpandedTileFeature,
  loadHoverTile,
  loadTitle,
} from "widgets/libs/widget.features";
import { addCSSVariablesToPlacement } from "widgets/libs/widget.layout";
import { IWidgetSettings } from "types/IWidgetSettings";
import getCSSVariables from "widgets/libs/css-variables";
import { getTimephrase } from "widgets/libs/tile.lib";

declare const sdk: Sdk;
sdk.tiles.preloadImages = true;
sdk.tiles.setLoadMode("page");
sdk.tiles.setVisibleTilesCount(100);

const widgetContainer = sdk.placement.getWidgetContainer();
const widgetSettings = getConfig(widgetContainer);

if (!widgetSettings.enabled) {
  throw new Error("Widget is not enabled");
}

// Add CSS variables to placement
addCSSVariablesToPlacement(getCSSVariables(widgetSettings));

// Load features
loadTitle();

// Load listeners
registerLoadListener(() => initializeGlideListeners());

// Add features
addAutoAddTileFeature<IWidgetSettings>(widgetSettings);
loadExpandedTileFeature<IWidgetSettings>(
  widgetSettings,
  () => hideGlideArrows(),
  () => showGlideArrows(),
);

loadHoverTile<IWidgetSettings>(widgetSettings);

// Add styles and templates to components
sdk.addCSSToComponent(expandedTileStyle, "expanded-tile");
sdk.addCSSToComponent(productsStyle, "ugc-products");
sdk.addCSSToComponent(shopspotStyle, "shopspot-icon");

sdk.addTemplateToComponent(expandedTileTemplate, async () => {
  const tile = sdk.tiles.getTile();
  return {
    shopspotEnabled: sdk.isComponentLoaded('shopspots'),
    productsEnabled: sdk.isComponentLoaded('products'),
    parent: sdk.getNodeId() || '',
    tile: sdk.tiles.getTile(),
    showTimestamp: tile && tile.source_created_at && widgetSettings.expanded_tile_show_timestamp,
    timephrase: tile && getTimephrase(tile.source_created_at),
    showCaption: tile && tile.message && widgetSettings.expanded_tile_show_caption,
    showSharing: widgetSettings.expanded_tile_show_sharing,
  }
},"expanded-tile");
