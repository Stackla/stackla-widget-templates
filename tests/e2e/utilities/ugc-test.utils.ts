import { clickFirstWidgetTile } from "../actions/widgets"
import {
  shouldExpandTile,
  shouldHaveAvatars,
  shouldHaveTimestamps,
  shouldHaveVideo,
  shouldNavigateExpandedTile,
  shouldNotHaveVideo
} from "../assertions/expanded-tile.assert"
import { shouldNavigateProducts } from "../assertions/products.assert"
import { shouldLoadShareMenu } from "../assertions/share-menu.assert"
import { componentsShouldLoad } from "../assertions/widget.assert"
import { setupUncaughtExceptionHandler, visitWidget } from "./widget.utils"
import { test } from "@playwright/test"

/**
 *
 * @param widgetType - The widget type to test, e.g. "grid", "nightfall", etc.
 * @param testClosure - Optional additional tests to run within the describe block
 */
export async function ugcTests(widgetType: string, testClosure?: () => void) {
  test.describe(`Should test the ${widgetType}`, () => {
    test.beforeEach(async ({ page }) => {
      setupUncaughtExceptionHandler(page)
      await visitWidget(page, widgetType)
      await page.evaluate(() => localStorage.clear())
      await page.evaluate(() => sessionStorage.clear())
    })

    test("Should expand tile", async ({ page }) => {
      await componentsShouldLoad(page)
      await shouldExpandTile(page, widgetType)
      await shouldNavigateExpandedTile(page)
    })

    test("Should expand tile and move products left and right", async ({ page }) => {
      await shouldNavigateProducts(page, widgetType)
    })

    test("Should have videos in expanded tiles", async ({ page }) => {
      await clickFirstWidgetTile(page, widgetType)
      await shouldHaveVideo(page)
      await shouldNotHaveVideo(page)
    })

    test("Should load share icons", async ({ page }) => {
      await shouldLoadShareMenu(page, widgetType)
    })

    test("Should see timestamps in expanded tiles", async ({ page }) => {
      await shouldHaveTimestamps(page, widgetType)
    })

    test("Should have avatars in expanded tiles", async ({ page }) => {
      await shouldHaveAvatars(page, widgetType)
    })

    testClosure && testClosure()
  })
}
