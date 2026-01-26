# Public Pages Indexing Policy

**Version:** 1.0  
**Date:** January 26, 2026  
**Status:** MANDATORY - Prevents accidental indexing of non-public pages

---

## OVERVIEW

This document defines which pages should be indexed by search engines and which should be excluded. This prevents accidental indexing of admin, utility, and private routes that could harm SEO or expose sensitive information.

---

## INDEX (Allow Crawling)

### Product Pages
- ✅ `/product?sku=*` - All Product Detail Pages
- ✅ `/product/*` - Product pages (if using path-based URLs)

### Category & Shop Pages
- ✅ `/shop` - Main shop/catalog page
- ✅ `/shop/*` - Category pages (if applicable)

### Content Pages
- ✅ `/blog` - Blog listing page
- ✅ `/blog/*` - Individual blog posts
- ✅ `/` - Homepage

### Policy Pages (Public)
- ✅ `/terms-of-service.html` - Terms of Service
- ✅ `/shipping-returns.html` - Shipping & Returns
- ✅ `/payment-policy.html` - Payment Policy
- ✅ `/privacy-policy.html` - Privacy Policy
- ✅ `/contact` - Contact page
- ✅ `/faq` - FAQ page

---

## NOINDEX (Block Crawling)

### Admin & Dashboard Pages
- ❌ `/admin` - Admin dashboard
- ❌ `/admin/*` - All admin sub-pages
- ❌ `/wp-admin` - WordPress admin (if applicable)
- ❌ `/wp-admin/*` - WordPress admin sub-pages
- ❌ `/my-account-dashboard.html` - User account dashboard
- ❌ `/command-center` - Command center
- ❌ `/command-center/*` - Command center sub-pages

### User Account Pages
- ❌ `/account` - User account page
- ❌ `/account/*` - All account sub-pages
- ❌ `/login` - Login page
- ❌ `/register` - Registration page
- ❌ `/forgot-password` - Password reset

### E-commerce Utility Pages
- ❌ `/cart` - Shopping cart
- ❌ `/checkout` - Checkout page
- ❌ `/checkout/*` - Checkout sub-pages
- ❌ `/order-confirmation` - Order confirmation
- ❌ `/thank-you.html` - Thank you page
- ❌ `/payment-success` - Payment success
- ❌ `/payment-failure` - Payment failure

### Development/Test Pages
- ❌ `/debug.html` - Debug page
- ❌ `/test-products.html` - Test products
- ❌ `/test-isometric-cart.html` - Test cart
- ❌ `/minimal-shop.html` - Minimal shop demo
- ❌ `/branding-kit.html` - Branding kit
- ❌ `/frosted-glass-*` - Demo pages

### API & Data Endpoints
- ❌ `/api/*` - All API endpoints
- ❌ `/products-data.js` - Product data file (not a page)
- ❌ `/feeds/*` - Feed generation pages (unless public merchant feeds)

### Email Templates
- ❌ `/email-templates/*` - Email template previews

---

## IMPLEMENTATION

### robots.txt

Place in root: `/robots.txt`

```
User-agent: *
Allow: /
Allow: /shop
Allow: /blog
Allow: /product
Allow: /terms-of-service.html
Allow: /shipping-returns.html
Allow: /payment-policy.html
Allow: /privacy-policy.html
Allow: /contact
Allow: /faq

Disallow: /admin
Disallow: /admin/
Disallow: /wp-admin
Disallow: /wp-admin/
Disallow: /account
Disallow: /account/
Disallow: /cart
Disallow: /checkout
Disallow: /checkout/
Disallow: /login
Disallow: /register
Disallow: /my-account-dashboard.html
Disallow: /command-center
Disallow: /command-center/
Disallow: /debug.html
Disallow: /test-*
Disallow: /api/
Disallow: /email-templates/

# Sitemap
Sitemap: https://successchemistry.com/sitemap.xml
```

### Meta Robots Tags

For pages that should be NOINDEX, add to `<head>`:

```html
<meta name="robots" content="noindex, nofollow">
```

**Pages requiring NOINDEX meta tag:**
- All admin pages
- All account pages
- Cart and checkout pages
- Test/debug pages
- Email template previews

### X-Robots-Tag Header (Alternative)

For server-side control, set HTTP header:

```
X-Robots-Tag: noindex, nofollow
```

---

## SITEMAP INCLUSION

### Include in sitemap.xml:
- ✅ Homepage
- ✅ All Product Detail Pages
- ✅ Shop/Category pages
- ✅ Blog posts
- ✅ Public policy pages
- ✅ FAQ page

### Exclude from sitemap.xml:
- ❌ Admin pages
- ❌ Account pages
- ❌ Cart/checkout
- ❌ Test pages
- ❌ API endpoints

---

## VALIDATION

### Test robots.txt
1. Visit: `https://yoursite.com/robots.txt`
2. Verify all NOINDEX paths listed
3. Test with Google Search Console robots.txt tester

### Test Meta Robots
1. View Page Source on NOINDEX pages
2. Verify `<meta name="robots" content="noindex, nofollow">` present
3. Test with Google Search Console URL Inspection tool

### Verify Sitemap
1. Check `sitemap.xml` includes only public pages
2. Verify no admin/account pages listed
3. Submit to Google Search Console

---

## COMMON MISTAKES

### Mistake #1: Indexing Cart/Checkout
**Problem:** Cart pages indexed, showing prices/items in search results  
**Fix:** Add `/cart` and `/checkout` to robots.txt Disallow

### Mistake #2: Indexing Admin Pages
**Problem:** Admin dashboard accessible via search  
**Fix:** Add `/admin` and `/admin/*` to robots.txt Disallow + meta robots

### Mistake #3: Test Pages in Sitemap
**Problem:** Test/debug pages indexed  
**Fix:** Exclude from sitemap.xml, add to robots.txt Disallow

---

## QUICK REFERENCE

**Always INDEX:**
- Product pages
- Shop/category pages
- Blog posts
- Public policy pages
- Homepage

**Always NOINDEX:**
- Admin/dashboard pages
- User account pages
- Cart/checkout pages
- Test/debug pages
- API endpoints

---

**This policy is MANDATORY to prevent SEO issues and security exposure.**
