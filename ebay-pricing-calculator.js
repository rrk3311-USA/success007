/**
 * eBay Pricing Calculator
 * 
 * Calculates profit margins including:
 * - Cost of Goods (COGS)
 * - eBay Final Value Fees
 * - Payment Processing Fees
 * - Shipping Costs
 * - Other fees
 * 
 * Usage:
 *   node ebay-pricing-calculator.js <SKU> [selling_price]
 *   node ebay-pricing-calculator.js 10777-810
 *   node ebay-pricing-calculator.js 10777-810 29.99
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load products data
let PRODUCTS_DATA;
try {
    const productsPath = join(__dirname, 'deploy-site', 'products-data.js');
    const productsContent = readFileSync(productsPath, 'utf8');
    const modifiedContent = productsContent.replace(/^const PRODUCTS_DATA/, 'var PRODUCTS_DATA') + '\nPRODUCTS_DATA;';
    const func = new Function(modifiedContent + '\nreturn PRODUCTS_DATA;');
    PRODUCTS_DATA = func();
} catch (err) {
    console.error('❌ Could not load products-data.js:', err.message);
    process.exit(1);
}

// Load product costs (COGS)
let PRODUCT_COSTS = {};
const costsPath = join(__dirname, 'product-costs.json');
if (existsSync(costsPath)) {
    try {
        PRODUCT_COSTS = JSON.parse(readFileSync(costsPath, 'utf8'));
    } catch (err) {
        console.warn('⚠️  Could not load product-costs.json, using defaults');
    }
}

// eBay Fee Structure (as of 2024-2025)
const EBAY_FEES = {
    // Final Value Fee (FVF) - percentage of final sale price
    finalValueFee: {
        // Most categories: 12.9% for items $7,500 and under, 2.35% for portion over $7,500
        standard: 0.129, // 12.9%
        standardOver7500: 0.0235, // 2.35% for portion over $7,500
        threshold: 7500,
        
        // Electronics, Computers, Cell Phones: 8.35% for items $7,500 and under
        electronics: 0.0835,
        
        // Clothing, Shoes & Accessories: 12.9% for items $7,500 and under
        clothing: 0.129,
        
        // Health & Beauty: 12.9% for items $7,500 and under
        healthBeauty: 0.129,
        
        // Books, Movies & Music: 12.9% for items $7,500 and under
        media: 0.129
    },
    
    // Payment Processing Fee (eBay Managed Payments)
    paymentProcessing: 0.029, // 2.9% + $0.30 per transaction
    paymentProcessingFixed: 0.30,
    
    // Listing Fees (usually $0 for basic listings)
    listingFee: 0,
    
    // Optional fees
    promotedListing: 0, // If using promoted listings (optional)
    internationalListing: 0, // If listing internationally (optional)
    
    // Store subscription fees (monthly, not per item)
    storeFee: 0
};

/**
 * Calculate eBay fees for a sale
 */
