# Setup Instructions

If you want to use these experiments, follow these steps:

## Option 1: Use as Standalone (Recommended for Testing)

1. Create a new Next.js/React project or use an existing one
2. Copy the component files to your project
3. Update the import paths in `extreme-app/page.js` to match your project structure
4. Install required dependencies (React, Tailwind CSS, etc.)

## Option 2: Restore to Main Project (Temporary)

1. **Backup current state** (the route is currently disabled)
2. Copy `extreme-app/page.js` to `deploy-site/life-jet/app/extreme/page.js`
3. Copy all files from `extreme-components/` to `deploy-site/life-jet/components/extreme/`
4. Update imports in `page.js` to: `../../components/extreme/...`
5. Test at `http://localhost:5174/extreme`
6. **IMPORTANT**: Move files back here before deploying!

## Dependencies Required

- React 18+
- Tailwind CSS
- Next.js (if using Next.js routing)

## Notes

- The components use modern React hooks (useState, useEffect, useRef)
- Requires WebGL support for shader effects
- Performance may vary on different devices
- Not optimized for mobile devices
