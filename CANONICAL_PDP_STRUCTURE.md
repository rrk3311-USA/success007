# Canonical Product Detail Page (PDP) Structure

**Version:** 1.0  
**Date:** January 26, 2026  
**Status:** MANDATORY STANDARD FOR ALL PRODUCTS

---

## OVERVIEW

This document defines the **mandatory structure** that ALL supplement Product Detail Pages must follow. This structure ensures SEO compliance, GPT-readiness, and legal adherence.

**CRITICAL:** This structure must be rendered in **server-side HTML** at initial page load. No content may be injected via JavaScript.

---

## PAGE ORDER (DO NOT CHANGE)

The following sections must appear in this exact order:

### 1. H1: Product Name + Primary Function
**Location:** Above the fold, immediately after hero image  
**Format:** `<h1>Product Name - Primary Function</h1>`  
**Example:** `<h1>Liver Cleanse Pills - Natural Liver Detox Support Formula</h1>`

**Requirements:**
- Must be in initial HTML (not injected)
- Single H1 per page
- Include primary function/benefit
- FDA-compliant language only

---

### 2. Plain-English Summary (2-3 Sentences)
**Location:** Directly below H1  
**Format:** Paragraph text  
**Purpose:** Above-the-fold summary for crawlers and users

**Requirements:**
- 2-3 sentences maximum
- Plain language (no medical jargon)
- Must explain what the product does
- Must be in initial HTML

**Example:**
```
<p>Support your liver health with Liver Cleanse Pills by Success Chemistry. 
This formula features natural ingredients like milk thistle, dandelion root, 
and artichoke extract, traditionally known for their liver-supporting properties. 
It assists with the body's natural detox process and helps maintain overall liver function.</p>
```

---

### 3. What the Product Does (Mechanism-Focused, Non-Medical)
**Location:** Below summary  
**Section Title:** `<h2>What This Product Does</h2>`

**Requirements:**
- Explain HOW the product works (mechanism)
- Focus on normal function support
- NO disease claims
- NO cure/treat/diagnose/prevent language
- Use "supports," "helps," "assists" only

**Example:**
```
<h2>What This Product Does</h2>
<p>Liver Cleanse Pills support your liver's natural detoxification processes. 
The formula combines milk thistle, which helps protect liver cells, with 
dandelion root that assists bile production. Together, these ingredients 
support the liver's ability to process toxins and maintain healthy function.</p>
```

---

### 4. Key Ingredients (Each with Short Explanation)
**Location:** Below "What it does"  
**Section Title:** `<h2>Key Ingredients</h2>`

**Requirements:**
- List each key ingredient
- Include short explanation (1-2 sentences each)
- Must be TEXT, not image-only
- Each ingredient in its own list item or card

**Format:**
```html
<h2>Key Ingredients</h2>
<ul>
  <li>
    <strong>Milk Thistle (300mg):</strong> Contains silymarin, a powerful 
    antioxidant that helps protect liver cells from toxins and supports 
    the liver's natural regeneration process.
  </li>
  <li>
    <strong>Dandelion Root (200mg):</strong> Aids natural liver detox 
    processes by supporting bile production and flow.
  </li>
  <!-- More ingredients... -->
</ul>
```

---

### 5. Suggested Use
**Location:** Below ingredients  
**Section Title:** `<h2>Suggested Use</h2>`

**Requirements:**
- Clear dosage instructions
- Timing (with/without food)
- Frequency
- Must be in initial HTML

**Example:**
```
<h2>Suggested Use</h2>
<p>As a dietary supplement, take two (2) veggie capsules once a day after 
a meal with an 8oz. glass of water or as directed by your healthcare professional.</p>
```

---

### 6. Who It's For / Not For
**Location:** Below suggested use  
**Section Title:** `<h2>Who This Product Is For</h2>`

**Requirements:**
- Clear target audience
- Safety warnings (pregnancy, medications, etc.)
- Must be in initial HTML

**Example:**
```
<h2>Who This Product Is For</h2>
<p>Liver Cleanse Pills are designed for adults seeking natural liver support. 
Not recommended for pregnant or nursing women, or individuals taking prescription 
medications without consulting a healthcare provider.</p>
```

---

### 7. Supplement Facts
**Location:** Below "Who it's for"  
**Section Title:** `<h2>Supplement Facts</h2>`

**Requirements:**
- Label image (optional but recommended)
- **MANDATORY:** Exact HTML text mirror of label
- Must match FDA label format
- Must be in initial HTML (not image-only)

**Format:**
```html
<h2>Supplement Facts</h2>
<!-- Optional: Label image -->
<img src="/images/products/[SKU]/label.png" alt="Supplement Facts Label" />

<!-- MANDATORY: Text version -->
<div class="supplement-facts-text">
  <p><strong>Serving Size:</strong> 2 Capsules</p>
  <p><strong>Servings Per Container:</strong> 30</p>
  <table>
    <tr>
      <td>Milk Thistle Extract</td>
      <td>300mg</td>
    </tr>
    <!-- More rows... -->
  </table>
</div>
```

