# 🤖 Telegram Bot Setup Guide

## Overview

This guide explains how to set up Telegram bot notifications for Success Chemistry. The bot can send alerts, order notifications, Fleet Manager reports, and other important updates.

## Quick Setup

### 1. Get Your Bot Token

You already have your bot token:
```
8544744463:AAF3jCArECnyYzEmIPMbIaw4IVd2x5qg6aI
```

### 2. Get Your Chat ID

You already have your chat ID:
```
6564361705
```

### 3. Configure Environment Variables

Create a `.env` file in the project root (if it doesn't exist) and add:

```env
TELEGRAM_BOT_TOKEN=8544744463:AAF3jCArECnyYzEmIPMbIaw4IVd2x5qg6aI
TELEGRAM_CHAT_ID=6564361705
```

**Important:** The `.env` file is already in `.gitignore`, so your credentials won't be committed to git.

### 4. Test the Connection

Run the test script:

```bash
node test-telegram.js
```

You should receive test messages in your Telegram chat.

## Usage Examples

### Basic Message

```javascript
import { sendTelegramMessage } from './telegram-notifier.js';

await sendTelegramMessage('Hello from Success Chemistry!');
```

### Alert Message

```javascript
import { sendTelegramAlert } from './telegram-notifier.js';

await sendTelegramAlert(
    'High Priority',
    'Subscription drop detected: -15%',
    'warning' // 'info', 'warning', 'error', or 'success'
);
```

### Fleet Manager Alert

```javascript
import { sendFleetManagerAlert } from './telegram-notifier.js';

await sendFleetManagerAlert('subscription_drop', {
    currentValue: '-12%',
    message: 'Subscription rate dropped below threshold'
});
```

### Order Notification

```javascript
import { sendOrderNotification } from './telegram-notifier.js';

await sendOrderNotification({
    orderNumber: 'ORD-12345',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    total: 99.99,
    itemCount: 3
});
```

### Daily Report

```javascript
import { sendReportSummary } from './telegram-notifier.js';

await sendReportSummary({
    type: 'Daily',
    metrics: {
        'MRR': '$5,234',
        'AOV': '$89.50',
        'Orders': '42',
        'Churn Rate': '2.1%'
    },
    summary: 'Strong performance today with 15% increase in orders.'
});
```

## Integration with Fleet Manager

To integrate Telegram notifications with your Fleet Manager alerts, you can add notification calls in your Fleet Manager code:

```javascript
import { sendFleetManagerAlert } from './telegram-notifier.js';

// Example: In your Fleet Manager alert handler
if (subscriptionDrop > 10) {
    await sendFleetManagerAlert('subscription_drop', {
        currentValue: `${subscriptionDrop}%`,
        message: `Subscription rate dropped by ${subscriptionDrop}%`
    });
}
```

## Available Functions

- `sendTelegramMessage(message, options)` - Send a simple text message
- `sendTelegramAlert(title, message, level)` - Send a formatted alert
- `sendFleetManagerAlert(alertType, data)` - Send Fleet Manager-specific alerts
- `sendOrderNotification(orderData)` - Send order notifications
- `sendReportSummary(reportData)` - Send daily/weekly reports
- `testTelegramConnection()` - Test the bot connection

## Alert Types for Fleet Manager

- `subscription_drop` - When subscription rate drops > 10%
- `churn_rate` - When churn rate exceeds 15%
- `roas_low` - When ROAS drops below 2.0
- `aov_drop` - When AOV drops > 8%

## Troubleshooting

### Bot not responding?

1. **Check credentials:**
   ```bash
   # Verify .env file exists and has correct values
   cat .env | grep TELEGRAM
   ```

2. **Test connection:**
   ```bash
   node test-telegram.js
   ```

3. **Verify bot token:**
   - Make sure the token is correct (no extra spaces)
   - Token format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

4. **Verify chat ID:**
   - Make sure the chat ID is correct
   - Chat ID should be a number (e.g., `6564361705`)

### Getting "Unauthorized" error?

- Your bot token might be invalid
- Make sure you copied the full token including the colon

### Messages not received?

- Check that you've started a conversation with the bot first
- Send `/start` to your bot in Telegram
- Verify the chat ID is correct

## Security Notes

- ✅ `.env` file is in `.gitignore` - credentials won't be committed
- ✅ Never commit bot tokens or chat IDs to git
- ✅ Use environment variables for all sensitive data
- ✅ Rotate tokens if they're ever exposed

## Next Steps

1. ✅ Set up `.env` file with your credentials
2. ✅ Run `node test-telegram.js` to verify connection
3. ✅ Integrate notifications into your Fleet Manager
4. ✅ Set up automated alerts for key metrics

## Support

If you encounter issues:
1. Check the console output for error messages
2. Verify your credentials are correct
3. Test with `test-telegram.js` script
4. Check Telegram bot API status
