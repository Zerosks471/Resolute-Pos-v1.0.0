# API Endpoints Documentation

Base URL: `http://localhost:3000/api/v1`

All endpoints (except authentication) require authentication via httpOnly cookies (`accessToken`). Most endpoints also require specific scopes for authorization.

## Authentication Legend

- 🔓 **Public**: No authentication required
- 🔒 **Auth Required**: Requires `accessToken` cookie
- 🔐 **Scope Required**: Requires specific user scopes/permissions

---

## Authentication (`/auth`)

### POST `/auth/signin`
🔓 Sign in to the system

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
- Sets `accessToken` and `refreshToken` httpOnly cookies
- Returns user details and authentication status

---

### POST `/auth/signout`
🔒 Sign out and clear authentication cookies

**Authentication:** Requires `isLoggedIn`, `isAuthenticated`

---

### POST `/auth/refresh-token`
🔒 Get a new access token using refresh token

**Authentication:** Requires `hasRefreshToken`

**Response:**
- Sets new `accessToken` cookie
- Returns new token details

---

### POST `/auth/remove-device`
🔒 Remove device access token

**Authentication:** Requires `isLoggedIn`, `isAuthenticated`

---

### GET `/auth/devices`
🔒 Get list of authenticated devices

**Authentication:** Requires `isLoggedIn`, `isAuthenticated`

**Response:**
- Returns list of devices with active sessions

---

## Settings (`/settings`)

All settings endpoints require the `SETTINGS` scope.

### Store Settings

#### GET `/settings/store-setting`
🔐 Get store details

**Scope:** `SETTINGS`

**Response:**
```json
{
  "storeName": "string",
  "address": "string",
  "phone": "string",
  "currency": "string",
  // ... other store settings
}
```

---

#### POST `/settings/store-setting`
🔐 Update store details

**Scope:** `SETTINGS`

**Request Body:**
```json
{
  "storeName": "string",
  "address": "string",
  "phone": "string",
  "currency": "string",
  // ... other store settings
}
```

---

### Print Settings

#### GET `/settings/print-setting`
🔐 Get print settings

**Scope:** `SETTINGS`

---

#### POST `/settings/print-setting`
🔐 Update print settings

**Scope:** `SETTINGS`

---

### Taxes

#### GET `/settings/taxes`
🔐 Get all taxes

**Scope:** `SETTINGS`

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "rate": "number",
    "enabled": "boolean"
  }
]
```

---

#### POST `/settings/taxes/add`
🔐 Add new tax

**Scope:** `SETTINGS`

**Request Body:**
```json
{
  "name": "string",
  "rate": "number"
}
```

---

#### GET `/settings/taxes/:id`
🔐 Get specific tax by ID

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Tax ID

---

#### POST `/settings/taxes/:id/update`
🔐 Update tax

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Tax ID

**Request Body:**
```json
{
  "name": "string",
  "rate": "number"
}
```

---

#### DELETE `/settings/taxes/:id`
🔐 Delete tax

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Tax ID

---

### Payment Types

#### GET `/settings/payment-types`
🔐 Get all payment types

**Scope:** `SETTINGS`

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "enabled": "boolean"
  }
]
```

---

#### POST `/settings/payment-types/add`
🔐 Add new payment type

**Scope:** `SETTINGS`

**Request Body:**
```json
{
  "name": "string"
}
```

---

#### POST `/settings/payment-types/:id/update`
🔐 Update payment type

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Payment type ID

---

#### POST `/settings/payment-types/:id/toggle`
🔐 Toggle payment type enabled/disabled

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Payment type ID

---

#### DELETE `/settings/payment-types/:id`
🔐 Delete payment type

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Payment type ID

---

### Store Tables

#### GET `/settings/store-tables`
🔐 Get all store tables

**Scope:** `SETTINGS`

**Response:**
```json
[
  {
    "id": "number",
    "table_name": "string",
    "capacity": "number",
    "status": "string"
  }
]
```

---

#### POST `/settings/store-tables/add`
🔐 Add new table

**Scope:** `SETTINGS`

**Request Body:**
```json
{
  "table_name": "string",
  "capacity": "number"
}
```

---

#### POST `/settings/store-tables/:id/update`
🔐 Update table

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Table ID

