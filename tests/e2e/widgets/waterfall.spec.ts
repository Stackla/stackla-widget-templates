import { test } from "@playwright/test"
import { shouldExpandTile, shouldNavigateExpandedTile } from "../helpers/expanded-tile-helpers"
import { shouldLoadShareMenu } from "../helpers/share-menu-helpers"
import { shouldNavigateProducts } from "../shared-tests/products"
import { describeUgcTest } from "../helpers/ugc-test.helpers"

const WIDGET_TYPE = "waterfall"

describeUgcTest(WIDGET_TYPE, async () => {
  test("Should expand tile", async ({ page }) => {
    const expandedTile = await shouldExpandTile(page, WIDGET_TYPE)
    await shouldNavigateExpandedTile(expandedTile)
  })

  test("Should expand tile and move products left and right", async ({ page }) => {
    await shouldNavigateProducts(page, WIDGET_TYPE)
  })

  test("Should load share icons", async ({ page }) => {
    await shouldLoadShareMenu(page, WIDGET_TYPE)
  })
})
