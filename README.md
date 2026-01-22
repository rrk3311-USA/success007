# Success Chemistry - E-commerce Site

Modern, conversion-optimized e-commerce site for Success Chemistry premium supplements.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Local Development

**Start the local development server:**
```bash
npm install
npm start
```

The site will be available at: `http://localhost:8080`

**What runs on port 8080:**
- Express static file server serving `deploy-site/` directory
- Handles clean URLs and routing for product pages
- Logs requests to `.cursor/debug.log` for debugging

### Port Usage

| Port | Service | Purpose |
|------|---------|---------|
| 8080 | Main web server | Local development (Express) |
| 3001 | API server | Backend API (if needed) |
| 5173/5174 | Vite dev server | React/Vite projects (stop if not using) |

**To stop stray servers:**
```bash
# Find processes on specific ports
lsof -ti:8080 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

## 📁 Project Structure

```
success007/
├── deploy-site/          # Static site files (served on port 8080)
│   ├── index.html        # Homepage
│   ├── shop/            # Shop page
│   ├── product/         # Product pages
│   ├── cart/            # Shopping cart
│   ├── blog/            # Blog/articles
│   ├── contact/         # Contact page
│   ├── includes/        # Universal header/footer
│   └── public/          # Images, assets
├── local-server.js      # Express server for local dev
├── package.json         # Dependencies and scripts
├── vercel.json          # Vercel deployment config
├── render.yaml          # Render deployment config
└── README.md            # This file
```

## 🛠️ Development Workflow

### Single Source of Truth
**✅ Work only in this repo:** `/Users/r-kammer/Documents/GitHub/success007/`

**❌ Don't edit in:** `/Users/r-kammer/CascadeProjects/Success Chemistry/` (archive this)

### Development Loop
1. Edit files in `deploy-site/`
2. Refresh browser at `http://localhost:8080`
3. Commit changes: `git add . && git commit -m "Description"`
4. Push: `git push`
5. Deploy happens automatically (Vercel/Render)

### Universal Components
- **Header:** `deploy-site/includes/universal-header.html` + `universal-header.css`
- **Footer:** `deploy-site/includes/universal-footer.html`
- **Reference:** See `UNIVERSAL_HEADER_FOOTER_REFERENCE.md`

## 📦 Deployment

### Vercel (Recommended)
1. Connect GitHub repo to Vercel
2. Set build command: `echo "No build required - static site"`
3. Set output directory: `deploy-site`
4. Deploy automatically on push to `main`

### Render
1. Connect GitHub repo to Render
2. Use `render.yaml` configuration
3. Deploy automatically on push to `main`

### Manual Deploy
```bash
# Sync to production (if needed)
./sync-to-production.sh
```

## 🎨 Key Features

- **Universal Header/Footer:** Consistent across all pages
- **Responsive Design:** Mobile, tablet, desktop optimized
- **Product Catalog:** Dynamic product loading from `products-data.js`
- **Shopping Cart:** LocalStorage-based cart functionality
- **SEO Optimized:** Meta tags, structured data, clean URLs

## 📝 Available Scripts

```bash
npm start          # Start local dev server (port 8080)
npm run server     # Start API server (port 3001)
npm run dev        # Start Vite dev server (if using React)
npm run build      # Build for production (if using Vite)
```

## 🔧 Configuration

### Local Server
- **File:** `local-server.js`
- **Port:** 8080
- **Serves:** `deploy-site/` directory
- **Logs:** `.cursor/debug.log`

### Products Data
- **File:** `deploy-site/products-data.js`
- **Version:** Update `?v=XX` in script tags when data changes
- **Function:** `window.getAllProducts()` returns all products

## 🐛 Debugging

### Debug Logs
Logs are written to: `.cursor/debug.log` (NDJSON format)

### Common Issues

**Products not loading:**
- Check `products-data.js` version matches script tag
- Verify `getAllProducts()` is available in console
- Check Network tab for 404 errors

**Header/Footer not consistent:**
- Verify all pages use `universal-header.html` and `universal-footer.html`
- Check for inline CSS overriding universal styles

**Port conflicts:**
- Stop other servers: `lsof -ti:8080 | xargs kill -9`
- Check what's running: `lsof -i :8080`

## 📚 Documentation

- `UNIVERSAL_HEADER_FOOTER_REFERENCE.md` - Header/footer reference
- `DEPLOYMENT_WORKFLOW.md` - Deployment process
- `PROJECT_STRUCTURE.md` - Detailed project structure
- `QUICK_REFERENCE.md` - Quick commands and tips

## 🎯 Best Practices

1. **Single Source of Truth:** Always edit in this repo, never in CascadeProjects
2. **Test Locally:** Run `npm start` and test at `http://localhost:8080` before committing
3. **Small Commits:** Commit often with clear messages
4. **Universal Components:** Use universal header/footer on all pages
5. **Version Control:** Update `?v=XX` when changing `products-data.js`

## 🚨 Important Notes

- **Don't copy files between folders** - work directly in this repo
- **Port 8080 is the main dev server** - stop other servers if conflicts occur
- **Universal header/footer must be identical** across all pages
- **Product data version** must match between preload and script tags

## 📞 Support

For issues or questions:
1. Check debug logs: `.cursor/debug.log`
2. Review documentation files in repo root
3. Check browser console for errors
4. Verify all dependencies installed: `npm install`

---

**Built with ❤️ for Success Chemistry**
