# eBay OAuth 2.0 Setup Guide

## Current Configuration

Your eBay OAuth settings have been configured:

- **RuName**: `Raphael_Kammer-RaphaelK-Cursor-hxncgp`
- **Display Title**: SuccessChemistry App
- **Client ID**: `RaphaelK-Cursor-PRD-0b440ed0...` (truncated - get full ID from portal)
- **Redirect URL**: `https://successchemistry.com/privacy-policy`
- **OAuth Enabled**: ✅ Yes

## What You Need to Complete Setup

### 1. Get Your Full Client ID and Client Secret

1. Go to: https://developer.ebay.com/my/keys
2. Find your Production app: **SuccessChemistry App**
3. Copy the **full Client ID** (not truncated)
4. Copy the **Client Secret** (click "Show" to reveal)
5. Add them to `deploy-site/config.js`:
   ```javascript
   CLIENT_ID: 'RaphaelK-Cursor-PRD-0b440ed0-XXXX-XXXX-XXXX-XXXX', // Full ID
   CLIENT_SECRET: 'your-client-secret-here'
   ```

### 2. OAuth 2.0 Flow

eBay uses OAuth 2.0 authorization code flow. Here's how it works:

#### Step 1: Generate Authorization URL

```javascript
const authUrl = `https://auth.ebay.com/oauth2/authorize?` +
  `client_id=${CLIENT_ID}&` +
  `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
  `response_type=code&` +
  `scope=${SCOPES.join(' ')}&` +
  `ruName=${RU_NAME}`;
```

#### Step 2: User Authorizes

User visits the authorization URL and grants permissions.

#### Step 3: Receive Authorization Code

After authorization, eBay redirects to your `redirect_uri` with a `code` parameter:
```
https://successchemistry.com/privacy-policy?code=AUTHORIZATION_CODE
```

#### Step 4: Exchange Code for Access Token

```javascript
const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
  },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    redirect_uri: REDIRECT_URI
  })
});
```

#### Step 5: Use Access Token

```javascript
const response = await fetch('https://api.ebay.com/sell/inventory/v1/inventory_item', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

## Token Format Note

The token you provided earlier (`v^1.1#i^1#p^3#I^3#r^0#f^0#t^...`) appears to be an **Auth'n'Auth token**, not an OAuth token. 

- **Auth'n'Auth**: Older format, uses User Token format
- **OAuth 2.0**: Modern format, uses Bearer tokens

For OAuth 2.0, you'll get a standard Bearer token after completing the OAuth flow.

## Quick Start Script

I can create a script to:
1. Generate the authorization URL
2. Handle the callback
3. Exchange code for token
4. Save token to config

Would you like me to create this OAuth helper script?

## Testing

Once you have:
- ✅ Full Client ID
- ✅ Client Secret
- ✅ Completed OAuth flow
- ✅ Access Token

Run the test script:
```bash
node test-ebau-api.js https://api.ebay.com
```

## Resources

- **eBay Developer Portal**: https://developer.ebay.com/my/keys
- **OAuth Documentation**: https://developer.ebay.com/api-docs/static/oauth-consent-request.html
- **API Documentation**: https://developer.ebay.com/api-docs
- **Inventory API**: https://developer.ebay.com/api-docs/sell/inventory/overview.html
