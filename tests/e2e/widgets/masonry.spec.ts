import { test } from "@playwright/test"
import { shouldExpandTile, shouldNavigateExpandedTile } from "../assertions/expanded-tile.assert"
import { shouldLoadShareMenu } from "../assertions/share-menu.assert"
import { shouldNavigateProducts } from "../assertions/products.assert"
import { describeUgcTest } from "../utilities/ugc-test.utils"

const WIDGET_TYPE = "masonry"

describeUgcTest(WIDGET_TYPE, async () => {
  test("Should expand tile", async ({ page }) => {
    await shouldExpandTile(page, WIDGET_TYPE)
    await shouldNavigateExpandedTile(page)
  })

  test("Should expand tile and move products left and right", async ({ page }) => {
    await shouldNavigateProducts(page, WIDGET_TYPE)
  })

  test("Should load share icons", async ({ page }) => {
    await shouldLoadShareMenu(page, WIDGET_TYPE)
  })
})
