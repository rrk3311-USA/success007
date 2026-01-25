// Global Cart Utility Functions
function getCart() {
    const cart = localStorage.getItem('successChemistryCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('successChemistryCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
    
    // Update all cart count displays
    const cartCountElements = document.querySelectorAll('#navCartCount, .cart-badge, [id*="cartCount"]');
    cartCountElements.forEach(el => {
        if (el) el.textContent = totalItems;
    });
    
    // Update sticky cart banner
    const stickyBanner = document.getElementById('stickyCartBanner');
    const cartItemsText = document.getElementById('cartItemsText');
    const cartTotalText = document.getElementById('cartTotalText');
    
    if (cart.length > 0) {
        if (stickyBanner) stickyBanner.style.display = 'flex';
        if (cartItemsText) {
            cartItemsText.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
        }
        if (cartTotalText) {
            const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1), 0);
            cartTotalText.textContent = `$${total.toFixed(2)}`;
        }
    } else {
        if (stickyBanner) stickyBanner.style.display = 'none';
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
