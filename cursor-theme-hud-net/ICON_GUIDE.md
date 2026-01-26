# Icon Creation Guide

The theme needs an `icon.png` file (128x128 pixels) for the marketplace.

## Quick Option: Use a Placeholder

Create a simple icon with:
- Background: `#0a0e1a` (theme background)
- Accent: `#00d4ff` (neon cyan)
- Text/Symbol: "HUD" or a simple geometric shape

## Tools to Create Icon

1. **Online**: Use [Canva](https://canva.com) or [Figma](https://figma.com)
2. **Local**: Use Photoshop, GIMP, or any image editor
3. **Code**: Use SVG and convert to PNG

## Simple SVG Template

```svg
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" fill="#0a0e1a"/>
  <text x="64" y="80" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#00d4ff" text-anchor="middle">HUD</text>
</svg>
```

## Requirements

- **Size**: 128x128 pixels
- **Format**: PNG
- **File name**: `icon.png`
- **Location**: Root of the extension folder

## Placeholder Icon

For now, you can use any 128x128 PNG image. The marketplace will show a default icon if none is provided, but having a custom icon is recommended for better visibility.
