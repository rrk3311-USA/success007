#!/usr/bin/env node
/**
 * Generate 12 Sclera i18n subdomain-style pages from locales.json.
 * Output: sclera/{lang}/index.html for en, es, fr, de, pt, it, zh, ja, ar, ru, hi, ko, nl.
 *
 * Usage: node deploy-site/sclera/generate-i18n-pages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_PATH = path.join(__dirname, 'locales.json');
const BASE_URL = 'https://successchemistry.com';
const PRODUCT_SKU = '10786-807';
const PRODUCT_URL = '/product?sku=' + PRODUCT_SKU;

const locales = JSON.parse(fs.readFileSync(LOCALES_PATH, 'utf8'));

function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function t(locale, key) {
  const v = locale[key];
  return Array.isArray(v) ? v : v != null ? String(v) : '';
}

function faqHtml(faq) {
  return (faq || []).map(({ q, a }) => `
        <div class="faq-item">
          <div class="faq-question">${escapeHtml(q)}</div>
          <div class="faq-answer">${escapeHtml(a)}</div>
        </div>`).join('');
}

function benefitsHtml(benefits) {
  return (benefits || []).map((b) => `<li>${escapeHtml(b)}</li>`).join('');
}

function trustBadgesHtml(badges) {
  return (badges || []).map((b) => `<span class="trust-badge">${escapeHtml(b)}</span>`).join('');
}

function buildPageFixed(locale) {
  const lang = t(locale, 'lang');
  const dir = t(locale, 'dir') || 'ltr';
  const langAttr = lang === 'zh' ? 'zh-Hans' : lang === 'en' ? 'en' : lang;
  const sectionWhat = { en: 'What It Does', es: 'Qué hace', fr: 'À quoi ça sert', de: 'Wirkung', pt: 'Para que serve', it: 'A cosa serve', zh: '作用', ja: '効果', ar: 'الوظيفة', ru: 'Действие', hi: 'क्या करता है', ko: '효능', nl: 'Werking' }[lang] || 'What It Does';
  const sectionBenefits = { en: 'Key Benefits', es: 'Beneficios', fr: 'Avantages', de: 'Vorteile', pt: 'Benefícios', it: 'Vantaggi', zh: '主要好处', ja: '主なメリット', ar: 'الفوائد', ru: 'Преимущества', hi: 'फायदे', ko: '핵심 효과', nl: 'Voordelen' }[lang] || 'Benefits';
  const sectionUse = { en: 'Suggested Use', es: 'Uso', fr: 'Mode d\'emploi', de: 'Anwendung', pt: 'Como usar', it: 'Modalità d\'uso', zh: '服用方法', ja: '飲み方', ar: 'طريقة الاستخدام', ru: 'Применение', hi: 'उपयोग', ko: '복용법', nl: 'Gebruik' }[lang] || 'Use';
  const sectionFor = { en: 'Who It\'s For', es: 'Para quién', fr: 'Pour qui', de: 'Für wen', pt: 'Para quem', it: 'Per chi', zh: '适用人群', ja: 'こんな方に', ar: 'لمن', ru: 'Для кого', hi: 'किसके लिए', ko: '이런 분들에게', nl: 'Voor wie' }[lang] || 'For You';

  return `<!DOCTYPE html>
<html lang="${escapeHtml(langAttr)}" dir="${escapeHtml(dir)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(t(locale, 'title'))}</title>
  <meta name="description" content="${escapeHtml(t(locale, 'metaDescription'))}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${BASE_URL}/sclera/${lang}/">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${BASE_URL}/sclera/${lang}/">
  <meta property="og:title" content="${escapeHtml(t(locale, 'title'))}">
  <meta property="og:description" content="${escapeHtml(t(locale, 'metaDescription'))}">
  <meta property="og:image" content="${BASE_URL}/images/products/${PRODUCT_SKU}/01.png">
  <meta property="og:locale" content="${lang === 'en' ? 'en_US' : lang === 'zh' ? 'zh_CN' : lang + '_' + lang.toUpperCase()}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(t(locale, 'title'))}">
  <meta name="twitter:description" content="${escapeHtml(t(locale, 'metaDescription'))}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="icon" type="image/png" href="/public/images/SC_logo_withR.png">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0a234e; line-height: 1.6; background: #f8f9fa; }
    .container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
    h1 { font-size: 1.75rem; color: #2854a6; margin-bottom: 0.75rem; }
    h2 { font-size: 1.35rem; color: #2854a6; margin: 1.75rem 0 0.75rem; }
    .section { background: #fff; padding: 1.5rem; margin: 1.25rem 0; border-radius: 10px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .tagline { font-size: 1.05rem; color: #555; margin-bottom: 1rem; }
    .summary { font-size: 1rem; line-height: 1.75; color: #333; }
    .disclaimer-note { margin-top: 0.75rem; font-size: 0.9rem; color: #666; font-style: italic; }
    ul.benefits { margin: 0.75rem 0 0 1.25rem; }
    ul.benefits li { margin-bottom: 0.4rem; }
    .faq-item { margin: 1rem 0; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; }
    .faq-question { font-weight: 600; color: #2854a6; margin-bottom: 0.5rem; }
    .faq-answer { color: #555; font-size: 0.95rem; }
    .not-for { background: #fef3c7; padding: 1rem; border-radius: 8px; margin-top: 0.75rem; font-size: 0.95rem; color: #92400e; }
    .trust-badges { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0; }
    .trust-badge { padding: 0.4rem 0.75rem; background: #eff6ff; border-radius: 6px; font-size: 0.85rem; color: #1e40af; }
    .cta-section { text-align: center; background: linear-gradient(135deg, #2854a6 0%, #667eea 100%); color: #fff; padding: 2rem; border-radius: 12px; }
    .cta-section h2 { color: #fff; margin-top: 0; }
    .cta-section .price { font-size: 1.25rem; margin: 0.5rem 0 1rem; }
    .cta-btn { display: inline-block; background: #fff; color: #2854a6; padding: 0.9rem 1.75rem; border-radius: 8px; text-decoration: none; font-weight: 600; transition: transform 0.2s; }
    .cta-btn:hover { transform: translateY(-2px); }
    header { background: #fff; padding: 1rem 0; border-bottom: 1px solid #e5e7eb; }
    footer { background: #2854a6; color: #fff; padding: 1.5rem; margin-top: 2.5rem; text-align: center; font-size: 0.9rem; }
    .lang-switcher { font-size: 0.85rem; margin-top: 0.5rem; }
    .lang-switcher a { color: #60a5fa; text-decoration: none; margin: 0 0.25rem; }
    .lang-switcher a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <a href="/"><img src="/public/images/SC_logo_withR.png" alt="Success Chemistry" style="height: 42px;"></a>
    </div>
  </header>

  <main class="container" style="padding: 1.5rem 20px;">
    <section class="section">
      <h1>${escapeHtml(t(locale, 'h1'))}</h1>
      <p class="tagline">${escapeHtml(t(locale, 'tagline'))}</p>
      <p class="summary">${escapeHtml(t(locale, 'summary'))}</p>
    </section>

    <section class="section">
      <h2>${escapeHtml(sectionWhat)}</h2>
      <p class="summary">${escapeHtml(t(locale, 'whatItDoes'))}</p>
      <p class="disclaimer-note">${escapeHtml(t(locale, 'disclaimerNote'))}</p>
    </section>

    <section class="section">
      <h2>${escapeHtml(sectionBenefits)}</h2>
      <ul class="benefits">${benefitsHtml(locale.benefits)}</ul>
    </section>

    <section class="section">
      <h2>${escapeHtml(sectionUse)}</h2>
      <p class="summary">${escapeHtml(t(locale, 'suggestedUse'))}</p>
    </section>

    <section class="section">
      <h2>${escapeHtml(sectionFor)}</h2>
      <p class="summary">${escapeHtml(t(locale, 'whoItsFor'))}</p>
      <div class="not-for"><strong>${escapeHtml(lang === 'en' ? 'Not recommended for: ' : '')}</strong>${escapeHtml(t(locale, 'notFor'))}</div>
    </section>

    <section class="section">
      <h2>FAQ</h2>
      ${faqHtml(locale.faq)}
    </section>

    <section class="section">
      <h2>${escapeHtml(t(locale, 'qualityTitle'))}</h2>
      <div class="trust-badges">${trustBadgesHtml(locale.trustBadges)}</div>
      <p class="summary">${escapeHtml(t(locale, 'qualityIntro'))}</p>
    </section>

    <section class="section cta-section">
      <h2>${escapeHtml(t(locale, 'ctaTitle'))}</h2>
      <p class="price">Sclera White – ${escapeHtml(t(locale, 'ctaPrice'))}</p>
      <a href="${PRODUCT_URL}" class="cta-btn">${escapeHtml(t(locale, 'ctaButton'))}</a>
      <p class="lang-switcher" style="color: rgba(255,255,255,0.85); margin-top: 1rem;">
        ${Object.keys(locales).filter((l) => l !== lang).slice(0, 8).map((l) => `<a href="/sclera/${l}/" style="color: rgba(255,255,255,0.9);">${escapeHtml(locales[l].name)}</a>`).join(' · ')}
      </p>
    </section>
  </main>

  <footer>
    <div class="container">
      <p>${escapeHtml(t(locale, 'footer'))}</p>
      <p class="lang-switcher"><a href="/" style="color: #93c5fd;">English</a> · <a href="/shop" style="color: #93c5fd;">Shop</a> · <a href="/cart" style="color: #93c5fd;">Cart</a></p>
    </div>
  </footer>
</body>
</html>`;
}

// Generate each language page
const langs = Object.keys(locales);
for (const lang of langs) {
  const outDir = path.join(__dirname, lang);
  fs.mkdirSync(outDir, { recursive: true });
  const html = buildPageFixed(locales[lang]);
  const outPath = path.join(outDir, 'index.html');
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`  ✅ ${lang} -> sclera/${lang}/index.html`);
}

console.log(`\n✅ Generated ${langs.length} Sclera i18n pages.`);
