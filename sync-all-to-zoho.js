/**
 * Sync All Data Sources to Zoho CRM
 * Syncs contacts, orders, and leads from multiple sources
 */

import dotenv from 'dotenv';
import { syncLeadToZoho } from './zoho-crm-integration.js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

dotenv.config();

const stats = {
    capsule: { total: 0, synced: 0, errors: 0 },
    csv: { total: 0, synced: 0, errors: 0 },
    paypal: { total: 0, synced: 0, errors: 0 }
};

/**
 * Sync contacts from Capsule CRM to Zoho
 */
async function syncCapsuleToZoho() {
    console.log('='.repeat(60));
    console.log('📦 SYNCING FROM CAPSULE CRM');
    console.log('='.repeat(60));
    
    const CAPSULE_API_URL = 'https://api.capsulecrm.com/api/v2';
    const CAPSULE_API_TOKEN = process.env.CAPSULE_API_TOKEN || 'FPH4ltmX3v307MaUMCYkECGl9a16eXPh37TpUbWjOM83kd3cyW4z2vk8Kk+GcxJA';
    
    if (!CAPSULE_API_TOKEN) {
        console.log('⚠️  Capsule API token not configured. Skipping Capsule sync.');
        return;
    }
    
    try {
        // Fetch all parties (contacts) from Capsule
        let page = 1;
        let allContacts = [];
        let hasMore = true;
        
        while (hasMore) {
            const response = await fetch(`${CAPSULE_API_URL}/parties?page=${page}&perPage=100`, {
                headers: {
                    'Authorization': `Bearer ${CAPSULE_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Capsule API error: ${response.status}`);
            }
            
            const data = await response.json();
            const contacts = data.parties || [];
            
            if (contacts.length === 0) {
                hasMore = false;
            } else {
                allContacts.push(...contacts);
                console.log(`   Fetched page ${page}: ${contacts.length} contacts`);
                page++;
            }
        }
        
        stats.capsule.total = allContacts.length;
        console.log(`\n✅ Found ${allContacts.length} contacts in Capsule CRM\n`);
        
        // Sync each contact
        for (let i = 0; i < allContacts.length; i++) {
            const contact = allContacts[i];
            const email = contact.emails?.[0]?.address;
            
            if (!email) {
                console.log(`⏭️  Skipping contact ${i + 1}/${allContacts.length} (no email)`);
                continue;
            }
            
            console.log(`📧 Syncing contact ${i + 1}/${allContacts.length}: ${email}`);
            
            const leadData = {
                firstName: contact.firstName || '',
                lastName: contact.lastName || '',
                email: email,
                phone: contact.phoneNumbers?.[0]?.number || '',
                company: contact.organisation?.name || 'Success Chemistry Customer',
                source: 'Capsule CRM Sync',
                description: `Synced from Capsule CRM\nContact ID: ${contact.id}`,
                customFields: {
                    City: contact.addresses?.[0]?.city || '',
                    State: contact.addresses?.[0]?.state || '',
                    Country: contact.addresses?.[0]?.country || '',
                    Postal_Code: contact.addresses?.[0]?.zip || ''
                }
            };
            
            try {
                const result = await syncLeadToZoho(leadData);
                if (result.success) {
                    stats.capsule.synced++;
                } else {
                    stats.capsule.errors++;
                }
            } catch (error) {
                stats.capsule.errors++;
                console.error(`   ❌ Error: ${error.message}`);
            }
            
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        console.log(`\n✅ Capsule sync complete!\n`);
    } catch (error) {
        console.error('❌ Error syncing from Capsule:', error);
        stats.capsule.errors++;
    }
}

/**
 * Sync contacts from CSV file to Zoho
 */
async function syncCSVToZoho(csvPath) {
    console.log('='.repeat(60));
    console.log('📄 SYNCING FROM CSV FILE');
    console.log('='.repeat(60));
    
    if (!fs.existsSync(csvPath)) {
        console.log(`⚠️  CSV file not found: ${csvPath}`);
        return;
    }
    
    try {
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            relax_column_count: true
        });
        
        stats.csv.total = records.length;
        console.log(`\n✅ Found ${records.length} records in CSV\n`);
        
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            
            // Try to find email field (case-insensitive)
            const emailField = Object.keys(record).find(key => 
                key.toLowerCase().includes('email')
            );
            const email = emailField ? record[emailField] : null;
            
            if (!email || !email.includes('@')) {
                console.log(`⏭️  Skipping record ${i + 1}/${records.length} (no valid email)`);
                continue;
            }
            
            // Try to find name fields
            const firstNameField = Object.keys(record).find(key => 
                key.toLowerCase().includes('first') || key.toLowerCase().includes('fname')
            );
            const lastNameField = Object.keys(record).find(key => 
                key.toLowerCase().includes('last') || key.toLowerCase().includes('lname') || key.toLowerCase().includes('surname')
            );
            const nameField = Object.keys(record).find(key => 
                key.toLowerCase().includes('name') && !key.toLowerCase().includes('first') && !key.toLowerCase().includes('last')
            );
            
            const firstName = firstNameField ? record[firstNameField] : 
                            (nameField ? record[nameField]?.split(' ')[0] : '');
            const lastName = lastNameField ? record[lastNameField] : 
                           (nameField ? record[nameField]?.split(' ').slice(1).join(' ') : '');
            
            // Try to find phone field
            const phoneField = Object.keys(record).find(key => 
                key.toLowerCase().includes('phone') || key.toLowerCase().includes('tel')
            );
            const phone = phoneField ? record[phoneField] : '';
            
            console.log(`📧 Syncing record ${i + 1}/${records.length}: ${email}`);
            
            const leadData = {
                firstName: firstName || '',
                lastName: lastName || '',
                email: email,
                phone: phone || '',
                company: record.company || record.organization || 'Success Chemistry Customer',
                source: 'CSV Import',
                description: `Imported from CSV file: ${csvPath}\n\nRaw data: ${JSON.stringify(record, null, 2)}`
            };
            
            try {
                const result = await syncLeadToZoho(leadData);
                if (result.success) {
                    stats.csv.synced++;
                } else {
                    stats.csv.errors++;
                }
            } catch (error) {
                stats.csv.errors++;
                console.error(`   ❌ Error: ${error.message}`);
            }
            
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        console.log(`\n✅ CSV sync complete!\n`);
    } catch (error) {
        console.error('❌ Error syncing from CSV:', error);
        stats.csv.errors++;
    }
}

