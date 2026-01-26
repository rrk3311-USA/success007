# eBay Token Diagnosis Guide

## What We Need to Check

### 1. Application Key Sets (OAuth Credentials)
**Location:** https://developer.ebay.com/my/keys

**What to look for:**
- ✅ **Client ID**: `[your_client_id]` (should match .env)
- ✅ **Client Secret**: `[your_client_secret]` (should match .env)
- ✅ **Dev ID**: `[your_dev_id]` (should match .env)
- ✅ **RuName**: `[your_ru_name]` (should match .env)

**What to verify:**
- Are the credentials active/enabled?
- Are they for Production or Sandbox?
- What scopes/permissions are configured?

### 2. User Access Tokens
**Location:** Usually under "User Tokens" or "OAuth Tokens" section

**What to look for:**
- Current active tokens
- Token expiration dates
- Token scopes (should include `sell.inventory`, `sell.account`)
- Whether tokens are for Production or Sandbox

**What we need:**
- Generate a NEW User Token if current one is expired
- Make sure it has the right scopes:
  - `https://api.ebay.com/oauth/api_scope/sell.inventory`
  - `https://api.ebay.com/oauth/api_scope/sell.account`
  - `https://api.ebay.com/oauth/api_scope/commerce.taxonomy.readonly`

### 3. Common Issues to Check

#### Issue 1: Token Expired
- **Symptom**: 401 Invalid access token
- **Solution**: Generate new User Token

#### Issue 2: Wrong Environment
- **Symptom**: Token works but wrong API endpoint
- **Solution**: Check if token is for Sandbox vs Production

#### Issue 3: Missing Scopes
- **Symptom**: Token valid but API calls fail with permission errors
- **Solution**: Regenerate token with correct scopes

#### Issue 4: Token Format
- **Symptom**: Token not being read correctly
- **Solution**: Make sure token is wrapped in quotes in .env (already fixed)

## Steps to Fix

1. **Navigate to:** https://developer.ebay.com/my/keys
2. **Find "User Tokens" or "OAuth Tokens" section**
3. **Generate a new User Token** with these scopes:
   - `sell.inventory`
   - `sell.account`
   - `commerce.taxonomy.readonly`
4. **Copy the new token**
5. **Update .env file** with the new token
6. **Test again** with `node test-ebay-token.js`

## Current Configuration (from .env)

```
EBAY_CLIENT_ID=[your_client_id]
EBAY_CLIENT_SECRET=[your_client_secret]
EBAY_DEV_ID=[your_dev_id]
EBAY_RU_NAME=[your_ru_name]
EBAY_ACCESS_TOKEN="[your_access_token]"
```

## Next Steps

Once you're signed in, I can:
1. Navigate to the keys page
2. Check your Application Key Sets
3. Look at User Access Tokens
4. Help generate a new token if needed
5. Update the .env file with the new token
