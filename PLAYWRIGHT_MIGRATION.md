# Playwright Testing Migration

This repository has been migrated from Cypress to Playwright for E2E testing.

## Quick Start

### Running Tests

```bash
# Run all Playwright tests
npm run test:e2e

# Run tests with UI mode (debug)
npm run test:playwright:debug

# Run specific test file
npx playwright test tests/e2e/widgets/carousel.spec.ts
```

### Test Structure

All E2E tests are located in `tests/e2e/`:

```
tests/e2e/
├── helpers/                    # Shared test utilities
│   ├── widget-helpers.ts      # Core widget interaction functions
│   ├── expanded-tile-helpers.ts # Expanded tile testing
│   ├── share-menu-helpers.ts  # Share menu interactions
│   └── tag-helpers.ts         # Tag functionality testing
├── fixtures/                  # Test data and snapshots
│   └── tagsnapshot.json      # Style comparison fixture
└── widgets/                   # Widget-specific tests
    ├── carousel.spec.ts
    ├── grid.spec.ts
    ├── masonry.spec.ts
    ├── nightfall.spec.ts
    ├── quadrant.spec.ts
    ├── slider.spec.ts
    ├── storypage.spec.ts
    └── waterfall.spec.ts
```

### Configuration

- **Playwright Config**: `playwright.config.ts`
- **Test Server**: Automatically starts `npm run start:test` on localhost:4002
- **Browser**: Tests run in Chromium by default
- **Reports**: Generated in `playwright-report/` and `test-results/`

### Migration Notes

This migration preserves all original test functionality:

1. **Widget Content Tests**: Verify widget displays correctly
2. **Expanded Tile Tests**: Test tile expansion and overlay behavior
3. **Share Menu Tests**: Validate share functionality and UI interactions
4. **Tag Tests**: Ensure tag functionality and style consistency

### Key Differences from Cypress

- **Import**: Use `import { test, expect } from '@playwright/test'`
- **Page Object**: Tests receive a `page` parameter
- **Assertions**: Use `expect(element).toBeVisible()` instead of `cy.should('be.visible')`
- **Waits**: Use `await page.waitForTimeout()` sparingly (warnings are normal)
- **Shadow DOM**: Access via `page.locator('#widget').locator('selector')`

### Helper Functions

The helper functions in `tests/e2e/helpers/` provide Cypress-like functionality:

- `visitWidget(page, widgetType)` - Navigate to widget page
- `getFirstTile(page, widgetType)` - Get first widget tile
- `getExpandedTile(page)` - Get expanded tile overlay
- `setupUncaughtExceptionHandler(page)` - Handle page errors gracefully

### GitHub Actions

The CI pipeline has been updated to use Playwright:
- Installs Playwright browsers automatically
- Runs tests after building the project
- Uploads test reports and screenshots on failure

### Development Workflow

1. Start the test server: `npm run start:test`
2. Run tests: `npm run test:playwright`
3. Debug tests: `npm run test:playwright:debug`
4. View reports: `npx playwright show-report`

For more information, see the [Playwright documentation](https://playwright.dev/docs/intro).