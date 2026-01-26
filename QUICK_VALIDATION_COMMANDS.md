# Quick Validation Commands

## Basic Usage

### Validate Specific Products
```bash
node batch-validate-pdps.js --base http://localhost:8080 --skus 10786-807,10777-810,20647-507
```

### Validate All Products (Slow - 112 products)
```bash
node batch-validate-pdps.js --base http://localhost:8080 --all
```

### Validate from URL File
```bash
node batch-validate-pdps.js sample-urls.txt
```

## Recommended: Validate Top Products First

Instead of validating all 112 products (which takes ~5-10 minutes), validate your top sellers first:

```bash
# Top 10 products
node batch-validate-pdps.js --base http://localhost:8080 --skus 10786-807,10777-810,20647-507,52274-401,14179-504-2,10775-506,10783-501,10784-807,10779-123,10788-302-1
```

## Single Product Validation

For quick testing of one product:
```bash
node validate-pdp-playwright.js "http://localhost:8080/product/10786-807"
```

With JSON output:
```bash
node validate-pdp-playwright.js "http://localhost:8080/product/10786-807" --json
```

## Check Reports

After validation, check the reports:
```bash
# View latest JSON report
cat validation_reports/report.json | jq '.[] | {url, pass, failures}'

# View latest CSV report
cat validation_reports/report.csv
```

## Tips

1. **Start small**: Validate 5-10 products first
2. **Fix issues**: Address failures before running full batch
3. **Use --all sparingly**: Only when you need to validate everything
4. **Check server**: Make sure `http://localhost:8080` is running

## Server Status

Check if server is running:
```bash
curl -s http://localhost:8080/ | head -1
```

Start server if needed:
```bash
npm start
# or
node local-server.js
```
