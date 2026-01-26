# 🔌 Headless API Documentation

## Overview

This document describes the headless REST API interface for accessing **Customers**, **Orders**, and **Products** data from Success Chemistry.

## Base URLs

- **Development**: `http://localhost:3001/api`
- **Production**: `https://successchemistry.com/api`

---

## 📦 Products API

### Get All Products
```http
GET /api/products
```

**Response:**
```json
[
  {
    "sku": "52274-401",
    "name": "Women's Balance",
    "price": 29.99,
    "category": "Women's Health",
    "stock": 100000,
    "description": "...",
    "image_url": "/images/products/52274-401/01.png"
  }
]
```

### Get Single Product
```http
GET /api/products/:sku
```

**Example:**
```http
GET /api/products/52274-401
```

### Create Product (Auth Required)
```http
POST /api/products
Content-Type: application/json

{
  "sku": "NEW-001",
  "name": "New Product",
  "price": 19.99,
  "category": "Health"
}
```

### Update Product (Auth Required)
```http
PUT /api/products/:sku
Content-Type: application/json

{
  "price": 24.99,
  "stock": 5000
}
```

### Delete Product (Auth Required)
```http
DELETE /api/products/:sku
```

---

## 🛒 Orders API

### Get All Orders
```http
GET /api/orders
```

**Query Parameters:**
- `limit` - Number of orders to return (default: 100)
- `status` - Filter by status (pending, completed, cancelled)
- `customer_email` - Filter by customer email

**Response:**
```json
[
  {
    "id": "ORD-12345",
    "order_id": "ORD-12345",
    "customer_email": "customer@example.com",
    "customer_name": "John Doe",
    "status": "pending",
    "total_amount": 99.99,
    "payment_method": "paypal",
    "payment_id": "PAY-ABC123",
    "shipping_address": "123 Main St...",
    "created_at": "2024-01-15T10:30:00Z",
    "items": [
      {
        "product_sku": "52274-401",
        "product_name": "Women's Balance",
        "quantity": 2,
        "price": 29.99
      }
    ]
  }
]
```

### Get Single Order
```http
GET /api/orders/:id
```

### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "customer_email": "customer@example.com",
  "customer_name": "John Doe",
  "items": [
    {
      "product_sku": "52274-401",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "total_amount": 59.98,
  "payment_method": "paypal",
  "payment_id": "PAY-ABC123",
  "shipping_address": "123 Main St, City, State 12345"
}
```

### Update Order Status
```http
PUT /api/orders/:id
Content-Type: application/json

{
  "status": "completed"
}
```

### Order Statistics
```http
GET /api/orders/stats/summary
```

**Response:**
```json
{
  "total_orders": 150,
  "total_revenue": 14998.50,
  "pending_orders": 5,
  "completed_orders": 140,
  "average_order_value": 99.99
}
```

---

## 👥 Customers/Users API

### Get All Users
```http
GET /api/users
```

**Response:**
```json
[
  {
    "id": 1,
    "email": "customer@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "created_at": "2024-01-01T00:00:00Z",
    "total_orders": 5,
    "total_spent": 299.95
  }
]
```

### Get Single User
```http
GET /api/users/:id
```

---

## 🔐 Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com"
  }
}
```

### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer {token}
```

---

## 📊 Analytics API

### Dashboard Overview
```http
GET /api/analytics/overview
```

### Sales Chart Data
```http
GET /api/analytics/sales-chart
```

### Category Analytics
```http
GET /api/analytics/categories
```

---

## 🗄️ Database Schema

### Products Table
```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    stock INTEGER DEFAULT 100000,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id VARCHAR(100) UNIQUE NOT NULL,
    customer_email VARCHAR(255),
    customer_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id VARCHAR(100),
    product_sku VARCHAR(50),
    product_name VARCHAR(255),
    quantity INTEGER,
    price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
```

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Quick Access

### View API in Browser
Open: `http://localhost:8080/api-viewer.html`

### Test with cURL

**Get Products:**
```bash
curl http://localhost:3001/api/products
```

**Get Orders:**
```bash
curl http://localhost:3001/api/orders
```

**Get Users:**
```bash
curl http://localhost:3001/api/users
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Prices are in USD
- Authentication required for write operations (POST, PUT, DELETE)
- API rate limiting may apply in production
- Products data is also available locally in `/products-data.js`

---

## 🔗 Related Files

- **API Viewer**: `/deploy-site/api-viewer.html`
- **Products Data**: `/deploy-site/products-data.js`
- **Local Server**: `/local-server.js`
