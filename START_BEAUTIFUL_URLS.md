# 🚀 Start Your Beautiful URLs

## Quick Start

### Step 1: Start the Frontend Server
```bash
cd "/Users/r-kammer/CascadeProjects/Success Chemistry"
node local-server.js
```

### Step 2: Start the API Server (if not running)
```bash
cd "/Users/r-kammer/CascadeProjects/Success Chemistry/server"
node index.js
```

## Your Beautiful URLs

Instead of ugly file paths, use these clean URLs:

### Public Pages:
- 🛍️ **Shop**: http://localhost:8080/shop
- 🏠 **Home**: http://localhost:8080/

### Admin Pages:
- 📊 **Dashboard**: http://localhost:8080/admin
- 📈 **Heatmap**: http://localhost:8080/heatmap
- 🤖 **Command Center**: http://localhost:8080/command-center

### Legal Pages:
- 🔒 **Privacy Policy**: http://localhost:8080/privacy

### API:
- 🔧 **API Server**: http://localhost:3001

---

## Optional: Custom Domain (Even Prettier!)

### Add Custom Local Domain

**Step 1: Edit hosts file**
```bash
sudo nano /etc/hosts
```

**Step 2: Add these lines**
```
127.0.0.1    successchemistry.local
127.0.0.1    shop.successchemistry.local
127.0.0.1    admin.successchemistry.local
```

Save with `Ctrl+X`, `Y`, `Enter`

**Step 3: Access with custom domain**
- 🛍️ Shop: http://shop.successchemistry.local:8080
- 📊 Admin: http://admin.successchemistry.local:8080
- 🏠 Main: http://successchemistry.local:8080

---

## One-Command Startup Script

Create a startup script to run both servers at once:

```bash
#!/bin/bash
# Start both servers

echo "🚀 Starting Success Chemistry servers..."

# Start API server in background
cd "/Users/r-kammer/CascadeProjects/Success Chemistry/server"
node index.js &

# Wait a moment
sleep 2

# Start frontend server
cd "/Users/r-kammer/CascadeProjects/Success Chemistry"
node local-server.js
```

Save as `start-servers.sh` and run:
```bash
chmod +x start-servers.sh
./start-servers.sh
```

---

## Benefits

✅ **Clean URLs** - No more ugly file:// paths
✅ **Easy to Remember** - localhost:8080/shop
✅ **Professional** - Looks like a real website
✅ **Shareable** - Use ngrok to share with others
✅ **Development Ready** - Perfect for testing before domain

---

## When You Buy Your Domain

When you purchase `successchemistry.com`:
1. Upload files to your hosting
2. Update API_BASE in shop.html and dashboard
3. Point DNS to your server
4. Everything works the same!

---

**Ready to start?** Just run:
```bash
node local-server.js
```

Then visit: http://localhost:8080/shop 🎉
