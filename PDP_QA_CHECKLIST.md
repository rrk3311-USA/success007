# Product Detail Page (PDP) SEO + GPT Readiness Confirmation Checklist

**Version:** 1.0  
**Date:** January 26, 2026  
**Status:** MANDATORY VALIDATION BEFORE PUBLISHING

---

## OVERVIEW

This checklist must be completed for **EVERY Product Detail Page** before it goes live. All items must be verified using "View Page Source" (not DOM inspector).

**Test Method:** Right-click → "View Page Source" (or `Ctrl+U` / `Cmd+U`)

---

## SECTION 1: INITIAL HTML CONTENT CHECK

### 1.1 H1 Product Name
- [ ] **YES** - H1 tag with product name exists in initial HTML
- [ ] **NO** - H1 missing or shows "Loading..."

**Test:** View Page Source → Search for `<h1>` → Must find product name

**Example (CORRECT):**
```html
<h1>Liver Cleanse Pills with Detox Support Formula – Supports Liver Health</h1>
```

**Example (WRONG):**
```html
<h1>Loading Product...</h1>
```

---

### 1.2 Summary Paragraph
- [ ] **YES** - Summary paragraph exists in initial HTML above the fold
- [ ] **NO** - Summary missing or injected via JavaScript

**Test:** View Page Source → Search for product description → Must find text content

---

### 1.3 "What It Does" Section
- [ ] **YES** - Mechanism/function explanation exists in initial HTML
- [ ] **NO** - Section missing or only in JavaScript

**Test:** View Page Source → Search for "What This Product Does" or mechanism text

---

### 1.4 Key Ingredients (Text, Not Image-Only)
- [ ] **YES** - Ingredients list exists as TEXT in initial HTML
- [ ] **NO** - Ingredients only in images or injected via JS

**Test:** View Page Source → Search for ingredient names → Must find text, not just image tags

**Example (CORRECT):**
```html
<li><strong>Milk Thistle (300mg):</strong> Contains silymarin...</li>
```

**Example (WRONG):**
```html
<img src="ingredients.png" alt="Ingredients">
<!-- No text version -->
```

---

### 1.5 Suggested Use
- [ ] **YES** - Suggested use/dosage instructions exist in initial HTML
- [ ] **NO** - Missing or injected via JavaScript

**Test:** View Page Source → Search for "Suggested Use" or dosage text

---

### 1.6 Safety / FDA Disclaimer
- [ ] **YES** - FDA disclaimer exists in initial HTML
- [ ] **NO** - Disclaimer missing

**Test:** View Page Source → Search for "FDA" or "not been evaluated" → Must find disclaimer

**Required Text:**
```
"These statements have not been evaluated by the Food and Drug Administration. 
This product is not intended to diagnose, treat, cure, or prevent any disease."
```

---

### 1.7 FAQ Questions (Minimum 4)
- [ ] **YES** - At least 4 FAQ questions exist in initial HTML
- [ ] **NO** - Less than 4 FAQs or missing entirely

**Test:** View Page Source → Search for FAQ questions → Count questions in HTML

---

### 1.8 FAQ Answers (All in HTML)
- [ ] **YES** - All FAQ answers exist in initial HTML (even if visually collapsed)
- [ ] **NO** - Answers missing or have `display: none` in initial HTML

**Test:** View Page Source → Search for FAQ answer text → Must find answers

**Example (CORRECT):**
```html
<div class="faq-answer faq-collapsed">
  <p>Answer text here...</p>
</div>
```

**Example (WRONG):**
```html
<div class="faq-answer" style="display: none;">
  <p>Answer text here...</p>
</div>
```

---

### 1.9 Supplement Facts (Text Mirror)
- [ ] **YES** - Supplement facts exist as TEXT in initial HTML
- [ ] **NO** - Only image, no text version

**Test:** View Page Source → Search for "Serving Size" or supplement facts → Must find text table/list

