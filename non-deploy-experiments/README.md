# Non-Deploy Experiments

This folder contains experimental code that should **NOT** be deployed to production.

## Contents

### Extreme Showcase
- **Location**: `extreme-app/` and `extreme-components/`
- **Description**: Advanced web UI experiments with particles, physics, and shaders
- **Status**: ⚠️ Experimental - Not for production use
- **Original Route**: Was at `/extreme` (now disabled)

## Why This Folder Exists

These experiments were moved here to:
- ✅ Keep them out of production deployments
- ✅ Prevent them from interfering with main project
- ✅ Preserve the code for future reference
- ✅ Allow experimentation without affecting live site

## How to Use

If you want to test these experiments locally:

1. Copy the files back to the appropriate locations in `deploy-site/life-jet/`
2. Run the dev server: `npm run life-jet`
3. Access at `http://localhost:5174/extreme`
4. **Remember to move them back here before deploying!**

## Files

- `extreme-app/page.js` - Main extreme showcase page
- `extreme-components/` - All component files:
  - `ParticleField.jsx` - Particle system with mouse interaction
  - `PhysicsCard.jsx` - Draggable physics-based cards
  - `ShaderBackground.jsx` - WebGL shader effects
  - `ThreeDScene.jsx` - Three.js 3D scene component
  - `AudioReactive.jsx` - Audio-reactive visualizations
  - `DataDrivenMotion.jsx` - Data-driven animations
  - `ScrollTimeline.jsx` - Scroll-based timeline
  - `SVGLogo.jsx` - SVG logo component

## Notes

- These components use heavy WebGL/Canvas operations
- Performance may vary on different devices
- Not optimized for production use
- May cause issues if deployed to production
