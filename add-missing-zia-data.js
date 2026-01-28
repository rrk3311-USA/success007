/**
 * Add Missing Data to Zia Knowledge Base
 * Includes: FAQs, Shipping/Returns, Subscriptions, Policies, etc.
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read existing knowledge base
const knowledgeBasePath = join(__dirname, 'zia-knowledge-base.json');
let knowledgeBase = JSON.parse(fs.readFileSync(knowledgeBasePath, 'utf8'));

// Add Shipping & Returns Policy
knowledgeBase.shippingAndReturns = {
    processing: {
        time: "1-2 business days",
        description: "Orders typically process within 1–2 business days"
    },
    shipping: {
        time: "Varies by location and method selected at checkout",
        free_shipping_threshold: 50,
        free_shipping_message: "Free shipping on orders over $50"
    },
    tracking: {
        notification: "A tracking link will be emailed once your order ships",
        update_delay: "If tracking hasn't updated for 72 hours, contact support for help"
    },
    returns: {
        window: "30 days",
        condition: "Unopened items",
        process: "Email support@successchemistry.com with your order number to start a return",
        policy_url: "https://successchemistry.com/shipping-returns"
    },
    exchanges: {
        damaged_items: "If your order arrives damaged or incorrect, we'll replace it at no cost",
        photos_required: "Please send photos of the issue so we can resolve it quickly"
    },
    refunds: {
        processing_time: "Refunds are processed within 5-10 business days after we receive the returned item",
        method: "Refunds are issued to the original payment method"
    }
};

// Add Subscription Information
knowledgeBase.subscriptions = {
    name: "Subscribe & Save",
    discount: "15% off",
    discount_percentage: 15,
    frequency: "Monthly",
    benefits: [
        "Save 15% on every delivery",
        "Free shipping on subscriptions",
        "Never run out - automatic delivery",
        "Cancel or skip anytime",
        "Modify delivery schedule"
    ],
    cancellation: {
        policy: "Cancel anytime with no penalties",
        process: "Cancel, skip, or pause your subscription anytime"
    },
    product_selection: {
        method: "Based on your wellness profile, health goals, and preferences",
        curation: "Our team of experts curates each shipment to support your unique journey"
    },
    satisfaction: {
        guarantee: "100% satisfaction guarantee",
        policy: "If you're not happy with any product, we'll make it right with a replacement or refund"
    },
    customization: {
        allowed: "You can always request specific products or exclude ones you don't want",
        contact: "Just reach out to our team!"
    },
    pricing: {
        locked_rate: "$49.99 rate is locked in as long as you remain an active subscriber",
        no_surprises: "No surprise price increases"
    },
    url: "https://successchemistry.com/subscribe"
};

// Add Product FAQs (extract from products-data.js)
const productsFilePath = join(__dirname, 'deploy-site/products-data.js');
const productsFileContent = fs.readFileSync(productsFilePath, 'utf-8');
const productsMatch = productsFileContent.match(/const PRODUCTS_DATA = ({[\s\S]*?});/);

if (productsMatch) {
    try {
        const productsData = eval('(' + productsMatch[1] + ')');
        knowledgeBase.productFAQs = [];
        
        Object.entries(productsData).forEach(([sku, product]) => {
            if (product.faqs && Array.isArray(product.faqs)) {
                product.faqs.forEach(faq => {
                    knowledgeBase.productFAQs.push({
                        sku: product.sku || sku,
                        product_name: product.name || '',
                        question: faq.question || '',
                        answer: faq.answer || ''
                    });
                });
            }
        });
        
        console.log(`   ✅ Added ${knowledgeBase.productFAQs.length} product FAQs`);
    } catch (error) {
        console.warn('   ⚠️  Could not extract product FAQs:', error.message);
    }
}

// Add General FAQs
knowledgeBase.generalFAQs = [
    {
        question: "Where are your products made?",
        answer: "All Success Chemistry products are made in the USA in a GMP-certified facility."
    },
    {
        question: "Are your products tested?",
        answer: "Yes, all products undergo 3rd party testing to ensure quality and purity."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day money-back guarantee. See our shipping & returns page for details: https://successchemistry.com/shipping-returns"
    },
    {
        question: "Do you offer subscriptions?",
        answer: "Yes, we offer Subscribe & Save with 15% discount on monthly deliveries. Visit https://successchemistry.com/subscribe for more information."
    },
    {
        question: "What certifications do you have?",
        answer: "We are GMP-certified, FDA-compliant, 3rd party tested, and Non-GMO verified."
    },
    {
        question: "What is your shipping policy?",
        answer: "Orders typically process within 1-2 business days. Free shipping on orders over $50. Tracking information is emailed once your order ships."
    },
    {
        question: "How do I track my order?",
        answer: "A tracking link will be emailed once your order ships. If tracking hasn't updated for 72 hours, contact support for help."
    },
    {
        question: "Can I cancel my subscription?",
        answer: "Yes! Cancel, skip, or pause your subscription anytime with no penalties. You're in complete control."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept PayPal, which includes PayPal, Venmo, Pay Later, and Google Pay options."
    },
    {
        question: "Are your products FDA approved?",
        answer: "Our products are FDA-compliant with proper labeling. Dietary supplements are not FDA-approved, but we follow all FDA regulations for manufacturing and labeling."
    }
];

// Add Payment Information
knowledgeBase.payment = {
    methods: ["PayPal", "Venmo", "Pay Later", "Google Pay"],
    primary: "PayPal",
    secure: true,
    sandbox_mode: "Currently in sandbox mode for testing",
    production_ready: "Can switch to live mode when ready"
};

// Add Contact & Support Information
knowledgeBase.support = {
    email: "info@successchemistry.com",
    support_email: "support@successchemistry.com",
    website: "https://successchemistry.com",
    contact_page: "https://successchemistry.com/contact",
    hours: "Monday-Friday 9AM-5PM PST",
    response_time: "We aim to respond within 24-48 hours"
};

// Add Compliance & Regulatory Information
knowledgeBase.compliance = {
    fda: {
        status: "FDA-compliant labeling",
        disclaimer: "*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.",
        required: "All health claims must include FDA disclaimer"
    },
    certifications: [
        "GMP-certified",
        "FDA-compliant",
        "3rd party tested",
        "Non-GMO",
        "Made in USA"
    ],
    manufacturing: {
        location: "USA",
        facility: "GMP-certified facility",
        testing: "3rd party tested for purity and potency"
    },
    labeling: {
        required: "FDA-compliant labeling required",
        includes: ["Supplement facts", "Ingredients list", "Suggested use", "Warnings", "FDA disclaimer"]
    }
};

// Add Product Bundles Information
knowledgeBase.bundles = {
    available: true,
    types: [
        "2-pack bundles",
        "3-pack bundles",
        "5-pack bundles"
    ],
    benefits: [
        "Significant savings",
        "Consistent supply for optimal results",
        "Better value per bottle"
    ],
    example: {
        sclera_white_3pack: {
            description: "3-pack bundle offers significant savings and ensures you have a consistent 90-day supply",
            servings: "90-day supply (3 bottles × 30 servings each)",
            shelf_life: "2 years from manufacturing date when stored properly"
        }
    }
};

// Add Inventory & Stock Information
knowledgeBase.inventory = {
    stock_status: "Most products are in stock",
    stock_levels: "High stock levels maintained for popular products",
    backorders: "Backorders are not currently available",
    restocking: "Products are restocked regularly"
};

// Add Order Processing Information
knowledgeBase.orderProcessing = {
    steps: [
        "Order received",
        "Payment processed (via PayPal)",
        "Order processed within 1-2 business days",
        "Order shipped with tracking",
        "Order delivered"
    ],
    confirmation: {
        email: "Order confirmation email sent after payment",
        tracking: "Tracking email sent when order ships"
    },
    issues: {
        damaged: "Contact support immediately with photos",
        incorrect: "Contact support for replacement",
        missing: "Contact support for resolution"
    }
};

// Add Customer Service Workflows
knowledgeBase.customerService = {
    common_issues: [
        {
            issue: "Order not received",
            resolution: "Check tracking information, contact support if tracking hasn't updated in 72 hours"
        },
        {
            issue: "Damaged product",
            resolution: "Email support@successchemistry.com with photos for free replacement"
        },
        {
            issue: "Wrong product received",
            resolution: "Contact support for immediate replacement at no cost"
        },
        {
            issue: "Subscription cancellation",
            resolution: "Cancel anytime through account dashboard or contact support"
        },
        {
            issue: "Return request",
            resolution: "Email support@successchemistry.com with order number within 30 days"
        }
    ],
    escalation: {
        level_1: "Email support@successchemistry.com",
        level_2: "Contact via website contact form",
        response_time: "24-48 hours"
    }
};

// Add Business Hours & Availability
knowledgeBase.businessHours = {
    support: {
        days: "Monday-Friday",
        hours: "9AM-5PM PST",
        timezone: "Pacific Standard Time"
    },
    shipping: {
        processing_days: "Monday-Friday",
        excludes: "Weekends and holidays"
    }
};

// Add Legal & Policy Links
knowledgeBase.legalPolicies = {
    privacy_policy: "https://successchemistry.com/privacy-policy",
    terms_of_service: "https://successchemistry.com/terms-of-service",
    shipping_returns: "https://successchemistry.com/shipping-returns",
    payment_policy: "https://successchemistry.com/payment-policy"
};

// Save enhanced knowledge base
fs.writeFileSync(knowledgeBasePath, JSON.stringify(knowledgeBase, null, 2));

console.log('✅ Added Missing Data to Zia Knowledge Base!');
console.log(`\n📋 Added Sections:`);
console.log(`   ✅ Shipping & Returns Policy`);
console.log(`   ✅ Subscription Information`);
console.log(`   ✅ Product FAQs: ${knowledgeBase.productFAQs?.length || 0} FAQs`);
console.log(`   ✅ General FAQs: ${knowledgeBase.generalFAQs?.length || 0} FAQs`);
console.log(`   ✅ Payment Information`);
console.log(`   ✅ Support & Contact Info`);
console.log(`   ✅ Compliance & Regulatory Info`);
console.log(`   ✅ Product Bundles Info`);
console.log(`   ✅ Inventory & Stock Info`);
console.log(`   ✅ Order Processing Workflows`);
console.log(`   ✅ Customer Service Workflows`);
console.log(`   ✅ Business Hours`);
console.log(`   ✅ Legal & Policy Links`);
console.log(`\n📁 Updated: ${knowledgeBasePath}`);
console.log(`\n🎯 Zia can now answer questions about:`);
console.log(`   - Shipping times and policies`);
console.log(`   - Return and refund processes`);
console.log(`   - Subscription details and cancellation`);
console.log(`   - Product-specific FAQs`);
console.log(`   - Payment methods`);
console.log(`   - Customer service procedures`);
console.log(`   - Compliance and certifications`);
console.log(`   - Order tracking and issues`);
