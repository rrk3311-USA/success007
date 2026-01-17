import fs from 'fs';
import path from 'path';

const root = process.cwd();
const outDir = path.join(root, 'deploy-site');

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(srcDir, destDir) {
  ensureDir(destDir);
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const src = path.join(srcDir, e.name);
    const dest = path.join(destDir, e.name);
    if (e.isDirectory()) {
      copyDir(src, dest);
    } else if (e.isFile()) {
      copyFile(src, dest);
    }
  }
}

rmrf(outDir);
ensureDir(outDir);

// Copy all top-level HTML files
for (const name of fs.readdirSync(root)) {
  const full = path.join(root, name);
  if (fs.statSync(full).isFile() && name.toLowerCase().endsWith('.html')) {
    copyFile(full, path.join(outDir, name));
  }
}

// Copy Netlify config (redirects/headers)
for (const f of ['netlify.toml', '.netlifyignore']) {
  const src = path.join(root, f);
  if (fs.existsSync(src)) {
    copyFile(src, path.join(outDir, f));
  }
}

// Copy key JS data/assets used by static pages
const extraFiles = [
  'products-data.js',
  'tracking-script.js',
];
for (const f of extraFiles) {
  const src = path.join(root, f);
  if (fs.existsSync(src)) {
    copyFile(src, path.join(outDir, f));
  }
}

// Copy public assets
const publicDir = path.join(root, 'public');
if (fs.existsSync(publicDir)) {
  copyDir(publicDir, path.join(outDir, 'public'));
}

// Mirror /public/images -> /images for compatibility with existing URLs
const publicImages = path.join(publicDir, 'images');
if (fs.existsSync(publicImages)) {
  copyDir(publicImages, path.join(outDir, 'images'));
}

console.log('✅ Prepared deploy-site/ for Netlify');
