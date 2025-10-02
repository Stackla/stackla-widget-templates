import { setupUncaughtExceptionHandler, visitWidget } from "./widget-helpers"
import { test } from "@playwright/test"

export async function describeUgcTest(widgetType: string, testClosure: () => void) {
  test.describe(`Should test the ${widgetType}`, () => {
    test.beforeEach(async ({ page }) => {
      setupUncaughtExceptionHandler(page)
      await visitWidget(page, widgetType)
      await page.evaluate(() => localStorage.clear())
      await page.evaluate(() => sessionStorage.clear())
    })

    testClosure()
  })
}
