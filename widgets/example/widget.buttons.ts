import type { Sdk } from "@stackla/ugc-widgets";

const EVENT_LOAD_MORE = "moreLoad";
const EVENT_LOAD_LESS = "lessLoad";

declare const sdk: Sdk;

export function getLoadMoreButton() {
  const button = sdk.querySelector<HTMLButtonElement>("#load-more");

  if (!button) {
    throw new Error("Load more button not found");
  }

  return button;
}

export function getLoadLessButton() {
  const button = sdk.querySelector<HTMLButtonElement>("#load-less");

  if (!button) {
    throw new Error("Load less button not found");
  }

  return button;
}

function loadMore() {
  const loadLessButton = getLoadLessButton();
  const loadMoreButton = getLoadMoreButton();

  sdk.triggerEvent(EVENT_LOAD_MORE);

  if (sdk.tiles.hasLessPages()) {
    loadLessButton.style.display = "";
  }

  if (!sdk.tiles.hasMorePages()) {
    loadMoreButton.style.display = "none";
  }

  window.scrollTo(0, 0);
}

function loadLess() {
  const loadLessButton = getLoadLessButton();
  const loadMoreButton = getLoadMoreButton();

  sdk.triggerEvent(EVENT_LOAD_LESS);

  if (sdk.tiles.hasLessPages()) {
    loadLessButton.style.display = "";
  }

  if (!sdk.tiles.hasLessPages()) {
    loadLessButton.style.display = "none";
  }

  if (sdk.tiles.hasMorePages()) {
    loadMoreButton.style.display = "";
  }
}

export function initButtons() {
  const loadLessButton = getLoadMoreButton();
  loadLessButton.style.display = "none";
  getLoadMoreButton().onclick = loadMore;
  getLoadLessButton().onclick = loadLess;
}
