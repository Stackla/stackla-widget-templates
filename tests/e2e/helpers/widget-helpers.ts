import { Page, Locator } from "@playwright/test"

export const WIDGET_ID = "ugc-widget-668ca52ada8fb"

/**
 * Get UGC tile selector based on widget type
 */
function getUgcTileSelectorByWidgetType(widgetType: string): string {
  switch (widgetType) {
    case "quadrant":
      return ".ugc-tile.processed"
    default:
      return ".ugc-tile"
  }
}

/**
 * Visit a widget page and wait for it to load
 */
export async function visitWidget(page: Page, widgetType: string): Promise<void> {
  // Set up network intercepts
  await page.route("**/widgets/668ca52ada8fb/draft?wid=668ca52ada8fb&limit=25&page=1&filter_id=10695", route => {
    // Allow the request to continue normally
    route.continue()
  })

  await page.route("**/widgets/668ca52ada8fb/tiles?wid=668ca52ada8fb&limit=25&page=1&filter_id=10695", route => {
    // Allow the request to continue normally
    route.continue()
  })

  // Navigate to the widget page
  await page.goto(`/preview?widgetType=${widgetType}`)

  // Wait for the widget to be present
  await page.locator(`#${WIDGET_ID}`).waitFor({ timeout: 10000 })

  // Wait for tiles to load
  const shadowRoot = page.locator(`#${WIDGET_ID}`)
  await shadowRoot.locator(getUgcTileSelectorByWidgetType(widgetType)).first().waitFor({ timeout: 10000 })

  // Wait and disable images for consistent testing
  await waitAndDisableImages(page)
}

/**
 * Wait and disable images for consistent visual testing
 */
export async function waitAndDisableImages(page: Page): Promise<void> {
  // Wait for content to load
  await page.waitForTimeout(8000)

  // Execute script to hide images and add red borders
  await page.evaluate(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const widget = (window as any).ugc.getWidgetBySelector()
    if (widget && widget.sdk) {
      const tiles = widget.sdk.querySelectorAll(".tile")
      tiles.forEach((tile: HTMLElement) => {
        tile.style.cssText = ""
        tile.style.border = "1px solid red"
      })

      const images = widget.sdk.querySelectorAll(".ugc-tile img")
      images.forEach((image: HTMLElement) => {
        image.style.visibility = "hidden"
      })
    }
  })
}

/**
 * Get the first tile for a given widget type
 */
export function getFirstTile(page: Page, widgetType: string): Locator {
  const shadowRoot = page.locator(`#${WIDGET_ID}`)
  return shadowRoot.locator(getUgcTileSelectorByWidgetType(widgetType)).first()
}

/**
 * Get the expanded tile element
 */
export function getExpandedTile(page: Page): Locator {
  const shadowRoot = page.locator(`#${WIDGET_ID}`)
  return shadowRoot.locator("expanded-tiles")
}

/**
 * Take a widget snapshot (screenshot)
 */
export async function widgetSnapshot(page: Page, widgetType: string): Promise<void> {
  await page.screenshot({
    path: `test-results/screenshots/${widgetType}-widget.png`,
    fullPage: false
  })
}

/**
 * Handle uncaught exceptions (similar to Cypress cy.on('uncaught:exception'))
 */
export function setupUncaughtExceptionHandler(page: Page): void {
  page.on("pageerror", () => {
    // Log the error but don't fail the test - similar to Cypress behavior
    // Error details are available in Playwright's built-in reporting
  })
}
