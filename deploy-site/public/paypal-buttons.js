// Get PayPal Client ID from config.js if available, otherwise use sandbox
function getPayPalClientID() {
    // Check if CONFIG object exists (from config.js)
    if (typeof window.CONFIG !== 'undefined' && window.CONFIG.PAYPAL) {
        return window.CONFIG.SANDBOX_MODE 
            ? window.CONFIG.PAYPAL.SANDBOX_CLIENT_ID 
            : window.CONFIG.PAYPAL.PRODUCTION_CLIENT_ID;
    }
    // Check if getPayPalClientID function exists in global scope (from config.js)
    if (typeof window.getPayPalClientID === 'function' && window.getPayPalClientID !== getPayPalClientID) {
        return window.getPayPalClientID();
    }
    // Fallback to production client ID
    return 'EBAQIbUDDVgB06yvEWREs2cMox8AKElkxFJAqKF71iUj007dv0YzxlKbepduwV7xGEI5FrjK3vakzm0b';
}
const PAYPAL_MODE = 'live';

function loadPayPalSDK(callback) {
    if (window.paypal) {
        callback();
        return;
    }
    
    const clientId = getPayPalClientID();
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture&components=buttons,funding-eligibility`;
    script.onload = callback;
    script.onerror = () => {
        console.error('Failed to load PayPal SDK');
    };
    document.head.appendChild(script);
}

function renderPayPalButton(containerId, options = {}) {
    const {
        amount,
        currency = 'USD',
        description = 'Purchase from Success Chemistry',
        items = [],
        isSubscription = false,
        planId = null,
        onSuccess = null,
        onError = null,
        onCancel = null
    } = options;

    loadPayPalSDK(() => {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        container.innerHTML = '';

        if (isSubscription && planId) {
            renderSubscriptionButton(container, planId, onSuccess, onError, onCancel);
        } else {
            renderOrderButton(container, amount, currency, description, items, onSuccess, onError, onCancel);
        }
    });
}

function renderOrderButton(container, amount, currency, description, items, onSuccess, onError, onCancel) {
    window.paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 45
        },
        
        createOrder: async function(data, actions) {
            try {
                const response = await fetch('http://localhost:3001/api/paypal/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        intent: 'CAPTURE',
                        purchase_units: [{
                            description: description,
                            amount: {
                                currency_code: currency,
                                value: amount.toFixed(2),
                                breakdown: items.length > 0 ? {
                                    item_total: {
                                        currency_code: currency,
                                        value: amount.toFixed(2)
                                    }
                                } : undefined
                            },
                            items: items.length > 0 ? items.map(item => ({
                                name: item.name,
                                description: item.description || item.name,
                                unit_amount: {
                                    currency_code: currency,
                                    value: item.price.toFixed(2)
                                },
                                quantity: item.quantity.toString()
                            })) : undefined
                        }]
                    })
                });

                const orderData = await response.json();
                
                if (orderData.success && orderData.order) {
                    return orderData.order.id;
                } else {
                    throw new Error(orderData.error || 'Failed to create order');
                }
            } catch (error) {
                console.error('Error creating PayPal order:', error);
                if (onError) onError(error);
                throw error;
            }
        },

        onApprove: async function(data, actions) {
            try {
                const response = await fetch(`http://localhost:3001/api/paypal/orders/${data.orderID}/pay`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                const paymentData = await response.json();

                if (paymentData.success) {
                    if (onSuccess) {
                        onSuccess(paymentData.payment);
                    } else {
                        alert('✅ Payment successful! Order ID: ' + data.orderID);
                        localStorage.removeItem('successChemistryCart');
                        window.location.href = '/order-confirmation.html?orderId=' + data.orderID;
                    }
                } else {
                    throw new Error(paymentData.error || 'Payment failed');
                }
            } catch (error) {
                console.error('Error processing payment:', error);
                if (onError) onError(error);
                alert('❌ Payment processing failed. Please try again.');
            }
        },

        onCancel: function(data) {
            console.log('Payment cancelled by user');
            if (onCancel) {
                onCancel(data);
            } else {
                alert('Payment cancelled. Your cart is still saved.');
            }
        },

        onError: function(err) {
            console.error('PayPal button error:', err);
            if (onError) {
                onError(err);
            } else {
                alert('An error occurred with PayPal. Please try again or contact support.');
            }
        }
    }).render(container);
}

