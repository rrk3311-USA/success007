# WooCommerce API – MySQL schema

Simple MySQL tables so you can **edit WooCommerce API settings in Admin** and **see WooCommerce orders** in the dashboard.

## 1. Create the tables

Use your MySQL user and database name:

```bash
mysql -u YOUR_USER -p YOUR_DATABASE < schema/woo-mysql.sql
```

Or in MySQL client:

```sql
SOURCE /path/to/success007/schema/woo-mysql.sql;
```

## 2. Configure the admin API server

Set **one** of these:

**Option A – connection URL**

```env
DATABASE_URL=mysql://user:password@host:3306/database_name
```

**Option B – separate vars**

```env
MYSQL_HOST=localhost
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database
```

Put these in `.env` in the project root (same folder as `admin-api-server.js`).

## 3. Run the admin server

```bash
npm run admin
```

Then open Admin → **WOO ORDERS**:

- Edit **Site URL**, **Consumer Key**, **Consumer Secret** and click **Save API config** (stored in MySQL).
- Click **Fetch orders from WooCommerce** to pull orders from WooCommerce and save them into MySQL.
- The table shows all WooCommerce orders stored in the database.

## Tables

| Table           | Purpose |
|----------------|--------|
| `woo_api_config` | Single row: WooCommerce site URL, consumer key, consumer secret (editable in admin). |
| `woo_orders`    | Cached WooCommerce orders (number, customer, date, total, status, line items). |

Without MySQL, the admin server still runs; WooCommerce config is kept in memory and orders are not persisted.