---

#### DELETE `/settings/store-tables/:id`
🔐 Delete table

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Table ID

---

### Categories

#### GET `/settings/categories`
🔐 Get all menu categories

**Scope:** `SETTINGS`

**Response:**
```json
[
  {
    "id": "number",
    "title": "string"
  }
]
```

---

#### POST `/settings/categories/add`
🔐 Add new category

**Scope:** `SETTINGS`

**Request Body:**
```json
{
  "title": "string"
}
```

---

#### POST `/settings/categories/:id/update`
🔐 Update category

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Category ID

---

#### DELETE `/settings/categories/:id`
🔐 Delete category

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Category ID

---

## Customers (`/customers`)

### GET `/customers`
🔐 Get all customers

**Scopes:** `CUSTOMERS`, `VIEW_CUSTOMERS`

**Query Parameters:**
- `page` (optional) - Page number for pagination
- `limit` (optional) - Number of results per page

**Response:**
```json
[
  {
    "phone": "string",
    "name": "string",
    "email": "string",
    "address": "string"
  }
]
```

---

### GET `/customers/:id`
🔐 Get customer by ID (phone number)

**Scopes:** `CUSTOMERS`, `VIEW_CUSTOMERS`

**URL Parameters:**
- `id` - Customer phone number

---

### GET `/customers/search-by-phone-name/search`
🔐 Search customers by phone or name

**Scopes:** `CUSTOMERS`, `VIEW_CUSTOMERS`

**Query Parameters:**
- `q` - Search query (phone or name)

---

### POST `/customers/add`
🔐 Add new customer

**Scopes:** `MANAGE_CUSTOMERS`

**Request Body:**
```json
{
  "phone": "string",
  "name": "string",
  "email": "string",
  "address": "string"
}
```

---

### POST `/customers/:id/update`
🔐 Update customer

**Scopes:** `CUSTOMERS`, `MANAGE_CUSTOMERS`

**URL Parameters:**
- `id` - Customer phone number

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "address": "string"
}
```

---

### DELETE `/customers/:id/delete`
🔐 Delete customer

**Scopes:** `CUSTOMERS`, `MANAGE_CUSTOMERS`

**URL Parameters:**
- `id` - Customer phone number

---

## Reservations (`/reservations`)

### GET `/reservations`
🔐 Get all reservations

**Scopes:** `RESERVATIONS`, `MANAGE_RESERVATIONS`, `VIEW_RESERVATIONS`

**Query Parameters:**
- `date` (optional) - Filter by date
- `status` (optional) - Filter by status

**Response:**
```json
[
  {
    "id": "number",
    "customer_phone": "string",
    "customer_name": "string",
    "table_id": "number",
    "date": "string",
    "time": "string",
    "guests": "number",
    "status": "string",
    "notes": "string"
  }
]
```

---

### GET `/reservations/init`
🔐 Get initialization data for reservations page

**Scopes:** `RESERVATIONS`, `MANAGE_RESERVATIONS`, `VIEW_RESERVATIONS`

**Response:**
- Returns tables, customers, and other necessary data for creating reservations

---

### GET `/reservations/search`
🔐 Search reservations

**Scopes:** `RESERVATIONS`, `MANAGE_RESERVATIONS`, `VIEW_RESERVATIONS`

**Query Parameters:**
- `q` - Search query

---

### POST `/reservations/add`
🔐 Add new reservation

**Scopes:** `RESERVATIONS`, `MANAGE_RESERVATIONS`

**Request Body:**
```json
{
  "customer_phone": "string",
  "table_id": "number",
  "date": "string",
  "time": "string",
  "guests": "number",
  "notes": "string"
}
```

---

### POST `/reservations/update/:id`
🔐 Update reservation

**Scopes:** `RESERVATIONS`, `MANAGE_RESERVATIONS`

**URL Parameters:**
- `id` - Reservation ID

---

### POST `/reservations/cancel/:id`
🔐 Cancel reservation

**Scopes:** `RESERVATIONS`, `MANAGE_RESERVATIONS`

**URL Parameters:**
- `id` - Reservation ID

---

### DELETE `/reservations/delete/:id`
🔐 Delete reservation

**Scopes:** `RESERVATIONS`, `MANAGE_RESERVATIONS`

**URL Parameters:**
- `id` - Reservation ID

---

## Users (`/users`)

All user endpoints require authentication (`isLoggedIn`, `isAuthenticated`). No specific scopes required beyond authentication.

### GET `/users`
🔒 Get all users

**Response:**
```json
[
  {
    "id": "number",
    "username": "string",
    "name": "string",
    "role": "string",
    "scope": "string"
  }
]
```

---

### GET `/users/scopes`
🔒 Get all available scopes

**Response:**
```json
[
  "DASHBOARD",
  "POS",
  "ORDERS",
  // ... other scopes
]
```

---

### POST `/users/add`
🔒 Add new user

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "name": "string",
  "role": "string",
  "scope": "string" // comma-separated scopes
}
```

