# Single-PDP Live Validation Guide

## Pre-Validation Checklist

Before running validation, ensure:
- ✅ Server is running on `http://localhost:8080`
- ✅ Product page loads correctly
- ✅ Products data is loaded (`/products-data.js`)

---

## 1. Single-PDP Live Validation

### A. Confirm Rendered HTML (Not Source JSX)

**Manual Check:**
1. Open browser DevTools (F12)
2. Navigate to: `http://localhost:8080/product/?sku=10786-807`
3. Wait for page to fully load (product should be visible)
4. Right-click → "View Page Source" (NOT "Inspect Element")
5. Verify in source:
   - Product name appears in `<h1>` tag (after JS execution)
   - Product price is visible as text
   - Product description is in HTML
   - Images have proper `src` attributes
6. Also check "Inspect Element" to see rendered DOM:
   - All content visible in Elements tab
   - No critical content hidden with `display: none`

**Note:** Since this is a client-side rendered page, initial HTML may show "Loading Product..." but after JS executes, all content should be in the DOM.

**Automated Check:**
```bash
node validate-pdp-seo.js "http://localhost:8080/product/?sku=10786-807"
```

### B. Confirm Schema Injected Once (No Duplication)

**Manual Check (Recommended - Checks Rendered DOM):**
1. Navigate to product page: `http://localhost:8080/product/?sku=10786-807`
2. Wait for page to fully load (product should be visible)
3. Open DevTools → Console
4. Run:
```javascript
// Count schema scripts
document.querySelectorAll('script[type="application/ld+json"]').length
// Should return: 1

// Check for Product schema
const schemas = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
  .map(s => JSON.parse(s.textContent))
  .filter(s => s['@type'] === 'Product');
console.log('Product schemas:', schemas.length); // Should be 1

// Verify schema content
if (schemas.length > 0) {
  const product = schemas[0];
  console.log('Schema valid:', {
    name: product.name,
    sku: product.sku,
    price: product.offers?.price,
    hasFAQ: !!product.mainEntity
  });
}
```

**Automated Check:**
The validation script checks static HTML. Since schema is injected via JavaScript, it may not detect it immediately. For accurate validation, use the manual browser check above, or wait a few seconds after page load before running the script.

**Note:** Google crawlers execute JavaScript, so dynamically injected schema is valid for SEO. The validation script is a quick check; manual browser validation is the gold standard.

**If Duplicates Found:**
- Check `renderProduct()` function
- Ensure old schema is removed before adding new one:
```javascript
// Remove existing schema
const existing = document.querySelector('script[data-schema="product"]');
if (existing) existing.remove();
```

### C. Confirm FAQ Answers Visible in DOM (No display:none)

**Manual Check:**
1. Navigate to product page and wait for it to load
2. Open DevTools → Elements
3. Search for: `faq-answer`
4. Inspect each FAQ answer element
5. Verify:
   - First FAQ answer has `display: block` (not `display: none`)
   - Content is in DOM (not hidden)
   - First FAQ should be expanded by default
6. In Console, run:
```javascript
const faqs = document.querySelectorAll('.faq-answer');
faqs.forEach((faq, i) => {
  const style = window.getComputedStyle(faq);
  console.log(`FAQ ${i+1} display:`, style.display, 'visible:', style.display !== 'none');
});
// First FAQ should show: display: block
```

**Automated Check:**
```bash
node validate-pdp-seo.js "http://localhost:8080/product/?sku=10786-807"
```

**Status:** ✅ Fixed - First FAQ now visible by default

**If FAQs Hidden:**
- Check CSS: `.faq-answer` should not have `display: none` by default
- First FAQ should have class `open` or inline style `display: block`
- Ensure FAQ content is server-rendered, not client-only

---

## 2. Telemetry Snapshot

### A. Lighthouse (Mobile)

**Steps:**
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select:
   - ✅ Mobile
   - ✅ Performance
   - ✅ SEO
   - ✅ Best Practices
4. Click "Analyze page load"
5. Target scores:
   - Performance: ≥ 90
   - SEO: 100
   - Best Practices: ≥ 90

