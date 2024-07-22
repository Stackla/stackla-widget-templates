import type { Sdk } from "@stackla/ugc-widgets";
import { handleTileClick } from "./tile.lib";
import {
  hideTilesView,
  loadTileExpandArrows,
  showTilesView,
} from "./widget.features";
import { BaseConfig } from "../../types/IBaseConfig";

declare const sdk: Sdk;

export function registerTileClickEventListeners<T extends BaseConfig>(
  widgetSettings: T,
) {
  const urlPattern = /^https?:\/\/.+/;

  const tiles = sdk.querySelectorAll(".ugc-tile");

  if (!tiles) {
    throw new Error("Failed to find tiles UI element");
  }

  tiles.forEach((tile: HTMLElement) => {
    const url = widgetSettings.click_through_url ?? "";
    const urlIsValid = urlPattern.test(url);

    if (urlIsValid) {
      tile.onclick = (e) => {
        handleTileClick(e, url);
      };
    }
  });
}

export function registerTileExpandListener(fn: () => void = () => {}) {
  sdk.addEventListener("tileExpand", () => {
    loadTileExpandArrows();
    hideTilesView();
    fn();
  });
}

export function registerTileClosedListener(fn: () => void = () => {}) {
  sdk.addEventListener("expandedTileClose", () => {
    showTilesView();
    fn();
  });
}

export function registerLoadListener(fn: () => void) {
  sdk.addEventListener("load", () => {
    fn();
  });
}
