#!/usr/bin/env node
/**
 * Site-wide purchase flow test
 *
 * Tests: Home → Shop → Product → Add to Cart → Cart → Subscribe & Save UI → Test Payment → Thank You
 *
 * Usage: node test-purchase-flow.js [baseUrl]
 * Example: node test-purchase-flow.js "http://localhost:8080"
 *
 * Requires: npx playwright install chromium
 * Run local server first: npm start (or npm run local), then npm run test:purchase
 */

import { chromium } from 'playwright';

const BASE_URL = process.argv[2] || 'http://localhost:8080';
const RESULTS = { passed: [], failed: [] };

function ok(name, detail = '') {
  RESULTS.passed.push({ name, detail });
  console.log(`  ✅ ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(name, detail = '') {
  RESULTS.failed.push({ name, detail });
  console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`);
}

async function run() {
  console.log(`\n🛒 Site-wide purchase flow test\n   Base URL: ${BASE_URL}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: BASE_URL });
  const page = await context.newPage();

  try {
    // --- 1. Home ---
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForLoadState('networkidle').catch(() => {});
    const homeTitle = await page.title();
    if (homeTitle && !homeTitle.toLowerCase().includes('error')) ok('Home loads', homeTitle);
    else fail('Home loads', `title: ${homeTitle}`);

    // --- 2. Shop ---
    await page.goto('/shop', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForLoadState('networkidle').catch(() => {});
    const shopTitle = await page.title();
    if (shopTitle && shopTitle.toLowerCase().includes('shop')) ok('Shop loads', shopTitle);
    else fail('Shop loads', `title: ${shopTitle}`);

    // Find Add to Cart on product cards (shop grid)
    const addBtn = page.locator('.btn-add-cart, [class*="add-cart"], button:has-text("Add to Cart")').first();
    const addCount = await addBtn.count();
    if (addCount === 0) {
      fail('Shop has Add to Cart buttons', 'none found');
    } else {
      ok('Shop has Add to Cart buttons', `${addCount} found`);
    }

    // --- 2b. Shop Add to Cart path (add from grid, then cart) ---
    await page.evaluate(() => {
      localStorage.setItem('successChemistryCart', '[]');
      localStorage.removeItem('purchaseType');
    });
    await page.goto('/shop', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForSelector('.product-card, .btn-add-cart', { timeout: 8000 }).catch(() => {});
    const shopAtc = page.locator('.product-card').first().locator('.btn-add-cart');
    if ((await shopAtc.count()) > 0) {
      await shopAtc.click();
      await page.waitForTimeout(800);
      const shopCart = await page.evaluate(() => JSON.parse(localStorage.getItem('successChemistryCart') || '[]'));
      if (shopCart.length > 0) ok('Shop Add to Cart adds item', `items: ${shopCart.length}`);
      else fail('Shop Add to Cart adds item', 'cart empty');
    } else {
      fail('Shop Add to Cart adds item', 'no .btn-add-cart in first card');
    }

    // --- 3. Product page (use main PDP template with bundles; 10777-810 serves static liver-cleanse page) ---
    await page.goto('/product?sku=10786-807', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(2000);

    const productTitle = await page.title();
    if (productTitle && !productTitle.toLowerCase().includes('loading')) ok('Product page loads', productTitle);
    else fail('Product page loads', `title: ${productTitle}`);

    // Wait for product content (bundle or add to cart)
    await page.waitForSelector('#addToCartBtn, #addBundleToCartBtn, .add-to-cart-btn, .add-bundle-btn', { timeout: 10000 }).catch(() => {});

    const atc = page.locator('#addToCartBtn, #addBundleToCartBtn, .add-to-cart-btn, .add-bundle-btn').first();
    const atcCount = await atc.count();
    if (atcCount > 0) ok('Product page has Add to Cart / Add Bundle button');
    else fail('Product page has Add to Cart / Add Bundle button');

    // Clear cart and add product via JS (reliable)
    await page.evaluate(() => {
      localStorage.setItem('successChemistryCart', '[]');
      localStorage.removeItem('purchaseType');
      localStorage.removeItem('isSubscription');
      localStorage.removeItem('subscriptionInfo');
    });

    // Click Add to Cart or Add Bundle
    const bundleBtn = page.locator('#addBundleToCartBtn');
    const mainAtc = page.locator('#addToCartBtn');
    if ((await bundleBtn.count()) > 0) {
      await bundleBtn.click();
    } else if ((await mainAtc.count()) > 0) {
      await mainAtc.click();
    } else {
      await atc.click();
    }
    await page.waitForTimeout(1500);

    let cart = await page.evaluate(() => JSON.parse(localStorage.getItem('successChemistryCart') || '[]'));
    if (cart.length > 0) ok('Add to Cart adds item to cart', `items: ${cart.length}`);
    else fail('Add to Cart adds item to cart', 'cart empty after click');

    // --- 4. Cart ---
    await page.goto('/cart', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);

    const cartTitle = await page.title();
    if (cartTitle && cartTitle.toLowerCase().includes('cart')) ok('Cart page loads', cartTitle);
    else fail('Cart page loads', `title: ${cartTitle}`);

    const emptyCart = await page.locator('#empty-cart');
    const emptyVisible = await emptyCart.isVisible().catch(() => false);
    if (!emptyVisible) ok('Cart shows items (not empty state)');
    else fail('Cart shows items', 'empty state visible');

    const subscriptionPitch = await page.locator('#subscription-pitch');
    const pitchVisible = await subscriptionPitch.isVisible().catch(() => false);
    const pitchDisplay = pitchVisible ? await subscriptionPitch.evaluate((el) => window.getComputedStyle(el).display) : 'none';
    if (cart.length === 1 && (pitchDisplay !== 'none' || pitchVisible)) ok('Subscribe & Save pitch visible for single item');
    else if (cart.length === 1) fail('Subscribe & Save pitch visible for single item', 'pitch hidden');
    else ok('Subscribe & Save pitch', `skipped (${cart.length} items)`);

    const oneTimeBtn = page.locator('#one-time-btn');
    const subscribeBtn = page.locator('#subscribe-btn');
    const hasToggle = (await oneTimeBtn.count()) > 0 && (await subscribeBtn.count()) > 0;
    if (hasToggle) ok('One-Time / Subscribe toggle present');
    else fail('One-Time / Subscribe toggle present');

    // --- 5. Test Payment (Bypass PayPal) ---
    const testPaymentBtn = page.locator('#test-payment-btn');
    const hasTestBtn = (await testPaymentBtn.count()) > 0;
    if (hasTestBtn) ok('Test Payment (Bypass PayPal) button present');
    else fail('Test Payment (Bypass PayPal) button present');

    if (hasTestBtn) {
      await testPaymentBtn.click();
      await page.waitForURL(/thank-you|order-confirmation/, { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(1500);

      const url = page.url();
      if (url.includes('thank-you') || url.includes('order-confirmation')) ok('Test Payment redirects to thank-you / order-confirmation', url);
      else fail('Test Payment redirects to thank-you / order-confirmation', `got: ${url}`);
    }

    // --- 6. Post-purchase: cart cleared ---
    await page.goto('/cart', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1000);
    cart = await page.evaluate(() => JSON.parse(localStorage.getItem('successChemistryCart') || '[]'));
    if (cart.length === 0) ok('Cart cleared after successful test payment');
    else fail('Cart cleared after successful test payment', `cart has ${cart.length} items`);
  } catch (e) {
    fail('Test run', e.message);
    console.error(e);
  } finally {
    await browser.close();
  }

  // --- Summary ---
  console.log('\n--- Summary ---');
  console.log(`  Passed: ${RESULTS.passed.length}`);
  console.log(`  Failed: ${RESULTS.failed.length}`);
  if (RESULTS.failed.length > 0) {
    console.log('\n  Failed checks:');
    RESULTS.failed.forEach(({ name, detail }) => console.log(`    • ${name}${detail ? ` — ${detail}` : ''}`));
    process.exit(1);
  }
  console.log('\n  All checks passed.\n');
  process.exit(0);
}

run();
