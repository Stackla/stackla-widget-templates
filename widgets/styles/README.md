# Common Widget Styles

This directory contains shared SCSS utilities to eliminate code duplication across widgets.

## Files

- `_common-widget-styles.scss` - Shared mixin for common widget styles
- `_variables.scss` - Centralized SCSS variables for all static values

## Common Widget Styles Mixin

The `_common-widget-styles.scss` file provides reusable mixins that consolidate styling patterns used across multiple widgets.

### Purpose

Previously, each widget had nearly identical `_styles.scss` files with 23-28 lines of duplicated imports and mixin includes. This led to:
- Code duplication across 10+ widgets
- Maintenance burden when updating common styles
- Inconsistency risks when styles diverge

### Usage

#### Standard Widgets (with Swiper)

For widgets that use the expanded swiper feature:

```scss
@use "@styles/partials/common-widget-styles" as common;

@include common.apply-common-styles('.your-widget-inline');
```

This will:
- Import all necessary dependencies (swiper, fonts, icons, loading, etc.)
- Apply all common style mixins (icon-sections, shopspot-icon, time-phrase, share-menu, tags, tile-content, swiper-expanded)
- Scope styles to your widget's inline class and expanded-tiles

#### Widgets Without Swiper

For widgets that don't use the expanded swiper feature:

```scss
@use "@styles/partials/common-widget-styles" as common;

@include common.apply-common-styles-without-swiper('.your-widget-inline');
```

#### Widgets with Additional Custom Styles

For widgets that need additional imports or custom styles:

```scss
@use "@styles/partials/common-widget-styles" as common;
@forward "inline-tile";  // Additional custom forward
@use "components";        // Additional custom import

@include common.apply-common-styles('.your-widget-inline');
```

### What's Included

The `apply-common-styles` mixin includes:

**Forwards:**
- `pkg:swiper/swiper-bundle.css`
- `@styles/partials/fonts`
- `@styles/partials/icons`
- `@styles/partials/loading`
- `@styles/partials/tile-overlay`
- `@styles/templates/expanded-tiles`
- `@styles/templates/swiper-overrides`

**Uses (for mixins):**
- `@styles/partials/inline`
- `@styles/templates/tags`
- `@styles/templates/load-more`
- `@styles/templates/tile-content`
- `@styles/templates/shopspot-icon`
- `@styles/templates/time-phrase`
- `@styles/templates/share-menu`
- `@styles/partials/icon-sections`
- `@styles/partials/expanded-swiper`

**Applied Styles:**
- `icon-sections-styles`
- `shopspot-icon-styles`
- `time-phrase-styles`
- `share-menu-styles`
- `tile-tags-styles`
- `tile-content-styles`
- `swiper-expanded-styles`

### Benefits

- **Reduced Code**: Widget `_styles.scss` files reduced from ~27 lines to 2-3 lines
- **DRY Principle**: Single source of truth for common widget styles
- **Easy Maintenance**: Update once, apply everywhere
- **Consistency**: All widgets use the same base styles
- **Flexibility**: Still allows widget-specific customizations

### Widgets Using This Utility

- carousel
- grid
- masonry
- waterfall
- quadrant
- nightfall
- blankcanvas

### Special Cases

**shortvideo** and **storyline** widgets have custom override implementations and don't use this mixin. They have inline comments explaining why they maintain their own style declarations.

### Migration Guide

If you're creating a new widget or updating an existing one:

1. Remove all common imports and forwards from your `_styles.scss`
2. Add `@use "@styles/partials/common-widget-styles" as common;`
3. Replace the common mixin includes with `@include common.apply-common-styles('.your-widget-inline');`
4. Keep any widget-specific imports/forwards before the include
5. Add any custom styles after the include
6. **Use variables from `@styles/partials/variables`** for any static values instead of hardcoded numbers

**Before:**
```scss
@forward "pkg:swiper/swiper-bundle.css";
@use "@styles/partials/fonts";
@forward "@styles/partials/icons";
// ... 20+ more lines of common imports
.my-widget-inline,
expanded-tiles {
  @include is.icon-sections-styles;
  @include sicon.shopspot-icon-styles;
  // ... more common mixins
}
```

**After:**
```scss
@use "@styles/partials/common-widget-styles" as common;

@include common.apply-common-styles('.my-widget-inline');
```

## SCSS Variables

The `_variables.scss` file contains all static values used in common widget utilities as meaningful variable names. This improves maintainability and consistency across widgets.

### Available Variables

**Swiper Breakpoints:**
- `$swiper-breakpoint-mobile`: 0
- `$swiper-breakpoint-tablet`: 537px
- `$swiper-breakpoint-desktop`: 952px

**Swiper Slides Per View:**
- `$swiper-slides-mobile`: 1
- `$swiper-slides-tablet`: 3
- `$swiper-slides-desktop`: 7

**Icon Sizes:**
- `$icon-size-small`: 24px
- `$icon-size-medium`: 26px
- `$icon-size-large`: 34px
- `$icon-size-xlarge`: 40px

**Spacing:**
- `$container-margin`: 20px
- `$nosto-container-margin`: 20px
- `$icon-placement-top/bottom/left/right`: 8px - 8.67px

**Other:**
- `$inline-tile-border-radius`: 5px
- `$story-border-radius`: 50%
- `$loading-icon-width/height`: 30px
- `$play-icon-width/height`: 50px
- And more...

### Usage Example

```scss
@use "@styles/partials/variables" as vars;

.my-widget {
  margin: vars.$container-margin;
  border-radius: vars.$inline-tile-border-radius;
  
  .icon {
    width: vars.$icon-size-medium;
    height: vars.$icon-size-medium;
  }
}
```
