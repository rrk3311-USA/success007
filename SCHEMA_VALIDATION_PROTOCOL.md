# Schema Validation Protocol

**Version:** 1.0  
**Date:** January 26, 2026  
**Status:** MANDATORY - Required for all Product Detail Pages

---

## OVERVIEW

This protocol defines the validation requirements for JSON-LD schema markup on Product Detail Pages. All schemas must pass validation before pages go live.

**Validation Tools:**
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

---

## VALIDATION REQUIREMENTS

### Requirement #1: Rich Results Test Pass

**Tool:** Google Rich Results Test  
**URL:** https://search.google.com/test/rich-results

**Test Steps:**
1. Enter product page URL
2. Click "Test URL"
3. Verify results

**Pass Criteria:**
- ✅ Product schema detected
- ✅ FAQPage schema detected (if product has FAQs)
- ✅ No errors
- ✅ No critical warnings

**Fail Criteria:**
- ❌ Schema not detected
- ❌ Errors present
- ❌ Critical warnings (price mismatch, missing required fields)

---

### Requirement #2: Schema.org Validator Pass

**Tool:** Schema.org Validator  
**URL:** https://validator.schema.org/

**Test Steps:**
1. Copy JSON-LD schema from page source
2. Paste into validator
3. Select "JSON-LD" format
4. Click "Run Test"

**Pass Criteria:**
- ✅ Valid JSON syntax
- ✅ Valid schema.org structure
- ✅ All required fields present
- ✅ No type mismatches

**Fail Criteria:**
- ❌ Invalid JSON
- ❌ Missing required fields
- ❌ Type mismatches
- ❌ Invalid property values

---

## PRODUCT SCHEMA VALIDATION

### Required Fields Check

Verify all required fields present:

- [ ] `@context` = "https://schema.org"
- [ ] `@type` = "Product"
- [ ] `name` - Product name (string)
- [ ] `description` - Product description (string)
- [ ] `brand.name` - Brand name (string)
- [ ] `category` - "DietarySupplement" or "Health & Beauty"
- [ ] `image` - Array of image URLs (minimum 1)
- [ ] `sku` - Product SKU (string)
- [ ] `offers.@type` = "Offer"
- [ ] `offers.url` - Canonical product URL
- [ ] `offers.priceCurrency` = "USD"
- [ ] `offers.price` - Price as string (e.g., "25.97")
- [ ] `offers.availability` = "https://schema.org/InStock"

### Optional Fields (Use if Available)

- [ ] `gtin` - GTIN/UPC code (if available)
- [ ] `weight` - Product weight (if available)
- [ ] `aggregateRating` - Only if REAL review data exists

### Common Validation Errors

#### Error: Missing Required Field
**Problem:** Required field missing (e.g., `offers.price`)  
**Fix:** Add missing field to schema

#### Error: Price Mismatch
**Problem:** Schema price doesn't match visible page price  
**Fix:** Update schema price to match page exactly

#### Error: Invalid Availability
**Problem:** `availability` value incorrect  
**Fix:** Use `"https://schema.org/InStock"` for in-stock items

#### Error: Missing Brand
**Problem:** `brand` object missing or incomplete  
**Fix:** Add `brand` with `@type: "Brand"` and `name: "Success Chemistry"`

#### Error: Invalid Image URL
**Problem:** Image URL returns 404 or invalid  
**Fix:** Verify image URLs are accessible and return 200 status

---

## FAQPAGE SCHEMA VALIDATION

### Required Fields Check

Verify all required fields present:

- [ ] `@context` = "https://schema.org"
- [ ] `@type` = "FAQPage"
- [ ] `mainEntity` - Array of Question objects
- [ ] Each Question has `@type` = "Question"
- [ ] Each Question has `name` (question text)
- [ ] Each Question has `acceptedAnswer.@type` = "Answer"
- [ ] Each Question has `acceptedAnswer.text` (answer text)

### Minimum Requirements

- [ ] Minimum 4 questions in `mainEntity` array
- [ ] All questions have answers
- [ ] Question text matches visible page text exactly
- [ ] Answer text matches visible page text exactly

### Common Validation Errors

#### Error: Question/Answer Mismatch
**Problem:** Schema FAQ text doesn't match page text  
**Fix:** Update schema to match page text exactly (including punctuation)

#### Error: Missing Answers
**Problem:** Questions without `acceptedAnswer`  
**Fix:** Add `acceptedAnswer` object to all questions

#### Error: Medical Claims in Answers
**Problem:** Answers contain forbidden medical language  
**Fix:** Remove "cure," "treat," "prevent" language from answers

