/**
 * Telegram Bot Notification Service
 * 
 * Sends notifications to Telegram chat using bot API
 * 
 * Usage:
 *   import { sendTelegramMessage, sendTelegramAlert } from './telegram-notifier.js';
 *   
 *   // Send simple message
 *   await sendTelegramMessage('Hello from Success Chemistry!');
 *   
 *   // Send formatted alert
 *   await sendTelegramAlert('High Priority', 'Subscription drop detected: -15%');
 */

import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Initialize bot (polling disabled since we only send messages)
let bot = null;

/**
 * Initialize Telegram bot
 */
function initializeBot() {
    if (!BOT_TOKEN) {
        console.warn('⚠️  TELEGRAM_BOT_TOKEN not set in environment variables');
        return null;
    }
    
    if (!bot) {
        bot = new TelegramBot(BOT_TOKEN, { polling: false });
    }
    
    return bot;
}

/**
 * Send a simple text message to Telegram
 * @param {string} message - Message to send
 * @param {object} options - Optional formatting options
 * @returns {Promise<object>} Telegram API response
 */
export async function sendTelegramMessage(message, options = {}) {
    if (!BOT_TOKEN || !CHAT_ID) {
        console.warn('⚠️  Telegram credentials not configured. Message:', message);
        return { success: false, error: 'Telegram not configured' };
    }

    try {
        const telegramBot = initializeBot();
        if (!telegramBot) {
            return { success: false, error: 'Bot initialization failed' };
        }

        const formattedMessage = options.format === 'markdown' 
            ? message 
            : message.replace(/\*/g, '\\*').replace(/_/g, '\\_').replace(/\[/g, '\\[').replace(/\]/g, '\\]');

        const result = await telegramBot.sendMessage(CHAT_ID, formattedMessage, {
            parse_mode: options.format || 'HTML',
            disable_web_page_preview: options.disablePreview !== false,
            ...options
        });

        console.log('✅ Telegram message sent successfully');
        return { success: true, messageId: result.message_id };
    } catch (error) {
        console.error('❌ Error sending Telegram message:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Send a formatted alert message (for Fleet Manager alerts, errors, etc.)
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {string} level - Alert level: 'info', 'warning', 'error', 'success'
 * @returns {Promise<object>} Telegram API response
 */
export async function sendTelegramAlert(title, message, level = 'info') {
    const emoji = {
        info: 'ℹ️',
        warning: '⚠️',
        error: '🚨',
        success: '✅'
    }[level] || 'ℹ️';

    const formattedMessage = `
${emoji} <b>${title}</b>

${message}

<code>Time: ${new Date().toLocaleString()}</code>
    `.trim();

    return await sendTelegramMessage(formattedMessage, { format: 'HTML' });
}

/**
 * Send Fleet Manager alert (for automated alerts)
 * @param {string} alertType - Type of alert (e.g., 'subscription_drop', 'churn_rate', 'roas_low')
 * @param {object} data - Alert data
 * @returns {Promise<object>} Telegram API response
 */
export async function sendFleetManagerAlert(alertType, data) {
    const alertConfig = {
        subscription_drop: {
            title: '📉 Subscription Drop Alert',
            threshold: '10%',
            emoji: '📉'
        },
        churn_rate: {
            title: '⚠️ High Churn Rate Alert',
            threshold: '15%',
            emoji: '⚠️'
        },
        roas_low: {
            title: '📊 Low ROAS Alert',
            threshold: '2.0',
            emoji: '📊'
        },
        aov_drop: {
            title: '💰 AOV Drop Alert',
            threshold: '8%',
            emoji: '💰'
        }
    };

    const config = alertConfig[alertType] || {
        title: '🔔 Fleet Manager Alert',
        threshold: 'N/A',
        emoji: '🔔'
    };

    const message = `
${config.emoji} <b>${config.title}</b>

<b>Type:</b> ${alertType}
<b>Threshold:</b> ${config.threshold}
<b>Current Value:</b> ${data.currentValue || 'N/A'}
${data.message ? `\n<b>Details:</b> ${data.message}` : ''}

<code>Time: ${new Date().toLocaleString()}</code>
    `.trim();

    return await sendTelegramMessage(message, { format: 'HTML' });
}

/**
 * Send order notification
 * @param {object} orderData - Order information
 * @returns {Promise<object>} Telegram API response
 */
export async function sendOrderNotification(orderData) {
    const message = `
🛒 <b>New Order Received!</b>

<b>Order #:</b> ${orderData.orderNumber || 'N/A'}
<b>Customer:</b> ${orderData.customerName || 'N/A'}
<b>Email:</b> ${orderData.customerEmail || 'N/A'}
<b>Total:</b> $${orderData.total?.toFixed(2) || '0.00'}
<b>Items:</b> ${orderData.itemCount || 0}

<code>Time: ${new Date().toLocaleString()}</code>
    `.trim();

    return await sendTelegramMessage(message, { format: 'HTML' });
}

/**
 * Send daily/weekly report summary
 * @param {object} reportData - Report data
 * @returns {Promise<object>} Telegram API response
 */
export async function sendReportSummary(reportData) {
    const message = `
📊 <b>${reportData.type || 'Daily'} Report Summary</b>

${reportData.metrics ? Object.entries(reportData.metrics).map(([key, value]) => 
    `<b>${key}:</b> ${value}`
).join('\n') : 'No metrics available'}

${reportData.summary ? `\n<b>Summary:</b>\n${reportData.summary}` : ''}

<code>Generated: ${new Date().toLocaleString()}</code>
    `.trim();

    return await sendTelegramMessage(message, { format: 'HTML' });
}

/**
 * Test Telegram connection
 * @returns {Promise<object>} Test result
 */
export async function testTelegramConnection() {
    if (!BOT_TOKEN || !CHAT_ID) {
        return {
            success: false,
            error: 'Telegram credentials not configured',
            message: 'Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in your .env file'
        };
    }

    try {
        const result = await sendTelegramMessage('🧪 Test message from Success Chemistry bot!');
        return {
            success: result.success,
            message: result.success 
                ? 'Telegram connection successful!' 
                : `Connection failed: ${result.error}`
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            message: `Connection test failed: ${error.message}`
        };
    }
}

// Export default for convenience
export default {
    sendMessage: sendTelegramMessage,
    sendAlert: sendTelegramAlert,
    sendFleetManagerAlert,
    sendOrderNotification,
    sendReportSummary,
    testConnection: testTelegramConnection
};
