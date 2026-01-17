/**
 * SUCCESS CHEMISTRY TRACKING SCRIPT
 * Add this to all pages for heatmaps, page flow, and conversion tracking
 * 
 * Usage: <script src="/tracking-script.js"></script>
 */

(function() {
    const API_BASE = 'http://localhost:3001';
    const sessionId = getOrCreateSessionId();
    
    // Track page view on load
    trackPageView();
    
    // Track clicks for heatmap
    document.addEventListener('click', trackClick);
    
    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', trackScroll);
    
    // Track time on page
    let pageLoadTime = Date.now();
    window.addEventListener('beforeunload', trackTimeOnPage);

    /**
     * Detect traffic source
     */
    function getTrafficSource() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');
        const referrer = document.referrer;
        
        // If UTM parameters exist, use them
        if (utmSource) {
            return {
                source: utmSource,
                medium: utmMedium || 'unknown',
                campaign: utmCampaign || 'unknown',
                type: 'utm'
            };
        }
        
        // Detect from referrer
        if (!referrer || referrer.includes(window.location.hostname)) {
            return { source: 'direct', medium: 'none', campaign: 'none', type: 'direct' };
        }
        
        // Social media
        if (referrer.includes('facebook.com') || referrer.includes('fb.com')) {
            return { source: 'facebook', medium: 'social', campaign: 'organic', type: 'social' };
        }
        if (referrer.includes('instagram.com')) {
            return { source: 'instagram', medium: 'social', campaign: 'organic', type: 'social' };
        }
        if (referrer.includes('twitter.com') || referrer.includes('t.co')) {
            return { source: 'twitter', medium: 'social', campaign: 'organic', type: 'social' };
        }
        if (referrer.includes('linkedin.com')) {
            return { source: 'linkedin', medium: 'social', campaign: 'organic', type: 'social' };
        }
        if (referrer.includes('tiktok.com')) {
            return { source: 'tiktok', medium: 'social', campaign: 'organic', type: 'social' };
        }
        
        // Search engines
        if (referrer.includes('google.com')) {
            return { source: 'google', medium: 'organic', campaign: 'search', type: 'search' };
        }
        if (referrer.includes('bing.com')) {
            return { source: 'bing', medium: 'organic', campaign: 'search', type: 'search' };
        }
        if (referrer.includes('yahoo.com')) {
            return { source: 'yahoo', medium: 'organic', campaign: 'search', type: 'search' };
        }
        
        // Default to referral
        const hostname = new URL(referrer).hostname;
        return { source: hostname, medium: 'referral', campaign: 'referral', type: 'referral' };
    }

    /**
     * Track page view
     */
    function trackPageView() {
        const trafficSource = getTrafficSource();
        
        const data = {
            event: 'page_view',
            page: window.location.pathname,
            sessionId: sessionId,
            data: {
                page: window.location.pathname,
                referrer: document.referrer,
                timestamp: new Date().toISOString(),
                source: trafficSource.source,
                medium: trafficSource.medium,
                campaign: trafficSource.campaign,
                type: trafficSource.type
            }
        };
        
        sendTracking(data);
    }

    /**
     * Track click for heatmap
     */
    function trackClick(e) {
        const data = {
            page: window.location.pathname,
            x: e.pageX,
            y: e.pageY,
            element: getElementPath(e.target)
        };
        
        fetch(`${API_BASE}/api/analytics/heatmap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => console.error('Heatmap tracking error:', err));
        
        // Track specific events
        if (e.target.matches('button, .cta-button, .add-to-cart')) {
            trackEvent('button_click', {
                button: e.target.textContent,
                element: getElementPath(e.target)
            });
        }
        
        if (e.target.matches('a')) {
            trackEvent('link_click', {
                url: e.target.href,
                text: e.target.textContent
            });
        }
    }

    /**
     * Track scroll depth
     */
    function trackScroll() {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercent > maxScrollDepth) {
            maxScrollDepth = scrollPercent;
            
            // Track milestones
            if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
                trackEvent('scroll_25', { page: window.location.pathname });
            } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
                trackEvent('scroll_50', { page: window.location.pathname });
            } else if (maxScrollDepth >= 75 && maxScrollDepth < 100) {
                trackEvent('scroll_75', { page: window.location.pathname });
            } else if (maxScrollDepth >= 100) {
                trackEvent('scroll_100', { page: window.location.pathname });
            }
        }
    }

    /**
     * Track time on page
     */
    function trackTimeOnPage() {
        const timeSpent = Math.floor((Date.now() - pageLoadTime) / 1000);
        trackEvent('time_on_page', {
            page: window.location.pathname,
            seconds: timeSpent,
            scrollDepth: maxScrollDepth
        });
    }

    /**
     * Track custom event
     */
    function trackEvent(eventName, data) {
        sendTracking({
            event: eventName,
            sessionId: sessionId,
            data: data || {}
        });
    }

    /**
     * Send tracking data to server
     */
    function sendTracking(data) {
        fetch(`${API_BASE}/api/analytics/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => console.error('Tracking error:', err));
    }

    /**
     * Get or create session ID
     */
    function getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem('sc_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('sc_session_id', sessionId);
        }
        return sessionId;
    }

    /**
     * Get element path for identification
     */
    function getElementPath(element) {
        if (!element) return '';
        
        const path = [];
        while (element && element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.nodeName.toLowerCase();
            
            if (element.id) {
                selector += '#' + element.id;
                path.unshift(selector);
                break;
            } else if (element.className) {
                selector += '.' + element.className.split(' ').join('.');
            }
            
            path.unshift(selector);
            element = element.parentNode;
        }
        
        return path.join(' > ');
    }

    /**
     * Expose tracking function globally
     */
    window.trackEvent = trackEvent;
    
    console.log('✅ Success Chemistry tracking initialized');
})();
