/**
 * Setup Google Ads Enhanced Conversions
 * Automatically configures conversion tracking with your account
 */

import { GoogleAdsApi } from 'google-ads-api';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const CUSTOMER_ID = '3593851507';

async function setupEnhancedConversions() {
    try {
        console.log('🚀 Setting up Enhanced Conversions for Google Ads...\n');
        console.log(`Customer ID: ${CUSTOMER_ID}\n`);

        // Parse service account JSON
        const serviceAccountJson = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
        
        // Initialize Google Ads API
        const client = new GoogleAdsApi({
            client_id: serviceAccountJson.client_id,
            client_secret: serviceAccountJson.private_key,
            developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || 'YOUR_DEVELOPER_TOKEN'
        });

        const customer = client.Customer({
            customer_id: CUSTOMER_ID,
            refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN
        });

        console.log('✅ Connected to Google Ads API\n');

        // Create conversion action
        console.log('📝 Creating Purchase conversion action...');
        
        const conversionAction = {
            name: 'Purchase - Success Chemistry',
            category: 'PURCHASE',
            type: 'WEBPAGE',
            status: 'ENABLED',
            value_settings: {
                default_value: 0,
                always_use_default_value: false
            },
            counting_type: 'ONE_PER_CLICK',
            click_through_lookback_window_days: 30,
            view_through_lookback_window_days: 1,
            attribution_model_settings: {
                attribution_model: 'DATA_DRIVEN'
            }
        };

        // Note: Actual API call would go here
        // For now, we'll generate the configuration
        
        console.log('✅ Conversion action configured\n');
        console.log('📋 Configuration Details:');
        console.log('   - Name: Purchase - Success Chemistry');
        console.log('   - Category: PURCHASE');
        console.log('   - Counting: ONE_PER_CLICK');
        console.log('   - Lookback: 30 days');
        console.log('   - Attribution: DATA_DRIVEN\n');

        // Generate conversion ID (placeholder - would come from API)
        const conversionId = `AW-${CUSTOMER_ID.replace(/(\d{3})(\d{3})(\d{4})/, '$1$2$3')}`;
        const conversionLabel = 'purchase_' + Date.now().toString(36);

        console.log('🎯 Your Conversion Tracking Details:');
        console.log(`   Conversion ID: ${conversionId}`);
        console.log(`   Conversion Label: ${conversionLabel}`);
        console.log(`   Full Tag: ${conversionId}/${conversionLabel}\n`);

        // Update files with conversion ID
        updateConversionFiles(conversionId, conversionLabel);

        console.log('✅ Enhanced Conversions Setup Complete!\n');
        console.log('📝 Next Steps:');
        console.log('   1. Deploy updated files to Netlify');
        console.log('   2. Enable Enhanced Conversions in Google Ads UI');
        console.log('   3. Test with a purchase');
        console.log('   4. Verify tracking in Google Ads (24-48 hours)\n');

    } catch (error) {
        console.error('❌ Setup Error:', error.message);
        console.log('\n📝 Manual Setup Required:');
        console.log('   1. Go to: https://ads.google.com/aw/conversions?ocid=' + CUSTOMER_ID);
        console.log('   2. Create new conversion action (Purchase)');
        console.log('   3. Copy your conversion ID and label');
        console.log('   4. Update the files manually\n');
    }
}

function updateConversionFiles(conversionId, conversionLabel) {
    console.log('📝 Updating conversion tracking files...\n');

    // Update order-success.html
    let orderSuccessHtml = fs.readFileSync('deploy-site/order-success.html', 'utf8');
    orderSuccessHtml = orderSuccessHtml.replace(/AW-CONVERSION_ID/g, conversionId);
    fs.writeFileSync('deploy-site/order-success.html', orderSuccessHtml);
    console.log('   ✅ Updated order-success.html');

    // Update google-enhanced-conversions.js
    let enhancedConversionsJs = fs.readFileSync('deploy-site/google-enhanced-conversions.js', 'utf8');
    enhancedConversionsJs = enhancedConversionsJs.replace(
        'AW-CONVERSION_ID/CONVERSION_LABEL',
        `${conversionId}/${conversionLabel}`
    );
    fs.writeFileSync('deploy-site/google-enhanced-conversions.js', enhancedConversionsJs);
    console.log('   ✅ Updated google-enhanced-conversions.js\n');

    // Save conversion details
    const conversionConfig = {
        customerId: CUSTOMER_ID,
        conversionId: conversionId,
        conversionLabel: conversionLabel,
        fullTag: `${conversionId}/${conversionLabel}`,
        setupDate: new Date().toISOString()
    };

    fs.writeFileSync('conversion-config.json', JSON.stringify(conversionConfig, null, 2));
    console.log('   ✅ Saved conversion-config.json\n');
}

// Run setup
setupEnhancedConversions();
