// Global Cart Utility Functions
function getCart() {
    try {
        const cart = localStorage.getItem('successChemistryCart');
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('successChemistryCart', JSON.stringify(cart));
    updateCartCount();
}

function createStickyCart() {
    // Check if sticky cart already exists
    if (document.getElementById('stickyCartBanner')) {
        return;
    }
    
    // Create sticky cart element
    const stickyCart = document.createElement('div');
    stickyCart.id = 'stickyCartBanner';
    stickyCart.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #2854a6 0%, #1e3f73 100%);
        color: white;
        padding: 16px 20px;
        z-index: 9999;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
        display: none;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        animation: slideUp 0.3s ease-out;
        border-top: 3px solid #d4af37;
    `;
    
    stickyCart.innerHTML = `
        <div style="display: flex; align-items: center; gap: 16px; flex: 1;">
            <div style="font-size: 2rem;">🛒</div>
            <div style="flex: 1;">
                <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 4px;" id="cartItemsText">0 items</div>
                <div style="font-size: 0.9rem; opacity: 0.9;" id="cartTotalText">$0.00</div>
            </div>
        </div>
        <a href="/cart" style="
            background: white;
            color: #2854a6;
            padding: 12px 32px;
            border-radius: 8px;
            font-weight: 700;
            text-decoration: none;
            white-space: nowrap;
            transition: all 0.3s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.2)';">
            View Cart →
        </a>
        <button onclick="document.getElementById('stickyCartBanner').style.display='none'" style="
            background: transparent;
            border: 2px solid rgba(255,255,255,0.5);
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            flex-shrink: 0;
        " onmouseover="this.style.background='rgba(255,255,255,0.2)';" onmouseout="this.style.background='transparent';" title="Close">×</button>
    `;
    
    // Add animation style if not exists
    if (!document.getElementById('stickyCartStyle')) {
        const style = document.createElement('style');
        style.id = 'stickyCartStyle';
        style.textContent = `
            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            @media (max-width: 768px) {
                #stickyCartBanner {
                    flex-direction: column;
                    padding: 12px 16px;
                    gap: 12px;
                }
                #stickyCartBanner > div:first-child {
                    width: 100%;
                }
                #stickyCartBanner a {
                    width: 100%;
                    text-align: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(stickyCart);
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
    
    // Update all cart count displays
    const cartCountElements = document.querySelectorAll('#navCartCount, .cart-badge, [id*="cartCount"]');
    cartCountElements.forEach(el => {
        if (el) el.textContent = totalItems;
    });
    
    // Create sticky cart if it doesn't exist
    createStickyCart();
    
    // Update sticky cart banner
    const stickyBanner = document.getElementById('stickyCartBanner');
    const cartItemsText = document.getElementById('cartItemsText');
    const cartTotalText = document.getElementById('cartTotalText');
    
    // Don't show sticky cart on cart page itself
    const isCartPage = window.location.pathname.includes('/cart');
    
    if (cart.length > 0 && !isCartPage) {
        if (stickyBanner) {
            stickyBanner.style.display = 'flex';
        }
        if (cartItemsText) {
            cartItemsText.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
        }
        if (cartTotalText) {
            const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1), 0);
            cartTotalText.textContent = `$${total.toFixed(2)}`;
        }
    } else {
        if (stickyBanner) {
            stickyBanner.style.display = 'none';
        }
    }
}

// Global addToCart function
window.addToCart = function(productName, price, quantity = 1, sku = null, image = null) {
    const cart = getCart();
    const productPrice = parseFloat(price);
    const productQuantity = parseInt(quantity) || 1;
    const productSku = sku || productName.toLowerCase().replace(/\s+/g, '-');
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.sku === productSku);
    
    if (existingItem) {
        existingItem.quantity += productQuantity;
    } else {
        cart.push({
            sku: productSku,
            name: productName,
            price: productPrice.toFixed(2),
            quantity: productQuantity,
            image: image || '/images/placeholder.jpg'
        });
    }
    
    saveCart(cart);
    
    // Show notification
    showNotification(`${productQuantity}x ${productName} added to cart!`);
    
    // Ensure sticky cart appears (updateCartCount is called by saveCart)
    // Force show sticky cart immediately
    setTimeout(() => {
        updateCartCount();
    }, 100);
    
    return cart;
};

function showNotification(message) {
    // Remove existing notification if any
    const existing = document.getElementById('cart-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.id = 'cart-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
        font-size: 1rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add animation
    if (!document.querySelector('#cart-notification-style')) {
        const style = document.createElement('style');
        style.id = 'cart-notification-style';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize cart count on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCartCount);
} else {
    updateCartCount();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getCart, saveCart, updateCartCount, addToCart: window.addToCart };
}