---

### POST `/users/update/:id`
🔒 Update user

**URL Parameters:**
- `id` - User ID

**Request Body:**
```json
{
  "username": "string",
  "name": "string",
  "role": "string",
  "scope": "string"
}
```

---

### POST `/users/update-password/:id`
🔒 Update user password

**URL Parameters:**
- `id` - User ID

**Request Body:**
```json
{
  "password": "string"
}
```

---

### DELETE `/users/delete/:id`
🔒 Delete user

**URL Parameters:**
- `id` - User ID

---

## Menu Items (`/menu-items`)

All menu item endpoints require the `SETTINGS` scope.

### Menu Items

#### GET `/menu-items`
🔐 Get all menu items

**Scope:** `SETTINGS`

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "price": "number",
    "category_id": "number",
    "enabled": "boolean",
    "image_url": "string"
  }
]
```

---

#### GET `/menu-items/:id`
🔐 Get menu item by ID

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Menu item ID

---

#### POST `/menu-items/add`
🔐 Add new menu item

**Scope:** `SETTINGS`

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "category_id": "number",
  "image_url": "string"
}
```

---

#### POST `/menu-items/update/:id`
🔐 Update menu item

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Menu item ID

---

#### DELETE `/menu-items/delete/:id`
🔐 Delete menu item

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Menu item ID

---

### Menu Item Addons

#### GET `/menu-items/addons/:id`
🔐 Get addons for specific menu item

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Menu item ID

**Response:**
```json
[
  {
    "id": "number",
    "menu_item_id": "number",
    "name": "string",
    "price": "number"
  }
]
```

---

#### GET `/menu-items/addons`
🔐 Get all addons

**Scope:** `SETTINGS`

---

#### POST `/menu-items/addons/:id/add`
🔐 Add addon to menu item

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Menu item ID

**Request Body:**
```json
{
  "name": "string",
  "price": "number"
}
```

---

#### POST `/menu-items/addons/:id/update/:addonId`
🔐 Update menu item addon

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Menu item ID
- `addonId` - Addon ID

---

#### DELETE `/menu-items/addons/:id/delete/:addonId`
🔐 Delete menu item addon

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Menu item ID
- `addonId` - Addon ID

---

### Menu Item Variants

#### GET `/menu-items/variants/:id`
🔐 Get variants for specific menu item

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Menu item ID

**Response:**
```json
[
  {
    "id": "number",
    "menu_item_id": "number",
    "name": "string",
    "price": "number"
  }
]
```

---

#### GET `/menu-items/variants`
🔐 Get all variants

**Scope:** `SETTINGS`

---

#### POST `/menu-items/variants/:id/add`
🔐 Add variant to menu item

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Menu item ID

**Request Body:**
```json
{
  "name": "string",
  "price": "number"
}
```

---

#### POST `/menu-items/variants/:id/update/:variantId`
🔐 Update menu item variant

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Menu item ID
- `variantId` - Variant ID

---

#### DELETE `/menu-items/variants/:id/delete/:variantId`
🔐 Delete menu item variant

**Scope:** `SETTINGS`

**URL Parameters:**
- `id` - Menu item ID
- `variantId` - Variant ID

---

## POS (`/pos`)

All POS endpoints require the `POS` scope.

### GET `/pos/init`
🔐 Get initialization data for POS

**Scope:** `POS`

**Response:**
- Returns menu items, categories, tables, payment types, taxes, and other data needed for POS operations

---