---

### 8. Safety + FDA Disclaimer
**Location:** Below supplement facts  
**Section Title:** `<h2>Important Safety Information</h2>`

**Requirements:**
- **MANDATORY** FDA disclaimer
- Safety warnings
- Drug interaction warnings
- Must be in initial HTML

**Standard Disclaimer:**
```html
<h2>Important Safety Information</h2>
<p><strong>FDA Disclaimer:</strong> These statements have not been evaluated 
by the Food and Drug Administration. This product is not intended to diagnose, 
treat, cure, or prevent any disease.</p>

<p><strong>Safety Warnings:</strong> Consult your healthcare provider before 
use if you are pregnant, nursing, taking medications, or have a medical 
condition. Discontinue use and consult a healthcare provider if adverse 
reactions occur.</p>
```

---

### 9. FAQ (4-8 Real Questions)
**Location:** Below safety disclaimer  
**Section Title:** `<h2>Frequently Asked Questions</h2>`

**Requirements:**
- **Minimum 4 questions** (preferably 6-8)
- All questions AND answers must be in initial HTML
- Answers may be visually collapsed but must exist in DOM
- Use CSS classes for collapse (NOT `display: none`)

**Format:**
```html
<h2>Frequently Asked Questions</h2>
<div class="faq-item">
  <div class="faq-question">
    <h3>How does Milk Thistle support liver health?</h3>
  </div>
  <div class="faq-answer faq-collapsed">
    <p>Milk Thistle contains silymarin, a powerful antioxidant that helps 
    protect liver cells from toxins and supports the liver's natural 
    regeneration process.</p>
  </div>
</div>
<!-- More FAQs... -->
```

**CSS for Collapse (NOT display: none):**
```css
.faq-collapsed {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-expanded {
  max-height: 1000px; /* Large enough for content */
}
```

---

### 10. Trust & Manufacturing (GMP, Testing, etc.)
**Location:** Below FAQ  
**Section Title:** `<h2>Quality & Manufacturing</h2>`

**Requirements:**
- GMP certification mention
- Testing information
- Made in USA (if applicable)
- Quality assurance statements
- Must be in initial HTML

**Example:**
```
<h2>Quality & Manufacturing</h2>
<p>Liver Cleanse Pills are manufactured in the USA in a GMP-certified facility. 
Each batch is tested for purity and potency. Our supplements are free from 
artificial additives, preservatives, and common allergens.</p>
```

---

### 11. Call-to-Action (CTA)
**Location:** Below trust section  
**Purpose:** Purchase/Add to Cart

**Requirements:**
- Clear CTA button
- Price display
- Add to cart functionality
- Must be in initial HTML (button may have JS functionality)

---

## CONTENT RULES

### FDA-Compliant Language

**✅ ALLOWED:**
- "Supports [normal function]"
- "Helps maintain [health]"
- "Assists with [process]"
- "Promotes [wellness]"
- "Aids [natural function]"

**❌ FORBIDDEN:**
- "Cures" or "treats"
- "Prevents" [disease]
- "Diagnoses" [condition]
- "Heals" or "fixes"
- Medical claims about diseases

### Tone Requirements

- **Neutral and factual**
- **No marketing hype**
- **Evidence-based language**
- **Professional and trustworthy**

### Technical Terms

- **DO NOT mention frameworks** (Next.js, React, etc.) in content
- **DO NOT mention code** or technical implementation
- **Focus on product benefits only**

---

## RENDERING REQUIREMENTS

### Server-Side Rendering (MANDATORY)

All content sections 1-11 must be:
- ✅ Present in initial HTML (View Page Source)
- ✅ Visible to crawlers without JavaScript
- ✅ Rendered server-side or via static generation
- ❌ NOT injected via JavaScript after page load

### JavaScript Usage

JavaScript may be used for:
- ✅ Interactive features (accordions, tabs)
- ✅ Add to cart functionality
- ✅ Image galleries
- ✅ User interactions

JavaScript may NOT be used for:
- ❌ Loading product content
- ❌ Injecting product descriptions
- ❌ Fetching product data after page load
- ❌ Hiding critical content from initial HTML

---

## VALIDATION CHECKLIST

Before publishing any PDP, verify:

- [ ] All 11 sections present in order
- [ ] H1 in initial HTML
- [ ] Summary in initial HTML
- [ ] Ingredients as text (not image-only)
- [ ] Supplement facts as text (not image-only)
- [ ] FDA disclaimer present
- [ ] Minimum 4 FAQs with answers in HTML
- [ ] All content in "View Page Source"
- [ ] No critical content injected via JS
- [ ] No medical claims
- [ ] FDA-compliant language only

---

**This structure is MANDATORY for all supplement Product Detail Pages.**
