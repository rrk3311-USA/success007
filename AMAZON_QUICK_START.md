# 🚀 Amazon SP-API Quick Start

## Quick Setup (5 Steps)

### Step 1: Install Package
```bash
npm install amazon-sp-api
```

### Step 2: Get Amazon Credentials

1. **Seller Central Account**: https://sellercentral.amazon.com
2. **Developer Account**: https://developer.amazon.com
3. **Register App**: https://developer.amazon.com/selling-partner-api/console

### Step 3: Set Up IAM User & Role

1. **Create IAM User** (in Seller Central):
   - Settings → User Permissions → Create IAM User
   - Copy the IAM User ARN

2. **Create IAM Role** (in AWS Console):
   - Go to: https://console.aws.amazon.com/iam/
   - Create Role with Amazon account ID: `589160054421`
   - Copy the IAM Role ARN

### Step 4: Authorize Application

```bash
# Generate authorization URL
node amazon-authorize.js

# After authorizing, exchange code for token
node amazon-authorize.js --code YOUR_AUTHORIZATION_CODE
```

### Step 5: Add to .env

```bash
AMAZON_LWA_CLIENT_ID=your_client_id
AMAZON_LWA_CLIENT_SECRET=your_client_secret
AMAZON_REFRESH_TOKEN=your_refresh_token
AMAZON_IAM_USER_ARN=arn:aws:iam::YOUR_ACCOUNT:user/sp-api-user
AMAZON_IAM_ROLE_ARN=arn:aws:iam::YOUR_ACCOUNT:role/sp-api-role
AMAZON_MARKETPLACE_ID=ATVPDKIKX0DER
AMAZON_SELLER_ID=your_seller_id
AMAZON_REGION=us-east-1
```

## Test Connection

```bash
node test-amazon-api.js
```

## Create Your First Listing

```bash
node create-amazon-listing-v2.js 10777-810
```

## Full Documentation

See `AMAZON_SP_API_SETUP.md` for complete setup instructions.

## Troubleshooting

### "Package not installed"
```bash
npm install amazon-sp-api
```

### "Missing credentials"
- Check `.env` file has all required variables
- See `.env.example` for template

### "Unauthorized" or "Invalid token"
- Re-run authorization: `node amazon-authorize.js`
- Get new refresh token

### "Access Denied"
- Request Listings API access in Seller Central
- May take 24-48 hours for approval