**Example (CORRECT):**
```html
<p><strong>Serving Size:</strong> 2 Capsules</p>
<table>
  <tr><td>Milk Thistle</td><td>300mg</td></tr>
</table>
```

**Example (WRONG):**
```html
<img src="supplement-facts.png" alt="Supplement Facts">
<!-- No text version -->
```

---

## SECTION 2: JAVASCRIPT INJECTION CHECK

### 2.1 No Critical Content Injected After Load
- [ ] **YES** - All critical content in initial HTML
- [ ] **NO** - Content injected via `innerHTML` or `fetch()`

**Test:** View Page Source → All product content must be present (not "Loading...")

**Forbidden Pattern:**
```javascript
// ❌ FORBIDDEN
document.getElementById('content').innerHTML = productHTML;
```

---

### 2.2 Tabs/Accordions Are Visibility-Only
- [ ] **YES** - Tab content exists in HTML, only visibility toggled
- [ ] **NO** - Content loaded on click or removed from HTML

**Test:** View Page Source → Search for tab content → Must find all tab content in HTML

**Allowed Pattern:**
```html
<div class="tab-content active">Content here</div>
<div class="tab-content hidden">More content here</div>
```

**Forbidden Pattern:**
```html
<div id="tab-content"></div>
<!-- Content loaded via JS on click -->
```

---

### 2.3 FAQ Answers Present in DOM
- [ ] **YES** - FAQ answers in HTML (may be visually collapsed)
- [ ] **NO** - Answers not in initial HTML

**Test:** View Page Source → Search for FAQ answer text → Must find all answers

---

## SECTION 3: SCHEMA MARKUP CHECK

### 3.1 Product Schema Present
- [ ] **YES** - Product JSON-LD schema exists in `<head>` or `<body>`
- [ ] **NO** - Schema missing

**Test:** View Page Source → Search for `"@type": "Product"` → Must find schema

---

### 3.2 FAQPage Schema Present
- [ ] **YES** - FAQPage JSON-LD schema exists (if product has FAQs)
- [ ] **NO** - Schema missing

**Test:** View Page Source → Search for `"@type": "FAQPage"` → Must find schema

---

### 3.3 Schema Matches Page Content
- [ ] **YES** - Schema content exactly matches visible page text
- [ ] **NO** - Schema has different text than page

**Test:** Compare schema `description` and FAQ answers with visible page content

**Validation Tool:** https://search.google.com/test/rich-results

---

### 3.4 Schema Validation Protocol Pass
- [ ] **YES** - Passes Google Rich Results Test (Product + FAQ)
- [ ] **YES** - Passes Schema.org Validator
- [ ] **YES** - No critical warnings (price mismatch, missing fields)
- [ ] **NO** - Validation errors or warnings found

**Test:** 
1. Google Rich Results Test: https://search.google.com/test/rich-results
2. Schema.org Validator: https://validator.schema.org/
3. Verify no errors or critical warnings

**Required Checks:**
- Product schema detected and valid
- FAQPage schema detected and valid (if applicable)
- Price matches visible page price exactly
- All required fields present
- No schema warnings that matter

**Reference:** See `SCHEMA_VALIDATION_PROTOCOL.md` for detailed validation steps

---

## SECTION 4: FDA COMPLIANCE CHECK

### 4.1 No Medical Claims
- [ ] **YES** - No "cure," "treat," "prevent," "diagnose" language
- [ ] **NO** - Medical claims found

**Test:** View Page Source → Search for forbidden words:
- "cure"
- "treat"
- "prevent [disease]"
- "diagnose"
- "heal"

**Allowed Language:**
- "supports"
- "helps"
- "assists"
- "promotes [wellness]"

---

### 4.2 FDA Disclaimer Present
- [ ] **YES** - Standard FDA disclaimer in HTML
- [ ] **NO** - Disclaimer missing

**Required Text:**
```
"These statements have not been evaluated by the Food and Drug Administration. 
This product is not intended to diagnose, treat, cure, or prevent any disease."
```

---

## SECTION 5: META TAGS & SEO