function calculateEbayFees(sellingPrice, category = 'healthBeauty', shippingCost = 0) {
    const fees = {
        finalValueFee: 0,
        paymentProcessing: 0,
        totalFees: 0,
        breakdown: []
    };
    
    // Final Value Fee calculation
    let fvfRate = EBAY_FEES.finalValueFee.healthBeauty; // Default to health/beauty for supplements
    
    // Calculate FVF
    if (sellingPrice <= EBAY_FEES.finalValueFee.threshold) {
        fees.finalValueFee = sellingPrice * fvfRate;
        fees.breakdown.push({
            name: 'Final Value Fee',
            amount: fees.finalValueFee,
            description: `${(fvfRate * 100).toFixed(2)}% of $${sellingPrice.toFixed(2)}`
        });
    } else {
        // Tiered pricing for items over $7,500
        const firstTier = EBAY_FEES.finalValueFee.threshold * fvfRate;
        const secondTier = (sellingPrice - EBAY_FEES.finalValueFee.threshold) * EBAY_FEES.finalValueFee.standardOver7500;
        fees.finalValueFee = firstTier + secondTier;
        fees.breakdown.push({
            name: 'Final Value Fee (Tiered)',
            amount: fees.finalValueFee,
            description: `${(fvfRate * 100).toFixed(2)}% of first $${EBAY_FEES.finalValueFee.threshold} + ${(EBAY_FEES.finalValueFee.standardOver7500 * 100).toFixed(2)}% of remainder`
        });
    }
    
    // Payment Processing Fee
    fees.paymentProcessing = (sellingPrice * EBAY_FEES.paymentProcessing) + EBAY_FEES.paymentProcessingFixed;
    fees.breakdown.push({
        name: 'Payment Processing Fee',
        amount: fees.paymentProcessing,
        description: `${(EBAY_FEES.paymentProcessing * 100).toFixed(2)}% + $${EBAY_FEES.paymentProcessingFixed.toFixed(2)}`
    });
    
    // Total fees
    fees.totalFees = fees.finalValueFee + fees.paymentProcessing;
    
    return fees;
}

/**
 * Calculate profit margin
 */
function calculateProfit(cogs, sellingPrice, shippingCost = 0, ebayFees = null) {
    if (!ebayFees) {
        ebayFees = calculateEbayFees(sellingPrice);
    }
    
    const revenue = sellingPrice;
    const totalCosts = cogs + shippingCost + ebayFees.totalFees;
    const profit = revenue - totalCosts;
    const profitMargin = (profit / revenue) * 100;
    const markup = ((sellingPrice - cogs) / cogs) * 100;
    
    return {
        revenue,
        cogs,
        shippingCost,
        ebayFees: ebayFees.totalFees,
        totalCosts,
        profit,
        profitMargin,
        markup,
        breakdown: {
            revenue,
            costs: {
                cogs,
                shipping: shippingCost,
                ebayFees: ebayFees.totalFees,
                total: totalCosts
            },
            profit,
            profitMargin,
            markup
        }
    };
}

/**
 * Find optimal selling price to achieve target profit margin
 */
function findOptimalPrice(cogs, targetMargin, shippingCost = 0) {
    // Formula: sellingPrice = (cogs + shipping + fixedFees) / (1 - variableFeeRate - targetMargin/100)
    const fixedFees = EBAY_FEES.paymentProcessingFixed;
    const variableFeeRate = EBAY_FEES.finalValueFee.healthBeauty + EBAY_FEES.paymentProcessing;
    const targetMarginRate = targetMargin / 100;
    
    const optimalPrice = (cogs + shippingCost + fixedFees) / (1 - variableFeeRate - targetMarginRate);
    
    // Verify the calculation
    const verification = calculateProfit(cogs, optimalPrice, shippingCost);
    
    return {
        optimalPrice,
        targetMargin,
        actualMargin: verification.profitMargin,
        verification
    };
}

/**
 * Main function
 */
