# Batch PDP Validation Guide

## Overview

The batch validator tests multiple product pages for SEO compliance and generates detailed reports. This is your **CI gate** - all PDPs must pass before deployment.

## Quick Start

### Validate Specific SKUs

```bash
node batch-validate-pdps.js --base http://localhost:8080 --skus 10786-807,10777-810,20647-507
```

### Validate All Products

```bash
node batch-validate-pdps.js --base http://localhost:8080 --all
```

### Validate from URL List

Create `urls.txt`:
```
http://localhost:8080/product/10786-807
http://localhost:8080/product/10777-810
http://localhost:8080/product/20647-507
```

Then run:
```bash
node batch-validate-pdps.js urls.txt
```

## Validation Checks (29/29 Criteria)

### Required Checks (Must Pass)
- ✅ **Title**: Present and includes product name
- ✅ **Meta Description**: Present (non-trivial length)
- ✅ **Canonical URL**: Present and matches expected pattern
- ✅ **Product Schema**: Exactly 1 Product JSON-LD (no duplicates)
- ✅ **FAQ Schema**: FAQPage JSON-LD present if FAQs exist
- ✅ **FAQ Visibility**: FAQ answers not `display:none` (collapse allowed)

### Optional Checks (Warnings)
- ⚠️ **H1**: Present (recommended)
- ⚠️ **Price**: Visible in DOM
- ⚠️ **Product Image**: Present

## Output Files

Reports are saved to `validation_reports/`:

- **`report.json`**: Full validation details (latest)
- **`report.csv`**: Executive-friendly summary (latest)
- **`report-YYYY-MM-DD.json`**: Timestamped full report
- **`report-YYYY-MM-DD.csv`**: Timestamped CSV summary

## CSV Columns

| Column | Description |
|--------|-------------|
| `url` | Product page URL |
| `pass` | true/false |
| `failures` | Semicolon-separated list of failures |
| `ldjsonCount` | Total JSON-LD scripts |
| `productSchemaCount` | Number of Product schemas (should be 1) |
| `hasProductSchema` | true/false |
| `hasFAQSchema` | true/false |
| `canonical` | yes/no |
| `title` | yes/no |
| `descLen` | Description length (0 or 1) |
| `h1` | yes/no |
| `price` | yes/no |
| `faqCount` | Number of FAQs |
| `firstFaqVisible` | true/false |

## Exit Codes

- **0**: All PDPs passed ✅
- **1**: One or more PDPs failed ❌

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Validate PDPs
  run: |
    npm start &
    sleep 5
    node batch-validate-pdps.js --base http://localhost:8080 --all
```

### Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-push

node batch-validate-pdps.js --base http://localhost:8080 --skus 10786-807,10777-810
if [ $? -ne 0 ]; then
  echo "❌ PDP validation failed. Fix issues before pushing."
  exit 1
fi
```

## Common Issues

### FAQ Visibility Failures
**Issue**: `First FAQ answer hidden (display:none)`

**Fix**: Ensure first FAQ answer has `display: block` by default, or use `max-height`/`opacity` for collapse animations instead of `display:none`.

### Duplicate Schema
**Issue**: `Duplicate Product schemas (2 found)`

**Fix**: Check that client-side schema injection skips if SSR schema already exists.

### Missing Canonical
**Issue**: `Missing canonical link`

**Fix**: Verify SSR is injecting canonical URL in `server-render-product.js`.

## Best Practices

1. **Run before every deployment**: Validate all products with `--all`
2. **Validate top sellers first**: Use `--skus` with your highest-traffic SKUs
3. **Check reports after fixes**: Review `report.json` for detailed failure reasons
4. **Track over time**: Timestamped reports help identify regressions

## Examples

### Validate Top 10 Products

```bash
node batch-validate-pdps.js \
  --base http://localhost:8080 \
  --skus 10786-807,10777-810,20647-507,52274-401,14179-504-2
```

### Validate Production URLs

```bash
node batch-validate-pdps.js \
  --base https://successchemistry.com \
  --skus 10786-807,10777-810
```

### Generate Report for Stakeholders

```bash
node batch-validate-pdps.js --base http://localhost:8080 --all
# Share validation_reports/report.csv with team
```