### 5.1 Title Tag
- [ ] **YES** - Title tag includes product name
- [ ] **NO** - Title is generic or "Loading..."

**Example (CORRECT):**
```html
<title>Liver Cleanse Pills with Detox Support Formula - Success Chemistry</title>
```

---

### 5.2 Meta Description
- [ ] **YES** - Meta description includes product summary
- [ ] **NO** - Description is generic or missing

**Example (CORRECT):**
```html
<meta name="description" content="Support your liver health with Liver Cleanse Pills...">
```

---

## SECTION 6: FINAL VALIDATION

### 6.1 Disable JavaScript Test
- [ ] **YES** - All critical content visible with JavaScript disabled
- [ ] **NO** - Content disappears when JS disabled

**Test:** Browser DevTools → Settings → Disable JavaScript → Reload page → Check content

---

### 6.2 Google Rich Results Test
- [ ] **YES** - No errors in Google Rich Results Test
- [ ] **NO** - Errors or warnings found

**Test:** https://search.google.com/test/rich-results → Enter URL → Check results

---

### 6.3 View Page Source Test
- [ ] **YES** - All critical content found in source
- [ ] **NO** - Content missing from source

**Test:** View Page Source → Search for:
- Product name
- Ingredients
- FAQs
- Supplement facts
- All must be present

---

## SECTION 7: CORE WEB VITALS

### 7.1 Largest Contentful Paint (LCP)
- [ ] **YES** - LCP < 2.5 seconds
- [ ] **NO** - LCP ≥ 2.5 seconds

**Target:** < 2.5s (Good)  
**Test:** Google PageSpeed Insights or Chrome DevTools → Lighthouse

**Common Issues:**
- Large unoptimized images
- Slow server response time
- Render-blocking resources

**Fix:** Optimize images, use CDN, implement SSR/SSG

---

### 7.2 Interaction to Next Paint (INP)
- [ ] **YES** - INP < 200 milliseconds
- [ ] **NO** - INP ≥ 200 milliseconds

**Target:** < 200ms (Good)  
**Test:** Google PageSpeed Insights or Chrome DevTools → Lighthouse

**Common Issues:**
- Heavy JavaScript execution
- Long event handlers
- Main thread blocking

**Fix:** Defer non-critical JS, optimize event handlers, use Web Workers

---

### 7.3 Cumulative Layout Shift (CLS)
- [ ] **YES** - CLS < 0.1
- [ ] **NO** - CLS ≥ 0.1

**Target:** < 0.1 (Good)  
**Test:** Google PageSpeed Insights or Chrome DevTools → Lighthouse

**Common Issues:**
- Images without dimensions
- Dynamic content injection
- Fonts causing layout shift

**Fix:** Set image dimensions, reserve space for dynamic content, use font-display: swap

---

### 7.4 Core Web Vitals Overall
- [ ] **YES** - All three metrics pass (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] **NO** - One or more metrics fail

**Test:** Google PageSpeed Insights → Core Web Vitals section

**Note:** SSR/SSG implementation already helps with LCP. Remaining work is image optimization and JS discipline.

---

## SCORING

**Total Items:** 29  
**Passing Score:** 29/29 (100%)

### Current Status:
- **Passing:** ___ / 29
- **Failing:** ___ / 29

### Critical Failures (Must Fix):
- [ ] Any item in Section 1 (Initial HTML Content)
- [ ] Any item in Section 2 (JavaScript Injection)
- [ ] Any item in Section 3 (Schema Markup)
- [ ] Any item in Section 7 (Core Web Vitals) - Performance impact

---

## SIGN-OFF

**Page URL:** _______________________  
**Product SKU:** _______________________  
**Date Tested:** _______________________  
**Tester Name:** _______________________  

**Status:**
- [ ] ✅ **APPROVED** - All checks passed
- [ ] ❌ **REJECTED** - Issues found (see notes below)

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

**This checklist must be completed before ANY Product Detail Page goes live.**
