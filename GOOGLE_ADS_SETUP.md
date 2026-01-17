# Google Ads API Setup Guide

## What is GOOGLE_SERVICE_ACCOUNT_JSON?

This is a JSON key file that allows your application to authenticate with Google Cloud services, including:
- **Google Ads API** - Manage campaigns, get performance data
- **Google Analytics** - Track website analytics
- **Google Cloud Platform** - Other Google services

## How to Get Your Service Account JSON

### Step 1: Create a Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Name it: "Success Chemistry"
4. Click "Create"

### Step 2: Enable Google Ads API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Ads API"
3. Click "Enable"

### Step 3: Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Name: "success-chemistry-ads"
4. Click "Create and Continue"
5. Role: Select "Editor" (or "Viewer" for read-only)
6. Click "Done"

### Step 4: Generate JSON Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON"
5. Click "Create"
6. **A JSON file will download** - this is your service account key!

### Step 5: Add to Your Project

**Option A: Store JSON content in .env (Recommended)**

1. Open the downloaded JSON file
2. Copy the entire contents
3. In your `.env` file, add:

```env
# Google Ads API
GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"your-project",...}'
```

**Note:** Put the entire JSON on one line, wrapped in single quotes.

**Option B: Store JSON file path**

1. Save the JSON file to: `/Users/r-kammer/CascadeProjects/Success Chemistry/google-service-account.json`
2. Add to `.gitignore`:
   ```
   google-service-account.json
   ```
3. In `.env`:
   ```env
   GOOGLE_SERVICE_ACCOUNT_PATH=./google-service-account.json
   ```

### Step 6: Link to Google Ads Account

1. Go to: https://ads.google.com/
2. Click "Tools & Settings" → "Setup" → "Access and Security"
3. Click "+" to add user
4. Enter the service account email (found in the JSON file, looks like: `success-chemistry-ads@your-project.iam.gserviceaccount.com`)
5. Grant "Standard" or "Admin" access
6. Click "Send Invitation"

## What We Can Build With Google Ads API:

1. **Campaign Performance Dashboard:**
   - View ad spend, clicks, conversions
   - Track ROI and ROAS
   - Monitor campaign health

2. **Automated Bid Management:**
   - Adjust bids based on performance
   - Pause underperforming ads
   - Scale winning campaigns

3. **Keyword Research:**
   - Find high-performing keywords
   - Track keyword rankings
   - Discover new opportunities

4. **Reporting:**
   - Generate custom reports
   - Export data to dashboard
   - Track trends over time

## Security Notes:

⚠️ **IMPORTANT:**
- The JSON file contains sensitive credentials
- Never commit it to git (already in `.gitignore`)
- Never share it publicly
- Rotate keys periodically
- Use "Viewer" role if you only need read access

## Do You Need This Right Now?

**You can skip this if:**
- You're not running Google Ads yet
- You don't need automated campaign management
- You're just building the shop first

**You should set this up if:**
- You're actively running Google Ads
- You want to track ad performance in the dashboard
- You want to automate bid adjustments

---

**Need help setting this up?** Let me know and I can walk you through it step by step!
