import type { Page } from "@playwright/test"
import { getFirstTile } from "../helpers/widget-helpers"

export async function clickFirstWidgetTile(page: Page, widgetType: string): Promise<void> {
  const firstTile = await getFirstTile(page, widgetType)
  await firstTile.click()
}
