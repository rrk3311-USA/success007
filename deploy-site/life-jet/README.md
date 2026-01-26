# LIFE JET - Daily Meal Deals Finder

A React-based meal finder application with F-35 fighter jet cockpit dashboard aesthetics.

## Features

- 🎯 **F-35 Cockpit UI**: Authentic fighter jet dashboard design
- 🍔 **Meal Finder**: Location-based daily deals discovery
- 📡 **Radar Display**: Interactive radar showing nearby deals
- 🎨 **Impressive Animations**: Smooth, cinematic transitions
- 📍 **Location Tracking**: Real-time GPS-based deal finding
- 🎮 **Base Nine Design**: Military-inspired interface elements

## Quick Start

### Development Mode

Run the Vite dev server:
```bash
npm run life-jet
```

Or from the life-jet directory:
```bash
cd deploy-site/life-jet
npm run dev
```

The app will be available at `http://localhost:5174`

### Production Build

Build for production:
```bash
npm run life-jet:build
```

The built files will be in `deploy-site/life-jet/dist/`

## Design Elements

### F-35 Cockpit Features
- **HUD Display**: Head-up display with system status
- **Radar System**: Animated radar sweep with target blips
- **Targeting Reticle**: Visual targeting system
- **Status Panels**: Real-time system monitoring
- **Tactical Grid**: Animated background grid overlay

### Animations
- Smooth panel fade-ins
- Radar sweep animation
- Blip pulse effects
- Scanline overlay
- Glowing text effects
- Card hover animations

## Components

- `HUD.jsx` - Head-up display component
- `RadarDisplay.jsx` - Interactive radar with deal blips
- `MealFinder.jsx` - Main meal search and display
- `DealCards.jsx` - Scrollable deal cards
- `LocationTracker.jsx` - GPS position display
- `StatusPanel.jsx` - System status and target data

## Integration

To integrate with your static server, build the app and copy the `dist` folder contents to your server directory.
