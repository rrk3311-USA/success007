# FAQ Visibility Fix - SEO Compliance

## Problem
FAQ answers were using `display: none` inline styles, which:
- ❌ Hides content from search engine crawlers
- ❌ Violates SEO best practices (content must be in DOM)
- ❌ Can trigger "hidden content" flags in Lighthouse
- ❌ Prevents LLM/AI crawlers from discovering FAQ content

## Solution
Replaced `display: none` with CSS-based collapse animation using:
- ✅ `max-height` transitions (0 → 800px)
- ✅ `opacity` transitions (0 → 1)
- ✅ `overflow: hidden` for smooth collapse
- ✅ Content always in DOM (`display: block`)

## Changes Made

### 1. CSS Updates (`product/index.html`)

**Before:**
```css
.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    padding: 0 0 0 0;
}
```

**After:**
```css
.faq-answer {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.3s ease, padding 0.3s ease, opacity 0.2s ease;
    padding: 0 0 0 0;
    /* Never use display:none - content must remain in DOM for SEO */
    display: block;
}

.faq-answer.open {
    max-height: 800px; /* Large enough for most answers */
    opacity: 1;
    padding: 0 0 20px 0;
}
```

### 2. HTML/JavaScript Updates

**Before:**
```html
<div class="faq-answer" style="display: ${isFirst ? 'block' : 'none'}; ...">
```

**After:**
```html
<div class="faq-answer ${isFirst ? 'open' : ''}" style="..." role="region" aria-label="FAQ answer">
```

**JavaScript Toggle:**
- **Before**: `style.display = 'none' / 'block'`
- **After**: `classList.toggle('open')` (uses CSS classes)

### 3. Accessibility Improvements
- Added `aria-expanded` attribute
- Added `role="button"` and `tabindex="0"` for keyboard navigation
- Added `role="region"` to FAQ answers
- Keyboard support (Enter/Space to toggle)

### 4. Validator Updates

Updated `validate-pdp-playwright.js` to:
- ✅ Fail if `display === 'none'` or `visibility === 'hidden'`
- ✅ Pass if `display !== 'none'` even when collapsed (max-height: 0, opacity: 0)
- ✅ Explicitly check for hidden content violations

## Validation Results

### Before Fix
```
❌ FAIL - First FAQ answer hidden (display:none)
❌ FAIL - Some FAQ answers hidden
```

### After Fix
```
✅ PASS - All FAQs in DOM (no display:none)
✅ PASS - First FAQ expanded by default
✅ PASS - Collapsed FAQs still accessible to crawlers
```

## SEO Benefits

1. **Crawler Visibility**: All FAQ content visible to Googlebot, Bingbot, etc.
2. **Schema Compliance**: FAQPage schema content matches visible DOM
3. **LLM Discovery**: AI crawlers can discover and cite FAQ content
4. **No Hidden Content Flags**: Lighthouse won't flag hidden content
5. **Accessibility**: Screen readers can access all FAQ content

## Testing

Run batch validation to verify:
```bash
node batch-validate-pdps.js --base http://localhost:8080 --skus 10786-807,10777-810
```

Expected: ✅ All PDPs passed validation

## Best Practices

### ✅ DO
- Use `max-height` + `opacity` for collapse animations
- Keep content in DOM (`display: block`)
- Use CSS classes for state management
- First FAQ open by default

### ❌ DON'T
- Never use `display: none` for FAQ answers
- Never use `visibility: hidden` for FAQ answers
- Never remove FAQ content from DOM when collapsed
- Never rely on JavaScript-only content injection

## Related Files

- `deploy-site/product/index.html` - FAQ HTML/CSS/JS
- `validate-pdp-playwright.js` - Validator checks
- `batch-validate-pdps.js` - Batch validation script
