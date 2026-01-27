# 🛒 Amazon SP-API Setup Guide

## Overview

Amazon SP-API (Selling Partner API) is the modern API for creating and managing Amazon listings. This guide will help you set up API access to create product listings programmatically.

## Prerequisites

1. **Amazon Seller Central Account** (Professional or Individual)
   - Sign up: https://sellercentral.amazon.com
   - Must be approved and active

2. **Developer Account**
   - Register: https://developer.amazon.com
   - Same email as Seller Central account

## Step-by-Step Setup

### Step 1: Create IAM User & Role (Required for SP-API)

1. **Go to Seller Central**:
   - https://sellercentral.amazon.com
   - Navigate to **Settings** → **User Permissions**

2. **Create IAM User**:
   - Click **"Create IAM User"**
   - Name: `sp-api-user` (or any name)
   - Copy the **IAM User ARN** (you'll need this)

3. **Create IAM Role**:
   - Go to: https://console.aws.amazon.com/iam/
   - Click **Roles** → **Create Role**
   - Select **"AWS Account"**
   - Enter Amazon's account ID: `589160054421` (for US marketplace)
   - Role name: `sp-api-role`
   - Copy the **IAM Role ARN**

### Step 2: Register Your Application

1. **Go to Developer Central**:
   - https://developer.amazon.com/selling-partner-api/console

2. **Register Application**:
   - Click **"Register new application"**
   - Fill in:
     - **Application Name**: Success Chemistry API
     - **OAuth Login Domain**: `successchemistry.com`
     - **OAuth Redirect URI**: `https://successchemistry.com/amazon-oauth`
     - **IAM ARN**: (paste the IAM Role ARN from Step 1)

3. **Save Credentials**:
   - **LWA Client ID** (Client Identifier)
   - **LWA Client Secret** (Client Secret)
   - **Application ID** (Application Identifier)

### Step 3: Authorize Your Application

1. **Generate Authorization URL**:
   ```bash
   # Run the authorization script
   node amazon-authorize.js
   ```

2. **Authorize in Browser**:
   - Copy the URL from the script output
   - Open in browser
   - Log in with your Seller Central account
   - Click **"Authorize"**
   - Copy the **Authorization Code** from the redirect URL

3. **Exchange for Refresh Token**:
   ```bash
   # The script will automatically exchange the code for a refresh token
   node amazon-authorize.js --code YOUR_AUTHORIZATION_CODE
   ```

### Step 4: Get Marketplace IDs

Amazon uses different marketplace IDs for different regions:

- **US**: `ATVPDKIKX0DER`
- **CA**: `A2EUQ1WTGCTBG2`
- **UK**: `A1F83G8C2ARO7P`
- **DE**: `A1PA6795UKMFR9`
- **FR**: `A13V1IB3VIYZZH`
- **IT**: `APJ6JRA9NG5V4`
- **ES**: `A1RKKUPIHCS9HS`
- **JP**: `A1VC38T7YXB528`

### Step 5: Add Credentials to .env

Add these to your `.env` file:

```bash
# ============================================
# Amazon SP-API Credentials
# ============================================
AMAZON_LWA_CLIENT_ID=your_lwa_client_id_here
AMAZON_LWA_CLIENT_SECRET=your_lwa_client_secret_here
AMAZON_REFRESH_TOKEN=your_refresh_token_here
AMAZON_IAM_USER_ARN=arn:aws:iam::YOUR_ACCOUNT:user/sp-api-user
AMAZON_IAM_ROLE_ARN=arn:aws:iam::YOUR_ACCOUNT:role/sp-api-role
AMAZON_MARKETPLACE_ID=ATVPDKIKX0DER
AMAZON_SELLER_ID=your_seller_id_here
AMAZON_REGION=us-east-1
```

## Important Notes

### API Access Levels

Amazon SP-API has different access levels:

1. **Public Data** - No approval needed
   - Product catalog
   - Pricing
   - Reviews

2. **Restricted Data** - Requires approval
   - Orders
   - Inventory
   - Reports
   - Listings (create/update)

### Getting Approval for Listings API

To create listings, you need:

1. **Professional Seller Account** (Individual accounts have limited access)
2. **API Access Approval**:
   - Go to Seller Central → **Apps & Services** → **Develop Apps**
   - Request access to **"Listings"** API
   - May take 24-48 hours for approval

### Rate Limits

- **Listings API**: 0.5 requests/second (2 requests per second burst)
- **Catalog API**: 0.5 requests/second
- **Pricing API**: 0.5 requests/second

## Testing

Once set up, test with:

```bash
# Test API connection
node test-amazon-api.js

# Create a test listing
node create-amazon-listing.js 10777-810
```

## Troubleshooting

### "Invalid IAM User" Error
- Verify IAM User ARN is correct
- Ensure IAM user has proper permissions
- Check that role trust relationship includes Amazon's account

### "Unauthorized" Error
- Refresh token may have expired
- Re-run authorization flow
- Check LWA credentials are correct

### "Access Denied" Error
- May need to request API access in Seller Central
- Check that your seller account is approved
- Verify marketplace ID is correct

## Resources

- **SP-API Documentation**: https://developer-docs.amazon.com/sp-api/
- **API Reference**: https://developer-docs.amazon.com/sp-api/docs
- **Seller Central**: https://sellercentral.amazon.com
- **Developer Central**: https://developer.amazon.com/selling-partner-api

## Next Steps

After setup is complete:
1. ✅ Test API connection
2. ✅ Create your first listing
3. ✅ Set up inventory sync
4. ✅ Configure order management
