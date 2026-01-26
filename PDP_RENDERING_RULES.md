# Product Detail Page (PDP) Rendering & UX Rules

**Version:** 1.0  
**Date:** January 26, 2026  
**Status:** CRITICAL - NON-NEGOTIABLE

---

## FRAMEWORK EXPECTATION

**Preferred:** Next.js with Static Site Generation (SSG)  
**Acceptable:** Next.js with Server-Side Rendering (SSR)  
**Alternative:** Any framework that supports server-side rendering

**Current State:** ❌ Client-side only (JavaScript injection)  
**Required State:** ✅ Server-rendered HTML at initial load

---

## NON-NEGOTIABLE RULES

### Rule #1: All Critical Content in Initial HTML

**MANDATORY:** ALL critical product content must be present in the HTML at initial page load.

**What This Means:**
- When you "View Page Source" (not DOM inspector), you must see:
  - Product name (H1)
  - Summary paragraph
  - Ingredients list
  - Suggested use
  - Safety disclaimer
  - FAQ questions AND answers
  - Supplement facts text

**What This Does NOT Mean:**
- ❌ Content injected via `innerHTML` after page load
- ❌ Content fetched from API after user interaction
- ❌ Content rendered only after JavaScript executes
- ❌ Content hidden with `display: none` in initial HTML

**Validation:**
```bash
# Test command (view source, not rendered DOM)
curl https://yoursite.com/product?sku=10777-810 | grep -i "liver cleanse"
# Should return product name, not "Loading..."
```

---

### Rule #2: No JavaScript-Only Content Injection

**FORBIDDEN PATTERNS:**

```javascript
// ❌ FORBIDDEN: Injecting content after load
document.getElementById('productContent').innerHTML = productHTML;

// ❌ FORBIDDEN: Fetching content via API
fetch('/api/products/' + sku).then(data => renderProduct(data));

// ❌ FORBIDDEN: Conditional rendering that removes content
if (userLoggedIn) {
  showContent();
} else {
  hideContent(); // Content not in HTML
}
```

**ALLOWED PATTERNS:**

```javascript
// ✅ ALLOWED: Toggling visibility (content already in HTML)
document.querySelector('.faq-answer').classList.toggle('expanded');

// ✅ ALLOWED: Interactive features (content already rendered)
document.querySelector('.add-to-cart').addEventListener('click', addToCart);

// ✅ ALLOWED: Image carousel (images already in HTML)
showNextImage(); // Just changes which image is visible
```

---

### Rule #3: Tabs / Accordions - Visibility Only

**REQUIREMENT:** If using tabs or accordions, content must exist in the DOM at initial load.

**FORBIDDEN:**
```html
<!-- ❌ FORBIDDEN: Content not in HTML -->
<div id="tab-content" style="display: none;">
  <!-- Content loaded via JS later -->
</div>
```

**ALLOWED:**
```html
<!-- ✅ ALLOWED: Content in HTML, visibility toggled -->
<div id="tab-overview" class="tab-content active">
  <p>Overview content here...</p>
</div>
<div id="tab-faq" class="tab-content hidden">
  <p>FAQ content here...</p>
</div>

<style>
.tab-content.hidden {
  display: none; /* OK - content still in HTML */
}
</style>
```

**Key Point:** Content must be in HTML source. CSS can hide it visually, but it must exist for crawlers.

---

### Rule #4: FAQ Answers Must Be in HTML

**REQUIREMENT:** At least 4 FAQ questions AND answers must exist in HTML at initial load.

**FORBIDDEN:**
```html
<!-- ❌ FORBIDDEN: Answers hidden with display: none -->
<div class="faq-answer" style="display: none;">
  <p>Answer text...</p>
</div>
```

**ALLOWED:**
```html
<!-- ✅ ALLOWED: Answers in HTML, visually collapsed -->
<div class="faq-answer faq-collapsed">
  <p>Answer text...</p>
</div>

<style>
.faq-collapsed {
  max-height: 0;
  overflow: hidden;
  /* Content still in HTML, just visually hidden */
}
</style>
```

**Why This Matters:**
- Google needs answers in HTML for FAQ rich results
- GPT systems need answers to read
- Schema.org FAQPage requires answers in HTML

---

### Rule #5: No Fetch-on-Click for Critical Content

**FORBIDDEN:**
```javascript
// ❌ FORBIDDEN: Loading content only when clicked
document.querySelector('.tab-btn').addEventListener('click', function() {
  fetch('/api/product-details').then(data => {
    document.getElementById('details').innerHTML = data;
  });
});
```

**ALLOWED:**
```javascript
// ✅ ALLOWED: Content already loaded, just showing it
document.querySelector('.tab-btn').addEventListener('click', function() {
  document.getElementById('details').classList.remove('hidden');
});
```

