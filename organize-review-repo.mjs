import fs from 'fs';
import path from 'path';

const root = process.cwd();
const rawRoot = path.join(root, 'review-repo', 'raw');
const sortedRoot = path.join(root, 'review-repo', 'sorted');

const buckets = {
  reviews: path.join(sortedRoot, 'reviews'),
  orders: path.join(sortedRoot, 'orders'),
  customers: path.join(sortedRoot, 'customers'),
  misc: path.join(sortedRoot, 'misc'),
  archive: path.join(sortedRoot, 'archive'),
};

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function safeName(s) {
  return s.replace(/[\\/:*?"<>|]/g, '_');
}

function classify(relPath) {
  const s = relPath.toLowerCase();

  // Reviews
  if (
    s.includes('review') ||
    s.includes('judgeme') ||
    s.includes('judge.me') ||
    s.includes('yotpo') ||
    s.includes('walmart review') ||
    s.includes('walmart- review') ||
    s.includes('walmart review sync') ||
    s.includes('testimonials')
  ) {
    return 'reviews';
  }

  // Orders
  if (
    s.includes('order') ||
    s.includes('orders') ||
    s.includes('order history') ||
    s.includes('sales report')
  ) {
    return 'orders';
  }

  // Customers
  if (
    s.includes('customer') ||
    s.includes('customers') ||
    s.includes('contacts') ||
    s.includes('contact')
  ) {
    return 'customers';
  }

  // Archive-ish buckets
  // Note: we still may choose to *also* include these in the main buckets if keyword matches,
  // so this check must come after the reviews/orders/customers checks above.
  if (s.includes('archive') || s.includes('flat files') || s.includes('backup')) {
    return 'archive';
  }

  return 'misc';
}

function removeIfExists(p) {
  try {
    fs.rmSync(p, { recursive: true, force: true });
  } catch {
    // ignore
  }
}

function makeSymlink(target, linkPath) {
  removeIfExists(linkPath);
  ensureDir(path.dirname(linkPath));
  const stat = fs.lstatSync(target);
  const type = stat.isDirectory() ? 'dir' : 'file';
  fs.symlinkSync(target, linkPath, type);
}

function walkFiles(dir, baseDir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === '.DS_Store') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...walkFiles(full, baseDir));
    } else if (e.isFile()) {
      out.push({
        full,
        rel: path.relative(baseDir, full),
      });
    }
  }
  return out;
}

function ensureEmptyDir(p) {
  removeIfExists(p);
  ensureDir(p);
}

function main() {
  if (!fs.existsSync(rawRoot)) {
    console.error(`❌ Missing: ${rawRoot}`);
    process.exit(1);
  }

  // Rebuild sorted output each run
  ensureEmptyDir(sortedRoot);
  Object.values(buckets).forEach(ensureDir);

  const report = {
    generated_at: new Date().toISOString(),
    raw_root: rawRoot,
    sorted_root: sortedRoot,
    counts: { reviews: 0, orders: 0, customers: 0, misc: 0, archive: 0 },
    extensions: {},
    items: [],
  };

  const files = walkFiles(rawRoot, rawRoot);

  for (const f of files) {
    const bucket = classify(f.rel);

    const segments = f.rel.split(path.sep).map(safeName);
    const dest = path.join(buckets[bucket], ...segments);

    const ext = path.extname(f.rel).toLowerCase() || '(none)';
    report.extensions[ext] = (report.extensions[ext] || 0) + 1;

    try {
      makeSymlink(f.full, dest);
      report.counts[bucket] += 1;
      report.items.push({ rel: f.rel, bucket, link: path.relative(root, dest) });
    } catch (err) {
      report.items.push({ rel: f.rel, bucket: 'error', error: String(err) });
    }
  }

  // Write report
  const reportPath = path.join(sortedRoot, 'SORT_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('✅ Created sorted symlink views in review-repo/sorted/');
  console.log('📄 Report:', reportPath);
  console.log('Counts:', report.counts);
}

main();
