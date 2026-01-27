#!/usr/bin/env node
/**
 * Generate full Sclera product pages in 12 languages with images, bundles, upsells.
 * Output: sclera/{lang}/index.html - complete product pages, just translated.
 *
 * Usage: node deploy-site/sclera/generate-full-i18n-pages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const LOCALES_PATH = path.join(__dirname, 'locales.json');
const PRODUCTS_DATA_PATH = path.join(__dirname, '..', 'products-data.js');
const BASE_URL = 'https://successchemistry.com';
const PRODUCT_SKU = '10786-807';

// Load locales
const locales = JSON.parse(fs.readFileSync(LOCALES_PATH, 'utf8'));

// Load product data
let product = null;
try {
  const productsDataContent = fs.readFileSync(PRODUCTS_DATA_PATH, 'utf8');
  const module = { exports: {} };
  const exports = module.exports;
  const loadModule = new Function('module', 'exports', 'require', productsDataContent);
  loadModule(module, module.exports, require);
  if (module.exports.PRODUCTS_DATA && module.exports.PRODUCTS_DATA[PRODUCT_SKU]) {
    product = module.exports.PRODUCTS_DATA[PRODUCT_SKU];
  }
} catch (e) {
  console.error('Error loading product data:', e.message);
  process.exit(1);
}

if (!product) {
  console.error(`Product ${PRODUCT_SKU} not found!`);
  process.exit(1);
}

// Recommended/upsell products (related eye health or best sellers)
const UPSELL_SKUS = ['10775-506', '10777-810', '52274-401', '14179-504-2'];
let upsellProducts = [];
try {
  const module = { exports: {} };
  const loadModule = new Function('module', 'exports', 'require', fs.readFileSync(PRODUCTS_DATA_PATH, 'utf8'));
  loadModule(module, module.exports, require);
  if (module.exports.PRODUCTS_DATA) {
    upsellProducts = UPSELL_SKUS
      .map(sku => module.exports.PRODUCTS_DATA[sku])
      .filter(p => p && p.sku !== PRODUCT_SKU)
      .slice(0, 4);
  }
} catch (e) {
  console.warn('Could not load upsell products:', e.message);
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function t(locale, key) {
  const v = locale[key];
  return Array.isArray(v) ? v : v != null ? String(v) : '';
}

// Section title translations
const sectionTitles = {
  en: { whatItDoes: 'What It Does', benefits: 'Key Benefits', use: 'Suggested Use', for: 'Who It\'s For', ingredients: 'Key Ingredients', details: 'Product Details', facts: 'Supplement Facts', faq: 'FAQ', quality: 'Quality & Manufacturing', subscribe: 'Subscribe & Save', upsells: 'You May Also Like' },
  es: { whatItDoes: 'Qué hace', benefits: 'Beneficios', use: 'Uso', for: 'Para quién', ingredients: 'Ingredientes clave', details: 'Detalles del producto', facts: 'Información nutricional', faq: 'Preguntas frecuentes', quality: 'Calidad y fabricación', subscribe: 'Suscríbete y ahorra', upsells: 'También te puede gustar' },
  fr: { whatItDoes: 'À quoi ça sert', benefits: 'Avantages', use: 'Mode d\'emploi', for: 'Pour qui', ingredients: 'Ingrédients clés', details: 'Détails du produit', facts: 'Informations nutritionnelles', faq: 'FAQ', quality: 'Qualité et fabrication', subscribe: 'S\'abonner et économiser', upsells: 'Vous pourriez aussi aimer' },
  de: { whatItDoes: 'Wirkung', benefits: 'Vorteile', use: 'Anwendung', for: 'Für wen', ingredients: 'Hauptbestandteile', details: 'Produktdetails', facts: 'Nährwertangaben', faq: 'FAQ', quality: 'Qualität & Herstellung', subscribe: 'Abonnieren & Sparen', upsells: 'Das könnte Ihnen auch gefallen' },
  pt: { whatItDoes: 'Para que serve', benefits: 'Benefícios', use: 'Como usar', for: 'Para quem', ingredients: 'Ingredientes principais', details: 'Detalhes do produto', facts: 'Informações nutricionais', faq: 'Perguntas frequentes', quality: 'Qualidade e fabrico', subscribe: 'Assinar e economizar', upsells: 'Você também pode gostar' },
  it: { whatItDoes: 'A cosa serve', benefits: 'Vantaggi', use: 'Modalità d\'uso', for: 'Per chi', ingredients: 'Ingredienti principali', details: 'Dettagli del prodotto', facts: 'Informazioni nutrizionali', faq: 'FAQ', quality: 'Qualità e fabricazione', subscribe: 'Abbonati e risparmia', upsells: 'Potrebbe piacerti anche' },
  zh: { whatItDoes: '作用', benefits: '主要好处', use: '服用方法', for: '适用人群', ingredients: '主要成分', details: '产品详情', facts: '营养成分', faq: '常见问题', quality: '品质与生产', subscribe: '订阅省更多', upsells: '您可能也喜欢' },
  ja: { whatItDoes: '効果', benefits: '主なメリット', use: '飲み方', for: 'こんな方に', ingredients: '主成分', details: '製品詳細', facts: '栄養成分', faq: 'よくある質問', quality: '品質・製造', subscribe: '定期購入でお得', upsells: 'こちらもおすすめ' },
  ar: { whatItDoes: 'الوظيفة', benefits: 'الفوائد', use: 'طريقة الاستخدام', for: 'لمن', ingredients: 'المكونات الرئيسية', details: 'تفاصيل المنتج', facts: 'المعلومات الغذائية', faq: 'الأسئلة الشائعة', quality: 'الجودة والتصنيع', subscribe: 'اشترك ووفر', upsells: 'قد يعجبك أيضاً' },
  ru: { whatItDoes: 'Действие', benefits: 'Преимущества', use: 'Применение', for: 'Для кого', ingredients: 'Ключевые ингредиенты', details: 'Детали продукта', facts: 'Пищевая ценность', faq: 'Часто задаваемые вопросы', quality: 'Качество и производство', subscribe: 'Подписка и экономия', upsells: 'Вам также может понравиться' },
  hi: { whatItDoes: 'क्या करता है', benefits: 'फायदे', use: 'उपयोग', for: 'किसके लिए', ingredients: 'मुख्य सामग्री', details: 'उत्पाद विवरण', facts: 'पोषण तथ्य', faq: 'सामान्य प्रश्न', quality: 'गुणवत्ता और निर्माण', subscribe: 'सदस्यता लें और बचाएं', upsells: 'आपको यह भी पसंद आ सकता है' },
  ko: { whatItDoes: '효능', benefits: '핵심 효과', use: '복용법', for: '이런 분들에게', ingredients: '주요 성분', details: '제품 상세', facts: '영양 정보', faq: '자주 묻는 질문', quality: '품질 및 제조', subscribe: '구독하고 절약', upsells: '이런 제품도 추천' },
  nl: { whatItDoes: 'Werking', benefits: 'Voordelen', use: 'Gebruik', for: 'Voor wie', ingredients: 'Belangrijkste ingrediënten', details: 'Productdetails', facts: 'Voedingsinformatie', faq: 'Veelgestelde vragen', quality: 'Kwaliteit & fabricage', subscribe: 'Abonneren & besparen', upsells: 'Dit vindt u misschien ook leuk' }
};

function getSectionTitle(lang, key) {
  return sectionTitles[lang]?.[key] || sectionTitles.en[key] || key;
}

function buildFullProductPage(locale) {
  const lang = t(locale, 'lang');
  const dir = t(locale, 'dir') || 'ltr';
  const langAttr = lang === 'zh' ? 'zh-Hans' : lang === 'en' ? 'en' : lang;
  const price = parseFloat(product.price || 0).toFixed(2);
  const basePrice = parseFloat(product.price || 0);
  const mainImage = (product.images && product.images[0]) ? product.images[0] : '/images/placeholder.jpg';
  
  // Bundle prices
  const bundlePrices = {
    single: basePrice,
    two: (basePrice * 2 * 0.9).toFixed(2),
    three: (basePrice * 3 * 0.85).toFixed(2),
    five: (basePrice * 5 * 0.80).toFixed(2)
  };
  
  // Image gallery HTML
  const imageGalleryHTML = product.images && product.images.length > 1 ? `
    <section class="product-gallery-section" style="padding: 40px 0; background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(248, 250, 255, 0.5) 100%); margin-top: 30px; width: 100%;">
      <div style="width: 100%; margin: 0 auto; padding: 0;">
        <h3 style="text-align: center; font-size: 1rem; margin-bottom: 28px; color: #1a1a2e; font-weight: 400; letter-spacing: 2px; text-transform: uppercase; padding: 0 20px;">${escapeHtml(getSectionTitle(lang, 'details'))}</h3>
        <div class="gallery-carousel-container" style="position: relative; width: 100%; overflow: hidden;">
          <div class="gallery-carousel-track" id="galleryCarouselTrack" style="display: flex; gap: 0; overflow-x: auto; overflow-y: hidden; scroll-behavior: smooth; scrollbar-width: none; -ms-overflow-style: none; padding: 0; -webkit-overflow-scrolling: touch; cursor: grab; user-select: none;">
            ${product.images.map((img, index) => `
              <div class="gallery-card" style="flex: 0 0 100%; width: 100%; min-height: 500px; display: flex; align-items: center; justify-content: center; padding: 40px 20px; background: linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 250, 255, 0.7) 100%); backdrop-filter: blur(20px);">
                <img src="${img}" alt="${escapeHtml(product.name)} - ${index + 1}" style="max-width: 100%; max-height: 500px; width: auto; height: auto; object-fit: contain;" loading="lazy">
              </div>
            `).join('')}
          </div>
          <div style="display: flex; justify-content: center; align-items: center; gap: 20px; padding: 24px 20px;">
            <button class="gallery-nav-btn" onclick="scrollGallery(-1)" style="background: rgba(255, 255, 255, 0.95); border: 1px solid rgba(40, 84, 166, 0.2); width: 50px; height: 50px; border-radius: 50%; font-size: 1.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #2854a6;">‹</button>
            <div style="font-size: 0.875rem; color: #666; min-width: 80px; text-align: center;">
              <span id="galleryCurrentIndex">1</span> / <span id="galleryTotalImages">${product.images.length}</span>
            </div>
            <button class="gallery-nav-btn" onclick="scrollGallery(1)" style="background: rgba(255, 255, 255, 0.95); border: 1px solid rgba(40, 84, 166, 0.2); width: 50px; height: 50px; border-radius: 50%; font-size: 1.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #2854a6;">›</button>
          </div>
        </div>
      </div>
    </section>
  ` : '';
  
  // Upsells removed per user request
  const upsellsHTML = '';
  
  // FAQ HTML
  const faqHTML = product.faqs && product.faqs.length > 0 ? product.faqs.map((faq, index) => {
    const isFirst = index === 0;
    return `
      <div class="faq-item" style="margin-bottom: 12px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div class="faq-question" style="padding: 14px 16px; background: #f8f9fa; cursor: pointer; font-weight: 500; color: #2854a6; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem;" onclick="const answer = this.nextElementSibling; const toggle = this.querySelector('.faq-toggle'); answer.classList.toggle('open'); toggle.textContent = answer.classList.contains('open') ? '−' : '+';">
          <span style="flex: 1; padding-right: 12px;">${escapeHtml(faq.question)}</span>
          <span class="faq-toggle" style="font-size: 1.3rem; font-weight: 600; flex-shrink: 0;">${isFirst ? '−' : '+'}</span>
        </div>
        <div class="faq-answer ${isFirst ? 'open' : ''}" style="padding: 14px 16px; background: white; color: #555; line-height: 1.6; font-size: 0.9rem; font-weight: 400; display: ${isFirst ? 'block' : 'none'};">
          <div style="white-space: normal; word-wrap: break-word;">${escapeHtml(faq.answer)}</div>
        </div>
      </div>
    `;
  }).join('') : '';
  
  // Ingredients list
  const ingredientsHTML = product.ingredients ? `
    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 1.2rem; color: #2854a6; margin-bottom: 16px; font-weight: 500; border-bottom: 2px solid #e0f2fe; padding-bottom: 8px;">
        ${escapeHtml(getSectionTitle(lang, 'ingredients'))}
      </h3>
      <ul style="line-height: 1.7; color: #444; padding-left: 20px; font-size: 0.9rem; margin: 0;">
        ${product.ingredients.split('\n').filter(i => i.trim()).map(ing => `<li style="margin-bottom: 6px; font-weight: 400;">${escapeHtml(ing.trim())}</li>`).join('')}
      </ul>
    </div>
  ` : '';
  
  return `<!DOCTYPE html>
<html lang="${escapeHtml(langAttr)}" dir="${escapeHtml(dir)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(t(locale, 'title'))}</title>
  <meta name="description" content="${escapeHtml(t(locale, 'metaDescription'))}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${BASE_URL}/sclera/${lang}/">
  <meta property="og:type" content="product">
  <meta property="og:url" content="${BASE_URL}/sclera/${lang}/">
  <meta property="og:title" content="${escapeHtml(t(locale, 'title'))}">
  <meta property="og:description" content="${escapeHtml(t(locale, 'metaDescription'))}">
  <meta property="og:image" content="${BASE_URL}${mainImage}">
  <meta property="og:locale" content="${lang === 'en' ? 'en_US' : lang === 'zh' ? 'zh_CN' : lang + '_' + lang.toUpperCase()}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(t(locale, 'title'))}">
  <meta name="twitter:description" content="${escapeHtml(t(locale, 'metaDescription'))}">
  <meta name="twitter:image" content="${BASE_URL}${mainImage}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="icon" type="image/png" href="/public/images/SC_logo_withR.png">
  <script src="https://www.paypal.com/sdk/js?client-id=ATM3Eoawal0vHl1xqCcuP5TvlPBP-96AHV0xP0tiQ-KlAd_tuSLLQjKMsby8lgbgE7jN5zXPF3HjMUNk&currency=USD&components=buttons,funding-eligibility&enable-funding=venmo,paylater&disable-funding=credit"></script>
  <script src="/public/cart-utils.js"></script>
  <script src="/public/paypal-buttons.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { overflow-x: hidden; width: 100%; max-width: 100vw; }
    body { font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0a234e; line-height: 1.6; background: linear-gradient(180deg, #f0f4f8 0%, #e8f4f8 30%, #dbeafe 60%, #e0f2fe 100%); min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .topbar { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); position: sticky; top: 0; z-index: 100; border-bottom: 1px solid rgba(255, 255, 255, 0.8); padding: 20px 0; }
    .topbar-inner { display: flex; align-items: center; justify-content: center; max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .brand img { height: 50px; }
    .blue-nav { background: #2854a6; padding: 12px 0; }
    .blue-nav .container { display: flex; align-items: center; justify-content: center; gap: 48px; flex-wrap: nowrap; }
    .blue-nav a { color: #ffffff; text-decoration: none; font-weight: 500; font-size: 1.1rem; }
    .hero-section { padding: 40px 0; text-align: center; }
    .hero-image img { max-width: 100%; max-height: 500px; object-fit: contain; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    .product-header h1 { font-size: 1.6rem; margin-bottom: 6px; color: #2854a6; font-weight: 500; }
    .price-info .price { font-size: 1.8rem; font-weight: 600; color: #2854a6; }
    .bundle-tabs-container { margin: 20px 0; }
    .bundle-tabs-header { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
    .bundle-tab-btn { flex: 1; min-width: 120px; padding: 12px; background: white; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; transition: all 0.3s; display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .bundle-tab-btn.active { border-color: #2854a6; background: #f0f7ff; }
    .bundle-tab-icon { font-size: 1.5rem; font-weight: 700; }
    .bundle-tab-label { font-size: 0.85rem; color: #666; }
    .bundle-tab-content { display: none; }
    .bundle-tab-content.active { display: block; }
    .bundle-tab-details { display: flex; align-items: center; gap: 20px; padding: 20px; background: rgba(255,255,255,0.8); border-radius: 12px; }
    .bundle-tab-bottles { display: flex; gap: 8px; }
    .bundle-tab-bottles img { width: 60px; height: auto; object-fit: contain; }
    .bundle-tab-info { flex: 1; }
    .bundle-tab-title { font-size: 1.2rem; font-weight: 600; color: #2854a6; margin-bottom: 4px; }
    .bundle-tab-price { font-size: 1.5rem; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
    .bundle-tab-savings { font-size: 0.9rem; color: #10b981; font-weight: 600; }
    .bundle-tab-badge { display: inline-block; background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%); color: #0a234e; padding: 4px 10px; border-radius: 10px; font-size: 0.7rem; font-weight: 700; margin-bottom: 4px; }
    .add-bundle-btn { width: 100%; padding: 14px 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 1rem; margin-top: 16px; transition: all 0.3s; }
    .add-bundle-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4); }
    .payment-card-container { max-width: 500px; margin: 30px auto; padding: 24px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); }
    .add-to-cart-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #2854a6 0%, #1e3a8a 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 1rem; transition: all 0.3s; box-shadow: 0 4px 15px rgba(40, 84, 166, 0.3); }
    .add-to-cart-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(40, 84, 166, 0.4); }
    .tabs-container { margin-top: 25px; }
    .tabs-header { display: flex; border-bottom: 2px solid #e0e0e0; background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(10px); border-radius: 12px 12px 0 0; }
    .tab-btn { flex: 1; padding: 12px 18px; background: none; border: none; border-bottom: 3px solid transparent; color: #666; font-weight: 500; cursor: pointer; font-size: 0.9rem; transition: all 0.3s; }
    .tab-btn.active { border-bottom-color: #2854a6; color: #2854a6; }
    .tab-content { display: none; padding: 20px 0; }
    .tab-content.active { display: block; }
    .subscribe-save-section { background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.15) 100%); padding: 20px 0; margin-top: 15px; border-top: 2px solid rgba(16, 185, 129, 0.2); }
    .faq-item { margin-bottom: 12px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
    .faq-question { padding: 14px 16px; background: #f8f9fa; cursor: pointer; font-weight: 500; color: #2854a6; }
    .faq-answer { padding: 14px 16px; background: white; color: #555; line-height: 1.6; }
    .footer { background: #2854a6; color: white; margin-top: 60px; }
    .footer-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3); }
    .footer-btn:active { transform: translateY(0); box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2); }
    @media (max-width: 768px) {
      .bundle-tabs-header { flex-direction: column; }
      .bundle-tab-btn { min-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="/"><img src="/public/images/SC_logo_withR.png" alt="Success Chemistry"></a>
    </div>
  </div>
  <div class="blue-nav">
    <div class="container">
      <a href="/cart">🛒 ${escapeHtml(lang === 'en' ? 'Cart' : lang === 'es' ? 'Carrito' : lang === 'fr' ? 'Panier' : lang === 'de' ? 'Warenkorb' : lang === 'pt' ? 'Carrinho' : lang === 'it' ? 'Carrello' : lang === 'zh' ? '购物车' : lang === 'ja' ? 'カート' : lang === 'ar' ? 'السلة' : lang === 'ru' ? 'Корзина' : lang === 'hi' ? 'कार्ट' : lang === 'ko' ? '장바구니' : 'Cart')} <span id="navCartCount">0</span></a>
      <a href="/contact">${escapeHtml(lang === 'en' ? 'Contact' : lang === 'es' ? 'Contacto' : lang === 'fr' ? 'Contact' : lang === 'de' ? 'Kontakt' : lang === 'pt' ? 'Contato' : lang === 'it' ? 'Contatto' : lang === 'zh' ? '联系' : lang === 'ja' ? 'お問い合わせ' : lang === 'ar' ? 'اتصل' : lang === 'ru' ? 'Контакты' : lang === 'hi' ? 'संपर्क' : lang === 'ko' ? '문의' : 'Contact')}</a>
    </div>
  </div>

  <main class="container" style="padding: 2rem 20px;">
    <!-- Hero Image -->
    <section class="hero-section">
      <div class="hero-image">
        <img src="${mainImage}" alt="${escapeHtml(product.name)}" loading="eager">
      </div>
    </section>

    <!-- Product Info -->
    <section style="padding: 24px 0;">
      <div class="product-header" style="text-align: left; margin-bottom: 20px;">
        <h1>${escapeHtml(product.name)}</h1>
        <p style="color: #666; font-size: 0.9rem; margin-bottom: 10px;">${escapeHtml(product.category || 'Premium Supplement')}</p>
        <div class="price-info" style="margin-bottom: 18px;">
          <span class="price">$${price}</span>
          <span style="color: #666; font-size: 0.85rem; margin-left: 6px;">${escapeHtml(lang === 'en' ? 'per bottle' : lang === 'es' ? 'por botella' : lang === 'fr' ? 'par bouteille' : lang === 'de' ? 'pro Flasche' : lang === 'pt' ? 'por garrafa' : lang === 'it' ? 'per bottiglia' : lang === 'zh' ? '每瓶' : lang === 'ja' ? '1本あたり' : lang === 'ar' ? 'للقارورة' : lang === 'ru' ? 'за флакон' : lang === 'hi' ? 'प्रति बोतल' : lang === 'ko' ? '병당' : 'per bottle')}</span>
        </div>
      </div>

      <!-- Bundle Selector -->
      <div class="bundle-tabs-container">
        <h3 style="font-size: 1.1rem; color: #2854a6; margin-bottom: 16px; text-align: center;">
          🛒 ${escapeHtml(lang === 'en' ? 'Ready to Order? Choose Your Bundle' : lang === 'es' ? '¿Listo para pedir? Elige tu paquete' : lang === 'fr' ? 'Prêt à commander ? Choisissez votre pack' : lang === 'de' ? 'Bereit zu bestellen? Wählen Sie Ihr Paket' : lang === 'pt' ? 'Pronto para pedir? Escolha seu pacote' : lang === 'it' ? 'Pronto ad ordinare? Scegli il tuo pacchetto' : lang === 'zh' ? '准备订购？选择您的套装' : lang === 'ja' ? 'ご注文の準備はできましたか？バンドルを選択' : lang === 'ar' ? 'جاهز للطلب؟ اختر مجموعتك' : lang === 'ru' ? 'Готовы заказать? Выберите набор' : lang === 'hi' ? 'ऑर्डर करने के लिए तैयार? अपना बंडल चुनें' : lang === 'ko' ? '주문 준비되셨나요? 번들을 선택하세요' : 'Ready to Order? Choose Your Bundle')}
        </h3>
        <div class="bundle-tabs-header">
          <button class="bundle-tab-btn active" data-bundle-tab="subscribe" data-bundle="subscribe" data-quantity="1" data-price="${basePrice.toFixed(2)}">
            <span class="bundle-tab-icon">🔄</span>
            <span class="bundle-tab-label">${escapeHtml(lang === 'en' ? 'Subscribe' : lang === 'es' ? 'Suscribirse' : lang === 'fr' ? 'S\'abonner' : lang === 'de' ? 'Abonnieren' : lang === 'pt' ? 'Assinar' : lang === 'it' ? 'Abbonati' : lang === 'zh' ? '订阅' : lang === 'ja' ? '定期購入' : lang === 'ar' ? 'اشترك' : lang === 'ru' ? 'Подписка' : lang === 'hi' ? 'सदस्यता' : lang === 'ko' ? '구독' : 'Subscribe')}</span>
          </button>
          <button class="bundle-tab-btn" data-bundle-tab="2" data-bundle="2" data-quantity="2" data-price="${bundlePrices.two}" data-savings="${(basePrice * 2 * 0.1).toFixed(2)}">
            <span class="bundle-tab-icon">2</span>
            <span class="bundle-tab-label">${escapeHtml(lang === 'en' ? '2 Bottles' : lang === 'es' ? '2 Botellas' : lang === 'fr' ? '2 Bouteilles' : lang === 'de' ? '2 Flaschen' : lang === 'pt' ? '2 Garrafas' : lang === 'it' ? '2 Bottiglie' : lang === 'zh' ? '2瓶' : lang === 'ja' ? '2本' : lang === 'ar' ? '2 قارورة' : lang === 'ru' ? '2 флакона' : lang === 'hi' ? '2 बोतलें' : lang === 'ko' ? '2병' : '2 Bottles')}</span>
          </button>
          <button class="bundle-tab-btn" data-bundle-tab="3" data-bundle="3" data-quantity="3" data-price="${bundlePrices.three}" data-savings="${(basePrice * 3 * 0.15).toFixed(2)}">
            <span class="bundle-tab-icon">3</span>
            <span class="bundle-tab-label">${escapeHtml(lang === 'en' ? '3 Bottles' : lang === 'es' ? '3 Botellas' : lang === 'fr' ? '3 Bouteilles' : lang === 'de' ? '3 Flaschen' : lang === 'pt' ? '3 Garrafas' : lang === 'it' ? '3 Bottiglie' : lang === 'zh' ? '3瓶' : lang === 'ja' ? '3本' : lang === 'ar' ? '3 قارورة' : lang === 'ru' ? '3 флакона' : lang === 'hi' ? '3 बोतलें' : lang === 'ko' ? '3병' : '3 Bottles')}</span>
          </button>
          <button class="bundle-tab-btn" data-bundle-tab="5" data-bundle="5" data-quantity="5" data-price="${bundlePrices.five}" data-savings="${(basePrice * 5 * 0.20).toFixed(2)}">
            <span class="bundle-tab-icon">5</span>
            <span class="bundle-tab-label">${escapeHtml(lang === 'en' ? '5 Bottles' : lang === 'es' ? '5 Botellas' : lang === 'fr' ? '5 Bouteilles' : lang === 'de' ? '5 Flaschen' : lang === 'pt' ? '5 Garrafas' : lang === 'it' ? '5 Bottiglie' : lang === 'zh' ? '5瓶' : lang === 'ja' ? '5本' : lang === 'ar' ? '5 قارورة' : lang === 'ru' ? '5 флаконов' : lang === 'hi' ? '5 बोतलें' : lang === 'ko' ? '5병' : '5 Bottles')}</span>
          </button>
        </div>
        
        <div class="bundle-tabs-content">
          <div class="bundle-tab-content active" id="bundle-tab-subscribe">
            <div class="bundle-tab-details">
              <div class="bundle-tab-bottles">
                <img src="${mainImage}" alt="${escapeHtml(product.name)}">
              </div>
              <div class="bundle-tab-info">
                <div class="bundle-tab-title">${escapeHtml(t(locale, 'subscribe') || 'Subscribe & Save')}</div>
                <div class="bundle-tab-price">$${basePrice.toFixed(2)}</div>
                <div style="font-size: 0.85rem; color: #666; margin-bottom: 8px;">${escapeHtml(lang === 'en' ? 'Auto-delivery every 30 days. Cancel anytime.' : lang === 'es' ? 'Entrega automática cada 30 días. Cancela cuando quieras.' : lang === 'fr' ? 'Livraison automatique tous les 30 jours. Annulez à tout moment.' : lang === 'de' ? 'Automatische Lieferung alle 30 Tage. Jederzeit kündbar.' : lang === 'pt' ? 'Entrega automática a cada 30 dias. Cancele a qualquer momento.' : lang === 'it' ? 'Consegna automatica ogni 30 giorni. Annulla in qualsiasi momento.' : lang === 'zh' ? '每30天自动配送。随时可取消。' : lang === 'ja' ? '30日ごとの自動配送。いつでもキャンセル可能。' : lang === 'ar' ? 'توصيل تلقائي كل 30 يوم. إلغاء في أي وقت.' : lang === 'ru' ? 'Автоматическая доставка каждые 30 дней. Отмена в любое время.' : lang === 'hi' ? 'हर 30 दिन में स्वचालित डिलीवरी। कभी भी रद्द करें।' : lang === 'ko' ? '30일마다 자동 배송. 언제든 취소 가능.' : 'Auto-delivery every 30 days. Cancel anytime.')}</div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                  <span style="font-size: 0.75rem; color: #10b981;">✓ ${escapeHtml(lang === 'en' ? '10% off every order' : lang === 'es' ? '10% de descuento en cada pedido' : lang === 'fr' ? '10% de réduction sur chaque commande' : lang === 'de' ? '10% Rabatt bei jeder Bestellung' : lang === 'pt' ? '10% de desconto em cada pedido' : lang === 'it' ? '10% di sconto su ogni ordine' : lang === 'zh' ? '每单10%折扣' : lang === 'ja' ? '毎回10%オフ' : lang === 'ar' ? '10% خصم على كل طلب' : lang === 'ru' ? '10% скидка на каждый заказ' : lang === 'hi' ? 'हर ऑर्डर पर 10% छूट' : lang === 'ko' ? '매 주문 10% 할인' : '10% off every order')}</span>
                  <span style="font-size: 0.75rem; color: #10b981;">✓ ${escapeHtml(lang === 'en' ? 'Free shipping' : lang === 'es' ? 'Envío gratis' : lang === 'fr' ? 'Livraison gratuite' : lang === 'de' ? 'Kostenloser Versand' : lang === 'pt' ? 'Frete grátis' : lang === 'it' ? 'Spedizione gratuita' : lang === 'zh' ? '免运费' : lang === 'ja' ? '送料無料' : lang === 'ar' ? 'شحن مجاني' : lang === 'ru' ? 'Бесплатная доставка' : lang === 'hi' ? 'मुफ्त शिपिंग' : lang === 'ko' ? '무료 배송' : 'Free shipping')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bundle-tab-content" id="bundle-tab-2">
            <div class="bundle-tab-details">
              <div class="bundle-tab-bottles">
                <img src="${mainImage}" alt="${escapeHtml(product.name)}">
                <img src="${mainImage}" alt="${escapeHtml(product.name)}">
              </div>
              <div class="bundle-tab-info">
                <div class="bundle-tab-badge">${escapeHtml(lang === 'en' ? 'MOST POPULAR' : lang === 'es' ? 'MÁS POPULAR' : lang === 'fr' ? 'LE PLUS POPULAIRE' : lang === 'de' ? 'BELIEBTESTE' : lang === 'pt' ? 'MAIS POPULAR' : lang === 'it' ? 'PIÙ POPOLARE' : lang === 'zh' ? '最受欢迎' : lang === 'ja' ? '人気No.1' : lang === 'ar' ? 'الأكثر شعبية' : lang === 'ru' ? 'САМЫЙ ПОПУЛЯРНЫЙ' : lang === 'hi' ? 'सबसे लोकप्रिय' : lang === 'ko' ? '인기 1위' : 'MOST POPULAR')}</div>
                <div class="bundle-tab-title">${escapeHtml(lang === 'en' ? '2 Bottles' : lang === 'es' ? '2 Botellas' : lang === 'fr' ? '2 Bouteilles' : lang === 'de' ? '2 Flaschen' : lang === 'pt' ? '2 Garrafas' : lang === 'it' ? '2 Bottiglie' : lang === 'zh' ? '2瓶' : lang === 'ja' ? '2本' : lang === 'ar' ? '2 قارورة' : lang === 'ru' ? '2 флакона' : lang === 'hi' ? '2 बोतलें' : lang === 'ko' ? '2병' : '2 Bottles')}</div>
                <div class="bundle-tab-price">$${bundlePrices.two}</div>
                <div class="bundle-tab-savings">${escapeHtml(lang === 'en' ? 'Save' : lang === 'es' ? 'Ahorra' : lang === 'fr' ? 'Économisez' : lang === 'de' ? 'Sparen Sie' : lang === 'pt' ? 'Economize' : lang === 'it' ? 'Risparmia' : lang === 'zh' ? '节省' : lang === 'ja' ? '節約' : lang === 'ar' ? 'وفر' : lang === 'ru' ? 'Экономия' : lang === 'hi' ? 'बचाएं' : lang === 'ko' ? '절약' : 'Save')} $${(basePrice * 2 * 0.1).toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <div class="bundle-tab-content" id="bundle-tab-3">
            <div class="bundle-tab-details">
              <div class="bundle-tab-bottles">
                <img src="${mainImage}" alt="${escapeHtml(product.name)}">
                <img src="${mainImage}" alt="${escapeHtml(product.name)}">
                <img src="${mainImage}" alt="${escapeHtml(product.name)}">
              </div>
              <div class="bundle-tab-info">
                <div class="bundle-tab-badge">${escapeHtml(lang === 'en' ? 'BEST VALUE' : lang === 'es' ? 'MEJOR VALOR' : lang === 'fr' ? 'MEILLEUR RAPPORT' : lang === 'de' ? 'BESTES ANGEBOT' : lang === 'pt' ? 'MELHOR VALOR' : lang === 'it' ? 'MIGLIOR RAPPORTO' : lang === 'zh' ? '超值' : lang === 'ja' ? 'お得' : lang === 'ar' ? 'أفضل قيمة' : lang === 'ru' ? 'ЛУЧШАЯ ЦЕНА' : lang === 'hi' ? 'सर्वोत्तम मूल्य' : lang === 'ko' ? '최고 가치' : 'BEST VALUE')}</div>
                <div class="bundle-tab-title">${escapeHtml(lang === 'en' ? '3 Bottles' : lang === 'es' ? '3 Botellas' : lang === 'fr' ? '3 Bouteilles' : lang === 'de' ? '3 Flaschen' : lang === 'pt' ? '3 Garrafas' : lang === 'it' ? '3 Bottiglie' : lang === 'zh' ? '3瓶' : lang === 'ja' ? '3本' : lang === 'ar' ? '3 قارورة' : lang === 'ru' ? '3 флакона' : lang === 'hi' ? '3 बोतलें' : lang === 'ko' ? '3병' : '3 Bottles')}</div>
                <div class="bundle-tab-price">$${bundlePrices.three}</div>
                <div class="bundle-tab-savings">${escapeHtml(lang === 'en' ? 'Save' : lang === 'es' ? 'Ahorra' : lang === 'fr' ? 'Économisez' : lang === 'de' ? 'Sparen Sie' : lang === 'pt' ? 'Economize' : lang === 'it' ? 'Risparmia' : lang === 'zh' ? '节省' : lang === 'ja' ? '節約' : lang === 'ar' ? 'وفر' : lang === 'ru' ? 'Экономия' : lang === 'hi' ? 'बचाएं' : lang === 'ko' ? '절약' : 'Save')} $${(basePrice * 3 * 0.15).toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <div class="bundle-tab-content" id="bundle-tab-5">
            <div class="bundle-tab-details">
              <div class="bundle-tab-bottles">
                ${Array(5).fill(mainImage).map(img => `<img src="${img}" alt="${escapeHtml(product.name)}">`).join('')}
              </div>
              <div class="bundle-tab-info">
                <div class="bundle-tab-title">${escapeHtml(lang === 'en' ? '5 Bottles' : lang === 'es' ? '5 Botellas' : lang === 'fr' ? '5 Bouteilles' : lang === 'de' ? '5 Flaschen' : lang === 'pt' ? '5 Garrafas' : lang === 'it' ? '5 Bottiglie' : lang === 'zh' ? '5瓶' : lang === 'ja' ? '5本' : lang === 'ar' ? '5 قارورة' : lang === 'ru' ? '5 флаконов' : lang === 'hi' ? '5 बोतलें' : lang === 'ko' ? '5병' : '5 Bottles')}</div>
                <div class="bundle-tab-price">$${bundlePrices.five}</div>
                <div class="bundle-tab-savings">${escapeHtml(lang === 'en' ? 'Save' : lang === 'es' ? 'Ahorra' : lang === 'fr' ? 'Économisez' : lang === 'de' ? 'Sparen Sie' : lang === 'pt' ? 'Economize' : lang === 'it' ? 'Risparmia' : lang === 'zh' ? '节省' : lang === 'ja' ? '節約' : lang === 'ar' ? 'وفر' : lang === 'ru' ? 'Экономия' : lang === 'hi' ? 'बचाएं' : lang === 'ko' ? '절약' : 'Save')} $${(basePrice * 5 * 0.20).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
        
        <button class="add-bundle-btn" id="addBundleToCartBtn">
          ${escapeHtml(lang === 'en' ? 'ADD SELECTED BUNDLE TO CART' : lang === 'es' ? 'AÑADIR PAQUETE SELECCIONADO AL CARRITO' : lang === 'fr' ? 'AJOUTER LE PACK SÉLECTIONNÉ AU PANIER' : lang === 'de' ? 'AUSGEWÄHLTES PAKET IN DEN WARENKORB' : lang === 'pt' ? 'ADICIONAR PACOTE SELECIONADO AO CARRINHO' : lang === 'it' ? 'AGGIUNGI PACCHETTO SELEZIONATO AL CARRELLO' : lang === 'zh' ? '将选定的套装加入购物车' : lang === 'ja' ? '選択したバンドルをカートに追加' : lang === 'ar' ? 'أضف المجموعة المحددة إلى السلة' : lang === 'ru' ? 'ДОБАВИТЬ ВЫБРАННЫЙ НАБОР В КОРЗИНУ' : lang === 'hi' ? 'चयनित बंडल कार्ट में जोड़ें' : lang === 'ko' ? '선택한 번들을 장바구니에 추가' : 'ADD SELECTED BUNDLE TO CART')}
        </button>
      </div>

      <!-- Payment Card -->
      <div class="payment-card-container">
        <h3 style="font-size: 1.1rem; font-weight: 600; color: #2854a6; margin-bottom: 20px; text-align: center;">${escapeHtml(lang === 'en' ? 'Complete Your Purchase' : lang === 'es' ? 'Complete tu compra' : lang === 'fr' ? 'Finalisez votre achat' : lang === 'de' ? 'Kauf abschließen' : lang === 'pt' ? 'Complete sua compra' : lang === 'it' ? 'Completa il tuo acquisto' : lang === 'zh' ? '完成购买' : lang === 'ja' ? '購入を完了' : lang === 'ar' ? 'أكمل مشترياتك' : lang === 'ru' ? 'Завершите покупку' : lang === 'hi' ? 'अपनी खरीदारी पूरी करें' : lang === 'ko' ? '구매 완료' : 'Complete Your Purchase')}</h3>
        <div id="paypal-button-container" style="margin-bottom: 16px;"></div>
        <div style="text-align: center; margin: 20px 0; position: relative;">
          <div style="position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: #dee2e6;"></div>
          <span style="background: rgba(255, 255, 255, 0.95); padding: 0 15px; position: relative; color: #6c757d; font-size: 0.85rem; font-weight: 500;">OR</span>
        </div>
        <button class="add-to-cart-btn" id="addToCartBtn">
          ${escapeHtml(lang === 'en' ? 'Add to Cart' : lang === 'es' ? 'Añadir al carrito' : lang === 'fr' ? 'Ajouter au panier' : lang === 'de' ? 'In den Warenkorb' : lang === 'pt' ? 'Adicionar ao carrinho' : lang === 'it' ? 'Aggiungi al carrello' : lang === 'zh' ? '加入购物车' : lang === 'ja' ? 'カートに追加' : lang === 'ar' ? 'أضف إلى السلة' : lang === 'ru' ? 'В корзину' : lang === 'hi' ? 'कार्ट में जोड़ें' : lang === 'ko' ? '장바구니에 담기' : 'Add to Cart')} - $${price}
        </button>
        <div style="text-align: center; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e0e0e0;">
          <p style="font-size: 0.75rem; color: #666; margin-bottom: 8px;">🔒 ${escapeHtml(lang === 'en' ? 'Secure checkout powered by PayPal' : lang === 'es' ? 'Pago seguro con PayPal' : lang === 'fr' ? 'Paiement sécurisé par PayPal' : lang === 'de' ? 'Sicherer Checkout mit PayPal' : lang === 'pt' ? 'Checkout seguro com PayPal' : lang === 'it' ? 'Checkout sicuro con PayPal' : lang === 'zh' ? 'PayPal安全结账' : lang === 'ja' ? 'PayPalによる安全な決済' : lang === 'ar' ? 'دفع آمن بواسطة PayPal' : lang === 'ru' ? 'Безопасная оплата через PayPal' : lang === 'hi' ? 'PayPal द्वारा सुरक्षित चेकआउट' : lang === 'ko' ? 'PayPal 보안 결제' : 'Secure checkout powered by PayPal')}</p>
        </div>
      </div>

      <!-- Product Details Tabs -->
      <div class="tabs-container">
        <div class="tabs-header">
          <button class="tab-btn active" data-tab="overview">${escapeHtml(getSectionTitle(lang, 'details'))}</button>
          ${product.faqs && product.faqs.length > 0 ? `<button class="tab-btn" data-tab="faq">${escapeHtml(getSectionTitle(lang, 'faq'))}</button>` : ''}
        </div>
        <div class="tabs-content">
          <div class="tab-content active" id="tab-overview">
            <div style="max-width: 900px; margin: 0 auto; padding: 0 20px;">
              <div style="background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); border-radius: 16px; padding: 24px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
                ${ingredientsHTML}
                <div style="margin-bottom: 32px; text-align: left; ${product.ingredients ? 'padding-top: 24px; border-top: 1px solid #e0e0e0;' : ''}">
                  <h3 style="font-size: 1.3rem; color: #2854a6; margin-bottom: 16px; font-weight: 600; border-bottom: 2px solid #e0f2fe; padding-bottom: 10px;">${escapeHtml(getSectionTitle(lang, 'details'))}</h3>
                  <div style="line-height: 1.8; color: #333; font-size: 1rem; text-align: left;">
                    ${escapeHtml(product.short_description || product.description.substring(0, 1000))}
                  </div>
                </div>
                ${product.suggested_use ? `
                <div style="margin-bottom: 24px; padding-top: 18px; border-top: 1px solid #e0e0e0;">
                  <h3 style="font-size: 1.1rem; color: #2854a6; margin-bottom: 10px; font-weight: 500; border-bottom: 2px solid #e0f2fe; padding-bottom: 6px;">${escapeHtml(getSectionTitle(lang, 'use'))}</h3>
                  <div style="line-height: 1.6; color: #444; font-size: 0.9rem;">${escapeHtml(product.suggested_use)}</div>
                </div>
                ` : ''}
                ${product.supplement_facts ? `
                <div style="padding-top: 18px; border-top: 1px solid #e0e0e0;">
                  <h3 style="font-size: 1.1rem; color: #2854a6; margin-bottom: 10px; font-weight: 500; border-bottom: 2px solid #e0f2fe; padding-bottom: 6px;">${escapeHtml(getSectionTitle(lang, 'facts'))}</h3>
                  <div style="background: rgba(248, 249, 250, 0.6); padding: 16px; border-radius: 10px; border: 1px solid rgba(0, 0, 0, 0.05);">
                    <pre style="white-space: pre-wrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 0.85rem; line-height: 1.6; color: #333; margin: 0;">${escapeHtml(product.supplement_facts)}</pre>
                  </div>
                </div>
                ` : ''}
              </div>
            </div>
          </div>
          ${product.faqs && product.faqs.length > 0 ? `
          <div class="tab-content" id="tab-faq">
            <div style="max-width: 800px; margin: 0 auto; padding: 0 20px;">
              ${faqHTML}
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    </section>
    
    ${imageGalleryHTML}
    
    <!-- Subscribe & Save Section -->
    <section class="subscribe-save-section">
      <div class="container" style="max-width: 900px; margin: 0 auto; padding: 0 20px;">
        <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); padding: 15px; border-radius: 8px; border: 2px solid rgba(16, 185, 129, 0.3); box-shadow: 0 4px 16px rgba(16, 185, 129, 0.15); text-align: center;">
          <div style="font-size: 1.25rem; margin-bottom: 6px;">💚</div>
          <h2 style="font-size: 0.9rem; font-weight: 500; margin-bottom: 6px; color: #065f46;">${escapeHtml(t(locale, 'subscribe') || 'Subscribe & Save Up to 20%')}</h2>
          <p style="font-size: 0.75rem; color: #555; margin-bottom: 10px; line-height: 1.4;">${escapeHtml(lang === 'en' ? 'Never run out of your favorite supplements! Subscribe to automatic deliveries and enjoy exclusive savings, free shipping, and the flexibility to cancel or modify anytime.' : lang === 'es' ? '¡Nunca te quedes sin tus suplementos favoritos! Suscríbete a entregas automáticas y disfruta de ahorros exclusivos, envío gratis y la flexibilidad de cancelar o modificar en cualquier momento.' : lang === 'fr' ? 'Ne manquez jamais de vos suppléments préférés ! Abonnez-vous aux livraisons automatiques et profitez d\'économies exclusives, de la livraison gratuite et de la flexibilité d\'annuler ou modifier à tout moment.' : lang === 'de' ? 'Verpassen Sie nie Ihre Lieblingsergänzungen! Abonnieren Sie automatische Lieferungen und genießen Sie exklusive Ersparnisse, kostenlosen Versand und die Flexibilität, jederzeit zu kündigen oder zu ändern.' : lang === 'pt' ? 'Nunca fique sem seus suplementos favoritos! Assine entregas automáticas e aproveite economias exclusivas, frete grátis e a flexibilidade de cancelar ou modificar a qualquer momento.' : lang === 'it' ? 'Non rimanere mai senza i tuoi integratori preferiti! Abbonati alle consegne automatiche e goditi risparmi esclusivi, spedizione gratuita e la flessibilità di annullare o modificare in qualsiasi momento.' : lang === 'zh' ? '再也不会缺少您最喜爱的补充剂！订阅自动配送，享受专属优惠、免费配送，以及随时取消或修改的灵活性。' : lang === 'ja' ? 'お気に入りのサプリメントが切れる心配なし！自動配送に登録して、特別割引、送料無料、いつでもキャンセル・変更可能な柔軟性をお楽しみください。' : lang === 'ar' ? 'لا تنفد مكملاتك المفضلة أبداً! اشترك في التوصيلات التلقائية واستمتع بتوفيرات حصرية وشحن مجاني ومرونة الإلغاء أو التعديل في أي وقت.' : lang === 'ru' ? 'Никогда не оставайтесь без любимых добавок! Подпишитесь на автоматическую доставку и наслаждайтесь эксклюзивными скидками, бесплатной доставкой и возможностью отменить или изменить в любое время.' : lang === 'hi' ? 'अपने पसंदीदा सप्लीमेंट्स कभी खत्म न करें! स्वचालित डिलीवरी की सदस्यता लें और विशेष बचत, मुफ्त शिपिंग और कभी भी रद्द या संशोधित करने की लचीलापन का आनंद लें।' : lang === 'ko' ? '좋아하는 보충제가 떨어지지 않도록! 자동 배송을 구독하고 독점 할인, 무료 배송, 언제든 취소 또는 수정 가능한 유연성을 즐기세요.' : 'Never run out of your favorite supplements! Subscribe to automatic deliveries and enjoy exclusive savings, free shipping, and the flexibility to cancel or modify anytime.')}</p>
          <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; margin-top: 10px;">
            <button onclick="if(typeof window.addToCartWithSubscription==='function'){window.addToCartWithSubscription(true);}else{alert('Please wait for page to fully load');}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; padding: 6px 16px; border-radius: 10px; font-weight: 500; font-size: 0.75rem; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);">
              ${escapeHtml(t(locale, 'subscribe') || 'Subscribe & Save')}
            </button>
            <button onclick="if(typeof window.addToCartWithSubscription==='function'){window.addToCartWithSubscription(false);}else{alert('Please wait for page to fully load');}" style="background: white; color: #10b981; border: 2px solid #10b981; padding: 6px 16px; border-radius: 10px; font-weight: 500; font-size: 0.75rem; cursor: pointer; transition: all 0.3s;">
              ${escapeHtml(lang === 'en' ? 'One-Time Purchase' : lang === 'es' ? 'Compra única' : lang === 'fr' ? 'Achat unique' : lang === 'de' ? 'Einmaliger Kauf' : lang === 'pt' ? 'Compra única' : lang === 'it' ? 'Acquisto singolo' : lang === 'zh' ? '一次性购买' : lang === 'ja' ? '一回限りの購入' : lang === 'ar' ? 'شراء لمرة واحدة' : lang === 'ru' ? 'Разовая покупка' : lang === 'hi' ? 'एक बार की खरीदारी' : lang === 'ko' ? '일회성 구매' : 'One-Time Purchase')}
            </button>
          </div>
        </div>
      </div>
    </section>
    
    ${upsellsHTML}
  </main>

  <footer class="footer">
    <div style="background: #2854a6; padding: 20px; text-align: center;">
      <div style="display: flex; justify-content: center; align-items: center; gap: 15px; flex-wrap: wrap;">
        <a href="/cart" class="footer-btn" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px) saturate(180%); color: #2854a6; padding: 14px 32px; font-size: 0.9rem !important; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-radius: 50px; border: 3px solid transparent; background-image: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), linear-gradient(135deg, #5eead4 0%, #3b82f6 50%, #8b5cf6 100%); background-origin: border-box; background-clip: padding-box, border-box; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2); cursor: pointer; text-decoration: none; transition: all 0.3s ease; display: inline-block;">${escapeHtml(lang === 'en' ? 'VIEW CART' : lang === 'es' ? 'VER CARRITO' : lang === 'fr' ? 'VOIR LE PANIER' : lang === 'de' ? 'WARENKORB ANSEHEN' : lang === 'pt' ? 'VER CARRINHO' : lang === 'it' ? 'VISUALIZZA CARRELLO' : lang === 'zh' ? '查看购物车' : lang === 'ja' ? 'カートを見る' : lang === 'ar' ? 'عرض السلة' : lang === 'ru' ? 'ПОСМОТРЕТЬ КОРЗИНУ' : lang === 'hi' ? 'कार्ट देखें' : lang === 'ko' ? '장바구니 보기' : 'VIEW CART')}</a>
      </div>
      <div style="display: flex; justify-content: center; align-items: center; gap: 15px; flex-wrap: wrap; margin-top: 20px;">
        <img src="/public/images/Footer-Badges-.png" alt="Certification Badges" style="max-width: 350px; height: auto;">
      </div>
    </div>
    <div style="width: 100%; height: 3px; background: linear-gradient(90deg, #4fd0ff 0%, #ffd34d 50%, #4fd0ff 100%);"></div>
    <div style="text-align: center; padding: 16px; background: #2854a6; color: white;">
      <p>${escapeHtml(t(locale, 'footer'))}</p>
      <p style="margin-top: 12px; font-size: 0.85rem;">
        ${Object.keys(locales).filter((l) => l !== lang).slice(0, 8).map((l) => `<a href="/sclera/${l}/" style="color: #93c5fd; text-decoration: none; margin: 0 0.25rem;">${escapeHtml(locales[l].name)}</a>`).join(' · ')}
      </p>
    </div>
  </footer>

  <script>
    // Product data
    const productData = ${JSON.stringify(product)};
    const currentPrice = ${basePrice};
    let selectedBundle = 'subscribe';
    let selectedPrice = ${basePrice};
    let selectedQuantity = 1;
    
    // Bundle tab switching
    document.querySelectorAll('.bundle-tab-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.bundle-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.bundle-tab-content').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const tabId = 'bundle-tab-' + this.dataset.bundleTab;
        document.getElementById(tabId)?.classList.add('active');
        selectedBundle = this.dataset.bundle;
        selectedPrice = parseFloat(this.dataset.price);
        selectedQuantity = parseInt(this.dataset.quantity);
        updateAddToCartButton();
      });
    });
    
    function updateAddToCartButton() {
      const btn = document.getElementById('addToCartBtn');
      if (btn) {
        btn.textContent = '${escapeHtml(lang === 'en' ? 'Add to Cart' : lang === 'es' ? 'Añadir al carrito' : lang === 'fr' ? 'Ajouter au panier' : lang === 'de' ? 'In den Warenkorb' : lang === 'pt' ? 'Adicionar ao carrinho' : lang === 'it' ? 'Aggiungi al carrello' : lang === 'zh' ? '加入购物车' : lang === 'ja' ? 'カートに追加' : lang === 'ar' ? 'أضف إلى السلة' : lang === 'ru' ? 'В корзину' : lang === 'hi' ? 'कार्ट में जोड़ें' : lang === 'ko' ? '장바구니에 담기' : 'Add to Cart')} - $' + selectedPrice.toFixed(2);
      }
      const bundleBtn = document.getElementById('addBundleToCartBtn');
      if (bundleBtn) {
        bundleBtn.textContent = '${escapeHtml(lang === 'en' ? 'ADD SELECTED BUNDLE TO CART' : lang === 'es' ? 'AÑADIR PAQUETE SELECCIONADO AL CARRITO' : lang === 'fr' ? 'AJOUTER LE PACK SÉLECTIONNÉ AU PANIER' : lang === 'de' ? 'AUSGEWÄHLTES PAKET IN DEN WARENKORB' : lang === 'pt' ? 'ADICIONAR PACOTE SELECIONADO AO CARRINHO' : lang === 'it' ? 'AGGIUNGI PACCHETTO SELEZIONATO AL CARRELLO' : lang === 'zh' ? '将选定的套装加入购物车' : lang === 'ja' ? '選択したバンドルをカートに追加' : lang === 'ar' ? 'أضف المجموعة المحددة إلى السلة' : lang === 'ru' ? 'ДОБАВИТЬ ВЫБРАННЫЙ НАБОР В КОРЗИНУ' : lang === 'hi' ? 'चयनित बंडल कार्ट में जोड़ें' : lang === 'ko' ? '선택한 번들을 장바구니에 추가' : 'ADD SELECTED BUNDLE TO CART')}';
      }
    }
    
    // Add to cart functions
    window.addToCartWithSubscription = function(isSubscription) {
      const productImage = productData.images && productData.images[0] ? productData.images[0] : '/images/placeholder.jpg';
      if (typeof window.addToCart === 'function') {
        window.addToCart(productData.name, selectedPrice, selectedQuantity, productData.sku, productImage);
        if (isSubscription) {
          localStorage.setItem('purchaseType', 'subscribe');
        } else {
          localStorage.setItem('purchaseType', 'one-time');
        }
        window.location.href = '/cart';
      }
    };
    
    document.getElementById('addToCartBtn')?.addEventListener('click', function() {
      const productImage = productData.images && productData.images[0] ? productData.images[0] : '/images/placeholder.jpg';
      if (typeof window.addToCart === 'function') {
        window.addToCart(productData.name, selectedPrice, selectedQuantity, productData.sku, productImage);
      }
    });
    
    document.getElementById('addBundleToCartBtn')?.addEventListener('click', function() {
      const productImage = productData.images && productData.images[0] ? productData.images[0] : '/images/placeholder.jpg';
      if (typeof window.addToCart === 'function') {
        window.addToCart(productData.name, selectedPrice, selectedQuantity, productData.sku, productImage);
        window.location.href = '/cart';
      }
    });
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const tabId = 'tab-' + this.dataset.tab;
        document.getElementById(tabId)?.classList.add('active');
      });
    });
    
    // Gallery carousel
    const galleryTrack = document.getElementById('galleryCarouselTrack');
    if (galleryTrack) {
      window.scrollGallery = function(direction) {
        const cardWidth = galleryTrack.offsetWidth;
        galleryTrack.scrollBy({ left: cardWidth * direction, behavior: 'smooth' });
        setTimeout(() => {
          const currentIndex = Math.round(galleryTrack.scrollLeft / cardWidth) + 1;
          const currentIndexEl = document.getElementById('galleryCurrentIndex');
          if (currentIndexEl) currentIndexEl.textContent = Math.min(currentIndex, ${product.images.length});
        }, 100);
      };
      galleryTrack.addEventListener('scroll', () => {
        const currentIndex = Math.round(galleryTrack.scrollLeft / galleryTrack.offsetWidth) + 1;
        const currentIndexEl = document.getElementById('galleryCurrentIndex');
        if (currentIndexEl) currentIndexEl.textContent = Math.min(currentIndex, ${product.images.length});
      });
    }
    
    // Initialize PayPal button
    function initPayPal() {
      const container = document.getElementById('paypal-button-container');
      if (!container || typeof paypal === 'undefined') {
        setTimeout(initPayPal, 100);
        return;
      }
      if (window.PayPalButtons && window.PayPalButtons.render) {
        window.PayPalButtons.render('paypal-button-container', {
          amount: selectedPrice,
          currency: 'USD',
          description: productData.name,
          items: [{
            name: productData.name,
            description: productData.name,
            price: selectedPrice,
            quantity: selectedQuantity
          }],
          onSuccess: (payment) => {
            const productImage = productData.images && productData.images[0] ? productData.images[0] : '/images/placeholder.jpg';
            if (typeof window.addToCart === 'function') {
              window.addToCart(productData.name, selectedPrice, selectedQuantity, productData.sku, productImage);
            }
            window.location.href = '/order-confirmation.html?orderId=' + payment.id;
          }
        });
      }
    }
    setTimeout(initPayPal, 500);
    
    // Update cart count on load
    if (typeof updateCartCount === 'function') updateCartCount();
  </script>
</body>
</html>`;
}

// Generate each language page
const langs = Object.keys(locales);
for (const lang of langs) {
  const outDir = path.join(__dirname, lang);
  fs.mkdirSync(outDir, { recursive: true });
  const html = buildFullProductPage(locales[lang]);
  const outPath = path.join(outDir, 'index.html');
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`  ✅ ${lang} -> sclera/${lang}/index.html (full product page)`);
}

console.log(`\n✅ Generated ${langs.length} full Sclera i18n product pages with images, bundles, and upsells.`);
