import { Page } from "@playwright/test"

export async function componentsShouldLoad(page: Page): Promise<void> {
  const components = [
    "add-to-cart.js",
    "products.js",
    "share-menu.js",
    "tags.js",
    "timephrase.js",
    "tile-content.js",
    "shopspots.js",
    "expanded-tiles.js",
    "google-analytics.js",
  ]

  // wait for get requests for each component
  await Promise.all(
    components.map(component =>
      page.waitForResponse(response => {
        return response.url().includes(component) && response.status() === 200
      })
    )
  )

  await page.waitForLoadState("networkidle")
}