**Key Metrics:**
- LCP (Largest Contentful Paint): < 2.5s
- INP (Interaction to Next Paint): < 200ms
- CLS (Cumulative Layout Shift): < 0.1

**Save Results:**
- Export as JSON
- Save screenshot
- Note any warnings/errors

### B. Rich Results Test

**Steps:**
1. Visit: https://search.google.com/test/rich-results
2. Enter URL: `http://localhost:8080/product/?sku=10786-807`
3. Click "Test URL"
4. Verify:
   - ✅ Product schema detected
   - ✅ All required fields present
   - ✅ No errors or warnings
   - ✅ FAQ schema detected (if applicable)

**Expected Results:**
- Product: Valid
- BreadcrumbList: Valid (if implemented)
- FAQPage: Valid (if FAQs present)

### C. URL Inspection (Indexing Allowed, Canonical Correct)

**Steps:**
1. Visit: https://search.google.com/search-console
2. Use "URL Inspection" tool
3. Enter: `http://localhost:8080/product/?sku=10786-807`
4. Verify:
   - ✅ "URL is on Google" or "URL is not on Google" (expected for localhost)
   - ✅ "Indexing allowed" = Yes
   - ✅ Canonical URL matches current URL
   - ✅ No robots.txt blocking
   - ✅ No meta robots noindex

**For Production:**
- Submit URL for indexing
- Monitor indexing status
- Check for crawl errors

---

## 3. Quick Validation Commands

### Run All Checks
```bash
# Validate single PDP
node validate-pdp-seo.js http://localhost:8080/product/?sku=10786-807

# Test multiple SKUs
for sku in 10786-807 20647-507 10775-506; do
  echo "Testing SKU: $sku"
  node validate-pdp-seo.js "http://localhost:8080/product/?sku=$sku"
  echo ""
done
```

### Manual Browser Checks
```javascript
// In browser console on product page:

// 1. Schema count
console.log('Schema scripts:', document.querySelectorAll('script[type="application/ld+json"]').length);

// 2. FAQ visibility
const faqs = document.querySelectorAll('.faq-answer');
faqs.forEach((faq, i) => {
  const style = window.getComputedStyle(faq);
  console.log(`FAQ ${i+1} display:`, style.display);
});

// 3. Critical content in DOM
console.log('H1:', document.querySelector('h1')?.textContent);
console.log('Price:', document.querySelector('.price')?.textContent);
console.log('Description length:', document.querySelector('.product-description')?.textContent.length);
```

---

## 4. Common Issues & Fixes

### Issue: Schema Duplication
**Fix:**
```javascript
// In renderProduct() function, before creating schema:
const existing = document.querySelector('script[data-schema="product"]');
if (existing) existing.remove();
```

### Issue: FAQs Hidden with display:none
**Fix:**
```css
/* Ensure first FAQ is visible */
.faq-answer:first-of-type,
.faq-answer.open {
    display: block !important;
    max-height: none !important;
}
```

### Issue: Content Not in Initial HTML
**Fix:**
- Ensure product data is server-rendered
- Use `<noscript>` fallbacks for critical content
- Pre-render product pages at build time (if using SSG)

---

## 5. Success Criteria

✅ **All checks pass when:**
- Schema: Single Product schema, all required fields
- FAQ: Answers visible in DOM, no display:none
- HTML: Critical content in initial render
- Lighthouse: SEO score = 100, Performance ≥ 90
- Rich Results: Product schema valid
- URL Inspection: Indexing allowed, canonical correct

**Once one PDP passes 29/29, the rest is mechanical rollout.**

---

## Next Steps After Validation

1. **Document Results:**
   - Save Lighthouse report
   - Screenshot Rich Results test
   - Note any issues found

2. **Fix Issues:**
   - Address schema duplication
   - Fix FAQ visibility
   - Optimize performance if needed

3. **Scale to All Products:**
   - Once one PDP passes, apply same structure to all
   - Use diff-based rollout
   - Monitor for structural drift

4. **Production Deployment:**
   - Run validation on staging
   - Test with real URLs
   - Submit to Google Search Console
