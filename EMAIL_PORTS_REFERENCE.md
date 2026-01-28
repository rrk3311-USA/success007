# 📧 Namecheap Email Server Ports - Quick Reference

## ✅ **Incoming Server (IMAP) - For Receiving Emails**

**Server:** `mail.privateemail.com`  
**Port:** `993`  
**Security:** SSL/TLS  
**Protocol:** IMAP

**Alternative (if 993 doesn't work):**
- Port: `143` (with TLS/STARTTLS)
- Security: TLS/STARTTLS

---

## ✅ **Outgoing Server (SMTP) - For Sending Emails**

**Server:** `mail.privateemail.com`  
**Port:** `465` (SSL) or `587` (TLS/STARTTLS)  
**Security:** SSL/TLS  
**Protocol:** SMTP

**Recommended:** Port `465` with SSL (what we tested successfully)

**Alternative:** Port `587` with TLS/STARTTLS (if 465 doesn't work)

---

## 📋 Complete Settings Summary

### **For Email Clients (Apple Mail, Outlook, etc.)**

**Incoming (IMAP):**
- Server: `mail.privateemail.com`
- Port: `993`
- Security: SSL
- Username: `info@successchemistry.com`
- Password: `Alphajet1986!`

**Outgoing (SMTP):**
- Server: `mail.privateemail.com`
- Port: `465` ✅ (Recommended - SSL)
- Security: SSL
- Username: `info@successchemistry.com`
- Password: `Alphajet1986!`
- Authentication: Required

---

### **For Zoho CRM Email Integration**

**Incoming (IMAP):**
- Server: `mail.privateemail.com`
- Port: `993`
- Security: SSL/TLS
- Username: `info@successchemistry.com`
- Password: `Alphajet1986!`

**Outgoing (SMTP):**
- Server: `mail.privateemail.com`
- Port: `465` (SSL) or `587` (TLS)
- Security: SSL/TLS
- Username: `info@successchemistry.com`
- Password: `Alphajet1986!`

---

## 🔍 Port Reference Table

| Service | Protocol | Port | Security | Use Case |
|---------|----------|------|----------|----------|
| **Incoming** | IMAP | 993 | SSL | Receive emails (recommended) |
| **Incoming** | IMAP | 143 | TLS/STARTTLS | Receive emails (alternative) |
| **Incoming** | POP3 | 995 | SSL | Download emails (not recommended) |
| **Outgoing** | SMTP | 465 | SSL | Send emails (recommended) ✅ |
| **Outgoing** | SMTP | 587 | TLS/STARTTLS | Send emails (alternative) |

---

## ✅ What We Tested Successfully

- **SMTP Port 465** ✅ - Working perfectly!
- **IMAP Port 993** - Ready for Zoho CRM

---

## 💡 Quick Answer

**Incoming Server (IMAP):**
- Port: **993** ✅

**Outgoing Server (SMTP):**
- Port: **465** ✅ (Recommended)
- Port: **587** (Alternative if 465 doesn't work)

---

**Last Updated:** January 27, 2026
