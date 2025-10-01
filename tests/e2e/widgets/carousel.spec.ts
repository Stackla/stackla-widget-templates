import { test } from "@playwright/test"
import { visitWidget, setupUncaughtExceptionHandler } from "../helpers/widget-helpers"
import { shouldExpandTile } from "../helpers/expanded-tile-helpers"
import { shouldLoadShareMenu } from "../helpers/share-menu-helpers"
import { shouldNavigateProducts } from "../shared-tests/products"

const WIDGET_TYPE = "carousel"

test.describe("Should test the carousel", () => {
  test.beforeEach(async ({ page }) => {
    setupUncaughtExceptionHandler(page)
    await visitWidget(page, WIDGET_TYPE)
  })

  test("Should expand tile", async ({ page }) => {
    await shouldExpandTile(page, WIDGET_TYPE)
  })

  test("Should expand tile and move products left and right", async ({ page }) => {
    await shouldNavigateProducts(page, WIDGET_TYPE)
  })

  test("Should load share icons", async ({ page }) => {
    await shouldLoadShareMenu(page, WIDGET_TYPE)
  })
})
