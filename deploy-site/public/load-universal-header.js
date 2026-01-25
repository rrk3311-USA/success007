// Universal Header Loader
// This script ensures ALL pages use the same header consistently

(function() {
    'use strict';
    
    // Load CSS
    function loadHeaderCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/includes/universal-header.css';
        link.id = 'universal-header-css';
        
        // Remove any existing header CSS
        const existing = document.getElementById('universal-header-css');
        if (existing) {
            existing.remove();
        }
        
        document.head.appendChild(link);
    }
    
    // Load HTML
    function loadHeaderHTML() {
        // Check if header already exists
        const existingHeader = document.querySelector('.header-wrapper');
        if (existingHeader) {
            return; // Header already loaded
        }
        
        fetch('/includes/universal-header.html')
            .then(response => response.text())
            .then(html => {
                // Remove any existing header elements
                const oldTopbar = document.querySelector('.topbar');
                const oldNav = document.querySelector('.blue-nav');
                const oldDivider = document.querySelector('.header-divider');
                
                if (oldTopbar) oldTopbar.remove();
                if (oldNav) oldNav.remove();
                if (oldDivider) oldDivider.remove();
                
                // Create wrapper and insert header
                const wrapper = document.createElement('div');
                wrapper.innerHTML = html;
                const headerWrapper = wrapper.querySelector('.header-wrapper') || wrapper.firstElementChild;
                
                if (headerWrapper) {
                    document.body.insertBefore(headerWrapper, document.body.firstChild);
                    
                    // Update cart count if needed
                    updateCartCount();
                }
            })
            .catch(error => {
                console.error('Failed to load universal header:', error);
            });
    }
    
    // Update cart count
    function updateCartCount() {
        try {
            const cart = localStorage.getItem('cart');
            if (cart) {
                const cartData = JSON.parse(cart);
                const count = cartData.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
                const cartCountEl = document.getElementById('navCartCount');
                if (cartCountEl) {
                    cartCountEl.textContent = count;
                }
            }
        } catch (e) {
            console.error('Error updating cart count:', e);
        }
    }
    
    // Load fonts if not already loaded
    function loadFonts() {
        const fontsLoaded = document.querySelector('link[href*="fonts.googleapis.com/css2?family=Poppins"]');
        if (!fontsLoaded) {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = 'https://fonts.googleapis.com';
            document.head.appendChild(link);
            
            const link2 = document.createElement('link');
            link2.rel = 'preconnect';
            link2.href = 'https://fonts.gstatic.com';
            link2.crossOrigin = 'anonymous';
            document.head.appendChild(link2);
            
            const fontLink = document.createElement('link');
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Inter:wght@400;500;600&family=Montserrat:wght@400;500;600&display=swap';
            fontLink.rel = 'stylesheet';
            document.head.appendChild(fontLink);
        }
    }
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            loadFonts();
            loadHeaderCSS();
            loadHeaderHTML();
        });
    } else {
        loadFonts();
        loadHeaderCSS();
        loadHeaderHTML();
    }
    
    // Listen for cart updates
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            updateCartCount();
        }
    });
    
    // Expose update function
    window.updateHeaderCartCount = updateCartCount;
})();
