# Resume Hero Header

**Last Updated:** January 2025  
**Source:** Los Angeles - Marketing and Branding Specialist (resume)

---

## Overview

A **resume-based hero section** you can place **below the universal header** on contact, about, or portfolio pages. Content is pulled from your resume for a consistent personal brand.

---

## Files

- **HTML:** `deploy-site/includes/resume-hero.html`
- **CSS:** `deploy-site/includes/resume-hero.css`

---

## How to Use

1. **Include the CSS** in your page `<head>` (before `</head>`):

```html
<link rel="stylesheet" href="/includes/resume-hero.css">
```

2. **Include the universal header** (if the page uses it):

```html
<!--#include virtual="/includes/universal-header.html" -->
<link rel="stylesheet" href="/includes/universal-header.css">
```

3. **Include the resume hero** right after the header wrapper:

```html
<!--#include virtual="/includes/resume-hero.html" -->
```

4. **Or** paste the contents of `resume-hero.html` and `resume-hero.css` directly into your page if you don’t use SSI.

---

## Content (from resume)

- **Label:** Marketing & Branding Specialist · Los Angeles
- **Headline:** Growth focused specialist with a proven ability to scale digital businesses.
- **Tagline:** Full sentence on visual communication, UX, and revenue growth.
- **Meta:** Marketplace & Brand Manager · Success Chemistry
- **Skills:** A/B Testing · Google Ads · LTV/CAC · Marketplace Strategy · Product-Led Growth · Shopify · Amazon · UX Design · Brand Narrative

---

## Styling

- Light gradient background (`#f8fafc` → `#f1f5f9`)
- Blue label (`#2854a6`) to match site nav
- Purple gradient accent bar at bottom (same animation as universal header)
- Responsive typography and spacing

To change copy, edit `deploy-site/includes/resume-hero.html`.
