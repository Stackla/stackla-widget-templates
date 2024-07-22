import type { Sdk } from "@stackla/ugc-widgets";
import { initButtons } from "./widget.buttons";
import { loadListeners } from "./widget.listeners";

declare const sdk: Sdk;

sdk.addLoadedComponents([
  "expanded-tile",
  "products",
  "shopspots",
  "add-to-cart",
  "cross-sellers",
]);

initButtons();
loadListeners();

sdk.tiles.setVisibleTilesCount(5);
sdk.tiles.setLoadMode("page");
sdk.tiles.hideBrokenTiles = true;
sdk.tiles.preloadImages = true;
