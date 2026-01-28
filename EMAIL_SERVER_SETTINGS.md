# 📧 Email Server Settings for Success Chemistry

## Your Email Addresses
- **info@successchemistry.com**
- **support@successchemistry.com**
- **admin@successchemistry.com**

---

## Namecheap Email Settings

Since you're using Namecheap email hosting, here are the email server settings:

### **IMAP Settings (Recommended - Keeps emails on server)**

**Incoming Mail Server (IMAP):**
- **Server:** `mail.privateemail.com`
- **Port:** 993 (SSL) or 143 (TLS/STARTTLS)
- **Security:** SSL/TLS
- **Username:** Your full email address (e.g., `info@successchemistry.com`)
- **Password:** Your email account password

**Outgoing Mail Server (SMTP):**
- **Server:** `mail.privateemail.com`
- **Port:** 465 (SSL) or 587 (TLS/STARTTLS)
- **Security:** SSL/TLS
- **Username:** Your full email address (e.g., `info@successchemistry.com`)
- **Password:** Your email account password
- **Authentication:** Required
- **SPA (Secure Password Authentication):** OFF

---

### **POP Settings (Downloads emails to device)**

**Incoming Mail Server (POP3):**
- **Server:** `mail.privateemail.com`
- **Port:** 995
- **Security:** SSL
- **Username:** Your full email address (e.g., `info@successchemistry.com`)
- **Password:** Your email account password

**Outgoing Mail Server (SMTP):**
- **Server:** `mail.privateemail.com`
- **Port:** 465 (SSL) or 587 (TLS/STARTTLS)
- **Security:** SSL/TLS
- **Username:** Your full email address (e.g., `info@successchemistry.com`)
- **Password:** Your email account password
- **Authentication:** Required

---

## How to Find Your Exact Settings

### Option 1: Namecheap Private Email
1. Log in to **Namecheap Account**
2. Go to **Domain List** → Select your domain
3. Click **Manage** → **Private Email**
4. Click on your email account
5. Look for **"Email Client Configuration"** or **"Mail Settings"**
6. You'll see IMAP/POP settings there

### Option 2: Namecheap cPanel (if using Shared Hosting)
1. Log in to **Namecheap cPanel**
2. Go to **Email Accounts**
3. Click on your email account
4. Look for **"Configure Email Client"** or **"Manual Setup"**
5. Select your email client (Outlook, Apple Mail, Thunderbird, etc.)
6. Settings will be displayed

**Note:** If using cPanel hosting, your server name may be different (check your welcome email)

---

## Quick Setup for Common Email Clients

### **Apple Mail (macOS)**
1. Open Mail app
2. Mail → Add Account
3. Choose "Other Mail Account"
4. Enter:
   - **Name:** Success Chemistry
   - **Email:** info@successchemistry.com
   - **Password:** Your email password
5. Click "Sign In"
6. Mail will auto-detect settings, or manually enter:
   - **Incoming:** mail.privateemail.com (port 993, SSL)
   - **Outgoing:** mail.privateemail.com (port 465, SSL)

### **Outlook (Windows/Mac)**
1. File → Add Account
2. Enter email and password
3. Choose "Manual setup"
4. Select "POP or IMAP"
5. Enter settings:
   - **Incoming:** mail.privateemail.com (port 993, SSL)
   - **Outgoing:** mail.privateemail.com (port 465, SSL)

### **Gmail (Import to Gmail)**
1. Gmail → Settings → Accounts and Import
2. "Add a mail account"
3. Enter: info@successchemistry.com
4. Choose "Import emails from my other account (POP3)"
5. Enter:
   - **POP Server:** mail.privateemail.com
   - **Port:** 995
   - **Username:** info@successchemistry.com
   - **Password:** Your email password

---

## For Sending Emails from Your App (SMTP)

Add these to your `.env` file:

```env
# ============================================
# Email Server Settings (SMTP) - Namecheap
# ============================================
EMAIL_HOST=mail.privateemail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=info@successchemistry.com
EMAIL_PASSWORD=your_email_password_here
EMAIL_FROM="Success Chemistry" <info@successchemistry.com>
EMAIL_REPLY_TO=support@successchemistry.com
```

**Or for TLS (port 587):**
```env
EMAIL_HOST=mail.privateemail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=info@successchemistry.com
EMAIL_PASSWORD=your_email_password_here
```

---

## IMAP vs POP - Which to Use?

### **IMAP (Recommended)**
✅ Keeps emails on server  
✅ Syncs across all devices  
✅ Access from webmail and clients  
✅ Better for multiple devices  
✅ Uses more server storage  

### **POP**
✅ Downloads emails to device  
✅ Works offline  
✅ Saves server storage  
❌ Only on one device  
❌ Can lose emails if device fails  

**Recommendation:** Use **IMAP** for business email accounts.

---

## Troubleshooting

### Can't Connect?
1. **Check password** - Make sure it's correct
2. **Check security settings** - Must use SSL/TLS
3. **Check firewall** - Ports 993, 995, 465, 587 must be open
4. **Check username** - Must be full email address (info@successchemistry.com)

### Emails Not Sending?
1. **SMTP authentication** - Must be enabled
2. **Port 587** - Try port 587 with TLS instead of 465
3. **Check spam** - Some providers block port 25

### Need Help?
- **Namecheap Support:** https://www.namecheap.com/support/
- **Email:** support@namecheap.com
- **Live Chat:** Available in Namecheap account
- **Knowledge Base:** https://www.namecheap.com/support/knowledgebase/

---

## Security Notes

⚠️ **Never commit email passwords to Git!**

✅ Store in `.env` file (already in `.gitignore`)  
✅ Use app-specific passwords if available  
✅ Enable 2FA on email account  
✅ Regularly update passwords  

---

## Next Steps

1. **Get your email password** from Namecheap account
2. **Add SMTP settings to `.env`** (see above)
3. **Test email sending** with a test script
4. **Configure email client** (Apple Mail, Outlook, etc.)

---

## Quick Test Script

Create `test-email.js`:

```javascript
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function testEmail() {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: 'your-test-email@gmail.com',
            subject: 'Test Email from Success Chemistry',
            text: 'This is a test email!'
        });
        console.log('✅ Email sent:', info.messageId);
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testEmail();
```

Run: `node test-email.js`

---

**Last Updated:** January 27, 2026
