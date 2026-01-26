# Product Detail Page - Server-Rendered Template

**Version:** 1.0  
**Date:** January 26, 2026  
**Status:** REFERENCE TEMPLATE - Use this structure for all PDPs

---

## OVERVIEW

This template shows the **correct structure** for a server-rendered Product Detail Page. All content must be present in the initial HTML (not injected via JavaScript).

**Implementation Note:** This template assumes server-side rendering (Next.js SSG/SSR) or static generation. Adapt the template syntax to your framework.

---

## COMPLETE TEMPLATE STRUCTURE

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{product.name}} - Success Chemistry</title>
    <meta name="description" content="{{product.short_description}}">
    
    <!-- Product Schema JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "{{product.name}}",
      "description": "{{product.short_description}}",
      "brand": {
        "@type": "Brand",
        "name": "Success Chemistry"
      },
      "category": "DietarySupplement",
      "image": {{product.images | json}},
      "sku": "{{product.sku}}",
      "offers": {
        "@type": "Offer",
        "url": "https://successchemistry.com/product?sku={{product.sku}}",
        "priceCurrency": "USD",
        "price": "{{product.price}}",
        "availability": "https://schema.org/InStock"
      }
    }
    </script>
    
    <!-- FAQPage Schema JSON-LD -->
    {{#if product.faqs}}
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {{#each product.faqs}}
        {
          "@type": "Question",
          "name": "{{this.question}}",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "{{this.answer}}"
          }
        }{{#unless @last}},{{/unless}}
        {{/each}}
      ]
    }
    </script>
    {{/if}}
    
    <!-- Styles -->
    <link rel="stylesheet" href="/css/product-page.css">
</head>
<body>
    <!-- Header (static) -->
    <header>
        <!-- Navigation -->
    </header>
    
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
        <a href="/">Home</a> ›
        <a href="/shop">Shop</a> ›
        <span>{{product.name}}</span>
    </nav>
    
    <!-- SECTION 1: H1 Product Name + Primary Function -->
    <section class="hero-section">
        <div class="container">
            <img src="{{product.images[0]}}" alt="{{product.name}}" class="hero-image">
            <h1>{{product.name}}</h1>
        </div>
    </section>
    
    <!-- SECTION 2: Plain-English Summary -->
    <section class="summary-section">
        <div class="container">
            <p class="product-summary">{{product.short_description}}</p>
        </div>
    </section>
    
    <!-- SECTION 3: What the Product Does -->
    <section class="what-it-does-section">
        <div class="container">
            <h2>What This Product Does</h2>
            <div class="what-it-does-content">
                {{#if product.what_it_does}}
                    <p>{{product.what_it_does}}</p>
                {{else}}
                    <!-- Generate from description if what_it_does not available -->
                    <p>{{product.description | extract_mechanism}}</p>
                {{/if}}
            </div>
        </div>
    </section>
    
    <!-- SECTION 4: Key Ingredients -->
    <section class="ingredients-section">
        <div class="container">
            <h2>Key Ingredients</h2>
            <ul class="ingredients-list">
                {{#each product.ingredients_list}}
                <li>
                    <strong>{{this.name}} ({{this.amount}}):</strong>
                    {{this.explanation}}
                </li>
                {{/each}}
            </ul>
            
            <!-- Fallback if ingredients_list not structured -->
            {{#unless product.ingredients_list}}
            <div class="ingredients-text">
                <p>{{product.ingredients}}</p>
            </div>
            {{/unless}}
        </div>
    </section>
    
    <!-- SECTION 5: Suggested Use -->
    <section class="suggested-use-section">
        <div class="container">
            <h2>Suggested Use</h2>
            <p>{{product.suggested_use}}</p>
        </div>
    </section>
    
    <!-- SECTION 6: Who It's For / Not For -->
    <section class="who-its-for-section">
        <div class="container">
            <h2>Who This Product Is For</h2>
            {{#if product.who_its_for}}
                <p>{{product.who_its_for}}</p>
            {{else}}
                <p>This product is designed for adults seeking natural support for {{product.primary_benefit}}. 
                Not recommended for pregnant or nursing women, or individuals taking prescription medications 
                without consulting a healthcare provider.</p>
            {{/if}}
        </div>
    </section>
    
    <!-- SECTION 7: Supplement Facts -->
    <section class="supplement-facts-section">
        <div class="container">
            <h2>Supplement Facts</h2>
            
            <!-- Optional: Label Image -->
            {{#if product.label_image}}
            <img src="{{product.label_image}}" alt="Supplement Facts Label" class="label-image">
            {{/if}}
            
            <!-- MANDATORY: Text Version -->
            <div class="supplement-facts-text">
                <pre>{{product.supplement_facts}}</pre>
            </div>
        </div>
    </section>
    
    <!-- SECTION 8: Safety + FDA Disclaimer -->
    <section class="safety-section">
        <div class="container">
            <h2>Important Safety Information</h2>
            <div class="fda-disclaimer">
                <p><strong>FDA Disclaimer:</strong> These statements have not been evaluated by the Food and Drug Administration. 
                This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
            </div>
            <div class="safety-warnings">
                <p><strong>Safety Warnings:</strong> Consult your healthcare provider before use if you are pregnant, nursing, 
                taking medications, or have a medical condition. Discontinue use and consult a healthcare provider if 
                adverse reactions occur.</p>
            </div>
        </div>
    </section>
    
    <!-- SECTION 9: FAQ (4-8 Questions) -->
    <section class="faq-section">
        <div class="container">
            <h2>Frequently Asked Questions</h2>
            
            {{#if product.faqs}}
            <div class="faq-list">
                {{#each product.faqs}}
                <div class="faq-item">
                    <button class="faq-question" onclick="toggleFAQ(this)" aria-expanded="false">
                        <h3>{{this.question}}</h3>
                        <span class="faq-toggle">+</span>
                    </button>
                    <div class="faq-answer faq-collapsed">
                        <p>{{this.answer}}</p>
                    </div>
                </div>
                {{/each}}
            </div>
            {{else}}
            <!-- If no FAQs, show placeholder message -->
            <p>No frequently asked questions available for this product.</p>
            {{/if}}
        </div>
    </section>
    
    <!-- SECTION 10: Trust & Manufacturing -->
    <section class="trust-section">
        <div class="container">
            <h2>Quality & Manufacturing</h2>
            <p>This product is manufactured in the USA in a GMP-certified facility. Each batch is tested for purity and potency. 
            Our supplements are free from artificial additives, preservatives, and common allergens.</p>
            
            <!-- Trust badges -->
            <div class="trust-badges">
                <img src="/images/badge-gmp.png" alt="GMP Certified">
                <img src="/images/badge-iso.png" alt="ISO Certified">
            </div>
        </div>
    </section>
    
    <!-- SECTION 11: Call-to-Action -->
    <section class="cta-section">
        <div class="container">
            <div class="price-display">
                <span class="price">${{product.price}}</span>
                <span class="per-bottle">per bottle</span>
            </div>
            <button class="add-to-cart-btn" data-sku="{{product.sku}}" data-price="{{product.price}}">
                Add to Cart - ${{product.price}}
            </button>
            <!-- PayPal button container -->
            <div id="paypal-button-container" data-sku="{{product.sku}}" data-price="{{product.price}}"></div>
        </div>
    </section>
    
    <!-- Footer (static) -->
    <footer>
        <!-- Footer content -->
    </footer>
    
    <!-- JavaScript for interactivity (content already rendered) -->
    <script>
        // FAQ Toggle (content already in HTML)
        function toggleFAQ(button) {
            const answer = button.nextElementSibling;
            const isExpanded = answer.classList.contains('faq-expanded');
            
            if (isExpanded) {
                answer.classList.remove('faq-expanded');
                answer.classList.add('faq-collapsed');
                button.setAttribute('aria-expanded', 'false');
                button.querySelector('.faq-toggle').textContent = '+';
            } else {
                answer.classList.remove('faq-collapsed');
                answer.classList.add('faq-expanded');
                button.setAttribute('aria-expanded', 'true');
                button.querySelector('.faq-toggle').textContent = '−';
            }
        }
        
        // Add to Cart (product data already in HTML)
        document.querySelector('.add-to-cart-btn').addEventListener('click', function() {
            const sku = this.getAttribute('data-sku');
            const price = this.getAttribute('data-price');
            // Add to cart logic
        });
    </script>
    
    <!-- PayPal Script -->
    <script src="/public/paypal-buttons.js"></script>
</body>
</html>
```

---

## CSS FOR FAQ COLLAPSE (NOT display: none)

```css
/* FAQ Collapse - Content in HTML, visually hidden */
.faq-item {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 12px;
    overflow: hidden;
}

.faq-question {
    width: 100%;
    padding: 14px 16px;
    background: #f8f9fa;
    border: none;
    text-align: left;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.faq-question h3 {
    margin: 0;
    font-size: 1rem;
    color: #2854a6;
}

.faq-toggle {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2854a6;
}

.faq-answer {
    padding: 14px 16px;
    background: white;
    color: #555;
    line-height: 1.6;
    transition: max-height 0.3s ease, padding 0.3s ease;
}

/* Collapsed state - content still in HTML */
.faq-collapsed {
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    overflow: hidden;
}

/* Expanded state */
.faq-expanded {
    max-height: 1000px; /* Large enough for content */
    padding-top: 14px;
    padding-bottom: 14px;
}
```

---

## KEY DIFFERENCES FROM CURRENT IMPLEMENTATION

### Current (WRONG):
```javascript
// Content injected after load
document.getElementById('productContent').innerHTML = productHTML;
```

### New (CORRECT):
```html
<!-- Content in HTML at initial load -->
<h1>{{product.name}}</h1>
<p>{{product.description}}</p>
```

### Current (WRONG):
```html
<!-- FAQ answers hidden -->
<div class="faq-answer" style="display: none;">
```

### New (CORRECT):
```html
<!-- FAQ answers in HTML, visually collapsed -->
<div class="faq-answer faq-collapsed">
```

---

## IMPLEMENTATION NOTES

### For Next.js (SSG):
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
  return { props: { product } };
}

export default function ProductPage({ product }) {
  return (
    // Use template structure above
  );
}
```

### For Static HTML:
- Generate HTML files at build time
- Use template engine (Handlebars, Mustache, etc.)
- Ensure all product data rendered in HTML
- No JavaScript content injection

---

## VALIDATION

After implementing, verify:

1. **View Page Source:**
   - ✅ Product name visible
   - ✅ Description visible
   - ✅ Ingredients visible
   - ✅ FAQs visible
   - ✅ Supplement facts visible

2. **Disable JavaScript:**
   - ✅ All content still visible
   - ✅ No "Loading..." placeholders

3. **Schema Validation:**
   - ✅ Product schema present
   - ✅ FAQPage schema present
   - ✅ No errors in Google Rich Results Test

---

**This template structure is MANDATORY for all Product Detail Pages.**
