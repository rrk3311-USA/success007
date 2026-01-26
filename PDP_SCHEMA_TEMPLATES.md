# Product Detail Page (PDP) Schema Markup Templates

**Version:** 1.0  
**Date:** January 26, 2026  
**Status:** MANDATORY FOR ALL PDPs

---

## OVERVIEW

All Product Detail Pages must include two JSON-LD schema blocks:
1. **Product Schema** - For product information and rich snippets
2. **FAQPage Schema** - For FAQ rich results in search

**CRITICAL:** Schema must be placed in `<head>` or at the top of `<body>`, and must EXACTLY match visible on-page content.

---

## A) PRODUCT SCHEMA

### Required Fields

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[Product Name]",
  "description": "[Short description - use summary paragraph]",
  "brand": {
    "@type": "Brand",
    "name": "Success Chemistry"
  },
  "category": "DietarySupplement",
  "image": [
    "[Image URL 1]",
    "[Image URL 2]",
    "[Image URL 3]"
  ],
  "sku": "[Product SKU]",
  "offers": {
    "@type": "Offer",
    "url": "[Canonical product URL]",
    "priceCurrency": "USD",
    "price": "[Price as number, e.g., 25.97]",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Success Chemistry"
    }
  }
}
```

### Optional Fields (Use if Available)

```json
{
  "gtin": "[GTIN/UPC code if available]",
  "weight": "[Product weight]",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[Rating]",
    "reviewCount": "[Number of reviews]"
  }
}
```

**⚠️ IMPORTANT:** Only include `aggregateRating` if you have REAL review data. Do not create fake ratings.

---

## B) FAQPAGE SCHEMA

### Required Structure

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question 1]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer 1 - must match on-page text exactly]"
      }
    },
    {
      "@type": "Question",
      "name": "[Question 2]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer 2 - must match on-page text exactly]"
      }
    }
    // ... more questions
  ]
}
```

**CRITICAL RULES:**
- Questions and answers must EXACTLY match visible on-page FAQ text
- No extra questions not shown on page
- No medical claims in answers
- Minimum 4 questions required

---

## COMPLETE EXAMPLE: Liver Cleanse (SKU: 10777-810)

### Product Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Liver Cleanse Pills with Detox Support Formula by Success Chemistry – Supports liver health with Milk Thistle, Dandelion Root, and Artichoke Extract. Contains 60 capsules.",
  "description": "Support your liver health with Liver Cleanse Pills by Success Chemistry. This formula features natural ingredients like milk thistle, dandelion root, and artichoke extract, traditionally known for their liver-supporting properties. It assists with the body's natural detox process and helps maintain overall liver function, contributing to your well-being.",
  "brand": {
    "@type": "Brand",
    "name": "Success Chemistry"
  },
  "category": "DietarySupplement",
  "image": [
    "https://successchemistry.com/images/products/10777-810/01.png",
    "https://successchemistry.com/images/products/10777-810/02.png",
    "https://successchemistry.com/images/products/10777-810/03.png"
  ],
  "sku": "10777-810",
  "gtin": "783325395272",
  "offers": {
    "@type": "Offer",
    "url": "https://successchemistry.com/product?sku=10777-810",
    "priceCurrency": "USD",
    "price": "25.97",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Success Chemistry"
    }
  }
}
```

### FAQPage Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does Milk Thistle support liver health and detoxification?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Milk Thistle contains silymarin, a powerful antioxidant that helps protect liver cells from toxins and supports the liver's natural regeneration process. It has been used for centuries to promote liver health and is one of the most researched herbs for liver support."
      }
    },
    {
      "@type": "Question",
      "name": "How long should I take Liver Cleanse for a complete detox?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For a thorough liver cleanse, we recommend taking Liver Cleanse Pills for 30-60 days. Many users continue taking it as ongoing liver support, especially if exposed to alcohol, processed foods, or environmental toxins regularly."
      }
    },
    {
      "@type": "Question",
      "name": "What are the signs that I might need liver support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Common signs include fatigue, digestive issues, skin problems, difficulty losing weight, and feeling sluggish after meals. If you consume alcohol, take medications, or eat processed foods regularly, your liver may benefit from additional support."
      }
    },
    {
      "@type": "Question",
      "name": "Can I take Liver Cleanse while drinking alcohol occasionally?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Liver Cleanse can help support your liver when consuming alcohol occasionally. The Milk Thistle and other ingredients help protect liver cells from oxidative stress. However, for best results, minimize alcohol consumption during your cleanse."
      }
    },
    {
      "@type": "Question",
      "name": "What makes this liver cleanse formula comprehensive?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our formula combines 10+ liver-supporting ingredients: Milk Thistle (silymarin), Dandelion Root (bile flow), Artichoke Extract (digestion), Turmeric (inflammation), Ginger, Burdock Root, and antioxidants like Grape Seed Extract - providing multi-faceted liver support."
      }
    },
    {
      "@type": "Question",
      "name": "Is Liver Cleanse safe for daily long-term use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Liver Cleanse is made with natural ingredients that are safe for ongoing daily use. Many healthcare practitioners recommend continuous liver support, especially in today's world of processed foods and environmental toxins."
      }
    }
  ]
}
```

