import { Page, Locator, expect } from "@playwright/test"

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
}

export async function getWidget(page: Page) {
  return page.locator(WIDGET_ID)
}

/**
 * Get the first tile for a given widget type
 */
export async function getFirstTile(page: Page, widgetType: string): Promise<Locator> {
  const shadowRoot = await getWidget(page)
  const firstTile = shadowRoot.locator(`${getUgcTileSelectorByWidgetType(widgetType)}`)

  await expect(firstTile.first()).toHaveAttribute("expanded-listener", "true")

  return firstTile.first()
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