---

## IMPLEMENTATION PATTERNS

### Pattern 1: Static Site Generation (SSG) - RECOMMENDED

**Next.js Example:**
```javascript
// pages/product/[sku].js
export async function getStaticPaths() {
  const products = getAllProducts();
  return {
    paths: products.map(p => ({ params: { sku: p.sku } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const product = getProductBySKU(params.sku);
  return {
    props: { product }
  };
}

export default function ProductPage({ product }) {
  return (
    <>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {/* All content rendered server-side */}
    </>
  );
}
```

**Benefits:**
- ✅ Content in HTML at build time
- ✅ Fast page loads
- ✅ Perfect for SEO
- ✅ Works without JavaScript

---

### Pattern 2: Server-Side Rendering (SSR)

**Next.js Example:**
```javascript
// pages/product/[sku].js
export async function getServerSideProps({ query }) {
  const product = getProductBySKU(query.sku);
  return {
    props: { product }
  };
}

export default function ProductPage({ product }) {
  return (
    <>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {/* All content rendered server-side */}
    </>
  );
}
```

**Benefits:**
- ✅ Content in HTML at request time
- ✅ Dynamic data
- ✅ Good for SEO

---

### Pattern 3: Hybrid (SSR + Client Enhancement)

**Allowed Pattern:**
```javascript
// Server renders initial content
export default function ProductPage({ product }) {
  return (
    <>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      
      {/* Client-side enhancement OK for interactivity */}
      <InteractiveGallery images={product.images} />
      <AddToCartButton productId={product.sku} />
    </>
  );
}
```

**Key:** Core content server-rendered, interactivity added client-side.

---

## FAQ IMPLEMENTATION

### Correct FAQ Pattern

```html
<!-- All FAQs in HTML at initial load -->
<div class="faq-section">
  <h2>Frequently Asked Questions</h2>
  
  <div class="faq-item">
    <button class="faq-question" onclick="toggleFAQ(this)">
      How does Milk Thistle support liver health?
    </button>
    <div class="faq-answer faq-collapsed">
      <p>Milk Thistle contains silymarin, a powerful antioxidant...</p>
    </div>
  </div>
  
  <!-- More FAQs... -->
</div>

<style>
.faq-collapsed {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-expanded {
  max-height: 1000px;
}
</style>

<script>
function toggleFAQ(button) {
  const answer = button.nextElementSibling;
  answer.classList.toggle('faq-collapsed');
  answer.classList.toggle('faq-expanded');
}
</script>
```

**Why This Works:**
- ✅ All content in HTML
- ✅ Answers visible to crawlers
- ✅ Visually collapsed for UX
- ✅ Schema.org compatible

---

## VALIDATION CHECKLIST

Before deploying any PDP, verify:

### HTML Source Check
- [ ] Open "View Page Source" (not DevTools)
- [ ] Search for product name - must be present
- [ ] Search for "ingredients" - must be present
- [ ] Search for FAQ answers - must be present
- [ ] Search for supplement facts - must be present

### JavaScript Check
- [ ] Disable JavaScript in browser
- [ ] Reload page
- [ ] All critical content must still be visible
- [ ] Product name, description, ingredients visible

### Crawler Simulation
```bash
# Test with curl (no JavaScript)
curl https://yoursite.com/product?sku=10777-810 > test.html
grep -i "liver cleanse" test.html
# Should return product content, not "Loading..."
```

### Schema Validation
- [ ] Use Google Rich Results Test
- [ ] Verify Product schema present
- [ ] Verify FAQPage schema present
- [ ] Schema matches visible content

---

## COMMON MISTAKES TO AVOID

### Mistake #1: "Progressive Enhancement" Gone Wrong
```javascript
// ❌ WRONG: Assuming JS will always run
if (typeof window !== 'undefined') {
  loadProduct(); // Content never in HTML
}
```

### Mistake #2: Lazy Loading Critical Content
```javascript
// ❌ WRONG: Loading content only when needed
const loadFAQ = async () => {
  const faqs = await fetch('/api/faqs');
  renderFAQs(faqs); // Not in initial HTML
};
```

### Mistake #3: Conditional Rendering
```javascript
// ❌ WRONG: Removing content from HTML
{isLoggedIn && <ProductDetails />} // Not in HTML if false
```

---

## SUMMARY

**Golden Rule:** If a Googlebot or GPT system reads your HTML source (View Page Source), they must see all critical product content. JavaScript can enhance, but cannot provide.

**Test:** View Page Source → Search for product name → Must find it immediately.

---

**These rules are NON-NEGOTIABLE for SEO and GPT compliance.**
