sdk.addLoadedComponents([
  "expanded-tile",
  "products",
  "shopspots",
  "add-to-cart",
  "cross-sellers",
  "tile-content",
  "share-menu",
  "timephrase",
  "https://code.jquery.com/jquery-3.7.1.slim.min.js"
])
sdk.tiles.preloadImages = true

const EVENT_LOAD_MORE = "moreLoad"
const loadMoreButton = sdk.querySelector("#load-more")
const buttons = sdk.querySelector("#buttons")

sdk.tiles.enableAutoAddNewTiles()

sdk.tiles.setVisibleTilesCount(10)

function loadMore() {
  sdk.triggerEvent(EVENT_LOAD_MORE)

  if (!sdk.tiles.hasMorePages()) {
    loadMoreButton.style.display = "none"
  }
}

loadMoreButton.onclick = loadMore

sdk.addEventListener("tilesUpdated", e => {
  if (sdk.tiles.hasMorePages()) {
    loadMoreButton.style.display = ""
  }
})

sdk.addEventListener("tileExpand", e => {
  buttons.style.display = "none"
})
sdk.addEventListener("expandedTileClose", e => {
  buttons.style.display = ""
})
