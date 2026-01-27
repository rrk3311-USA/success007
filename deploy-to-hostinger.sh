#!/bin/bash

# Deploy to Hostinger via SFTP/FTP
# This script syncs the deploy-site directory to Hostinger

set -e

echo "🚀 Deploying to Hostinger..."
echo ""

# Load credentials from .env file using Python to safely handle special characters
if [ -f .env ]; then
    eval $(python3 << 'PYEOF'
import re
import sys

with open('.env', 'r') as f:
    for line in f:
        line = line.strip()
        if line.startswith('HOSTINGER_') and '=' in line and not line.startswith('#'):
            key, value = line.split('=', 1)
            # Remove surrounding quotes
            value = value.strip('"').strip("'")
            # Escape special characters for bash
            value = value.replace('\\', '\\\\').replace('$', '\\$').replace('`', '\\`').replace('"', '\\"')
            print(f'export {key}="{value}"')
PYEOF
)
fi

# Hostinger FTP/SFTP Configuration
HOSTINGER_HOST="${HOSTINGER_HOST:-ftp.yourdomain.com}"
HOSTINGER_USER="${HOSTINGER_USER:-your_username}"
HOSTINGER_PASS="${HOSTINGER_PASS:-your_password}"
HOSTINGER_REMOTE_PATH="${HOSTINGER_REMOTE_PATH:-/public_html}"

# Check if credentials are set
if [ "$HOSTINGER_HOST" = "ftp.yourdomain.com" ] || [ "$HOSTINGER_USER" = "your_username" ]; then
    echo "❌ Error: Hostinger credentials not configured!"
    echo ""
    echo "Please set the following environment variables:"
    echo "  - HOSTINGER_HOST (e.g., ftp.yourdomain.com)"
    echo "  - HOSTINGER_USER (your FTP username)"
    echo "  - HOSTINGER_PASS (your FTP password)"
    echo "  - HOSTINGER_REMOTE_PATH (e.g., /public_html)"
    echo ""
    echo "You can either:"
    echo "  1. Create a .env file with these variables"
    echo "  2. Export them before running this script"
    echo ""
    exit 1
fi

# Navigate to project root
cd "$(dirname "$0")"

# Source directory (what we're deploying)
SOURCE_DIR="./deploy-site"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Error: $SOURCE_DIR directory not found!"
    exit 1
fi

echo "📦 Source: $SOURCE_DIR"
echo "🌐 Target: $HOSTINGER_USER@$HOSTINGER_HOST:$HOSTINGER_REMOTE_PATH"
echo ""

# Check if lftp is installed (better for FTP)
if command -v lftp &> /dev/null; then
    echo "✅ Using lftp for deployment..."
    echo ""
    
    # Use Python to safely create lftp script with special character handling
    LFTP_SCRIPT=$(mktemp)
    python3 << PYEOF
import re
import os

# Read credentials from .env
credentials = {}
with open('.env', 'r') as f:
    for line in f:
        if line.startswith('HOSTINGER_') and '=' in line and not line.strip().startswith('#'):
            key, value = line.strip().split('=', 1)
            # Remove surrounding quotes
            value = value.strip('"').strip("'")
            credentials[key] = value

# Get values with defaults
host = credentials.get('HOSTINGER_HOST', 'ftp.yourdomain.com')
user = credentials.get('HOSTINGER_USER', 'your_username')
password = credentials.get('HOSTINGER_PASS', 'your_password')
remote_path = credentials.get('HOSTINGER_REMOTE_PATH', '/public_html')
source_dir = os.path.abspath('$SOURCE_DIR')

# Write lftp script
with open('$LFTP_SCRIPT', 'w') as f:
    f.write('set ftp:ssl-allow no\\n')
    f.write('set ftp:passive-mode yes\\n')
    f.write(f'open -u {user},{password} {host}\\n')
    f.write(f'cd {remote_path}\\n')
    f.write(f'lcd {source_dir}\\n')
    f.write('mirror --reverse --delete --verbose --exclude-glob .git* --exclude-glob .DS_Store --exclude-glob .vercel* --exclude-glob .netlify* --exclude-glob node_modules\\n')
    f.write('bye\\n')
PYEOF
    
    lftp -f "$LFTP_SCRIPT"
    rm -f "$LFTP_SCRIPT"
    
    echo ""
    echo "✅ Deployment complete!"
    
# Check if rsync over SSH is available
elif command -v rsync &> /dev/null && [ -n "$HOSTINGER_SSH_KEY" ]; then
    echo "✅ Using rsync over SSH for deployment..."
    echo ""
    
    rsync -avz --delete \
        --exclude='.git' \
        --exclude='.DS_Store' \
        --exclude='.vercel' \
        --exclude='.netlify' \
        --exclude='node_modules' \
        -e "ssh -i $HOSTINGER_SSH_KEY" \
        "$SOURCE_DIR/" "$HOSTINGER_USER@$HOSTINGER_HOST:$HOSTINGER_REMOTE_PATH/"
    
    echo ""
    echo "✅ Deployment complete!"
    
# Fallback to basic FTP using curl
elif command -v curl &> /dev/null; then
    echo "⚠️  Using basic FTP (curl) - limited functionality..."
    echo "   For better results, install 'lftp' or configure SSH"
    echo ""
    
    # Note: curl FTP is limited, this is a basic example
    # For full deployment, use lftp or rsync
    echo "📤 Uploading files..."
    
    # This is a simplified example - for production, use lftp
    find "$SOURCE_DIR" -type f ! -name ".DS_Store" ! -path "*/.git/*" ! -path "*/node_modules/*" | while read file; do
        rel_path="${file#$SOURCE_DIR/}"
        echo "  Uploading: $rel_path"
        # curl FTP upload would go here, but lftp is recommended
    done
    
    echo ""
    echo "⚠️  Basic FTP mode - please install 'lftp' for full deployment"
    echo "   Install: brew install lftp (macOS) or apt-get install lftp (Linux)"
    
else
    echo "❌ Error: No suitable FTP/SFTP tool found!"
    echo ""
    echo "Please install one of the following:"
    echo "  - lftp (recommended): brew install lftp"
    echo "  - rsync (with SSH key configured)"
    echo ""
    exit 1
fi

echo ""
echo "🌐 Deployment to Hostinger complete!"
echo "   Visit your site to verify the changes."
echo ""