#### Error: Duplicate Questions
**Problem:** Same question appears multiple times  
**Fix:** Remove duplicates, ensure unique questions

---

## VALIDATION CHECKLIST

### Pre-Publish Validation

Before publishing any PDP, complete:

- [ ] **Google Rich Results Test**
  - [ ] Product schema detected
  - [ ] FAQPage schema detected (if applicable)
  - [ ] No errors
  - [ ] No critical warnings
  - [ ] Screenshot saved

- [ ] **Schema.org Validator**
  - [ ] Product schema valid
  - [ ] FAQPage schema valid (if applicable)
  - [ ] No JSON syntax errors
  - [ ] All required fields present

- [ ] **Content Match Check**
  - [ ] Schema `name` matches page H1
  - [ ] Schema `description` matches page summary
  - [ ] Schema `price` matches visible price
  - [ ] FAQ questions match page questions exactly
  - [ ] FAQ answers match page answers exactly

- [ ] **Field Completeness**
  - [ ] All required Product fields present
  - [ ] All required FAQPage fields present
  - [ ] Optional fields used appropriately (no fake ratings)

---

## AUTOMATED VALIDATION

### Recommended Tools

1. **Google Search Console**
   - Monitor Rich Results status
   - Check for schema errors
   - Review enhancement reports

2. **Schema Markup Validator (Browser Extension)**
   - Real-time validation
   - Quick checks during development

3. **Lighthouse (Schema Audit)**
   - Automated schema detection
   - Part of broader page audit

### Validation Script Example

```javascript
// Example validation check (pseudo-code)
function validateSchema(pageUrl) {
  const schema = extractJSONLD(pageUrl);
  
  // Check Product schema
  if (!schema.product) {
    return { error: "Product schema missing" };
  }
  
  // Check required fields
  const required = ['name', 'description', 'offers'];
  for (let field of required) {
    if (!schema.product[field]) {
      return { error: `Missing required field: ${field}` };
    }
  }
  
  // Check price format
  if (typeof schema.product.offers.price !== 'string') {
    return { error: "Price must be string" };
  }
  
  return { success: true };
}
```

---

## POST-PUBLISH MONITORING

### Weekly Checks

- [ ] Google Search Console → Enhancements → Products
- [ ] Check for schema errors or warnings
- [ ] Review Rich Results performance
- [ ] Monitor FAQ rich results (if applicable)

### Monthly Review

- [ ] Validate top 10 PDPs with Rich Results Test
- [ ] Check schema.org validator for any new errors
- [ ] Review Search Console for schema-related issues
- [ ] Update schemas if product data changes

---

## TROUBLESHOOTING

### Issue: Schema Not Detected

**Possible Causes:**
- Schema not in `<head>` or top of `<body>`
- Invalid JSON syntax
- Schema commented out or hidden

**Fix:**
- Move schema to `<head>` section
- Validate JSON syntax
- Ensure schema is not commented

### Issue: Price Mismatch Warning

**Possible Causes:**
- Schema price doesn't match visible price
- Currency mismatch
- Price format incorrect

**Fix:**
- Update schema price to match page exactly
- Ensure `priceCurrency` is "USD"
- Use string format for price (e.g., "25.97")

### Issue: FAQ Rich Results Not Showing

**Possible Causes:**
- Less than 4 FAQs
- FAQ text doesn't match schema
- FAQ answers not in HTML

**Fix:**
- Ensure minimum 4 FAQs
- Match schema text to page text exactly
- Verify answers exist in HTML (not just schema)

---

## VALIDATION REPORT TEMPLATE

**Page URL:** _______________________  
**Product SKU:** _______________________  
**Date Validated:** _______________________

### Google Rich Results Test
- [ ] ✅ Pass - Product schema detected
- [ ] ✅ Pass - FAQPage schema detected
- [ ] ✅ Pass - No errors
- [ ] ⚠️ Warning - [Describe warning]
- [ ] ❌ Error - [Describe error]

### Schema.org Validator
- [ ] ✅ Pass - Valid JSON
- [ ] ✅ Pass - Valid structure
- [ ] ✅ Pass - All required fields
- [ ] ❌ Error - [Describe error]

### Content Match
- [ ] ✅ Pass - Schema matches page content
- [ ] ❌ Fail - [Describe mismatch]

**Overall Status:**
- [ ] ✅ **APPROVED** - Ready to publish
- [ ] ❌ **REJECTED** - Fixes required

**Notes:**
_________________________________________________________________
_________________________________________________________________

---

**Schema validation is MANDATORY before any Product Detail Page goes live.**
