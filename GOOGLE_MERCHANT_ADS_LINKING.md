# Linking Google Merchant Center to Google Ads

## Your Account Details

**Google Ads Customer ID:** 3593851507  
**Service Account:** Already configured in `.env`

## Why Link Merchant Center to Google Ads?

Linking enables:
- **Shopping Campaigns** - Run product ads on Google Search
- **Performance Max** - AI-powered campaigns across all Google properties
- **Smart Shopping** - Automated bidding and ad placement
- **Product Feed Ads** - Show your supplements directly in search results
- **Conversion Tracking** - Track sales from ads to checkout

## Step-by-Step Linking Process

### Step 1: Access Google Merchant Center
1. Go to: https://merchants.google.com
2. Sign in with your Google account
3. Select your Success Chemistry merchant account

### Step 2: Link to Google Ads
1. In Merchant Center, click **Settings** (gear icon)
2. Navigate to **Linked accounts**
3. Find **Google Ads** section
4. Click **Link account**
5. Enter your Google Ads Customer ID: **3593851507**
6. Click **Send link request**

### Step 3: Approve in Google Ads
1. Go to: https://ads.google.com
2. Click **Tools & Settings** → **Setup** → **Linked accounts**
3. Find **Google Merchant Center** section
4. You should see a pending request from your Merchant Center
5. Click **Approve**
6. Select link type: **Standard** (recommended)
7. Click **Approve link**

### Step 4: Verify Link
1. Back in Merchant Center, go to **Linked accounts**
2. Status should show: **Linked** with a green checkmark
3. You should see your Google Ads account ID: 3593851507

## What Happens After Linking?

✅ **Immediate Benefits:**
- Product data flows to Google Ads
- Can create Shopping campaigns
- Access to Performance Max campaigns
- Product feed available in Ads interface

✅ **Campaign Types You Can Run:**

**1. Shopping Campaigns**
- Show product images, prices, and store name
- Appear in Google Shopping tab
- Display on Search results
- Cost-per-click (CPC) bidding

**2. Performance Max Campaigns**
- AI-optimized across all Google channels
- YouTube, Display, Search, Discover, Gmail, Maps
- Automated bidding and creative
- Best for scaling

**3. Local Inventory Ads** (if you have physical stores)
- Show in-store availability
- Drive foot traffic

## Setting Up Your First Shopping Campaign

### Prerequisites (After Linking):
1. ✅ Merchant Center linked to Ads (3593851507)
2. ✅ Product feed approved in Merchant Center
3. ✅ UCP profile published (already done)
4. ✅ Return policy configured
5. ✅ Shipping settings configured

### Campaign Setup:
1. In Google Ads, click **+ New Campaign**
2. Select goal: **Sales** or **Website traffic**
3. Campaign type: **Shopping**
4. Select your Merchant Center account
5. Choose campaign subtype:
   - **Standard Shopping** - Manual control
   - **Smart Shopping** - Automated (recommended to start)

### Budget Recommendations:
- **Testing Phase:** $20-50/day
- **Scaling Phase:** $100-300/day
- **Mature Phase:** $500+/day

### Product Groups to Prioritize:
Based on your catalog:
1. **Women's Balance** (SKU: 52274-401) - $28
2. **Prostate Renew** bundles - Higher AOV
3. **Sclera White** bundles - Popular category
4. **Best-selling supplements** - Proven demand

## Conversion Tracking Setup

### Step 1: Create Conversion Action
1. In Google Ads: **Tools** → **Conversions**
2. Click **+ New conversion action**
3. Select **Website**
4. Category: **Purchase**
5. Value: **Use transaction-specific values**
6. Count: **Every conversion**

### Step 2: Install Conversion Tag
Add to your checkout success page:

```html
<!-- Google Ads Conversion Tracking -->
<script>
gtag('event', 'conversion', {
    'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
    'value': transactionTotal,
    'currency': 'USD',
    'transaction_id': orderId
});
</script>
```

### Step 3: Enhanced Conversions (Recommended)
Enable for better tracking:
1. In conversion action settings
2. Turn on **Enhanced conversions**
3. Sends hashed customer data (email, phone)
4. Improves attribution accuracy

## Product Feed Optimization for Ads

### Critical Attributes for Shopping Ads:
```xml
<entry>
  <g:id>52274-401</g:id>
  <title>Women's Balance - Female Libido Support - 60 Capsules</title>
  <description>Premium female wellness supplement with L-Arginine, Maca, Ashwagandha...</description>
  <g:link>https://successchemistry.com/product/52274-401</g:link>
  <g:image_link>https://success-chemistry-shop.netlify.app/images/products/52274-401/01.png</g:image_link>
  <g:price>28.00 USD</g:price>
  <g:availability>in stock</g:availability>
  <g:brand>Success Chemistry</g:brand>
  <g:condition>new</g:condition>
  <g:google_product_category>Health & Beauty > Health Care > Fitness & Nutrition > Vitamins & Supplements</g:google_product_category>
  
  <!-- UCP Attributes (already added) -->
  <g:native_commerce>TRUE</g:native_commerce>
  <g:consumer_notice>...</g:consumer_notice>
</entry>
```

## Budget Allocation Strategy

### Month 1: Testing ($1,500-2,000)
- Test different product groups
- Find winning keywords
- Optimize bids
- A/B test ad copy

### Month 2-3: Scaling ($3,000-5,000)
- Scale winning products
- Expand to Performance Max
- Add remarketing
- Increase budgets on profitable campaigns

### Month 4+: Optimization ($5,000+)
- Automated bidding strategies
- Seasonal campaigns
- New product launches
- Brand campaigns

## Performance Benchmarks (Supplements Industry)

**Average Metrics:**
- CTR: 0.5-1.5%
- CPC: $0.50-2.00
- Conversion Rate: 2-5%
- ROAS: 300-500% (3-5x return)
- AOV: $40-80

**Your Target Goals:**
- ROAS: >400% (4x return minimum)
- CPA: <$15 per acquisition
- AOV: $50+ (bundle strategy)

## Quick Checklist

Before running ads, ensure:
- [ ] Merchant Center linked to Ads account 3593851507
- [ ] Product feed approved (no errors)
- [ ] Shipping rates configured
- [ ] Return policy published
- [ ] Tax settings configured
- [ ] Conversion tracking installed
- [ ] Budget allocated ($50/day minimum)
- [ ] Campaign structure planned

## Common Issues & Solutions

**Issue:** Products not showing in Ads
- **Solution:** Check feed status in Merchant Center, ensure all required attributes present

**Issue:** Low impression share
- **Solution:** Increase bids, expand keywords, improve product titles

**Issue:** High CPC, low conversions
- **Solution:** Add negative keywords, improve landing pages, test different products

**Issue:** Disapproved products
- **Solution:** Review Google Shopping policies, add required disclaimers, fix image quality

## Next Steps

1. **Link accounts** (follow steps above)
2. **Wait 24-48 hours** for product data to sync
3. **Create first Shopping campaign** (Smart Shopping recommended)
4. **Set daily budget** ($50 to start)
5. **Monitor performance** daily for first week
6. **Optimize based on data** after 2 weeks

## Support Resources

- **Google Ads Support:** https://support.google.com/google-ads
- **Merchant Center Help:** https://support.google.com/merchants
- **Shopping Ads Guide:** https://support.google.com/google-ads/answer/2454022
- **Your Ads Account:** https://ads.google.com/aw/overview?ocid=3593851507

---

**Your Google Ads Customer ID:** 3593851507  
**Ready to link?** Follow Step 1-4 above to connect Merchant Center to your Ads account.
