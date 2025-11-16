# Database Schema Documentation

Database: `resolutepos_db`
Engine: MySQL 8.0+
Charset: utf8mb4
Collation: utf8mb4_0900_ai_ci

---

## Table of Contents
1. [Categories](#categories)
2. [Customers](#customers)
3. [Invoices](#invoices)
4. [Menu Items](#menu-items)
5. [Menu Item Addons](#menu-item-addons)
6. [Menu Item Variants](#menu-item-variants)
7. [Orders](#orders)
8. [Order Items](#order-items)
9. [Payment Types](#payment-types)
10. [Print Settings](#print-settings)
11. [Refresh Tokens](#refresh-tokens)
12. [Reservations](#reservations)
13. [Store Details](#store-details)
14. [Store Tables](#store-tables)
15. [Taxes](#taxes)
16. [Token Sequences](#token-sequences)
17. [Users](#users)
18. [Database Relationships](#database-relationships)

---

## Categories

Stores menu item categories (e.g., Dinner, Lunch, Fastfood).

**Table:** `categories`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique category identifier |
| `title` | VARCHAR(100) | NULL | Category name |

**Default Data:**
- Full Dish
- Dinner
- Lunch
- Fastfood
- Extras

**Indexes:**
- PRIMARY KEY on `id`

---

## Customers

Stores customer information with phone as primary identifier.

**Table:** `customers`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `phone` | VARCHAR(20) | PRIMARY KEY, NOT NULL | Customer phone number (unique identifier) |
| `name` | VARCHAR(255) | NOT NULL | Customer name |
| `email` | VARCHAR(255) | NULL | Customer email address |
| `birth_date` | DATE | NULL | Customer date of birth |
| `gender` | ENUM('male','female','other') | NULL | Customer gender |
| `is_member` | TINYINT(1) | DEFAULT 0 | Membership status (0=no, 1=yes) |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `update_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- PRIMARY KEY on `phone`

**Notes:**
- Phone number serves as the unique customer identifier
- Used for reservations, orders, and customer tracking
- Membership status can be used for loyalty programs

---

## Invoices

Stores invoice summary information for completed orders.

**Table:** `invoices`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique invoice identifier |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Invoice creation timestamp |
| `sub_total` | DECIMAL(10,2) | NULL | Subtotal before taxes |
| `tax_total` | DECIMAL(10,2) | NULL | Total tax amount |
| `total` | DECIMAL(10,2) | NULL | Grand total (subtotal + tax) |

**Indexes:**
- PRIMARY KEY on `id`

**Relationships:**
- Referenced by `orders.invoice_id`
- Related to transactions via `invoice_id`

**Notes:**
- Created when an order is paid/completed
- Auto-increments to generate unique invoice numbers
- Stores financial totals for reporting

---

## Menu Items

Stores the restaurant menu items with pricing and categorization.

**Table:** `menu_items`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique menu item identifier |
| `title` | VARCHAR(255) | NULL | Item name |
| `price` | DECIMAL(10,2) | NULL | Base/display price |
| `net_price` | DECIMAL(10,2) | NULL | Net price (price excluding tax if applicable) |
| `tax_id` | INT | NULL | Reference to tax configuration |
| `image` | VARCHAR(2000) | NULL | URL or path to item image |
| `category` | INT | NULL | Category ID (links to categories table) |

**Indexes:**
- PRIMARY KEY on `id`

**Relationships:**
- `tax_id` references `taxes.id` (not enforced as FK)
- `category` references `categories.id` (not enforced as FK)
- Parent table for `menu_item_addons` and `menu_item_variants`

**Notes:**
- Items can have multiple variants (sizes) and addons (extras)
- `net_price` used for tax calculations (price before tax)
- No image storage limit specified, adjust based on needs

**Example Data:**
```sql
Pizza - $10.00 (GST 5%, inclusive)
Bhel (Jain) - $2.79 (net: $1.59, GST 5%, exclusive)
Vada Sambhar - $10.00 (net: $4.00, GST 15%, exclusive)
```

---

## Menu Item Addons

Stores add-ons/extras for menu items (e.g., Extra Cheese, Green Chutney).

**Table:** `menu_item_addons`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY (with item_id), AUTO_INCREMENT | Unique addon identifier |
| `item_id` | INT | PRIMARY KEY (with id), NOT NULL | Menu item this addon belongs to |
| `title` | VARCHAR(255) | NOT NULL | Addon name |
| `price` | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 | Additional price for addon |

**Indexes:**
- PRIMARY KEY on (`id`, `item_id`)
- INDEX on `item_id`

**Foreign Keys:**
- `item_id` REFERENCES `menu_items(id)` ON DELETE CASCADE ON UPDATE CASCADE

**Notes:**
- Multiple addons can be added to a single menu item
- Cascades delete when parent menu item is deleted
- Addon prices are added to base item price

**Example Data:**
```sql
Pizza → Extra Cheese ($4.00)
Pizza → Extra Toppings ($2.50)
Bhel → Green Chutney ($0.50)
```

---

## Menu Item Variants

Stores size/variant options for menu items (e.g., Small, Medium, Large).

**Table:** `menu_item_variants`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY (with item_id), AUTO_INCREMENT | Unique variant identifier |
| `item_id` | INT | PRIMARY KEY (with id), NOT NULL | Menu item this variant belongs to |
| `title` | VARCHAR(255) | NOT NULL | Variant name (e.g., Small, Medium, Large) |
| `price` | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 | Price for this variant |

**Indexes:**
- PRIMARY KEY on (`id`, `item_id`)
- INDEX on `item_id`

**Foreign Keys:**
- `item_id` REFERENCES `menu_items(id)` ON DELETE CASCADE ON UPDATE CASCADE

**Notes:**
- Represents different sizes or variations of the same item
- Cascades delete when parent menu item is deleted
- Each variant has its own price (not an add-on to base price)

**Example Data:**
```sql
Pizza → Small ($5.00)
Pizza → Medium ($8.50)
Pizza → Large ($9.99)

Bhel → Medium ($0.25)
Bhel → Large ($0.50)
```

---

## Orders

Stores customer orders with status tracking and payment information.

**Table:** `orders`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique order identifier |
| `date` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Order creation timestamp |
| `delivery_type` | VARCHAR(90) | NULL | Delivery method (dine-in, takeout, delivery) |
| `customer_type` | ENUM('WALKIN','CUSTOMER') | DEFAULT 'WALKIN' | Walk-in customer or registered customer |
| `customer_id` | VARCHAR(20) | NULL | Customer phone number (references customers) |
| `table_id` | INT | NULL | Table assignment (references store_tables) |
| `status` | ENUM('created','completed','cancelled') | DEFAULT 'created' | Order status |
| `token_no` | INT | NULL | Token/ticket number for kitchen |
| `payment_status` | ENUM('pending','paid') | DEFAULT 'pending' | Payment status |
| `invoice_id` | INT | NULL | Associated invoice ID (when paid) |

**Indexes:**
- PRIMARY KEY on `id`

**Relationships:**
- `customer_id` references `customers.phone` (not enforced)
- `table_id` references `store_tables.id` (not enforced)
- `invoice_id` references `invoices.id` (not enforced)
- Parent table for `order_items`

**Status Flow:**
```
created → completed (normal flow)
created → cancelled (cancelled order)
```

**Payment Flow:**
```
pending → paid (when invoice is created)
```

**Notes:**
- Token number used for kitchen display and customer notification
- Can have orders without specific customer (walk-in)
- Invoice created when order is paid

---

## Order Items

Stores individual items within an order with kitchen status tracking.

**Table:** `order_items`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique order item identifier |
| `order_id` | INT | NULL | Parent order ID |
| `item_id` | INT | NULL | Menu item ID |
| `variant_id` | INT | NULL | Selected variant (size) ID |
| `price` | DECIMAL(10,2) | NULL | Price at time of order |
| `quantity` | INT | NULL | Quantity ordered |
| `status` | ENUM('created','preparing','completed','cancelled','delivered') | DEFAULT 'created' | Item preparation status |
| `date` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Item creation timestamp |
| `notes` | VARCHAR(255) | NULL | Special instructions |
| `addons` | MEDIUMTEXT | NULL | Selected addons (JSON or comma-separated) |

**Indexes:**
- PRIMARY KEY on `id`

**Relationships:**
- `order_id` references `orders.id` (not enforced)
- `item_id` references `menu_items.id` (not enforced)
- `variant_id` references `menu_item_variants.id` (not enforced)

**Status Flow (Kitchen):**
```
created → preparing → completed → delivered
         ↓
      cancelled
```

**Notes:**
- Price stored at order time (historical pricing)
- Addons stored as text (likely JSON array)
- Each item tracked independently for kitchen operations
- Real-time status updates via Socket.IO

---

## Payment Types

Stores available payment methods (Cash, Card, UPI, etc.).

**Table:** `payment_types`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique payment type identifier |
| `title` | VARCHAR(255) | NULL | Payment method name |
| `is_active` | TINYINT(1) | NULL | Whether payment method is enabled |

**Indexes:**
- PRIMARY KEY on `id`

**Default Data:**
```sql
Cash (active)
Credit / Debit Card (active)
UPI (active)
Wire Transfer (inactive)
```

**Notes:**
- Can be toggled active/inactive without deletion
- Used in transactions and POS operations
- Filterable by active status in frontend

---

## Print Settings

Stores receipt/invoice printing configuration (single row table).

**Table:** `print_settings`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Settings ID (always 1) |
| `page_format` | VARCHAR(5) | NULL | Paper width in mm (e.g., "80") |
| `header` | VARCHAR(2000) | NULL | Receipt header text |
| `footer` | VARCHAR(2000) | NULL | Receipt footer text |
| `show_notes` | TINYINT(1) | NULL | Display order notes on receipt |
| `is_enable_print` | TINYINT(1) | NULL | Enable/disable printing |
| `show_store_details` | TINYINT(1) | NULL | Display store info on receipt |
| `show_customer_details` | TINYINT(1) | NULL | Display customer info on receipt |
| `print_token` | TINYINT(1) | NULL | Auto-print kitchen tokens |

**Indexes:**
- PRIMARY KEY on `id`

**Default Configuration:**
```
Format: 80mm
Header: Star A Hotels\n7, Times Square, NY.
Footer: Thanks for Ordering!\nVisit Again!
All boolean options: enabled (1)
```

**Notes:**
- Single-row configuration table (ID always 1)
- Controls receipt printing behavior
- Header/footer support multiline text with \n

---

## Refresh Tokens

Stores refresh tokens for user authentication and device management.

**Table:** `refresh_tokens`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `username` | VARCHAR(40) | PRIMARY KEY (with others), NOT NULL | User's username |
| `refresh_token` | VARCHAR(500) | PRIMARY KEY (with others), NOT NULL | JWT refresh token |
| `device_ip` | VARCHAR(50) | NULL | Device IP address |
| `device_name` | VARCHAR(255) | NULL | Device type and browser |
| `device_location` | VARCHAR(255) | NULL | Device location (if available) |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Token creation time |
| `expiry` | DATETIME | NULL | Token expiration time (30 days default) |
| `device_id` | INT | PRIMARY KEY (with others), AUTO_INCREMENT | Unique device identifier |

**Indexes:**
- PRIMARY KEY on (`device_id`, `username`, `refresh_token`)

**Relationships:**
- `username` references `users.username` (not enforced)

**Notes:**
- Allows users to be logged in on multiple devices
- Device identification helps with security and device management
- Tokens expire after 30 days (configurable via env)
- Used for "get devices" and "remove device" functionality

**Example Device Names:**
```
Apple Mac\nBrowser: Chrome
iPhone\nBrowser: Safari
unknown\nBrowser: PostmanRuntime
```

---

## Reservations

Stores table reservations with customer and timing information.

**Table:** `reservations`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique reservation identifier |
| `customer_id` | VARCHAR(20) | NULL | Customer phone number |
| `date` | DATETIME | NULL, INDEXED | Reservation date and time |
| `table_id` | INT | NULL | Reserved table ID |
| `status` | VARCHAR(100) | NULL | Reservation status (pending, confirmed, cancelled, etc.) |
| `notes` | VARCHAR(500) | NULL | Special requests or notes |
| `people_count` | INT | NULL | Number of guests |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |
| `unique_code` | VARCHAR(20) | UNIQUE, NULL | Unique reservation code/slug |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `unique_code`
- INDEX on `date`
- INDEX on `customer_id`

**Relationships:**
- `customer_id` references `customers.phone` (not enforced)
- `table_id` references `store_tables.id` (not enforced)

**Notes:**
- Unique code can be used for reservation lookup
- Indexed by date for efficient date-range queries
- Status values not enforced by enum (flexible status system)
- People count helps with capacity planning

---

## Store Details

Stores restaurant/store information (single row configuration).

**Table:** `store_details`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Settings ID (always 1) |
| `store_name` | VARCHAR(255) | NULL | Restaurant name |
| `address` | VARCHAR(255) | NULL | Store address |
| `phone` | VARCHAR(20) | NULL | Store contact number |
| `email` | VARCHAR(255) | NULL | Store email address |
| `currency` | VARCHAR(10) | NULL | Currency code (USD, EUR, INR, etc.) |
| `image` | VARCHAR(2000) | NULL | Store logo URL/path |

**Indexes:**
- PRIMARY KEY on `id`

**Default Data:**
```
Store: Star A1 Hotels
Address: Times Square, NY
Phone: 9876543210
Email: a1restro@mail.com
Currency: USD
```

**Notes:**
- Single-row configuration table (ID always 1)
- Used for receipts, invoices, and branding
- Currency affects price display formatting

---

## Store Tables

Stores physical table information for restaurant seating.

**Table:** `store_tables`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique table identifier |
| `table_title` | VARCHAR(100) | NULL | Table name/number |
| `floor` | VARCHAR(50) | NULL | Floor location |
| `seating_capacity` | SMALLINT | NULL | Maximum number of seats |

**Indexes:**
- PRIMARY KEY on `id`

**Relationships:**
- Referenced by `orders.table_id`
- Referenced by `reservations.table_id`

**Example Data:**
```sql
Table 1 (1st Floor, 4 seats)
Table 2 (1st Floor, 2 seats)
Special Twin Table (-, 0 seats)
Twin Star (3rd Floor, 12 seats)
```

**Notes:**
- Used for dine-in orders and reservations
- Floor can be any text (1st Floor, 3rd Floor, -)
- Capacity 0 may indicate special/variable seating
- No status field (availability managed via orders/reservations)

---

## Taxes

Stores tax configurations with rates and calculation types.

**Table:** `taxes`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique tax identifier |
| `title` | VARCHAR(50) | NULL | Tax name (e.g., GST 5, VAT 10) |
| `rate` | DOUBLE | NULL | Tax rate as percentage |
| `type` | ENUM('inclusive','exclusive','other') | DEFAULT 'other' | Tax calculation method |

**Indexes:**
- PRIMARY KEY on `id`

**Tax Types:**
- **inclusive**: Tax already included in item price (price = net + tax)
- **exclusive**: Tax added on top of item price (total = price + tax)
- **other**: Custom calculation or no tax

**Example Data:**
```sql
GST 5 (5%, inclusive) - Tax included in displayed price
GST 15 (15%, exclusive) - Tax added at checkout
```

**Calculation Examples:**
```
Inclusive Tax (5%):
  Display Price: $10.00
  Net Price: $9.52
  Tax Amount: $0.48

Exclusive Tax (15%):
  Price: $10.00
  Tax Amount: $1.50
  Total: $11.50
```

**Notes:**
- Referenced by `menu_items.tax_id`
- Multiple tax rates can coexist
- Tax calculation handled in backend services

---

## Token Sequences

Manages auto-incrementing token numbers for kitchen orders (daily reset).

**Table:** `token_sequences`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Sequence ID (always 1) |
| `sequence_no` | INT | NULL | Last used token number |
| `last_updated` | DATE | NULL | Date of last token generation |

**Indexes:**
- PRIMARY KEY on `id`

**Notes:**
- Single-row table (ID always 1)
- Used to generate sequential token numbers for orders
- Resets daily (sequence restarts at 1 each day)
- Token numbers displayed on kitchen tickets
- Backend utility `clear_sequence_tokens.js` handles daily reset

**Usage Pattern:**
```javascript
1. Check if last_updated is today's date
2. If different date, reset sequence_no to 1 and update date
3. Increment sequence_no and assign to new order
4. Return current sequence_no as token number
```

---

## Users

Stores user accounts with authentication and role-based permissions.

**Table:** `users`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `username` | VARCHAR(40) | PRIMARY KEY, NOT NULL | Unique username (login ID) |
| `password` | VARCHAR(150) | NOT NULL | Bcrypt hashed password |
| `name` | VARCHAR(95) | NULL | Full name |
| `role` | ENUM('admin','user') | DEFAULT 'user' | User role |
| `photo` | VARCHAR(2000) | NULL | Profile photo URL/path |
| `designation` | VARCHAR(50) | NULL | Job title |
| `phone` | VARCHAR(20) | NULL | Contact number |
| `email` | VARCHAR(255) | NULL | Email address |
| `scope` | VARCHAR(2000) | NULL | Comma-separated permission scopes |

**Indexes:**
- PRIMARY KEY on `username`

**Roles:**
- **admin**: Full system access (bypasses scope checks)
- **user**: Limited access based on assigned scopes

**Available Scopes (from config):**
```
DASHBOARD - Dashboard access
POS - Point of Sale operations
ORDERS, ORDER_STATUS, ORDER_STATUS_DISPLAY - Order management
KITCHEN, KITCHEN_DISPLAY - Kitchen display system
RESERVATIONS, VIEW_RESERVATIONS, MANAGE_RESERVATIONS - Reservation management
CUSTOMERS, VIEW_CUSTOMERS, MANAGE_CUSTOMERS - Customer management
INVOICES - Invoice access
REPORTS - Reporting functionality
SETTINGS - Settings and configuration
```

**Example Users:**
```sql
admin - Admin User (admin role, all access)
will24 - Master Chef Will (KITCHEN, KITCHEN_DISPLAY)
rina24 - Rina (ORDER_STATUS) - Waitress
nancy20 - Nancy (DASHBOARD, REPORTS, SETTINGS) - Manager
cm1234 - Customer Manager (VIEW_CUSTOMERS, VIEW_RESERVATIONS, MANAGE_RESERVATIONS)
```

**Password Security:**
- Passwords hashed using bcrypt with salt rounds (default: 10)
- Original passwords never stored
- Salt rounds configurable via `PASSWORD_SALT` env variable

**Scope Authorization:**
- Comma-separated string of scope names
- Checked by `authorize()` middleware
- Null scope for users who should have no specific permissions
- Admin role bypasses all scope checks

---

## Database Relationships

### Entity Relationship Overview

```
users
  └─→ refresh_tokens (username)

customers
  ├─→ orders (customer_id → phone)
  └─→ reservations (customer_id → phone)

categories
  └─→ menu_items (category)

taxes
  └─→ menu_items (tax_id)

menu_items
  ├─→ menu_item_addons (item_id) [CASCADE DELETE]
  ├─→ menu_item_variants (item_id) [CASCADE DELETE]
  └─→ order_items (item_id)

menu_item_variants
  └─→ order_items (variant_id)

store_tables
  ├─→ orders (table_id)
  └─→ reservations (table_id)

orders
  ├─→ order_items (order_id)
  └─→ invoices (invoice_id)

payment_types
  └─→ transactions (payment_type_id)

invoices
  └─→ transactions (invoice_id)
```

### Foreign Key Constraints

Only two foreign keys are enforced with CASCADE:

1. **menu_item_addons.item_id** → menu_items.id
   - ON DELETE CASCADE
   - ON UPDATE CASCADE

2. **menu_item_variants.item_id** → menu_items.id
   - ON DELETE CASCADE
   - ON UPDATE CASCADE

**Note:** Most relationships are not enforced via foreign keys. Application logic handles referential integrity.

---

## Data Types and Conventions

### Decimal Precision
- All price/amount fields: `DECIMAL(10,2)`
- Supports up to 99,999,999.99

### Timestamps
- Created timestamps: `DEFAULT CURRENT_TIMESTAMP`
- Updated timestamps: `DEFAULT CURRENT_TIMESTAMP`
- Date queries: Enable `dateStrings=true` in connection

### Boolean Values
- Stored as `TINYINT(1)`
- 0 = false, 1 = true
- Used for flags like `is_active`, `show_notes`, etc.

### Text Storage
- Small text: VARCHAR(255)
- Medium text: VARCHAR(2000) for URLs, images
- Large text: MEDIUMTEXT for JSON data (addons)

### Enumerations
All enum values are lowercase except:
- orders.customer_type: 'WALKIN', 'CUSTOMER' (uppercase)

---

## Important Notes

### Connection Configuration
The database connection uses these parameters:
```
?ssl={"rejectUnauthorized":false}
&multipleStatements=true
&dateStrings=true
```

### No Transactions Table
Despite the API having transaction endpoints, there is no `transactions` table in this schema dump. This may be:
- Added after this dump was created
- Managed elsewhere
- Not yet implemented

### Missing Audit Fields
Many tables lack:
- updated_at timestamps
- deleted_at for soft deletes
- created_by/updated_by user tracking

### Index Optimization
Consider adding indexes on:
- orders.status, orders.payment_status
- order_items.status, order_items.order_id
- customers.name (for search)
- Foreign key columns not currently indexed

### Security Considerations
- All passwords must be bcrypt hashed (salt rounds: 10)
- Refresh tokens stored as JWT strings
- No sensitive customer data encryption at rest
- Phone numbers as customer IDs (consider privacy implications)

---

## Sample Queries

### Get Order with Items
```sql
SELECT
  o.id, o.date, o.status, o.token_no,
  c.name as customer_name,
  st.table_title,
  oi.quantity, mi.title as item_name, oi.price
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.phone
LEFT JOIN store_tables st ON o.table_id = st.id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN menu_items mi ON oi.item_id = mi.id
WHERE o.id = ?;
```

### Calculate Invoice Total
```sql
SELECT
  SUM(oi.price * oi.quantity) as subtotal,
  SUM(oi.price * oi.quantity * t.rate / 100) as tax_total,
  SUM(oi.price * oi.quantity * (1 + t.rate / 100)) as total
FROM order_items oi
JOIN menu_items mi ON oi.item_id = mi.id
LEFT JOIN taxes t ON mi.tax_id = t.id
WHERE oi.order_id = ?;
```

### Get Today's Reservations
```sql
SELECT
  r.id, r.date, r.people_count, r.status,
  c.name as customer_name, c.phone,
  st.table_title, st.seating_capacity
FROM reservations r
JOIN customers c ON r.customer_id = c.phone
LEFT JOIN store_tables st ON r.table_id = st.id
WHERE DATE(r.date) = CURDATE()
ORDER BY r.date;
```

### Kitchen Order Display
```sql
SELECT
  o.id as order_id, o.token_no, o.date,
  st.table_title,
  oi.id as item_id, mi.title as item_name,
  oi.quantity, oi.status, oi.notes,
  mv.title as variant, oi.addons
FROM orders o
LEFT JOIN store_tables st ON o.table_id = st.id
JOIN order_items oi ON o.id = oi.order_id
JOIN menu_items mi ON oi.item_id = mi.id
LEFT JOIN menu_item_variants mv ON oi.variant_id = mv.id
WHERE o.status = 'created'
  AND oi.status IN ('created', 'preparing')
ORDER BY o.date ASC;
```

---

## Migration Considerations

If you need to modify the schema:

1. **Add transactions table** if using transaction endpoints
2. **Add foreign key constraints** for data integrity
3. **Add updated_at triggers** or use application logic
4. **Index optimization** for frequently queried columns
5. **Consider soft deletes** instead of hard deletes
6. **Add audit fields** (created_by, updated_by, deleted_by)
7. **Encrypt sensitive data** (customer emails, phone numbers)
8. **Add composite indexes** for common query patterns
