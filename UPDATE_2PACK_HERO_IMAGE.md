# Update 2-Pack Hero Image Update Instructions

## Image File Location
The new 2-pack hero image has been saved to:
```
deploy-site/images/products/10777-810/02-hero-2pack-main.png
```

## Option 1: Manual Upload (Recommended)

1. **Upload to WordPress Media Library:**
   - Go to WordPress Admin → Media → Add New
   - Upload: `deploy-site/images/products/10777-810/02-hero-2pack-main.png`
   - Copy the image URL (e.g., `https://blueviolet-snake-802946.hostingersite.com/wp-content/uploads/2026/01/...`)

2. **Update Product:**
   - Go to WooCommerce → Products
   - Find: "Success Chemistry Liver Cleanse 2-Pack" (SKU: 10777-810-2)
   - Edit product
   - Set the uploaded image as the featured/main image
   - Save

## Option 2: Use Script (After Image is Accessible)

Once the image is uploaded and accessible via URL, run:
```bash
node update-woocommerce-2pack-hero.js
```

Or provide the image URL and I can update the product programmatically.

## Current Status

- ✅ Image file saved locally
- ✅ Product created in WooCommerce (ID: 6774)
- ⏳ Waiting for image to be uploaded to WordPress media library

## Quick Update Script

If you provide the WordPress media URL, I can create a quick script to update the product immediately.
