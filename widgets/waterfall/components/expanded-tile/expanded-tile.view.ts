import { Sdk } from "@stackla/ugc-widgets";
import { getTimephrase } from "../../../libs/tile.lib";
import { getConfig } from "../../widget.config";

declare const sdk : Sdk;

export const expandedTileView = async () => {
    const widgetContainer = sdk.placement.getWidgetContainer();
    const widgetSettings = getConfig(widgetContainer);
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
}