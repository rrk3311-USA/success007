# Quick Start Guide

## For Users

### Install from Marketplace (Recommended)
1. Open Cursor
2. Press `Cmd+Shift+X` (Mac) or `Ctrl+Shift+X` (Windows/Linux)
3. Search: "HUD Net Core"
4. Click Install
5. Press `Cmd+K Cmd+T` (Mac) or `Ctrl+K Ctrl+T` (Windows/Linux)
6. Select "HUD Net Core"

### Install from VSIX (Manual)
1. Download the `.vsix` file from releases
2. Open Cursor
3. Extensions view → "..." menu → "Install from VSIX..."
4. Select the downloaded file
5. Activate the theme (see step 5 above)

## For Developers

### Setup
```bash
# Install vsce (VS Code Extension Manager)
npm install -g @vscode/vsce

# Navigate to theme directory
cd cursor-theme-hud-net

# Package the extension
vsce package

# This creates a .vsix file you can install locally
```

### Test Locally
1. Run `vsce package` to create `.vsix`
2. In Cursor: Extensions → "..." → "Install from VSIX..."
3. Select the generated `.vsix` file
4. Activate the theme to test

### Publish
```bash
# First time: Set up publisher in package.json
# Then publish with your Personal Access Token
vsce publish -p <YOUR_TOKEN>
```

See `PUBLISHING.md` for detailed instructions.
