# ⚠️ This Route is Disabled

The extreme showcase page has been moved to `/non-deploy-experiments/` to prevent it from being deployed to production.

## Why?

- Experimental code that may cause issues in production
- Heavy WebGL/Canvas operations not optimized for all devices
- Not ready for production use

## To Re-enable

1. Copy files from `/non-deploy-experiments/extreme-app/` back to this folder
2. Copy components from `/non-deploy-experiments/extreme-components/` back to `../../components/extreme/`
3. Restore the original `page.js` file
4. **Remember to move them back before deploying!**

## Current Status

The page now shows a disabled message instead of the experimental features.