### POST `/pos/create-order`
🔐 Create new order (for dine-in/kitchen)

**Scope:** `POS`

**Request Body:**
```json
{
  "table_id": "number",
  "customer_phone": "string",
  "items": [
    {
      "menu_item_id": "number",
      "quantity": "number",
      "variant_id": "number",
      "addons": ["number"],
      "notes": "string"
    }
  ],
  "notes": "string"
}
```

**Response:**
- Returns created order details
- Triggers Socket.IO `new_order_backend` event

---

### POST `/pos/create-order-and-invoice`
🔐 Create order and invoice (for immediate payment/takeout)

**Scope:** `POS`

**Request Body:**
```json
{
  "table_id": "number",
  "customer_phone": "string",
  "items": [
    {
      "menu_item_id": "number",
      "quantity": "number",
      "variant_id": "number",
      "addons": ["number"],
      "notes": "string"
    }
  ],
  "payment_type_id": "number",
  "amount_paid": "number",
  "notes": "string"
}
```

**Response:**
- Returns created order, invoice, and transaction details

---

## Kitchen (`/kitchen`)

All kitchen endpoints require `KITCHEN` or `KITCHEN_DISPLAY` scope.

### GET `/kitchen`
🔐 Get all kitchen orders

**Scopes:** `KITCHEN`, `KITCHEN_DISPLAY`

**Response:**
```json
[
  {
    "order_id": "number",
    "table_name": "string",
    "order_time": "string",
    "items": [
      {
        "id": "number",
        "menu_item_name": "string",
        "quantity": "number",
        "status": "string",
        "notes": "string",
        "variant": "string",
        "addons": ["string"]
      }
    ]
  }
]
```

---

### POST `/kitchen/:id`
🔐 Update kitchen order item status

**Scopes:** `KITCHEN`, `KITCHEN_DISPLAY`

**URL Parameters:**
- `id` - Order item ID

**Request Body:**
```json
{
  "status": "string" // e.g., "preparing", "ready", "served"
}
```

**Response:**
- Triggers Socket.IO `order_update_backend` event

---

## Orders (`/orders`)

All order endpoints require one of: `POS`, `ORDERS`, `ORDER_STATUS`, `ORDER_STATUS_DISPLAY` scopes.

### GET `/orders`
🔐 Get all orders

**Scopes:** `POS`, `ORDERS`, `ORDER_STATUS`, `ORDER_STATUS_DISPLAY`

**Query Parameters:**
- `status` (optional) - Filter by order status
- `date` (optional) - Filter by date

**Response:**
```json
[
  {
    "id": "number",
    "table_name": "string",
    "customer_name": "string",
    "total": "number",
    "status": "string",
    "created_at": "string",
    "items": [...]
  }
]
```

---

### GET `/orders/init`
🔐 Get initialization data for orders page

**Scopes:** `POS`, `ORDERS`, `ORDER_STATUS`, `ORDER_STATUS_DISPLAY`

**Response:**
- Returns payment types, tables, and other necessary data

---

### POST `/orders/update-status/:id`
🔐 Update order item status

**Scopes:** `POS`, `ORDERS`, `ORDER_STATUS`, `ORDER_STATUS_DISPLAY`

**URL Parameters:**
- `id` - Order item ID

**Request Body:**
```json
{
  "status": "string"
}
```

---

### POST `/orders/cancel`
🔐 Cancel order

**Scopes:** `POS`, `ORDERS`, `ORDER_STATUS`, `ORDER_STATUS_DISPLAY`

**Request Body:**
```json
{
  "order_id": "number",
  "reason": "string"
}
```

---

### POST `/orders/complete`
🔐 Mark order as complete (without payment)

**Scopes:** `POS`, `ORDERS`, `ORDER_STATUS`, `ORDER_STATUS_DISPLAY`

**Request Body:**
```json
{
  "order_id": "number"
}
```

---

### POST `/orders/complete-order-payment-summary`
🔐 Get payment summary for completing order

**Scopes:** `POS`, `ORDERS`, `ORDER_STATUS`, `ORDER_STATUS_DISPLAY`

**Request Body:**
```json
{
  "order_id": "number"
}
```

**Response:**
```json
{
  "subtotal": "number",
  "tax": "number",
  "total": "number",
  "items": [...]
}
```

