# Instagram API Setup Guide

## Overview

This guide explains how to set up and use the Instagram Graph API to manage posts programmatically for your Success Chemistry Instagram account.

## Prerequisites

1. **Instagram Business or Creator Account**
   - Your account must be converted to Business or Creator
   - Go to Instagram Settings → Account → Switch to Professional Account

2. **Facebook Page**
   - Your Instagram account must be connected to a Facebook Page
   - Go to Instagram Settings → Linked Accounts → Facebook

3. **Facebook Developer Account**
   - Create an account at https://developers.facebook.com/

## Setup Steps

### Step 1: Create Facebook App

1. Go to https://developers.facebook.com/apps/
2. Click "Create App"
3. Choose "Business" as the app type
4. Fill in app details:
   - App Name: "Success Chemistry"
   - Contact Email: your email
   - Business Account: (optional)

### Step 2: Add Instagram Products

1. In your app dashboard, go to "Add Products"
2. Add these products:
   - **Instagram Graph API** (for posting)
   - **Instagram Basic Display** (for reading)

### Step 3: Configure Instagram Graph API

1. Go to Instagram Graph API in your app dashboard
2. Set up Instagram Basic Display:
   - Add Instagram App ID
   - Configure OAuth Redirect URIs
   - Add Valid OAuth Redirect URIs (e.g., `https://successchemistry.com/auth/instagram/callback`)

### Step 4: Get Required IDs

1. **Facebook Page ID:**
   - Go to your Facebook Page
   - Click "About" → find "Page ID"

2. **Instagram Business Account ID:**
   - Use Graph API Explorer: `https://developers.facebook.com/tools/explorer/`
   - Query: `GET /me/accounts`
   - Find your page, then query: `GET /{page-id}?fields=instagram_business_account`
   - Copy the `instagram_business_account.id`

### Step 5: Generate Access Token

1. **Short-lived Token (for testing):**
   - Use Graph API Explorer
   - Select your app
   - Add permissions: `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`
   - Generate token

2. **Long-lived Token (for production):**
   ```javascript
   // Exchange short-lived token for long-lived (60 days)
   GET /oauth/access_token?
     grant_type=fb_exchange_token&
     client_id={app-id}&
     client_secret={app-secret}&
     fb_exchange_token={short-lived-token}
   ```

3. **Permanent Token (recommended):**
   - Use Facebook's Token Generator
   - Or implement token refresh logic

### Step 6: Add to Environment Variables

Add to your `.env` file:

```env
INSTAGRAM_ACCESS_TOKEN=your_long_lived_token_here
INSTAGRAM_ACCOUNT_ID=your_instagram_business_account_id
FACEBOOK_PAGE_ID=your_facebook_page_id
```

## Usage Examples

### Initialize API

```javascript
import { initInstagram } from './api/instagram-posts.js';

// Initialize with credentials
initInstagram(
    process.env.INSTAGRAM_ACCESS_TOKEN,
    process.env.INSTAGRAM_ACCOUNT_ID,
    process.env.FACEBOOK_PAGE_ID
);
```

### Create Image Post

```javascript
import { createImagePost } from './api/instagram-posts.js';

const result = await createImagePost({
    imageUrl: 'https://successchemistry.com/images/products/sclera-white.jpg',
    caption: '✨ New Sclera White is here! Brighten your eyes naturally with our premium eye health supplement. #EyeHealth #ScleraWhite #SuccessChemistry',
    locationId: null // Optional
});

console.log('Post created:', result.id);
```

### Create Carousel Post

```javascript
import { createCarouselPost } from './api/instagram-posts.js';

const result = await createCarouselPost({
    imageUrls: [
        'https://successchemistry.com/images/products/product1.jpg',
        'https://successchemistry.com/images/products/product2.jpg',
        'https://successchemistry.com/images/products/product3.jpg'
    ],
    caption: '🌟 Our top 3 bestsellers! Which one will you try? #Wellness #Supplements'
});
```

### Create Video/Reel

```javascript
import { createVideoPost } from './api/instagram-posts.js';

const result = await createVideoPost({
    videoUrl: 'https://successchemistry.com/videos/product-demo.mp4',
    caption: 'See how Sclera White works! #Reels #EyeHealth',
    thumbnailUrl: 'https://successchemistry.com/images/thumbnails/video-thumb.jpg'
});
```

### Get All Posts

```javascript
import { getPosts } from './api/instagram-posts.js';

const result = await getPosts({ limit: 25 });
console.log('Posts:', result.posts);
```

### Delete Post

```javascript
import { deletePost } from './api/instagram-posts.js';

const result = await deletePost('post_id_here');
console.log('Deleted:', result.success);
```

## Scheduling Posts

**Note:** Instagram Graph API doesn't officially support native scheduling. However, you can implement custom scheduling:

```javascript
// Store scheduled posts in database
const scheduledPost = {
    creationId: 'container_id',
    scheduledTime: new Date('2026-02-15T10:00:00Z'),
    publishEndpoint: '...',
    accessToken: '...'
};

// Use cron job or scheduled task to publish at the right time
// Example with node-cron:
const cron = require('node-cron');

cron.schedule('* * * * *', async () => {
    // Check for posts scheduled to publish now
    const postsToPublish = await getScheduledPosts();
    
    for (const post of postsToPublish) {
        if (new Date(post.scheduledTime) <= new Date()) {
            await publishScheduledPost(post);
        }
    }
});
```

## API Endpoints (Server Integration)

If you want to expose this via your server API:

```javascript
// server/routes/instagram.js
import express from 'express';
import { 
    initInstagram, 
    createImagePost, 
    getPosts, 
    deletePost 
} from '../api/instagram-posts.js';

const router = express.Router();

// Initialize on server start
initInstagram(
    process.env.INSTAGRAM_ACCESS_TOKEN,
    process.env.INSTAGRAM_ACCOUNT_ID,
    process.env.FACEBOOK_PAGE_ID
);

// Create post
router.post('/posts', async (req, res) => {
    try {
        const result = await createImagePost(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get posts
router.get('/posts', async (req, res) => {
    try {
        const result = await getPosts(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete post
router.delete('/posts/:id', async (req, res) => {
    try {
        const result = await deletePost(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
```

## Limitations & Notes

1. **Scheduling:** Native scheduling not supported - implement custom solution
2. **Rate Limits:** 
   - 200 requests per hour per user
   - 25 posts per day per account
3. **Media Requirements:**
   - Images: JPG or PNG, max 8MB, min 320x320px
   - Videos: MP4, max 100MB, min 1 second
   - Aspect ratios: 1:1 (square), 4:5 (portrait), 16:9 (landscape)
4. **Caption Limits:**
   - Max 2,200 characters
   - Supports hashtags and @mentions
5. **Access Tokens:**
   - Short-lived: 1 hour
   - Long-lived: 60 days
   - Need to implement refresh logic for production

## Security Best Practices

1. **Never expose access tokens in client-side code**
2. **Store tokens in environment variables**
3. **Implement token refresh logic**
4. **Use HTTPS for all API calls**
5. **Validate and sanitize all user inputs**
6. **Implement rate limiting**

## Troubleshooting

### "User must be on whitelist" Error
- This means your account needs to be approved for content publishing
- Apply for Instagram Content Publishing access in Facebook App Dashboard

### "Invalid OAuth Access Token"
- Token may have expired
- Generate a new long-lived token
- Implement automatic token refresh

### "Media URL must be publicly accessible"
- Images/videos must be hosted on a public URL
- Cannot use localhost or private URLs
- Use CDN or public hosting

## Resources

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api/)
- [Content Publishing Guide](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/content-publishing/)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)
