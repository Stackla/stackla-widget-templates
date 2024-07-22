import type { Sdk, Tile } from "@stackla/ugc-widgets";

declare const sdk: Sdk;

export function handleTileClick(e: Event, widgetUrl: string) {
  const ugcTiles = sdk.tiles.tiles;

  const clickedElement = e.target as HTMLElement;
  const clickedTile = clickedElement.closest(".ugc-tile");

  if (!clickedTile) {
    throw new Error("Failed to find clicked tile");
  }

  const tileId = clickedTile.getAttribute("data-id");

  if (!tileId) {
    throw new Error("Failed to find tile ID");
  }

  const tileData: Tile = ugcTiles[tileId];

  const tileLink = widgetUrl || tileData.original_url || tileData.original_link;

  if (tileLink) {
    window.open(tileLink, "_blank");
  }
}

export function getTimephrase(timestamp: number) {
  if (!timestamp) {
    return "just now";
  }
  const now = Math.round(new Date().getTime() / 1000);
  const then = Math.round(timestamp);
  if (isNaN(then)) {
    return "a while ago";
  }
  const diff = now - then;
  let timeNumber = diff;
  let timeWord = "";

  if (diff >= 2592000) {
    timeNumber = Math.round(diff / 2592000);
    timeWord = "month";
  } else if (diff >= 604800) {
    timeNumber = Math.round(diff / 604800);
    timeWord = "week";
  } else if (diff >= 86400) {
    timeNumber = Math.round(diff / 86400);
    timeWord = "day";
  } else if (diff >= 3600) {
    timeNumber = Math.round(diff / 3600);
    timeWord = "hour";
  } else if (diff >= 60) {
    timeNumber = Math.round(diff / 60);
    timeWord = "minute";
  } else if (diff > 0) {
    timeNumber = diff;
    timeWord = "second";
  } else {
    return "just now";
  }

  if (timeNumber !== 1) {
    timeWord += "s";
  }
  return timeNumber + " " + timeWord + " ago";
}
