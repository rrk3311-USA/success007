#!/bin/bash
# Cleanup script for duplicate pages
# Review this script before running!

echo "=== DUPLICATE CLEANUP SCRIPT ==="
echo ""
echo "This will remove duplicate/backup files. Review the list below:"
echo ""

# Files to potentially delete (uncomment to enable deletion)
echo "📄 Files that can be safely deleted:"
echo ""
echo "# Shipping Returns backups:"
echo "rm deploy-site/shipping-returns-BACKUP.html"
echo "rm deploy-site/shipping-returns-PREVIEW.html"
echo ""
echo "# Old folder versions (if keeping .html versions):"
echo "# rm -rf deploy-site/payment-policy/"
echo "# rm -rf deploy-site/privacy-policy/"
echo "# rm -rf deploy-site/terms-of-service/"
echo "# rm -rf deploy-site/shipping-returns/"
echo ""
echo "# Blog (if keeping blog/index.html):"
echo "# rm deploy-site/blog.html"
echo ""
echo "⚠️  To actually delete, uncomment the lines above and run this script"
echo ""
echo "✅ Safe to keep:"
echo "   - index.html (current homepage)"
echo "   - index-OLD-UX-OVERHAUL.html (old version for reference)"