---

## IMPLEMENTATION IN HTML

### Placement

Place schema blocks in the `<head>` section or immediately after opening `<body>` tag:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Product Name - Success Chemistry</title>
  
  <!-- Product Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "...",
    // ... rest of schema
  }
  </script>
  
  <!-- FAQPage Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [...]
  }
  </script>
</head>
<body>
  <!-- Page content -->
</body>
</html>
```

---

## DYNAMIC GENERATION (Server-Side)

### Next.js Example

```javascript
// pages/product/[sku].js
export default function ProductPage({ product }) {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.short_description,
    "brand": {
      "@type": "Brand",
      "name": "Success Chemistry"
    },
    "category": "DietarySupplement",
    "image": product.images,
    "sku": product.sku,
    "offers": {
      "@type": "Offer",
      "url": `https://successchemistry.com/product?sku=${product.sku}`,
      "priceCurrency": "USD",
      "price": product.price.toString(),
      "availability": "https://schema.org/InStock"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": product.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>
      
      {/* Page content */}
    </>
  );
}
```

---

## VALIDATION

### Google Rich Results Test

1. Visit: https://search.google.com/test/rich-results
2. Enter your product page URL
3. Verify:
   - ✅ Product schema detected
   - ✅ FAQPage schema detected
   - ✅ No errors or warnings
   - ✅ Schema matches visible content

### Schema.org Validator

1. Visit: https://validator.schema.org/
2. Paste your JSON-LD schema
3. Verify no errors

---

## COMMON MISTAKES

### Mistake #1: Schema Doesn't Match Content
```json
// ❌ WRONG: Schema says "Cures liver disease"
"description": "Cures liver disease and removes all toxins"

// ✅ CORRECT: Schema matches on-page content
"description": "Supports liver health and assists with natural detox processes"
```

### Mistake #2: Missing Required Fields
```json
// ❌ WRONG: Missing offers.price
{
  "@type": "Product",
  "name": "Product Name"
  // Missing offers
}

// ✅ CORRECT: All required fields present
{
  "@type": "Product",
  "name": "Product Name",
  "offers": {
    "@type": "Offer",
    "price": "25.97",
    "priceCurrency": "USD"
  }
}
```

### Mistake #3: FAQ Answers Don't Match
```json
// ❌ WRONG: Schema answer different from page
"acceptedAnswer": {
  "text": "Cures liver disease" // Not on page
}

// ✅ CORRECT: Schema matches page exactly
"acceptedAnswer": {
  "text": "Supports liver health" // Matches page text
}
```

---

## TEMPLATE FOR COPY-PASTE

### Product Schema Template

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[REPLACE: Product full name]",
  "description": "[REPLACE: Short description/summary]",
  "brand": {
    "@type": "Brand",
    "name": "Success Chemistry"
  },
  "category": "DietarySupplement",
  "image": [
    "[REPLACE: Image URL 1]",
    "[REPLACE: Image URL 2]",
    "[REPLACE: Image URL 3]"
  ],
  "sku": "[REPLACE: Product SKU]",
  "offers": {
    "@type": "Offer",
    "url": "[REPLACE: Full product URL]",
    "priceCurrency": "USD",
    "price": "[REPLACE: Price as string, e.g., '25.97']",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Success Chemistry"
    }
  }
}
```

### FAQPage Schema Template

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[REPLACE: Question 1]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[REPLACE: Answer 1 - must match page text]"
      }
    },
    {
      "@type": "Question",
      "name": "[REPLACE: Question 2]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[REPLACE: Answer 2 - must match page text]"
      }
    },
    {
      "@type": "Question",
      "name": "[REPLACE: Question 3]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[REPLACE: Answer 3 - must match page text]"
      }
    },
    {
      "@type": "Question",
      "name": "[REPLACE: Question 4]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[REPLACE: Answer 4 - must match page text]"
      }
    }
  ]
}
```

---

**Schema markup is MANDATORY for all Product Detail Pages.**
