#!/usr/bin/env node
/**
 * Sync only images for 3 main products from success project (deploy-site) → SCV2.
 * Source: deploy-site/products-data.js (we use same SKUs). Copies image files only.
 * Run from repo root: node SCV2/scripts/sync-3-product-images.js
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "../..");
const SUCCESS_IMAGES = path.join(REPO_ROOT, "deploy-site/public/images/products");
const SCV2_IMAGES = path.join(REPO_ROOT, "SCV2/public/images/products");

const MAIN_PRODUCT_SKUS = ["52274-401", "14179-504-2", "10786-807-2"];

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

function syncDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.warn("Skip (missing):", srcDir);
    return 0;
  }
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  let count = 0;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const srcPath = path.join(srcDir, e.name);
    const destPath = path.join(destDir, e.name);
    if (e.isDirectory()) {
      count += syncDir(srcPath, destPath);
    } else if (e.isFile() && IMAGE_EXT.has(path.extname(e.name).toLowerCase())) {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
}

let total = 0;
for (const sku of MAIN_PRODUCT_SKUS) {
  const src = path.join(SUCCESS_IMAGES, sku);
  const dest = path.join(SCV2_IMAGES, sku);
  const n = syncDir(src, dest);
  total += n;
  console.log(sku, "→", n, "images");
}
console.log("Done. Total images synced:", total);