function renderSubscriptionButton(container, planId, onSuccess, onError, onCancel) {
    window.paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'subscribe',
            height: 45
        },

        createSubscription: async function(data, actions) {
            try {
                const response = await fetch('http://localhost:3001/api/paypal/subscriptions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        plan_id: planId,
                        application_context: {
                            brand_name: 'Success Chemistry',
                            locale: 'en-US',
                            shipping_preference: 'SET_PROVIDED_ADDRESS',
                            user_action: 'SUBSCRIBE_NOW',
                            return_url: window.location.origin + '/subscription-success.html',
                            cancel_url: window.location.origin + '/cart.html'
                        }
                    })
                });

                const subscriptionData = await response.json();

                if (subscriptionData.success && subscriptionData.subscription) {
                    return subscriptionData.subscription.id;
                } else {
                    throw new Error(subscriptionData.error || 'Failed to create subscription');
                }
            } catch (error) {
                console.error('Error creating subscription:', error);
                if (onError) onError(error);
                throw error;
            }
        },

        onApprove: async function(data) {
            console.log('Subscription approved:', data.subscriptionID);
            
            // Sync subscription to WooCommerce, Capsule, and ShipStation
            try {
                const cart = JSON.parse(localStorage.getItem('successChemistryCart') || '[]');
                const subscriptionInfo = JSON.parse(localStorage.getItem('subscriptionInfo') || 'null');
                
                if (cart.length > 0 && subscriptionInfo) {
                    // Format subscription as order data for syncing
                    const orderData = {
                        id: data.subscriptionID,
                        orderId: data.subscriptionID,
                        date: new Date().toISOString(),
                        items: cart,
                        total: parseFloat(subscriptionInfo.subscriptionPrice || 0),
                        status: 'subscription_active',
                        isSubscription: true,
                        subscriptionId: data.subscriptionID,
                        planId: subscriptionInfo.planId
                    };
                    
                    // Sync to WooCommerce
                    if (window.WooCommerceOrder && window.WooCommerceOrder.syncOrder) {
                        try {
                            // Fetch subscription details from PayPal to get customer info
                            const subscriptionResponse = await fetch(`http://localhost:3001/api/paypal/subscriptions/${data.subscriptionID}`);
                            if (subscriptionResponse.ok) {
                                const subscriptionDetails = await subscriptionResponse.json();
                                await window.WooCommerceOrder.syncOrder(subscriptionDetails);
                                console.log('✅ Subscription synced to WooCommerce!');
                            }
                        } catch (err) {
                            console.warn('⚠️ WooCommerce subscription sync failed:', err);
                        }
                    }
                    
                    // Sync to Capsule CRM
                    if (window.CapsuleCRM && window.CapsuleCRM.syncOrder) {
                        try {
                            const customerData = {
                                email: subscriptionInfo.customerEmail || '',
                                firstName: subscriptionInfo.customerName?.split(' ')[0] || '',
                                lastName: subscriptionInfo.customerName?.split(' ').slice(1).join(' ') || ''
                            };
                            await window.CapsuleCRM.syncOrder(orderData, customerData);
                            console.log('✅ Subscription synced to Capsule CRM!');
                        } catch (err) {
                            console.warn('⚠️ Capsule subscription sync failed:', err);
                        }
                    }
                }
            } catch (err) {
                console.error('Error syncing subscription:', err);
            }
            
            if (onSuccess) {
                onSuccess(data);
            } else {
                alert('✅ Subscription activated! ID: ' + data.subscriptionID);
                localStorage.removeItem('successChemistryCart');
                window.location.href = '/subscription-success.html?subscriptionId=' + data.subscriptionID;
            }
        },

        onCancel: function(data) {
            console.log('Subscription cancelled by user');
            if (onCancel) {
                onCancel(data);
            } else {
                alert('Subscription cancelled. Your cart is still saved.');
            }
        },

        onError: function(err) {
            console.error('PayPal subscription error:', err);
            if (onError) {
                onError(err);
            } else {
                alert('An error occurred with PayPal subscription. Please try again.');
            }
        }
    }).render(container);
}

