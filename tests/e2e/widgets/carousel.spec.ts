import { test } from '@playwright/test'
import { visitWidget, setupUncaughtExceptionHandler, widgetSnapshot } from '../helpers/widget-helpers'
import { shouldExpandedTile, expandedTileSnapshot } from '../helpers/expanded-tile-helpers'
import { shouldLoadShareMenu } from '../helpers/share-menu-helpers'
import { shouldLoadTags } from '../helpers/tag-helpers'

const WIDGET_TYPE = 'carousel'

test.describe('Should test the carousel', () => {
  test.beforeEach(async ({ page }) => {
    setupUncaughtExceptionHandler(page)
    await visitWidget(page, WIDGET_TYPE)
  })

  test('Should show widget contents', async ({ page }) => {
    await widgetSnapshot(page, WIDGET_TYPE)
  })

  test('Should expand tile', async ({ page }) => {
    await shouldExpandedTile(page, WIDGET_TYPE)
    await expandedTileSnapshot(page, WIDGET_TYPE)
  })

  test('Should load share icons', async ({ page }) => {
    await shouldLoadShareMenu(page, WIDGET_TYPE)
  })

  test('Should load tags', async ({ page }) => {
    await shouldLoadTags(page, WIDGET_TYPE)
  })
})