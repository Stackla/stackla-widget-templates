# Widget Utilities

This directory contains shared TypeScript utilities to reduce code duplication across widgets.

## Inline Swiper Loader

The `inline-swiper.loader.ts` file provides a reusable utility for initializing inline swiper components across carousel and shortvideo widgets.

### Purpose

Previously, the carousel and shortvideo widgets had nearly identical swiper loader files (~142 lines each) with only minor differences in configuration parameters. This led to:
- Significant code duplication (>280 lines of duplicated code)
- Maintenance burden when updating swiper behavior
- Risk of inconsistencies when one widget is updated but not the other

### Usage

Import and call `initializeInlineSwiper` with your widget-specific configuration:

```typescript
import { Sdk } from "types"
import { initializeInlineSwiper } from "../utils/inline-swiper.loader"

declare const sdk: Sdk

export function initializeInlineSwiperListeners() {
  initializeInlineSwiper({
    widgetName: "carousel",
    widgetClass: "carousel-inline",
    swiperId: "inline-carousel",
    initialLoop: false, // optional, defaults to false
    sdk
  })
}
```

### Configuration Options

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `widgetName` | string | Widget identifier used for button naming | `"carousel"`, `"shortvideo"` |
| `widgetClass` | string | CSS class for the widget selector | `"carousel-inline"` |
| `swiperId` | string | Unique ID for the swiper instance | `"inline-carousel"` |
| `initialLoop` | boolean | Enable loop mode initially (optional, default: false) | `false` |
| `sdk` | Sdk | SDK instance | `sdk` |

### What It Does

The utility:
1. **Finds and validates** the swiper element
2. **Initializes swiper** with common configuration:
   - Responsive breakpoints (mobile, tablet, desktop)
   - Navigation buttons
   - Keyboard support
   - Mouse wheel support
   - Auto-loading of tiles
3. **Manages loading state** with visual feedback
4. **Handles navigation** with prev/next button state
5. **Observes tile loading** and updates swiper when complete

### Common Configuration Applied

- **Slides per view**: Responsive (1 on mobile, 3 on tablet, 7 on desktop)
- **Grab cursor**: Enabled for better UX
- **Touch move**: Initially disabled during loading
- **Mousewheel**: Enabled for scrolling
- **Keyboard**: Arrow key navigation enabled
- **Loop**: Configurable via `initialLoop` parameter

### Widgets Using This Utility

- **carousel**: Uses with `initialLoop: false`
- **shortvideo**: Uses with default settings (loop: false)

### Special Cases

**storyline** widget has a significantly different swiper implementation with:
- Custom `ResizeObserver` for dynamic sizing
- `getSlidesPerView()` function for responsive layout
- Custom `spaceBetween` logic based on tile size
- Different swiper parameters

Therefore, it maintains its own `inline-story-swiper.loader.ts` file.

### Benefits

- **Reduced Code**: Widget swiper loaders reduced from ~142 lines to ~13 lines
- **DRY Principle**: Single source of truth for inline swiper initialization
- **Easy Maintenance**: Update once, apply everywhere
- **Consistency**: All widgets using this utility have identical swiper behavior
- **Type Safety**: Full TypeScript support with interface definitions

### Migration Guide

If you're creating a new inline swiper widget or updating an existing one:

**Before:**
```typescript
// 142+ lines of swiper initialization code
import { initializeSwiper, refreshSwiper, ... } from "@stackla/widget-utils/extensions/swiper"
import type { Swiper } from "swiper"
// ... many more imports and functions
```

**After:**
```typescript
import { initializeInlineSwiper } from "../utils/inline-swiper.loader"

export function initializeInlineSwiperListeners() {
  initializeInlineSwiper({
    widgetName: "mywidget",
    widgetClass: "mywidget-inline",
    swiperId: "inline-mywidget",
    sdk
  })
}
```

### Testing

After implementing or updating swiper configuration:
1. Build the project: `npm run build`
2. Start the development server: `npm run start`
3. Navigate to the widget preview
4. Verify swiper navigation, loading, and responsiveness

### Future Enhancements

Consider consolidating additional common patterns:
- Expanded tile swiper initialization
- Product swiper configuration
- Story swiper variations (where appropriate)