/**
 * Sync PayPal transactions to Zoho (if PayPal API is available)
 */
async function syncPayPalToZoho() {
    console.log('='.repeat(60));
    console.log('💳 SYNCING FROM PAYPAL');
    console.log('='.repeat(60));
    
    // This would require PayPal API access
    // For now, we'll just note that this is available
    console.log('⚠️  PayPal transaction sync requires PayPal API setup.');
    console.log('   This feature can be added if you have PayPal API credentials.\n');
}

/**
 * Main sync function
 */
async function syncAllToZoho(options = {}) {
    const {
        syncCapsule = true,
        syncCSV = true,
        csvPath = './order-history.csv',
        syncPayPal = false
    } = options;
    
    console.log('🚀 Starting Complete Zoho CRM Sync...\n');
    console.log('Options:');
    console.log(`   Sync Capsule CRM: ${syncCapsule ? '✅' : '❌'}`);
    console.log(`   Sync CSV Files: ${syncCSV ? '✅' : '❌'}`);
    console.log(`   CSV Path: ${csvPath}`);
    console.log(`   Sync PayPal: ${syncPayPal ? '✅' : '❌'}`);
    console.log('');
    
    if (!process.env.ZOHO_CRM_ACCESS_TOKEN) {
        console.error('❌ Zoho CRM access token not configured in .env file');
        process.exit(1);
    }
    
    try {
        // Sync from Capsule CRM
        if (syncCapsule) {
            await syncCapsuleToZoho();
        }
        
        // Sync from CSV files
        if (syncCSV) {
            // Try multiple CSV files
            const csvFiles = [
                './order-history.csv',
                './validation_reports/report.csv',
                csvPath
            ];
            
            for (const csvFile of csvFiles) {
                if (fs.existsSync(csvFile)) {
                    await syncCSVToZoho(csvFile);
                    break; // Only sync first found file
                }
            }
        }
        
        // Sync from PayPal (if enabled)
        if (syncPayPal) {
            await syncPayPalToZoho();
        }
        
        // Print summary
        console.log('='.repeat(60));
        console.log('📊 COMPLETE SYNC SUMMARY');
        console.log('='.repeat(60));
        
        if (syncCapsule) {
            console.log('\n📦 Capsule CRM:');
            console.log(`   Total: ${stats.capsule.total}`);
            console.log(`   ✅ Synced: ${stats.capsule.synced}`);
            console.log(`   ❌ Errors: ${stats.capsule.errors}`);
        }
        
        if (syncCSV) {
            console.log('\n📄 CSV Files:');
            console.log(`   Total: ${stats.csv.total}`);
            console.log(`   ✅ Synced: ${stats.csv.synced}`);
            console.log(`   ❌ Errors: ${stats.csv.errors}`);
        }
        
        console.log('\n✅ Complete sync finished!\n');
        
    } catch (error) {
        console.error('❌ Sync failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);
    const options = {
        syncCapsule: !args.includes('--no-capsule'),
        syncCSV: !args.includes('--no-csv'),
        csvPath: args.includes('--csv') ? args[args.indexOf('--csv') + 1] : './order-history.csv',
        syncPayPal: args.includes('--paypal')
    };
    
    syncAllToZoho(options).catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

export { syncAllToZoho };
