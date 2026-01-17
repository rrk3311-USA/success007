import {
  createProduct,
  createSubscriptionPlan,
  createSubscription,
  listProducts,
  listSubscriptionPlans
} from './paypal-agent.js';

export async function ensureProductInPayPal(productData) {
  try {
    const existingProducts = await listProducts({ page_size: 100 });
    
    const existing = existingProducts?.products?.find(p => 
      p.name === productData.name || p.id === productData.externalId
    );
    
    if (existing) {
      return existing.id;
    }
    
    const product = await createProduct({
      name: productData.name,
      description: productData.description || `${productData.name} - Premium supplement`,
      type: 'PHYSICAL',
      category: 'HEALTH_AND_BEAUTY',
      image_url: productData.image_url,
      home_url: productData.home_url || 'https://successchemistry.com'
    });
    
    return product.id;
  } catch (error) {
    console.error('Error ensuring product in PayPal:', error);
    throw error;
  }
}

export async function createSubscriptionPlanForProduct(productId, productData) {
  try {
    const planName = `${productData.name} - Monthly Subscription`;
    
    const existingPlans = await listSubscriptionPlans({ product_id: productId });
    const existing = existingPlans?.plans?.find(p => p.name === planName);
    
    if (existing) {
      return existing.id;
    }
    
    const discountedPrice = (productData.price * 0.85).toFixed(2);
    
    const plan = await createSubscriptionPlan({
      product_id: productId,
      name: planName,
      description: `Save 15% with monthly auto-delivery of ${productData.name}`,
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'MONTH',
            interval_count: 1
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: discountedPrice,
              currency_code: 'USD'
            }
          }
        }
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: '0',
          currency_code: 'USD'
        },
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3
      }
    });
    
    return plan.id;
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    throw error;
  }
}

export async function setupSubscriptionForCartItem(cartItem) {
  try {
    const productId = await ensureProductInPayPal({
      name: cartItem.name,
      description: `Premium ${cartItem.name}`,
      image_url: cartItem.image,
      externalId: cartItem.sku
    });
    
    const planId = await createSubscriptionPlanForProduct(productId, {
      name: cartItem.name,
      price: cartItem.price
    });
    
    return {
      productId,
      planId,
      savings: (cartItem.price * 0.15).toFixed(2),
      subscriptionPrice: (cartItem.price * 0.85).toFixed(2)
    };
  } catch (error) {
    console.error('Error setting up subscription:', error);
    throw error;
  }
}

export async function createCustomerSubscription(planId, customerInfo) {
  try {
    const subscription = await createSubscription({
      plan_id: planId,
      subscriber: {
        name: {
          given_name: customerInfo.firstName,
          surname: customerInfo.lastName
        },
        email_address: customerInfo.email,
        shipping_address: customerInfo.shippingAddress
      },
      application_context: {
        brand_name: 'Success Chemistry',
        locale: 'en-US',
        shipping_preference: 'SET_PROVIDED_ADDRESS',
        user_action: 'SUBSCRIBE_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
        },
        return_url: 'https://successchemistry.com/subscription-success',
        cancel_url: 'https://successchemistry.com/cart'
      }
    });
    
    return subscription;
  } catch (error) {
    console.error('Error creating customer subscription:', error);
    throw error;
  }
}

export function calculateSubscriptionSavings(price, quantity = 1) {
  const regularTotal = price * quantity;
  const subscriptionPrice = price * 0.85;
  const subscriptionTotal = subscriptionPrice * quantity;
  const savings = regularTotal - subscriptionTotal;
  
  return {
    regularPrice: price.toFixed(2),
    regularTotal: regularTotal.toFixed(2),
    subscriptionPrice: subscriptionPrice.toFixed(2),
    subscriptionTotal: subscriptionTotal.toFixed(2),
    savings: savings.toFixed(2),
    savingsPercent: 15
  };
}
