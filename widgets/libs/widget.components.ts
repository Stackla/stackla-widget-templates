import type { Sdk } from "@stackla/ugc-widgets";
import { BaseConfig } from "types/IBaseConfig";

declare const sdk: Sdk;

export function loadExpandSettingComponents<T extends BaseConfig>(
  widgetSettings: T,
) {
  if (widgetSettings.expanded_tile_show_shopspots) {
    sdk.addLoadedComponents(["shopspots"]);
  }

  sdk.addLoadedComponents(["expanded-tile", "cross-sellers"]);
  if (widgetSettings.expanded_tile_show_products) {
    sdk.addLoadedComponents(["products"]);
  }
  if (widgetSettings.expanded_tile_show_add_to_cart) {
    sdk.addLoadedComponents(["add-to-cart"]);
  }
}
