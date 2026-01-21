/**
 * ShipStation API Integration for Success Chemistry
 * Automatically sends orders to ShipStation for on-demand fulfillment
 * Compatible with ShipStation API v1.0
 */

// ShipStation API Configuration
// Get these from: ShipStation Dashboard → Settings → API Settings
const SHIPSTATION_API_URL = 'https://ssapi.shipstation.com';
let SHIPSTATION_API_KEY = '';
let SHIPSTATION_API_SECRET = '';

// Initialize ShipStation credentials (set these from ShipStation dashboard)
function initShipStation(apiKey, apiSecret) {
    SHIPSTATION_API_KEY = apiKey;
    SHIPSTATION_API_SECRET = apiSecret;
}

/**
 * Create order in ShipStation
 * This is what triggers on-demand fulfillment
 */
async function createShipStationOrder(orderData, customerData, shippingAddress) {
    try {
        if (!SHIPSTATION_API_KEY || !SHIPSTATION_API_SECRET) {
            console.warn('⚠️ ShipStation API credentials not set. Skipping order creation.');
            return { success: false, error: 'API credentials not configured' };
        }

        console.log('📦 Creating order in ShipStation...', orderData);

        // Format items for ShipStation
        const lineItems = orderData.items.map((item, index) => ({
            lineItemKey: `${orderData.orderId}-${index + 1}`,
            sku: item.sku || item.name?.substring(0, 50),
            name: item.name || 'Supplement',
            imageUrl: item.image || '',
            weight: {
                value: 0.5, // Default weight in lbs (adjust per product)
                units: 'pounds'
            },
            quantity: parseInt(item.quantity || 1),
            unitPrice: parseFloat(item.price || 0),
            warehouseLocation: '', // Optional warehouse location
            options: [],
            productId: item.sku || null,
            fulfillmentSku: item.sku || null
        }));

        // Format shipping address
        const shipTo = {
            name: `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim() || 'Customer',
            street1: shippingAddress?.address_line_1 || shippingAddress?.street || '',
            street2: shippingAddress?.address_line_2 || shippingAddress?.street2 || '',
            city: shippingAddress?.admin_area_2 || shippingAddress?.city || '',
            state: shippingAddress?.admin_area_1 || shippingAddress?.state || '',
            postalCode: shippingAddress?.postal_code || shippingAddress?.zip || '',
            country: shippingAddress?.country_code || shippingAddress?.country || 'US',
            phone: customerData.phone || ''
        };

        // Create ShipStation order payload
        const shipstationOrder = {
            orderNumber: orderData.orderId || `SC-${Date.now()}`,
            orderDate: orderData.date || new Date().toISOString(),
            orderStatus: 'awaiting_shipment', // Order ready to fulfill
            customerUsername: customerData.email || '',
            customerEmail: customerData.email || '',
            billTo: shipTo, // Same as ship to for most orders
            shipTo: shipTo,
            items: lineItems,
            amountPaid: parseFloat(orderData.total || 0),
            taxAmount: parseFloat(orderData.tax || 0),
            shippingAmount: parseFloat(orderData.shipping || 0),
            paymentMethod: 'PayPal',
            paymentDate: orderData.date || new Date().toISOString(),
            requestedShippingService: '', // Let ShipStation choose or set default
            carrierCode: '', // Auto-select based on address
            serviceCode: '', // Auto-select service
            confirmation: 'none', // 'none', 'delivery', 'signature', etc.
            shipDate: '', // Ship immediately
            advancedOptions: {
                warehouseId: null, // Use default warehouse
                nonMachinable: false,
                saturdayDelivery: false,
                containsAlcohol: false,
                storeId: null,
                customField1: `Order from ${orderData.orderId}`,
                customField2: 'Success Chemistry',
                customField3: '',
                source: 'Website',
                mergedOrSplit: false,
                mergedIds: [],
                parentId: null,
                billToParty: null,
                billToAccount: null,
                billToPostalCode: null,
                billToCountryCode: null
            },
            tagIds: [],
            marketplaceIds: [],
            marketplaceNames: []
        };

        // Make API call to ShipStation
        const authHeader = 'Basic ' + btoa(`${SHIPSTATION_API_KEY}:${SHIPSTATION_API_SECRET}`);

        const response = await fetch(`${SHIPSTATION_API_URL}/orders/createorder`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shipstationOrder)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ ShipStation API error:', response.status, errorText);
            
            // Try to parse error for better message
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.Message || errorJson.message || `ShipStation API error: ${response.status}`);
            } catch (e) {
                throw new Error(`ShipStation API error: ${response.status} - ${errorText}`);
            }
        }

        const data = await response.json();
        console.log('✅ Order created in ShipStation!', data);
        
        return {
            success: true,
            orderId: data.orderId,
            orderNumber: data.orderNumber,
            shipstationOrderId: data.orderId,
            message: 'Order sent to ShipStation for fulfillment'
        };

    } catch (error) {
        console.error('❌ Error creating ShipStation order:', error);
        // Don't throw - we don't want to break the order flow if ShipStation fails
        return {
            success: false,
            error: error.message || 'Failed to create ShipStation order'
        };
    }
}

/**
 * Update order in ShipStation (if needed)
 */
async function updateShipStationOrder(orderId, updateData) {
    try {
        if (!SHIPSTATION_API_KEY || !SHIPSTATION_API_SECRET) {
            return { success: false, error: 'API credentials not configured' };
        }

        const authHeader = 'Basic ' + btoa(`${SHIPSTATION_API_KEY}:${SHIPSTATION_API_SECRET}`);

        const response = await fetch(`${SHIPSTATION_API_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            throw new Error(`ShipStation API error: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data };

    } catch (error) {
        console.error('❌ Error updating ShipStation order:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get order from ShipStation
 */
async function getShipStationOrder(orderNumber) {
    try {
        if (!SHIPSTATION_API_KEY || !SHIPSTATION_API_SECRET) {
            return null;
        }

        const authHeader = 'Basic ' + btoa(`${SHIPSTATION_API_KEY}:${SHIPSTATION_API_SECRET}`);

        const response = await fetch(`${SHIPSTATION_API_URL}/orders?orderNumber=${encodeURIComponent(orderNumber)}`, {
            headers: {
                'Authorization': authHeader
            }
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.orders?.[0] || null;

    } catch (error) {
        console.error('❌ Error getting ShipStation order:', error);
        return null;
    }
}

/**
 * Sync order to ShipStation (main function to call)
 * Formats PayPal order data and sends to ShipStation
 */
async function syncOrderToShipStation(orderData, customerData, paypalDetails) {
    try {
        console.log('🔄 Syncing order to ShipStation...', orderData);

        // Extract shipping address from PayPal details
        const shippingAddress = paypalDetails?.purchase_units?.[0]?.shipping?.address;

        if (!shippingAddress) {
            console.warn('⚠️ No shipping address found in PayPal details');
            return { success: false, error: 'Shipping address required' };
        }

        // Create order in ShipStation
        const result = await createShipStationOrder(orderData, customerData, shippingAddress);

        if (result.success) {
            console.log('✅ Order successfully synced to ShipStation!', result);
        } else {
            console.warn('⚠️ ShipStation sync failed:', result.error);
        }

        return result;

    } catch (error) {
        console.error('❌ Error syncing order to ShipStation:', error);
        return {
            success: false,
            error: error.message || 'Failed to sync order'
        };
    }
}

// Make functions available globally
if (typeof window !== 'undefined') {
    window.ShipStation = {
        init: initShipStation,
        createOrder: createShipStationOrder,
        updateOrder: updateShipStationOrder,
        getOrder: getShipStationOrder,
        syncOrder: syncOrderToShipStation
    };
}

// Export for Node.js (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initShipStation,
        createShipStationOrder,
        updateShipStationOrder,
        getShipStationOrder,
        syncOrderToShipStation
    };
}
