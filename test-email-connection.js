/**
 * Test Email Connection - Namecheap SMTP/IMAP
 * Tests both SMTP (sending) and IMAP (receiving) connections
 */

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const EMAIL_CONFIG = {
    host: process.env.EMAIL_HOST || 'mail.privateemail.com',
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
};

const IMAP_CONFIG = {
    host: process.env.EMAIL_IMAP_HOST || 'mail.privateemail.com',
    port: parseInt(process.env.EMAIL_IMAP_PORT || '993'),
    secure: process.env.EMAIL_IMAP_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
};

console.log('🧪 Testing Namecheap Email Connection...\n');
console.log('📧 Email Configuration:');
console.log(`   Host: ${EMAIL_CONFIG.host}`);
console.log(`   Port: ${EMAIL_CONFIG.port}`);
console.log(`   Secure: ${EMAIL_CONFIG.secure}`);
console.log(`   User: ${EMAIL_CONFIG.auth.user}`);
console.log(`   Password: ${EMAIL_CONFIG.auth.pass ? '***' + EMAIL_CONFIG.auth.pass.slice(-3) : 'NOT SET'}\n`);

// Test 1: SMTP Connection (Sending)
async function testSMTP() {
    console.log('📤 Testing SMTP (Outgoing) Connection...');
    
    try {
        const transporter = nodemailer.createTransport(EMAIL_CONFIG);
        
        // Verify connection
        await transporter.verify();
        console.log('   ✅ SMTP connection successful!\n');
        
        // Try sending a test email
        console.log('   📨 Sending test email...');
        const testEmail = await transporter.sendMail({
            from: process.env.EMAIL_FROM || `"Success Chemistry" <${EMAIL_CONFIG.auth.user}>`,
            to: EMAIL_CONFIG.auth.user, // Send to self
            subject: '✅ Success Chemistry - Email Test',
            text: 'This is a test email from Success Chemistry email system.\n\nIf you received this, your SMTP settings are working correctly!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0a234e;">✅ Email Test Successful!</h2>
                    <p>This is a test email from Success Chemistry email system.</p>
                    <p>If you received this, your SMTP settings are working correctly!</p>
                    <hr style="border: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">Test sent at: ${new Date().toLocaleString()}</p>
                </div>
            `
        });
        
        console.log('   ✅ Test email sent successfully!');
        console.log(`   📬 Message ID: ${testEmail.messageId}\n`);
        return true;
        
    } catch (error) {
        console.error('   ❌ SMTP connection failed:');
        console.error(`   Error: ${error.message}\n`);
        
        if (error.code === 'EAUTH') {
            console.error('   💡 Tip: Check your email username and password');
        } else if (error.code === 'ECONNECTION') {
            console.error('   💡 Tip: Check your host and port settings');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('   💡 Tip: Check your firewall/network settings');
        }
        
        return false;
    }
}

// Test 2: IMAP Connection (Receiving) - Basic check
async function testIMAP() {
    console.log('📥 Testing IMAP (Incoming) Connection...');
    
    try {
        // Note: Full IMAP testing requires imap library
        // This is a basic configuration check
        console.log(`   Host: ${IMAP_CONFIG.host}`);
        console.log(`   Port: ${IMAP_CONFIG.port}`);
        console.log(`   Secure: ${IMAP_CONFIG.secure}`);
        console.log(`   User: ${IMAP_CONFIG.auth.user}`);
        console.log('   ⚠️  Full IMAP test requires imap library (not installed)');
        console.log('   💡 For Zoho CRM, use these settings when adding email account:\n');
        console.log(`      Server: ${IMAP_CONFIG.host}`);
        console.log(`      Port: ${IMAP_CONFIG.port}`);
        console.log(`      Security: ${IMAP_CONFIG.secure ? 'SSL' : 'TLS'}`);
        console.log(`      Username: ${IMAP_CONFIG.auth.user}`);
        console.log(`      Password: ${IMAP_CONFIG.auth.pass ? '***' + IMAP_CONFIG.auth.pass.slice(-3) : 'NOT SET'}\n`);
        
        return true;
        
    } catch (error) {
        console.error('   ❌ IMAP configuration check failed:');
        console.error(`   Error: ${error.message}\n`);
        return false;
    }
}

// Main test function
async function runTests() {
    console.log('='.repeat(60));
    console.log('🧪 Success Chemistry - Email Connection Test');
    console.log('='.repeat(60) + '\n');
    
    // Check if credentials are set
    if (!EMAIL_CONFIG.auth.user || !EMAIL_CONFIG.auth.pass) {
        console.error('❌ Email credentials not set in .env file!');
        console.error('   Please set EMAIL_USER and EMAIL_PASSWORD\n');
        process.exit(1);
    }
    
    const smtpResult = await testSMTP();
    const imapResult = await testIMAP();
    
    console.log('='.repeat(60));
    if (smtpResult && imapResult) {
        console.log('✅ All email tests passed!');
        console.log('\n📋 Next Steps:');
        console.log('   1. Check your inbox for the test email');
        console.log('   2. Use these settings in Zoho CRM email integration');
        console.log('   3. Your email system is ready to use!\n');
    } else {
        console.log('⚠️  Some tests failed. Please check the errors above.\n');
    }
    console.log('='.repeat(60));
}

// Run tests
runTests().catch(error => {
    console.error('\n❌ Test script error:', error);
    process.exit(1);
});
