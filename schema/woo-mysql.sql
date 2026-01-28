-- WooCommerce API config & orders cache for Admin
-- Run once: mysql -u youruser -p yourdatabase < schema/woo-mysql.sql

-- Store WooCommerce API credentials (editable in admin)
CREATE TABLE IF NOT EXISTS woo_api_config (
  id INT PRIMARY KEY DEFAULT 1,
  site_url VARCHAR(512) NOT NULL DEFAULT '',
  consumer_key VARCHAR(256) NOT NULL DEFAULT '',
  consumer_secret VARCHAR(256) NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Optional: insert default row so admin can edit
INSERT INTO woo_api_config (id, site_url, consumer_key, consumer_secret)
VALUES (1, '', '', '')
ON DUPLICATE KEY UPDATE id = id;

-- Cache of WooCommerce orders (so you can "see" them in admin)
CREATE TABLE IF NOT EXISTS woo_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  woo_order_id BIGINT NOT NULL UNIQUE,
  number VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'processing',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency VARCHAR(8) NOT NULL DEFAULT 'USD',
  customer_email VARCHAR(255) NOT NULL DEFAULT '',
  customer_name VARCHAR(255) NOT NULL DEFAULT '',
  line_items_json JSON,
  created_at_woo DATETIME,
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_woo_order_id (woo_order_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at_woo),
  INDEX idx_customer (customer_email)
);
