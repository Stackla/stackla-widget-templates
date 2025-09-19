# WCAG 2.1 AA Quick Reference for Widget Development

## ✅ Checklist for Accessibility Compliance

### Semantic Structure
- [ ] Use `<main>` for primary content
- [ ] Use `<section>` with `role="region"` for distinct areas
- [ ] Use `<article>` for individual content items
- [ ] Use `<nav>` for navigation controls
- [ ] Use `<button>` for all interactive elements

### ARIA Attributes
- [ ] Add `aria-label` for element descriptions
- [ ] Use `aria-describedby` for additional context
- [ ] Include `role` attributes for semantic clarity
- [ ] Set `aria-hidden="true"` for decorative elements
- [ ] Use `aria-controls` for navigation relationships

### Keyboard Navigation
- [ ] Set `tabindex="0"` for focusable elements
- [ ] Set `tabindex="-1"` for programmatically focused elements
- [ ] Implement arrow key navigation for grids/carousels
- [ ] Support Enter/Space for activation
- [ ] Provide skip links for efficient navigation

### Focus Management
- [ ] Visible focus indicators (3px outline minimum)
- [ ] High contrast mode support
- [ ] Focus trapping in modals
- [ ] Logical tab order
- [ ] Return focus after modal closure

### Color Contrast
- [ ] 4.5:1 ratio for normal text
- [ ] 3:1 ratio for large text (18pt+ or 14pt+ bold)
- [ ] 3:1 ratio for graphical objects
- [ ] Test with high contrast mode
- [ ] Avoid color-only information

### Images & Media
- [ ] Descriptive `alt` text for meaningful images
- [ ] Empty `alt=""` for decorative images
- [ ] `aria-label` for icon buttons
- [ ] Video captions and transcripts
- [ ] Audio descriptions for video content

### Interactive Elements
- [ ] Minimum 44px touch targets on mobile
- [ ] Clear hover/focus states
- [ ] Disabled state indicators
- [ ] Loading state announcements
- [ ] Error state descriptions

## 🎯 Common Patterns

### Button with Icon
```html
<button type="button" aria-label="Play video">
  <span class="icon-play" aria-hidden="true"></span>
  <span class="sr-only">Play video</span>
</button>
```

### Image with Proper Alt Text
```html
<img src="user-content.jpg" 
     alt="Beach sunset photo shared by @username from Instagram" 
     role="img" />
```

### Navigation Controls
```html
<nav role="navigation" aria-label="Carousel navigation">
  <button type="button" 
          aria-label="Previous item" 
          aria-controls="carousel-content">
    Previous
  </button>
</nav>
```

### Screen Reader Only Text
```css
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
```

### Focus Indicators
```css
*:focus {
  outline: 3px solid #0066cc;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}
```

## 🔧 Testing Tools

### Automated Testing
- **axe-core**: Browser extension and API
- **Lighthouse**: Built into Chrome DevTools
- **Pa11y**: Command line accessibility tester
- **ESLint**: jsx-a11y plugin for React

### Manual Testing
- **Keyboard only**: Unplug your mouse
- **Screen readers**: NVDA (free), JAWS, VoiceOver
- **High contrast**: Windows/Mac system settings
- **Zoom**: Test at 200% zoom level

### Browser Extensions
- **axe DevTools**: Free accessibility checker
- **WAVE**: Web accessibility evaluation tool
- **Colour Contrast Analyser**: Check contrast ratios
- **Headings Map**: Validate heading structure

## 🚨 Common Mistakes to Avoid

1. **Using `div` for buttons**: Use `<button>` elements
2. **Missing alt text**: Always provide meaningful descriptions
3. **Color-only indicators**: Include text or patterns
4. **Keyboard traps**: Ensure all elements are reachable
5. **Poor focus order**: Maintain logical tab sequence
6. **Missing labels**: Every form element needs a label
7. **Auto-playing media**: Provide controls and warnings
8. **Time limits**: Allow extensions or removal
9. **Flashing content**: Avoid seizure triggers
10. **Mobile tap targets**: Ensure 44px minimum size

## 📱 Mobile Considerations

- Larger touch targets (44px minimum)
- Gesture alternatives for complex interactions
- Voice control compatibility
- Screen reader swipe navigation
- Orientation change handling
- Zoom support up to 200%

## 🎨 Design Considerations

- High contrast color schemes
- Consistent navigation patterns
- Clear visual hierarchy
- Readable typography (16px minimum)
- Sufficient white space
- Error state visibility
- Loading state indicators
- Success confirmation messages

## 🔗 Quick Links

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Accessibility Resources](https://webaim.org/)
- [Color Contrast Checker](https://www.tpgi.com/color-contrast-checker/)

---
*Remember: Accessibility benefits everyone, not just users with disabilities.*