---

### POST `/orders/complete-and-pay-order`
🔐 Complete order with payment

**Scopes:** `POS`, `ORDERS`, `ORDER_STATUS`, `ORDER_STATUS_DISPLAY`

**Request Body:**
```json
{
  "order_id": "number",
  "payment_type_id": "number",
  "amount_paid": "number"
}
```

**Response:**
- Returns invoice and transaction details
- Marks order as completed

---

## Invoices (`/invoices`)

All invoice endpoints require `INVOICES` or `POS` scope.

### GET `/invoices`
🔐 Get all invoices

**Scopes:** `INVOICES`, `POS`

**Query Parameters:**
- `page` (optional) - Page number
- `limit` (optional) - Results per page
- `start_date` (optional) - Filter by start date
- `end_date` (optional) - Filter by end date

**Response:**
```json
[
  {
    "id": "number",
    "invoice_number": "string",
    "customer_name": "string",
    "total": "number",
    "payment_type": "string",
    "created_at": "string"
  }
]
```

---

### GET `/invoices/init`
🔐 Get initialization data for invoices page

**Scopes:** `INVOICES`, `POS`

---

### GET `/invoices/search`
🔐 Search invoices

**Scopes:** `INVOICES`, `POS`

**Query Parameters:**
- `q` - Search query (invoice number, customer name, etc.)

---

### POST `/invoices/orders`
🔐 Get orders for specific invoice

**Scopes:** `INVOICES`, `POS`

**Request Body:**
```json
{
  "invoice_id": "number"
}
```

**Response:**
- Returns detailed order items for the invoice

---

## Dashboard (`/dashboard`)

### GET `/dashboard`
🔐 Get dashboard data and analytics

**Scope:** `DASHBOARD`

**Response:**
```json
{
  "todaySales": "number",
  "todayOrders": "number",
  "todayRevenue": "number",
  "popularItems": [
    {
      "name": "string",
      "quantity": "number",
      "revenue": "number"
    }
  ],
  "recentOrders": [...],
  "salesChart": [...]
}
```

---

## Reports (`/reports`)

### GET `/reports`
🔐 Get reports and analytics

**Scope:** `REPORTS`

**Query Parameters:**
- `start_date` - Report start date
- `end_date` - Report end date
- `type` (optional) - Report type (sales, items, customers, etc.)

**Response:**
- Returns comprehensive report data based on query parameters

---

## Transactions (`/transactions`)

All transaction endpoints require authentication (no specific scope required).

### GET `/transactions`
🔒 Get all transactions

**Query Parameters:**
- `page` (optional) - Page number
- `limit` (optional) - Results per page
- `start_date` (optional) - Filter by start date
- `end_date` (optional) - Filter by end date

**Response:**
```json
[
  {
    "id": "number",
    "invoice_id": "number",
    "payment_type": "string",
    "amount": "number",
    "created_at": "string"
  }
]
```

---

### GET `/transactions/search`
🔒 Search transactions

**Query Parameters:**
- `q` - Search query

---

### POST `/transactions`
🔒 Add new transaction

**Request Body:**
```json
{
  "invoice_id": "number",
  "payment_type_id": "number",
  "amount": "number"
}
```

---

### PUT `/transactions/:id`
🔒 Update transaction

**URL Parameters:**
- `id` - Transaction ID

**Request Body:**
```json
{
  "payment_type_id": "number",
  "amount": "number"
}
```

---

### DELETE `/transactions/:id`
🔒 Delete transaction

**URL Parameters:**
- `id` - Transaction ID

---

## Socket.IO Events

**Server listens for:**
- `new_order_backend` - New order created from POS
- `order_update_backend` - Order status updated from kitchen

**Server broadcasts:**
- `new_order` - Notifies all clients of new order
- `order_update` - Notifies all clients of order status change

**Usage:**
```javascript
// Client sends
socket.emit("new_order_backend", orderData);

// Client receives
socket.on("new_order", (orderData) => {
  // Update UI with new order
});

socket.on("order_update", (updateData) => {
  // Update order status in UI
});
```

---

## Error Responses

All endpoints follow a consistent error response format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions/scopes)
- `404` - Not Found
- `500` - Internal Server Error
