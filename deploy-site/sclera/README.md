# Sclera White – International (i18n) Pages

Twelve language-specific landing pages for **Sclera White** (SKU `10786-807`) for international sales. Each page is a translated product overview with CTA linking to the main product page.

## Languages (13 total)

| Code | Language    | Path           |
|------|-------------|----------------|
| en   | English     | `/sclera/en`   |
| es   | Spanish     | `/sclera/es`   |
| fr   | French      | `/sclera/fr`   |
| de   | German      | `/sclera/de`   |
| pt   | Portuguese  | `/sclera/pt`   |
| it   | Italian     | `/sclera/it`   |
| zh   | Chinese     | `/sclera/zh`   |
| ja   | Japanese    | `/sclera/ja`   |
| ar   | Arabic      | `/sclera/ar`   |
| ru   | Russian     | `/sclera/ru`   |
| hi   | Hindi       | `/sclera/hi`   |
| ko   | Korean      | `/sclera/ko`   |
| nl   | Dutch       | `/sclera/nl`   |

## Regenerating pages

After editing `locales.json` or product data:

```bash
npm run sclera:i18n
```

Or directly:
```bash
node deploy-site/sclera/generate-full-i18n-pages.js
```

**Note:** The generator creates **full product pages** with:
- ✅ Product images (hero + gallery carousel)
- ✅ Bundle selector (Subscribe, 2-pack, 3-pack, 5-pack) with images
- ✅ Payment card (PayPal buttons + Add to Cart)
- ✅ Product details (ingredients, supplement facts, FAQ)
- ✅ Subscribe & Save section
- ✅ Upsells/recommended products
- ✅ All JavaScript functionality (cart, bundles, PayPal)

## Subdomain setup (optional)

To serve each language on its own subdomain (e.g. `fr.successchemistry.com`, `de.successchemistry.com`):

1. **DNS**: Add CNAME records  
   - `fr` → your main domain or CDN  
   - `de` → same  
   - (repeat for each lang you want as subdomain)

2. **Hosting (e.g. Netlify)**  
   - Either use path-based rewrites so `fr.successchemistry.com` serves `/sclera/fr/`, or  
   - Deploy each lang as a separate site and point the subdomain to it.

3. **Canonical URLs**: Each page already uses  
   `https://successchemistry.com/sclera/{lang}/` as canonical.  
   If you switch to subdomains, update the generator to use  
   `https://{lang}.successchemistry.com/` (or your chosen pattern) and regenerate.

## Links

- **Base**: `/sclera` → redirects to `/sclera/en`
- **Product**: CTA links to `/product?sku=10786-807` (main PDP).
