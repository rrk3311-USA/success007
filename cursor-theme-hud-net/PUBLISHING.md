# Publishing Guide for HUD Net Core Theme

## Prerequisites

1. **VS Code Extension Account**
   - Create an account at [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage)
   - Get a Personal Access Token (PAT) from Azure DevOps

2. **Install VS Code Extension Manager (vsce)**
   ```bash
   npm install -g @vscode/vsce
   ```

## Publishing Steps

### 1. Prepare the Extension

Make sure all files are in place:
- `package.json` - Extension manifest
- `themes/hud-net-core-color-theme.json` - Theme file
- `README.md` - Documentation
- `CHANGELOG.md` - Version history
- `LICENSE` - License file
- `.vscodeignore` - Files to exclude

### 2. Create a Publisher

If you haven't already:
1. Go to [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage)
2. Click "Create Publisher"
3. Fill in your publisher details
4. Note your publisher ID (update in `package.json`)

### 3. Get Personal Access Token

1. Go to [Azure DevOps](https://dev.azure.com)
2. User Settings > Personal Access Tokens
3. Create new token with "Marketplace (Manage)" scope
4. Copy the token (you'll need it for publishing)

### 4. Package the Extension

```bash
cd cursor-theme-hud-net
vsce package
```

This creates a `.vsix` file you can test locally.

### 5. Test Locally (Optional)

Install the `.vsix` file in Cursor:
1. Open Cursor
2. Extensions view (Cmd+Shift+X)
3. Click "..." menu
4. Select "Install from VSIX..."
5. Choose your `.vsix` file
6. Test the theme

### 6. Publish to Marketplace

```bash
vsce publish -p <YOUR_PERSONAL_ACCESS_TOKEN>
```

Or if you've set up the token:
```bash
vsce publish
```

### 7. Verify Publication

1. Go to [Visual Studio Marketplace](https://marketplace.visualstudio.com)
2. Search for "HUD Net Core Theme"
3. Verify it appears correctly

## Updating the Extension

When making updates:

1. Update version in `package.json`
2. Add entry to `CHANGELOG.md`
3. Package: `vsce package`
4. Publish: `vsce publish -p <TOKEN>`

## Publishing to Cursor Marketplace

Cursor uses the VS Code Marketplace, so publishing there makes it available in Cursor automatically.

## Alternative: GitHub Releases

You can also distribute via GitHub:

1. Create a GitHub repository
2. Push your code
3. Create releases with `.vsix` files
4. Users can install from VSIX manually

## Tips

- Test thoroughly before publishing
- Use semantic versioning (1.0.0, 1.0.1, etc.)
- Write clear release notes
- Include screenshots in README
- Respond to user feedback

## Troubleshooting

**Error: Missing publisher**
- Update `publisher` field in `package.json`

**Error: Invalid token**
- Regenerate your Personal Access Token
- Ensure it has "Marketplace (Manage)" scope

**Error: Version already exists**
- Increment version in `package.json`
