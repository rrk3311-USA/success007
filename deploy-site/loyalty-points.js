/**
 * Success Chemistry - Loyalty Points System
 * Earn 5 points for every $1 spent
 */

const LOYALTY_CONFIG = {
    POINTS_PER_DOLLAR: 5,
    POINTS_TO_DOLLAR: 100, // 100 points = $1 discount
    MIN_REDEMPTION: 500, // Minimum 500 points to redeem ($5 value)
    ENABLED: true
};

// Initialize loyalty system
class LoyaltyPointsSystem {
    constructor() {
        this.storageKey = 'successChemistryLoyalty';
        this.init();
    }

    init() {
        // Create loyalty data structure if it doesn't exist
        if (!this.getData()) {
            this.setData({
                points: 0,
                totalEarned: 0,
                totalRedeemed: 0,
                history: [],
                customerId: this.generateCustomerId(),
                createdAt: new Date().toISOString()
            });
        }
    }

    generateCustomerId() {
        return 'SC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    getData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }

    setData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        this.updateDisplay();
    }

    // Calculate points earned from purchase amount
    calculatePoints(dollarAmount) {
        return Math.floor(dollarAmount * LOYALTY_CONFIG.POINTS_PER_DOLLAR);
    }

    // Calculate dollar value of points
    pointsToDollars(points) {
        return (points / LOYALTY_CONFIG.POINTS_TO_DOLLAR).toFixed(2);
    }

    // Add points from a purchase
    addPoints(amount, orderNumber, description = 'Purchase') {
        const data = this.getData();
        const pointsEarned = this.calculatePoints(amount);

        data.points += pointsEarned;
        data.totalEarned += pointsEarned;
        data.history.unshift({
            type: 'earned',
            points: pointsEarned,
            amount: amount,
            orderNumber: orderNumber,
            description: description,
            date: new Date().toISOString()
        });

        // Keep only last 50 transactions
        if (data.history.length > 50) {
            data.history = data.history.slice(0, 50);
        }

        this.setData(data);
        this.showPointsNotification(pointsEarned, 'earned');

        // Track in Google Analytics
        if (window.SuccessChemistryTracking) {
            window.SuccessChemistryTracking.trackCustomEvent('loyalty_points_earned', {
                points: pointsEarned,
                amount: amount,
                order_number: orderNumber
            });
        }

        return pointsEarned;
    }

    // Redeem points for discount
    redeemPoints(points) {
        const data = this.getData();

        if (points < LOYALTY_CONFIG.MIN_REDEMPTION) {
            alert(`Minimum ${LOYALTY_CONFIG.MIN_REDEMPTION} points required to redeem.`);
            return false;
        }

        if (points > data.points) {
            alert('Insufficient points balance.');
            return false;
        }

        const discountValue = this.pointsToDollars(points);
        data.points -= points;
        data.totalRedeemed += points;
        data.history.unshift({
            type: 'redeemed',
            points: points,
            discountValue: discountValue,
            description: `Redeemed for $${discountValue} discount`,
            date: new Date().toISOString()
        });

        this.setData(data);
        this.showPointsNotification(points, 'redeemed');

        // Track in Google Analytics
        if (window.SuccessChemistryTracking) {
            window.SuccessChemistryTracking.trackCustomEvent('loyalty_points_redeemed', {
                points: points,
                discount_value: discountValue
            });
        }

        return discountValue;
    }

    // Get current points balance
    getPoints() {
        const data = this.getData();
        return data ? data.points : 0;
    }

    // Get points history
    getHistory() {
        const data = this.getData();
        return data ? data.history : [];
    }

