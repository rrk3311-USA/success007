# Product Detail Page Remediation - Implementation Roadmap

**Version:** 1.0  
**Date:** January 26, 2026  
**Status:** ACTION PLAN

---

## OVERVIEW

This roadmap provides a step-by-step implementation plan to remediate all Product Detail Pages (PDPs) following the audit findings and canonical structure.

**Current State:** 3/100 audit score (critical failure)  
**Target State:** 29/29 QA checklist score (100% compliance)

---

## PHASE 1: PROOF OF CONCEPT (Week 1)

### Step 1: Pick 1 PDP and Implement

**Recommended:** Liver Cleanse (SKU: 10777-810)
- Has complete FAQ data (10 FAQs)
- Representative of typical product
- Complete example already provided

**Tasks:**
1. Implement server-side rendering using `PDP_TEMPLATE_SERVER_RENDERED.md`
2. Follow structure from `CANONICAL_PDP_STRUCTURE.md`
3. Use `PDP_EXAMPLE_LIVER_CLEANSE.md` as reference
4. Add Product + FAQPage schemas from `PDP_SCHEMA_TEMPLATES.md`

**Deliverable:** One fully compliant PDP

---

### Step 2: Run QA Checklist

**Tasks:**
1. Use `PDP_QA_CHECKLIST.md` to validate
2. Run all 29 checks
3. Document score (target: 29/29)
4. Fix any failures

**Validation:**
- View Page Source test
- Google Rich Results Test
- Schema.org Validator
- Core Web Vitals check

**Deliverable:** QA checklist with 29/29 score

---

### Step 3: Get Validation Review

**Tasks:**
1. Share remediated PDP URL or HTML output
2. Request tight validation against checklist logic
3. Address any remaining SEO/GPT pitfalls:
   - Canonical tags
   - Heading hierarchy
   - Hidden content patterns
   - Schema placement
   - Duplicate FAQ issues

**Deliverable:** Validated, production-ready PDP

---

## PHASE 2: HIGH-VALUE ROLLOUT (Weeks 2-3)

### Step 4: Identify Top 5 Revenue PDPs

**Criteria:**
- Highest revenue products
- Highest traffic products
- Most important SKUs

**Tasks:**
1. Pull revenue/traffic data
2. Rank products by priority
3. Select top 5 for remediation

---

### Step 5: Remediate Top 5 PDPs

**Process:**
1. For each PDP:
   - Follow canonical structure
   - Implement server-side rendering
   - Add schema markup
   - Run QA checklist
   - Fix any issues
   - Deploy

2. Use "diff-based" process:
   - Structure identical to proof-of-concept
   - Only content swapped (product data)
   - Reuse templates and patterns

**Deliverable:** 5 high-value PDPs at 29/29 compliance

---

## PHASE 3: FULL CATALOG ROLLOUT (Weeks 4-8)

### Step 6: Batch Process Remaining PDPs

**Approach:**
- Process in batches of 10-15 products
- Use automated template generation where possible
- Manual QA on each batch

**Tasks:**
1. Generate server-rendered HTML for batch
2. Add schema markup (automated where possible)
3. Run QA checklist on each
4. Fix issues
5. Deploy batch
6. Repeat for next batch

**Deliverable:** All PDPs at 29/29 compliance

---

## IMPLEMENTATION CHECKLIST

### For Each PDP:

**Pre-Implementation:**
- [ ] Review canonical structure requirements
- [ ] Gather product data (name, description, ingredients, FAQs, etc.)
- [ ] Verify product has minimum 4 FAQs (add if missing)

**Implementation:**
- [ ] Implement server-side rendering
- [ ] Add all 11 sections in correct order
- [ ] Ensure all content in initial HTML
- [ ] Add Product JSON-LD schema
- [ ] Add FAQPage JSON-LD schema (if FAQs exist)
- [ ] Add FDA disclaimer
- [ ] Implement FAQ collapse (CSS, not display: none)

**Validation:**
- [ ] Run `PDP_QA_CHECKLIST.md` (target: 29/29)
- [ ] Google Rich Results Test pass
- [ ] Schema.org Validator pass
- [ ] Core Web Vitals check (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] View Page Source test (all content present)
- [ ] Disable JavaScript test (content still visible)

**Deployment:**
- [ ] Code review
- [ ] Staging validation
- [ ] Production deploy
- [ ] Post-deploy validation
- [ ] Monitor Search Console

---

## DIFF-BASED PROCESS

### Template Structure (Reusable)

```html
<!-- Structure identical for all products -->
<section class="hero-section">
  <h1>{{product.name}}</h1>
</section>

<section class="summary-section">
  <p>{{product.short_description}}</p>
</section>

<!-- ... all 11 sections ... -->
```

### Content Swap (Product-Specific)

Only these change per product:
- Product name
- Description
- Ingredients
- FAQs
- Images
- Price
- SKU

**Everything else stays identical.**

---

## AUTOMATION OPPORTUNITIES

### Schema Generation

**Automate:**
- Product schema generation from product data
- FAQPage schema generation from FAQ data
- Schema validation before deploy

**Tool:** Build script that reads `products-data.js` and generates schemas

### Template Generation

**Automate:**
- Server-rendered HTML generation
- Batch processing of multiple products
- QA checklist validation

**Tool:** Build script that processes all products and generates compliant HTML

---

## SUCCESS METRICS

### Phase 1 (Proof of Concept)
- [ ] 1 PDP at 29/29 compliance
- [ ] QA checklist passed
- [ ] Validation review complete

### Phase 2 (High-Value Rollout)
- [ ] 5 PDPs at 29/29 compliance
- [ ] Top revenue products covered
- [ ] Process validated and repeatable

### Phase 3 (Full Catalog)
- [ ] All PDPs at 29/29 compliance
- [ ] Zero critical SEO issues
- [ ] Full schema coverage
- [ ] Core Web Vitals passing

---

## RISK MITIGATION

### Risk: Breaking Existing Functionality

**Mitigation:**
- Test thoroughly in staging
- Deploy one PDP first
- Monitor for issues
- Rollback plan ready

### Risk: Missing Product Data

**Mitigation:**
- Audit all products for required data
- Add missing FAQs before remediation
- Create data completion checklist

### Risk: Performance Regression

**Mitigation:**
- Monitor Core Web Vitals
- Optimize images
- Defer non-critical JavaScript
- Use CDN for assets

---

## RESOURCES

**Reference Documents:**
- `PDP_SEO_AUDIT_REPORT.md` - Current issues
- `CANONICAL_PDP_STRUCTURE.md` - Required structure
- `PDP_RENDERING_RULES.md` - Technical requirements
- `PDP_SCHEMA_TEMPLATES.md` - Schema examples
- `PDP_TEMPLATE_SERVER_RENDERED.md` - Template
- `PDP_EXAMPLE_LIVER_CLEANSE.md` - Reference implementation
- `PDP_QA_CHECKLIST.md` - Validation checklist
- `SCHEMA_VALIDATION_PROTOCOL.md` - Schema validation
- `PUBLIC_PAGES_INDEXING_POLICY.md` - Indexing rules

**Validation Tools:**
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/
- Google PageSpeed Insights: https://pagespeed.web.dev/

---

## TIMELINE SUMMARY

**Week 1:** Proof of concept (1 PDP)  
**Weeks 2-3:** High-value rollout (5 PDPs)  
**Weeks 4-8:** Full catalog rollout (all remaining PDPs)

**Total Estimated Time:** 8 weeks for complete remediation

---

**This roadmap ensures systematic, validated remediation of all Product Detail Pages.**
