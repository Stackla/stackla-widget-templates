import { Page } from "@playwright/test"
import { shouldExpandTile } from "../helpers/expanded-tile-helpers"

export async function shouldNavigateProducts(page: Page, widgetType: string): Promise<void> {
  await shouldExpandTile(page, widgetType)

  const leftArrow = page.getByLabel("Previous product image").locator("span")

  const rightArrow = page.getByLabel("Next product image").locator("span")

  await page.getByLabel("View product: Kathmandu 1").first().waitFor({ state: "visible" })
  await rightArrow.click()

  await page.getByLabel("View product: Kathmandu 2").first().waitFor({ state: "visible" })
  await page.getByLabel("View product: Kathmandu 1").first().waitFor({ state: "hidden" })

  await leftArrow.click()
  await page.getByLabel("View product: Kathmandu 1").first().waitFor({ state: "visible" })
  await page.getByLabel("View product: Kathmandu 2").first().waitFor({ state: "hidden" })

  // move left again and it should go to the end of the list
  await leftArrow.click()
  await page.getByLabel("View product: Desna Dress").first().waitFor({ state: "visible" })
  await page.getByLabel("View product: Kathmandu 1").first().waitFor({ state: "hidden" })
}
