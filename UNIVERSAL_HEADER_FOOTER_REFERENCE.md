# Universal Header & Footer Reference

**Last Updated:** January 2025  
**Status:** ✅ ACTIVE - Use these on ALL pages

---

## 📋 Quick Reference

- **Header HTML:** `deploy-site/includes/universal-header.html`
- **Header CSS:** `deploy-site/includes/universal-header.css`
- **Footer HTML:** `deploy-site/includes/universal-footer.html`

---

## 🎨 Header Visual Description

Based on the approved design:

1. **Top Bar (White Background)**
   - Centered logo (Success Chemistry)
   - "My Account" link in top right corner (👤 icon)
   - Height: 98px (desktop), 68px (mobile)

2. **Purple Gradient Divider** (4px height)
   - Animated gradient: purple → pink → blue → purple
   - Runs along top and bottom of navigation bar

3. **Navigation Bar (Dark Blue: #2854a6)**
   - Height: 54px (desktop), 50px (mobile)
   - Centered white text links:
     - Home
     - Articles
     - 🧪 Shop
     - Cart 🛒 0
     - Contact
   - Text is vertically centered in the bar

---

## 📄 Universal Header HTML

**File:** `deploy-site/includes/universal-header.html`

```html
<!-- UNIVERSAL HEADER - Use this on ALL pages -->
<!-- This header is 100% static - no size changes, no hover growth, completely consistent -->

<div class="header-wrapper">
    <div class="topbar">
        <div class="container">
            <div class="topbar-inner">
                <a class="brand" href="/">
                    <img src="/public/images/SC_logo_withR.png" alt="Success Chemistry">
                </a>
                <a href="/my-account-dashboard.html" class="account-link">
                    <span>👤</span>
                    <span>My Account</span>
                </a>
            </div>
        </div>
    </div>
    <div class="header-divider"></div>
    <div class="blue-nav">
        <div class="container">
            <a href="/">Home</a>
            <a href="/blog">Articles</a>
            <a href="/shop">🧪 Shop</a>
            <a href="/cart" id="cartLink">Cart 🛒 <span id="navCartCount">0</span></a>
            <a href="/contact">Contact</a>
        </div>
    </div>
    <div class="header-divider"></div>
</div>
```

---

## 🎨 Universal Header CSS

**File:** `deploy-site/includes/universal-header.css`

**Key Features:**
- ✅ 100% static - no size changes on hover/click
- ✅ Fixed heights for all elements
- ✅ Logo perfectly centered
- ✅ Navigation text vertically centered in blue bar
- ✅ Account link in top right
- ✅ Purple gradient dividers above and below navigation

**Full CSS:** See `deploy-site/includes/universal-header.css` for complete code.

**Critical CSS Properties:**
```css
.header-wrapper {
    margin-top: 0;
    width: 100%;
    background: white;
}

.topbar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px) saturate(180%);
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 20px 0;
    min-height: 98px;
    max-height: 98px;
    height: 98px;
}

.brand {
    position: absolute;
    left: 50%;
    transform: translateX(-50%) !important;
}

.blue-nav {
    background: #2854a6;
    padding: 0;
    min-height: 54px;
    max-height: 54px;
    height: 54px;
    display: flex;
    align-items: center;
}

.blue-nav .container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
}

.blue-nav a {
    color: #ffffff;
    font-size: 1.56rem;
    line-height: 54px;
    display: inline-flex;
    align-items: center;
    height: 100%;
}

.header-divider {
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%);
    animation: gradientMove 3s linear infinite;
}
```

---

## 📄 Universal Footer HTML

**File:** `deploy-site/includes/universal-footer.html`

```html
<!-- UNIVERSAL FOOTER - Use this on ALL pages -->
<!-- This footer is 100% consistent across all pages -->

<footer class="footer">
    <div style="background: #2854a6; padding: 20px; text-align: center;">
        <div style="display: flex; justify-content: center; align-items: center; gap: 15px; flex-wrap: wrap;">
            <a href="/shop" class="footer-btn" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px) saturate(180%); color: #2854a6; padding: 14px 32px; font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-radius: 50px; border: 3px solid transparent; background-image: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), linear-gradient(135deg, #5eead4 0%, #3b82f6 50%, #8b5cf6 100%); background-origin: border-box; background-clip: padding-box, border-box; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2); cursor: pointer; text-decoration: none; transition: all 0.3s ease; display: inline-block;">VIEW ALL</a>
            <a href="/cart" class="footer-btn" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px) saturate(180%); color: #2854a6; padding: 14px 32px; font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-radius: 50px; border: 3px solid transparent; background-image: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), linear-gradient(135deg, #5eead4 0%, #3b82f6 50%, #8b5cf6 100%); background-origin: border-box; background-clip: padding-box, border-box; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2); cursor: pointer; text-decoration: none; transition: all 0.3s ease; display: inline-block;">VIEW CART</a>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 15px; flex-wrap: wrap; margin-top: 20px;">
            <img src="/public/images/Footer-Badges-.png" alt="Certification Badges" style="max-width: 350px; height: auto;">
        </div>
    </div>
    <div style="width: 100%; height: 3px; background: linear-gradient(90deg, #4fd0ff 0%, #ffd34d 50%, #4fd0ff 100%);"></div>
    <div style="background: #2854a6; padding: 15px 20px; display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap; font-size: 0.85rem !important;">
        <a href="/terms-of-service.html" style="color: white; text-decoration: none; font-weight: 500; transition: opacity 0.3s; font-size: 0.85rem !important;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Terms of Service</a>
        <span style="color: rgba(255,255,255,0.3);">|</span>
        <a href="/shipping-returns.html" style="color: white; text-decoration: none; font-weight: 500; transition: opacity 0.3s; font-size: 0.85rem !important;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Shipping & Returns</a>
        <span style="color: rgba(255,255,255,0.3);">|</span>
        <a href="/payment-policy.html" style="color: white; text-decoration: none; font-weight: 500; transition: opacity 0.3s; font-size: 0.85rem !important;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Payment Policy</a>
        <span style="color: rgba(255,255,255,0.3);">|</span>
        <a href="/privacy-policy.html" style="color: white; text-decoration: none; font-weight: 500; transition: opacity 0.3s; font-size: 0.85rem !important;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Privacy Policy</a>
        <span style="color: rgba(255,255,255,0.3);">|</span>
        <a href="/contact" style="color: white; text-decoration: none; font-weight: 500; transition: opacity 0.3s; font-size: 0.85rem !important;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Contact</a>
        <span style="color: rgba(255,255,255,0.3);">|</span>
        <a href="/shop" style="color: white; text-decoration: none; font-weight: 500; transition: opacity 0.3s; font-size: 0.85rem !important;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">🧪 SHOP</a>
    </div>
    <div style="width: 100%; height: 3px; background: linear-gradient(90deg, #4fd0ff 0%, #ffd34d 50%, #4fd0ff 100%);"></div>
    <div style="text-align: center; padding: 16px; background: #2854a6;">
        <p style="color: white; font-size: 0.85rem !important; margin: 0 0 12px 0; font-weight: 500;">🗽 Copyright 2026 - Success Chemistry®</p>
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap; margin-top: 12px;">
            <a href="https://www.successchemistry.com" target="_blank" rel="noopener" style="color: white; text-decoration: none; font-size: 0.9rem !important; font-weight: 600; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.8'; this.style.textDecoration='underline'" onmouseout="this.style.opacity='1'; this.style.textDecoration='none'">www.SuccessChemistry.com</a>
        </div>
    </div>
</footer>
```

---

## 🔧 How to Use on New Pages

### Step 1: Include Header CSS

In the `<style>` section of your page, include the universal header CSS:

```html
<style>
    /* Your other styles... */
    
    /* ============================================
       UNIVERSAL HEADER CSS - 100% STATIC
       Use this on ALL pages for consistent header
       NO SIZE CHANGES - NO HOVER GROWTH - COMPLETELY STATIC
       ============================================ */
    
    /* Copy the entire contents of deploy-site/includes/universal-header.css here */
    
</style>
```

### Step 2: Include Header HTML

In the `<body>` section, right after the opening `<body>` tag:

```html
<body>
    <!-- UNIVERSAL HEADER - Use this on ALL pages -->
    <!-- Copy the entire contents of deploy-site/includes/universal-header.html here -->
    
    <!-- Your page content... -->
</body>
```

### Step 3: Include Footer HTML

Before the closing `</body>` tag:

```html
    <!-- Your page content... -->
    
    <!-- UNIVERSAL FOOTER - Use this on ALL pages -->
    <!-- Copy the entire contents of deploy-site/includes/universal-footer.html here -->
</body>
```

---

## ✅ Pages Currently Using Universal Header/Footer

- ✅ `deploy-site/index.html` (Homepage)
- ✅ `deploy-site/shop/index.html`
- ✅ `deploy-site/blog/index.html`
- ✅ `deploy-site/cart/index.html`
- ✅ `deploy-site/contact/index.html`
- ✅ `deploy-site/shipping-returns.html`
- ✅ `deploy-site/privacy-policy.html`
- ✅ `deploy-site/payment-policy.html`
- ✅ `deploy-site/faq/index.html`
- ✅ `deploy-site/terms-of-service.html`

---

## 🎯 Key Design Specifications

### Header Dimensions
- **Topbar Height:** 98px (desktop), 68px (mobile)
- **Logo Height:** 58px (desktop), 44px (mobile)
- **Navigation Bar Height:** 54px (desktop), 50px (mobile)
- **Divider Height:** 4px

### Colors
- **Topbar Background:** `rgba(255, 255, 255, 0.95)` with backdrop blur
- **Navigation Background:** `#2854a6` (solid blue)
- **Navigation Text:** `#ffffff` (white)
- **Account Link:** `#2854a6` (blue)

### Typography
- **Navigation Font Size:** `1.56rem` (desktop), `1.2rem` (mobile)
- **Navigation Font Weight:** `500`
- **Navigation Line Height:** `54px` (matches bar height for perfect centering)

### Spacing
- **Navigation Gap:** 48px between links (desktop), 22px (mobile)
- **Account Link Position:** `right: 20px` from container edge

---

## ⚠️ Important Notes

1. **DO NOT modify** the universal header/footer files directly unless updating ALL pages
2. **Always test** on multiple pages after making changes
3. **Keep heights fixed** - never use `auto` or percentages for header elements
4. **Navigation text must be vertically centered** - use `line-height: 54px` and `display: flex; align-items: center`
5. **Logo must be centered** - use `position: absolute; left: 50%; transform: translateX(-50%)`

---

## 📸 Visual Reference

**Header Structure:**
```
┌─────────────────────────────────────┐
│  [Logo Centered]    [My Account →]  │  ← White Topbar (98px)
├─────────────────────────────────────┤
│  [Purple Gradient Divider] (4px)    │
├─────────────────────────────────────┤
│  Home | Articles | 🧪 Shop | Cart 🛒 0 | Contact  │  ← Blue Nav (54px)
│  (Centered white text)              │
├─────────────────────────────────────┤
│  [Purple Gradient Divider] (4px)    │
└─────────────────────────────────────┘
```

---

## 🔄 Update Process

If you need to update the universal header/footer:

1. Edit the files in `deploy-site/includes/`
2. Run the update script to apply to all pages
3. Test on multiple pages
4. Update this reference document

---

**Last Verified:** January 2025  
**All pages confirmed using universal header/footer**