function renderCartPayPalButtons() {
    const cart = JSON.parse(localStorage.getItem('successChemistryCart') || '[]');
    const isSubscription = localStorage.getItem('isSubscription') === 'true';
    const subscriptionInfo = JSON.parse(localStorage.getItem('subscriptionInfo') || 'null');
    
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const items = cart.map(item => ({
        name: item.name,
        description: item.name,
        price: item.price,
        quantity: item.quantity
    }));

    if (isSubscription && cart.length === 1 && subscriptionInfo?.planId) {
        renderPayPalButton('paypal-button-container', {
            isSubscription: true,
            planId: subscriptionInfo.planId,
            onSuccess: async (data) => {
                // Sync subscription to WooCommerce, Capsule, and ShipStation
                try {
                    console.log('🔄 Syncing subscription to integrations...', data);
                    
                    // Fetch subscription details from PayPal API
                    const apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                        ? 'http://localhost:3001' 
                        : 'https://api.successchemistry.com';
                    
                    const subscriptionResponse = await fetch(`${apiBase}/api/paypal/subscriptions/${data.subscriptionID}`);
                    if (subscriptionResponse.ok) {
                        const subscriptionDetails = await subscriptionResponse.json();
                        
                        // Format as order data for WooCommerce
                        const orderData = {
                            id: data.subscriptionID,
                            orderId: data.subscriptionID,
                            date: new Date().toISOString(),
                            items: cart,
                            total: parseFloat(subscriptionInfo.subscriptionPrice || cart[0].price * 0.85),
                            status: 'subscription_active',
                            isSubscription: true,
                            subscriptionId: data.subscriptionID,
                            planId: subscriptionInfo.planId
                        };
                        
                        // Sync to WooCommerce
                        if (window.WooCommerceOrder && window.WooCommerceOrder.syncOrder) {
                            try {
                                // Format subscription details as PayPal order format for WooCommerce
                                const paypalOrderFormat = {
                                    id: data.subscriptionID,
                                    purchase_units: [{
                                        amount: {
                                            value: orderData.total.toString(),
                                            currency_code: 'USD'
                                        },
                                        items: cart.map(item => ({
                                            name: item.name,
                                            sku: item.sku,
                                            quantity: item.quantity.toString(),
                                            unit_amount: {
                                                value: item.price.toString(),
                                                currency_code: 'USD'
                                            }
                                        })),
                                        shipping: subscriptionDetails.subscriber?.shipping_address ? {
                                            name: {
                                                full_name: subscriptionDetails.subscriber?.name?.given_name + ' ' + subscriptionDetails.subscriber?.name?.surname
                                            },
                                            address: {
                                                address_line_1: subscriptionDetails.subscriber?.shipping_address?.address_line_1 || '',
                                                address_line_2: subscriptionDetails.subscriber?.shipping_address?.address_line_2 || '',
                                                admin_area_1: subscriptionDetails.subscriber?.shipping_address?.admin_area_1 || '',
                                                admin_area_2: subscriptionDetails.subscriber?.shipping_address?.admin_area_2 || '',
                                                postal_code: subscriptionDetails.subscriber?.shipping_address?.postal_code || '',
                                                country_code: subscriptionDetails.subscriber?.shipping_address?.country_code || 'US'
                                            }
                                        } : null
                                    }],
                                    payer: {
                                        name: subscriptionDetails.subscriber?.name || {},
                                        email_address: subscriptionDetails.subscriber?.email_address || '',
                                        phone: subscriptionDetails.subscriber?.phone || {}
                                    }
                                };
                                
                                const wooResult = await window.WooCommerceOrder.syncOrder(paypalOrderFormat);
                                if (wooResult && wooResult.id) {
                                    console.log('✅ Subscription synced to WooCommerce!', wooResult);
                                }
                            } catch (err) {
                                console.warn('⚠️ WooCommerce subscription sync failed:', err);
                            }
                        }
                        
                        // Sync to Capsule CRM
                        if (window.CapsuleCRM && window.CapsuleCRM.syncOrder) {
                            try {
                                const customerData = {
                                    email: subscriptionDetails.subscriber?.email_address || '',
                                    firstName: subscriptionDetails.subscriber?.name?.given_name || '',
                                    lastName: subscriptionDetails.subscriber?.name?.surname || '',
                                    address: subscriptionDetails.subscriber?.shipping_address || {}
                                };
                                await window.CapsuleCRM.syncOrder(orderData, customerData);
                                console.log('✅ Subscription synced to Capsule CRM!');
                            } catch (err) {
                                console.warn('⚠️ Capsule subscription sync failed:', err);
                            }
                        }
                    }
                } catch (err) {
                    console.error('Error syncing subscription:', err);
                }
                
                localStorage.removeItem('successChemistryCart');
                localStorage.removeItem('subscriptionInfo');
                localStorage.removeItem('isSubscription');
                window.location.href = '/subscription-success.html?subscriptionId=' + data.subscriptionID;
            }
        });
    } else {
        renderPayPalButton('paypal-button-container', {
            amount: total,
            description: 'Success Chemistry Purchase',
            items: items,
            onSuccess: (payment) => {
                localStorage.removeItem('successChemistryCart');
                localStorage.removeItem('isSubscription');
                window.location.href = '/order-confirmation.html?orderId=' + payment.id;
            }
        });
    }
}

function renderProductPayPalButton(productSku, productName, productPrice) {
    renderPayPalButton('paypal-button-container', {
        amount: productPrice,
        description: `Purchase ${productName}`,
        items: [{
            name: productName,
            description: productName,
            price: productPrice,
            quantity: 1
        }],
        onSuccess: (payment) => {
            alert('✅ Payment successful!');
            window.location.href = '/order-confirmation.html?orderId=' + payment.id;
        }
    });
}

window.PayPalButtons = {
    render: renderPayPalButton,
    renderCart: renderCartPayPalButtons,
    renderProduct: renderProductPayPalButton
};