function main() {
    const sku = process.argv[2];
    const sellingPriceArg = parseFloat(process.argv[3]);
    
    if (!sku) {
        console.log('eBay Pricing Calculator');
        console.log('');
        console.log('Usage:');
        console.log('  node ebay-pricing-calculator.js <SKU> [selling_price]');
        console.log('');
        console.log('Examples:');
        console.log('  node ebay-pricing-calculator.js 10777-810');
        console.log('  node ebay-pricing-calculator.js 10777-810 29.99');
        console.log('');
        console.log('Available products:');
        const productSkus = Object.keys(PRODUCTS_DATA).slice(0, 10);
        productSkus.forEach(s => {
            const p = PRODUCTS_DATA[s];
            console.log(`  - ${s}: ${p.name.substring(0, 50)}... ($${p.price})`);
        });
        process.exit(1);
    }
    
    const product = PRODUCTS_DATA[sku];
    if (!product) {
        console.error(`❌ Product with SKU "${sku}" not found`);
        process.exit(1);
    }
    
    const sellingPrice = sellingPriceArg || product.price;
    
    // Get COGS from product-costs.json, then product data, then default to 0
    const costData = PRODUCT_COSTS[sku] || PRODUCT_COSTS._default || {};
    const cogs = costData.cogs || product.cost || product.cogs || 0;
    
    // Calculate shipping based on weight if available
    let shippingCost = costData.shipping_cost || product.shipping || 6.73; // Default to 3oz shipping
    
    // Try to calculate shipping from weight if not set
    if (!costData.shipping_cost && product.weight) {
        const weightMatch = product.weight.match(/(\d+\.?\d*)\s*(oz|lb|pound|pounds)/i);
        if (weightMatch) {
            const weightValue = parseFloat(weightMatch[1]);
            const weightUnit = weightMatch[2].toLowerCase();
            const weightInOz = weightUnit.includes('lb') ? weightValue * 16 : weightValue;
            
            // Match to shipping tier
            if (weightInOz >= 1 && weightInOz < 5) shippingCost = 6.73;
            else if (weightInOz >= 5 && weightInOz < 9) shippingCost = 7.38;
            else if (weightInOz >= 9 && weightInOz < 13) shippingCost = 9.84;
            else if (weightInOz >= 13 && weightInOz < 16) shippingCost = 11.66;
            else shippingCost = 6.73; // Default
        }
    }
    
    console.log('='.repeat(70));
    console.log('eBay Pricing Calculator');
    console.log('='.repeat(70));
    console.log('');
    console.log(`Product: ${product.name}`);
    console.log(`SKU: ${product.sku}`);
    console.log(`Current Selling Price: $${sellingPrice.toFixed(2)}`);
    console.log(`Cost of Goods: $${cogs > 0 ? cogs.toFixed(2) : 'NOT SET (enter manually)'}`);
    if (costData.tier) {
        console.log(`Pricing Tier: ${costData.tier} (${PRODUCT_COSTS._pricing_tier?.bottles_per_month || '1-199 bottles/month'})`);
    }
    console.log(`Shipping Cost: $${shippingCost.toFixed(2)} ${product.weight ? `(Weight: ${product.weight})` : ''}`);
    console.log('');
    
    // Calculate eBay fees
    const ebayFees = calculateEbayFees(sellingPrice);
    
    console.log('📊 eBay Fee Breakdown:');
    console.log('-'.repeat(70));
    ebayFees.breakdown.forEach(fee => {
        console.log(`  ${fee.name.padEnd(30)} $${fee.amount.toFixed(2)}  (${fee.description})`);
    });
    console.log(`  ${'Total eBay Fees'.padEnd(30)} $${ebayFees.totalFees.toFixed(2)}`);
    console.log('');
    
    if (cogs > 0) {
        // Calculate profit
        const profit = calculateProfit(cogs, sellingPrice, shippingCost, ebayFees);
        
        console.log('💰 Profit Analysis:');
        console.log('-'.repeat(70));
        console.log(`  Revenue (Selling Price)      $${profit.revenue.toFixed(2)}`);
        console.log(`  Cost of Goods (COGS)         $${profit.cogs.toFixed(2)}`);
        console.log(`  Shipping Cost                $${profit.shippingCost.toFixed(2)}`);
        console.log(`  eBay Fees                    $${profit.ebayFees.toFixed(2)}`);
        console.log(`  ─────────────────────────────────────────────────`);
        console.log(`  Total Costs                  $${profit.totalCosts.toFixed(2)}`);
        console.log(`  ─────────────────────────────────────────────────`);
        console.log(`  Net Profit                   $${profit.profit.toFixed(2)}`);
        console.log(`  Profit Margin                ${profit.profitMargin.toFixed(2)}%`);
        console.log(`  Markup                       ${profit.markup.toFixed(2)}%`);
        console.log('');
        
        // Show different scenarios
        console.log('🎯 Target Margin Scenarios:');
        console.log('-'.repeat(70));
        const targetMargins = [20, 30, 40, 50];
        targetMargins.forEach(margin => {
            const optimal = findOptimalPrice(cogs, margin, shippingCost);
            console.log(`  ${margin}% Margin:  Sell at $${optimal.optimalPrice.toFixed(2)}  →  Profit: $${optimal.verification.profit.toFixed(2)}`);
        });
        console.log('');
    } else {
        console.log('⚠️  Cost of Goods not set for this product.');
        console.log('');
        console.log('To add COGS, edit product-costs.json or run:');
        console.log(`  node ebay-pricing-calculator.js ${sku} ${sellingPrice} --set-cogs <amount>`);
        console.log('');
        console.log('Example calculation with COGS:');
        const exampleCogs = sellingPrice * 0.3; // Assume 30% COGS for example
        const exampleProfit = calculateProfit(exampleCogs, sellingPrice, shippingCost, ebayFees);
        console.log(`  If COGS = $${exampleCogs.toFixed(2)}:`);
        console.log(`    Net Profit: $${exampleProfit.profit.toFixed(2)}`);
        console.log(`    Profit Margin: ${exampleProfit.profitMargin.toFixed(2)}%`);
        console.log('');
    }
    
    // Handle setting COGS
    if (process.argv.includes('--set-cogs')) {
        const cogsIndex = process.argv.indexOf('--set-cogs');
        const newCogs = parseFloat(process.argv[cogsIndex + 1]);
        if (isNaN(newCogs)) {
            console.error('❌ Invalid COGS amount');
            process.exit(1);
        }
        
        // Update product costs
        if (!PRODUCT_COSTS[sku]) {
            PRODUCT_COSTS[sku] = {};
        }
        PRODUCT_COSTS[sku].cogs = newCogs;
        PRODUCT_COSTS[sku].shipping_cost = shippingCost;
        
        // Save to file
        writeFileSync(costsPath, JSON.stringify(PRODUCT_COSTS, null, 2));
        console.log(`\n✅ Updated COGS for ${sku}: $${newCogs.toFixed(2)}`);
        console.log('   Saved to product-costs.json');
        console.log('\n💰 Recalculating with new COGS...\n');
        
        // Recalculate with new COGS
        const updatedProfit = calculateProfit(newCogs, sellingPrice, shippingCost, ebayFees);
        console.log('💰 Updated Profit Analysis:');
        console.log('-'.repeat(70));
        console.log(`  Revenue (Selling Price)      $${updatedProfit.revenue.toFixed(2)}`);
        console.log(`  Cost of Goods (COGS)         $${updatedProfit.cogs.toFixed(2)}`);
        console.log(`  Shipping Cost                $${updatedProfit.shippingCost.toFixed(2)}`);
        console.log(`  eBay Fees                    $${updatedProfit.ebayFees.toFixed(2)}`);
        console.log(`  ─────────────────────────────────────────────────`);
        console.log(`  Total Costs                  $${updatedProfit.totalCosts.toFixed(2)}`);
        console.log(`  ─────────────────────────────────────────────────`);
        console.log(`  Net Profit                   $${updatedProfit.profit.toFixed(2)}`);
        console.log(`  Profit Margin                ${updatedProfit.profitMargin.toFixed(2)}%`);
        console.log(`  Markup                       ${updatedProfit.markup.toFixed(2)}%`);
        console.log('');
    }
    
    console.log('💡 Tips:');
    console.log('  - Final Value Fee: 12.9% for Health & Beauty category');
    console.log('  - Payment Processing: 2.9% + $0.30 per transaction');
    console.log('  - Total fees: ~15.8% + $0.30 per sale');
    console.log('  - Aim for at least 30-40% profit margin after all fees');
    console.log('');
}

main();
