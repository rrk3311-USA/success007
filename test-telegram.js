/**
 * Test Telegram Bot Connection
 * 
 * Run this script to test your Telegram bot setup:
 *   node test-telegram.js
 */

import { testTelegramConnection, sendTelegramMessage, sendTelegramAlert } from './telegram-notifier.js';

async function runTests() {
    console.log('🧪 Testing Telegram Bot Connection...\n');

    // Test 1: Connection test
    console.log('1️⃣ Testing connection...');
    const connectionTest = await testTelegramConnection();
    console.log(connectionTest.message);
    console.log('');

    if (!connectionTest.success) {
        console.log('❌ Connection failed. Please check:');
        console.log('   - TELEGRAM_BOT_TOKEN is set in .env file');
        console.log('   - TELEGRAM_CHAT_ID is set in .env file');
        console.log('   - Bot token is valid');
        console.log('   - Chat ID is correct');
        process.exit(1);
    }

    // Test 2: Simple message
    console.log('2️⃣ Sending simple message...');
    const messageResult = await sendTelegramMessage('Hello! This is a test message from Success Chemistry bot. 🤖');
    console.log(messageResult.success ? '✅ Message sent!' : `❌ Failed: ${messageResult.error}`);
    console.log('');

    // Wait a bit before next message
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 3: Alert message
    console.log('3️⃣ Sending alert message...');
    const alertResult = await sendTelegramAlert(
        'Test Alert',
        'This is a test alert to verify the notification system is working correctly.',
        'success'
    );
    console.log(alertResult.success ? '✅ Alert sent!' : `❌ Failed: ${alertResult.error}`);
    console.log('');

    console.log('✅ All tests completed!');
    console.log('\n📱 Check your Telegram chat to verify messages were received.');
}

runTests().catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
