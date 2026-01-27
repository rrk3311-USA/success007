# Sclera White - Google Merchant Center Supplemental Feed ✅

## What Was Created

A **supplemental feed** specifically for Sclera White products that can be used alongside your main Google Merchant Center feed.

### Files Created:
1. **`deploy-site/feeds/generate-sclera-supplemental-feed.js`** - Generator script
2. **`deploy-site/feeds/sclera-supplemental-feed.xml`** - Generated XML feed

### Products Included:
- ✅ **10786-807** - Sclera White Single Bottle
- ✅ **10786-807-2** - Sclera White 2-Pack Bundle
- ✅ **10786-807-3** - Sclera White 3-Pack Bundle

---

## Connection Status

**✅ YES - You are connected to Google!**

Based on your existing setup:
- ✅ Google Merchant Center feed exists: `google-merchant-feed.xml`
- ✅ Google UCP (Universal Commerce Protocol) integration is set up
- ✅ Google Ads account linked (Customer ID: 3593851507)
- ✅ Supplemental feed ready for Sclera products

---

## How to Use This Supplemental Feed

### Step 1: Upload to Google Merchant Center

1. Go to [Google Merchant Center](https://merchants.google.com)
2. Navigate to **Products** → **Feeds**
3. Click **"+ Add supplemental feed"** (or **"Supplemental feeds"** → **"Add supplemental feed"**)
4. Choose **"Scheduled fetch"**
5. Enter feed URL:
   ```
   https://successchemistry.com/feeds/sclera-supplemental-feed.xml
   ```
   (Or use: `https://success-chemistry-shop.netlify.app/feeds/sclera-supplemental-feed.xml` if that's your production URL)
6. Set schedule: **Daily automatic fetch**
7. Click **"Save"**

### Step 2: Verify Feed Processing

- Google will fetch and process the feed within 24 hours
- Check feed status in Merchant Center dashboard
- Look for any errors or warnings

### Step 3: Monitor Performance

- The supplemental feed will enhance your main feed with Sclera-specific attributes
- Use custom labels for campaign segmentation:
  - `custom_label_0`: "Sclera White"
  - `custom_label_1`: "Eye Health"
  - `custom_label_2`: "Single" or "Bundle"
  - `custom_label_3`: Price tier
  - `custom_label_4`: "Supplemental Feed"

---

## Regenerating the Feed

To update the feed with latest product data:

```bash
cd deploy-site/feeds
node generate-sclera-supplemental-feed.js
```

This will regenerate `sclera-supplemental-feed.xml` with current product information.

---

## Feed Features

### What Makes This Supplemental?

A **supplemental feed** adds or updates specific attributes for products that already exist in your main feed. Benefits:

1. **Targeted Updates** - Only Sclera products get enhanced attributes
2. **Campaign Segmentation** - Custom labels for better ad targeting
3. **Flexibility** - Can update Sclera products independently
4. **Non-Disruptive** - Works alongside your main feed without conflicts

### Feed Attributes Included:

- ✅ Standard product data (title, description, price, images)
- ✅ Google product category
- ✅ GTIN/UPC codes
- ✅ Merchant item ID for matching
- ✅ UCP attributes (`native_commerce: TRUE`)
- ✅ Consumer notice (FDA disclaimer)
- ✅ Custom labels for segmentation
- ✅ Additional product images

---

## Production URL Configuration

The feed generator uses `https://successchemistry.com` as the base URL by default.

To change the production URL, either:

1. **Set environment variable:**
   ```bash
   export PRODUCTION_URL=https://your-domain.com
   node generate-sclera-supplemental-feed.js
   ```

2. **Edit the script:**
   ```javascript
   const BASE_URL = 'https://your-domain.com';
   ```

---

## Troubleshooting

### Feed Not Processing?
- ✅ Verify the feed URL is accessible publicly
- ✅ Check XML syntax is valid
- ✅ Ensure product IDs match your main feed
- ✅ Wait 24 hours for initial processing

### Products Not Showing?
- ✅ Verify SKUs exist in your main feed
- ✅ Check that merchant_item_id matches product ID
- ✅ Ensure products are approved in Merchant Center

### Need to Add More Products?
Edit `generate-sclera-supplemental-feed.js` and add SKUs to:
```javascript
const SCLERA_SKUS = ['10786-807', '10786-807-2', '10786-807-3', 'NEW-SKU'];
```

---

## Next Steps

1. ✅ **Deploy the feed file** to your production server
2. ✅ **Upload to Google Merchant Center** as supplemental feed
3. ✅ **Monitor feed status** for errors
4. ✅ **Use custom labels** in Google Ads campaigns for Sclera products
5. ✅ **Regenerate feed** when product data changes

---

## Support

- **Google Merchant Center Help:** https://support.google.com/merchants
- **Feed Requirements:** https://support.google.com/merchants/answer/7052112
- **Supplemental Feeds Guide:** https://support.google.com/merchants/answer/188494

---

**Created:** January 26, 2026  
**Status:** ✅ Ready for Google Merchant Center upload  
**Feed URL:** `https://successchemistry.com/feeds/sclera-supplemental-feed.xml`
