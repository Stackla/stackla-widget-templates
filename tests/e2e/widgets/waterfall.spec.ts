import { test } from "@playwright/test"
import { visitWidget, setupUncaughtExceptionHandler } from "../helpers/widget-helpers"
import { shouldExpandTile } from "../helpers/expanded-tile-helpers"
import { shouldLoadShareMenu } from "../helpers/share-menu-helpers"

const WIDGET_TYPE = "waterfall"

test.describe("Should test the waterfall", () => {
  test.beforeEach(async ({ page }) => {
    setupUncaughtExceptionHandler(page)
    await visitWidget(page, WIDGET_TYPE)
  })

  test("Should expand tile", async ({ page }) => {
    await shouldExpandTile(page, WIDGET_TYPE)
  })

  test("Should load share icons", async ({ page }) => {
    await shouldLoadShareMenu(page, WIDGET_TYPE)
  })
})