    // Show points notification with Lucky Golden Rabbit mascot
    showPointsNotification(points, type) {
        const message = type === 'earned' 
            ? `You earned ${points} Lucky Points!` 
            : `Redeemed ${points} Lucky Points!`;

        // Create notification element with golden rabbit mascot
        const notification = document.createElement('div');
        notification.className = 'loyalty-notification';
        notification.innerHTML = `
            <div class="loyalty-notification-content">
                <span class="loyalty-mascot">🐰⭐</span>
                <div class="loyalty-notification-text-wrap">
                    <span class="loyalty-notification-title">${type === 'earned' ? 'Lucky Rabbit Says...' : 'Points Redeemed!'}</span>
                    <span class="loyalty-notification-text">${message}</span>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Update points display on page
    updateDisplay() {
        const data = this.getData();
        const points = data ? data.points : 0;
        const dollarValue = this.pointsToDollars(points);

        // Update all points displays on page
        document.querySelectorAll('.loyalty-points-display').forEach(el => {
            el.textContent = points.toLocaleString();
        });

        document.querySelectorAll('.loyalty-points-value').forEach(el => {
            el.textContent = `$${dollarValue}`;
        });

        // Update header widget if it exists
        const headerWidget = document.getElementById('loyaltyHeaderWidget');
        if (headerWidget) {
            headerWidget.innerHTML = `
                <span class="loyalty-mascot-mini">🐰⭐</span>
                <span class="loyalty-text">${points.toLocaleString()}</span>
            `;
        }
    }

    // Create header widget with Lucky Golden Rabbit
    createHeaderWidget() {
        const data = this.getData();
        const points = data ? data.points : 0;

        const widget = document.createElement('div');
        widget.id = 'loyaltyHeaderWidget';
        widget.className = 'loyalty-header-widget';
        widget.innerHTML = `
            <a href="/my-account.html#loyalty" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 6px;">
                <span class="loyalty-mascot-mini">🐰⭐</span>
                <span class="loyalty-text">${points.toLocaleString()}</span>
            </a>
        `;

        return widget;
    }

    // Generate coupon code from points
    generateCouponCode(points) {
        const discountValue = this.pointsToDollars(points);
        const code = `LOYALTY${points}`;
        
        // Store coupon in localStorage
        const coupons = JSON.parse(localStorage.getItem('successChemistryCoupons') || '[]');
        coupons.push({
            code: code,
            discount: parseFloat(discountValue),
            type: 'loyalty',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('successChemistryCoupons', JSON.stringify(coupons));

        return code;
    }
}

// Initialize global loyalty system
window.LoyaltyPoints = new LoyaltyPointsSystem();

// Auto-update display when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (LOYALTY_CONFIG.ENABLED) {
        window.LoyaltyPoints.updateDisplay();
        
        // Add header widget to navigation if it exists
        const nav = document.querySelector('.topbar-inner, .header-nav');
        if (nav && !document.getElementById('loyaltyHeaderWidget')) {
            const widget = window.LoyaltyPoints.createHeaderWidget();
            nav.appendChild(widget);
        }
    }
});

// Add CSS for loyalty notifications and widgets - Frosty Glassmorphic UX with Golden Rabbit
const loyaltyStyles = document.createElement('style');
loyaltyStyles.textContent = `
    .loyalty-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, rgba(200, 230, 255, 0.85) 0%, rgba(180, 220, 255, 0.8) 50%, rgba(255, 230, 180, 0.85) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        color: #0a234e;
        padding: 16px 20px;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(100, 180, 255, 0.3), inset 0 1px 0 rgba(255,255,255,0.5);
        border: 2px solid rgba(255,255,255,0.5);
        z-index: 10000;
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .loyalty-notification.show {
        opacity: 1;
        transform: translateX(0);
    }

    .loyalty-notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .loyalty-mascot {
        font-size: 36px;
        filter: drop-shadow(0 2px 6px rgba(212,175,55,0.4));
        animation: mascotBounce 0.8s ease-out infinite;
    }

    @keyframes mascotBounce {
        0%, 100% { transform: translateY(0) rotate(-5deg); }
        50% { transform: translateY(-6px) rotate(5deg); }
    }

    .loyalty-notification-text-wrap {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .loyalty-notification-title {
        font-weight: 700;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #2854a6;
    }

    .loyalty-notification-text {
        font-weight: 700;
        font-size: 15px;
        color: #0a234e;
    }

    .loyalty-header-widget {
        background: linear-gradient(135deg, rgba(255, 230, 150, 0.9) 0%, rgba(200, 230, 255, 0.85) 100%);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        color: #0a234e;
        padding: 6px 14px;
        border-radius: 999px;
        font-weight: 700;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        gap: 6px;
        border: 2px solid rgba(255,255,255,0.5);
        box-shadow: 0 4px 15px rgba(100, 180, 255, 0.2);
    }

    .loyalty-header-widget:hover {
        transform: scale(1.08);
        box-shadow: 0 6px 25px rgba(212,175,55,0.4);
        background: linear-gradient(135deg, rgba(255, 220, 120, 0.95) 0%, rgba(180, 220, 255, 0.9) 100%);
    }

    .loyalty-mascot-mini {
        font-size: 18px;
        animation: miniHop 2s ease-in-out infinite;
    }

    @keyframes miniHop {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
    }

    .loyalty-text {
        font-weight: 800;
        color: #2854a6;
    }

    .loyalty-points-badge {
        background: linear-gradient(135deg, rgba(255, 230, 150, 0.9), rgba(200, 230, 255, 0.85));
        backdrop-filter: blur(8px);
        color: #0a234e;
        padding: 4px 12px;
        border-radius: 999px;
        font-weight: 700;
        font-size: 12px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        border: 1px solid rgba(255,255,255,0.4);
    }

    @media (max-width: 768px) {
        .loyalty-notification {
            top: 10px;
            right: 10px;
            left: 10px;
            padding: 14px 16px;
        }

        .loyalty-mascot {
            font-size: 30px;
        }

        .loyalty-notification-text {
            font-size: 14px;
        }

        .loyalty-header-widget {
            padding: 5px 10px;
            font-size: 12px;
        }

        .loyalty-mascot-mini {
            font-size: 15px;
        }
    }
`;
document.head.appendChild(loyaltyStyles);

// Export for use in other scripts
window.LOYALTY_CONFIG = LOYALTY_CONFIG;
