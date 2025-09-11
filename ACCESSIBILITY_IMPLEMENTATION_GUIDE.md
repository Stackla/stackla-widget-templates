# WCAG 2.1 AA Accessibility Implementation Guide

## Overview

This guide provides refactored HTML/CSS templates for Stackla widget templates that meet WCAG 2.1 AA accessibility standards. The implementation focuses on semantic structure, ARIA attributes, keyboard navigation, color contrast, and image accessibility.

## Changes Made

### 1. Semantic Structure
- **Before**: Generic `<div>` elements without semantic meaning
- **After**: Proper HTML5 semantic elements:
  - `<main>` for primary content areas
  - `<section>` for distinct content sections with `role="region"`
  - `<article>` for individual content items
  - `<nav>` for navigation controls
  - `<button>` for interactive elements

### 2. ARIA Attributes
- Added `aria-label` for descriptive element purposes
- Implemented `aria-describedby` for additional context
- Used `role` attributes for semantic clarification
- Added `aria-hidden="true"` for decorative elements
- Included `aria-controls` for navigation relationships

### 3. Keyboard Navigation
- Made all interactive elements focusable with `tabindex="0"`
- Added visible focus indicators with 3px outline
- Implemented proper button elements for interactions
- Added skip links for efficient navigation

### 4. Color Contrast
- Enhanced button backgrounds for 4.5:1 contrast ratio
- Added text shadows for overlaid text
- Implemented high contrast mode support
- Used filter effects for icon visibility

### 5. Image Accessibility
- Comprehensive alt text with fallbacks
- Descriptive context for screen readers
- Proper `role="img"` for icon elements
- Hidden decorative images with `aria-hidden="true"`

## Implementation Instructions

### Step 1: Replace Template Files

#### Carousel Widget
1. **Replace layout.hbs**:
   ```bash
   cp widgets/carousel/layout-accessible.hbs widgets/carousel/layout.hbs
   ```

2. **Replace tile.hbs**:
   ```bash
   cp widgets/carousel/tile-accessible.hbs widgets/carousel/tile.hbs
   ```

3. **Update styles**:
   ```bash
   cp widgets/carousel/widget-accessible.scss widgets/carousel/widget.scss
   ```

#### Grid Widget
1. **Replace layout.hbs**:
   ```bash
   cp widgets/grid/layout-accessible.hbs widgets/grid/layout.hbs
   ```

2. **Replace tile.hbs**:
   ```bash
   cp widgets/grid/tile-accessible.hbs widgets/grid/tile.hbs
   ```

3. **Update styles**:
   ```bash
   cp widgets/grid/widget-accessible.scss widgets/grid/widget.scss
   ```

### Step 2: Update Global Styles

Add these accessibility utilities to your global styles:

```scss
/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus indicators */
*:focus {
  outline: 3px solid #0066cc;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .tile,
  button {
    border: 2px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Step 3: JavaScript Enhancements

Add keyboard navigation support:

```javascript
// Carousel keyboard navigation
document.addEventListener('keydown', function(e) {
  if (e.target.classList.contains('swiper-slide')) {
    if (e.key === 'ArrowLeft') {
      // Trigger previous slide
      document.querySelector('.swiper-button-prev').click();
    } else if (e.key === 'ArrowRight') {
      // Trigger next slide
      document.querySelector('.swiper-button-next').click();
    } else if (e.key === 'Enter' || e.key === ' ') {
      // Open tile details
      e.target.click();
    }
  }
});

// Grid keyboard navigation
document.addEventListener('keydown', function(e) {
  if (e.target.closest('.grid')) {
    const tiles = Array.from(document.querySelectorAll('.grid .tile'));
    const currentIndex = tiles.indexOf(e.target);
    let nextIndex;

    switch(e.key) {
      case 'ArrowRight':
        nextIndex = Math.min(currentIndex + 1, tiles.length - 1);
        break;
      case 'ArrowLeft':
        nextIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'ArrowDown':
        // Calculate next row (assuming 3 columns)
        nextIndex = Math.min(currentIndex + 3, tiles.length - 1);
        break;
      case 'ArrowUp':
        // Calculate previous row
        nextIndex = Math.max(currentIndex - 3, 0);
        break;
      case 'Enter':
      case ' ':
        e.target.click();
        return;
      default:
        return;
    }

    if (nextIndex !== undefined && tiles[nextIndex]) {
      tiles[nextIndex].focus();
      e.preventDefault();
    }
  }
});
```

### Step 4: Content Requirements

Update your content delivery to include:

1. **Descriptive alt text**: Ensure your API provides meaningful descriptions
2. **Content context**: Include source platform and content type information
3. **Video descriptions**: Provide audio descriptions for video content
4. **Product information**: Clear labeling for shoppable content

### Step 5: Testing

1. **Automated testing**:
   ```bash
   # Install accessibility testing tools
   npm install --save-dev @axe-core/playwright
   
   # Run accessibility audits
   npm run test:accessibility
   ```

2. **Manual testing**:
   - Test with keyboard-only navigation
   - Verify with screen readers (NVDA, JAWS, VoiceOver)
   - Check color contrast with tools like Colour Contrast Analyser
   - Test with high contrast mode enabled

3. **Browser testing**:
   - Test across multiple browsers
   - Verify mobile touch interactions
   - Check responsive behavior

### Step 6: Maintenance

1. **Regular audits**: Run accessibility tests with each deployment
2. **Content review**: Ensure new content includes proper descriptions
3. **User feedback**: Implement mechanisms for accessibility feedback
4. **Training**: Educate content creators on accessibility requirements

## Browser Support

These accessibility improvements support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers with equivalent versions

## Additional Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

## Support

For questions about this implementation, contact the accessibility team or refer to the internal accessibility guidelines documentation.