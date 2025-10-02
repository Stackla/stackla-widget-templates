import type { Page } from "@playwright/test"
import { getFirstTile } from "../utilities/widget.utils"

export async function clickFirstWidgetTile(page: Page, widgetType: string): Promise<void> {
  const firstTile = await getFirstTile(page, widgetType)
  await firstTile.click()
}
