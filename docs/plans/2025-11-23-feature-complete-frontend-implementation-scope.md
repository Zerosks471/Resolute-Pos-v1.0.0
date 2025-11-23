# Feature-Complete Angular Frontend Implementation Scope

**Date:** 2025-11-23
**Status:** Validated and Ready for Implementation
**Scope:** Complete Phase 1 implementation of all 5 Angular applications with full features

---

## Overview

This document defines the complete scope for implementing the feature-complete Angular frontend for Resolute POS. This includes all 5 applications (pos-staff, kitchen-display, pos-kiosk, admin-dashboard, customer-web) with all major features from the design document.

**Estimated Timeline:** 3-6 months
**Approach:** Comprehensive implementation plan with 50-100+ tasks

---

## 1. Foundation & Shared Components

### Shared UI Components Library (`libs/ui-components`)

**Material Design 3 Components:**
- Buttons, cards, modals, dialogs
- Layout components: navigation, toolbar, sidebar
- Form components: input fields, selects, checkboxes, date pickers
- Data display: tables, lists, grids with sorting and filtering
- Loading states, error states, empty states
- Feedback components: snackbars, alerts, confirmations

**Theme System:**
- Material Design 3 color system implementation
- Light and dark theme variants
- Dynamic color theming
- Consistent spacing and typography
- Responsive breakpoints

### Data Models & State Management (`libs/data-access`)

**NgRx Feature Stores:**
- Orders store (create, update, complete, void)
- Menu items store (categories, items, modifiers, pricing)
- Tables store (floor plan, status, assignments)
- Customers store (profiles, loyalty, order history)
- Inventory store (stock levels, recipes, COGS)
- User store (authentication, preferences, permissions)

**API Services:**
- Complete service implementations for all backend endpoints
- Request/response interceptors
- Error handling and retry logic
- Caching strategies

**Real-Time Integration:**
- Socket.IO event handlers for all events
- Order updates (new_order, order_update, kitchen_order)
- Table updates (table_status_change)
- Payment updates (payment_complete)
- Kitchen status (item_ready, order_complete)

### Authentication & Authorization (`libs/auth`)

**PIN Login System:**
- Complete PIN login flow with backend integration
- Material Design 3 PIN pad UI
- Error handling and rate limiting
- Session persistence

**JWT Token Management:**
- Access token (15-minute expiry)
- Refresh token (7-day expiry)
- Automatic token refresh
- Token expiry handling

**Authorization System:**
- Route guards for all protected routes
- Scope-based permission checks
- Role-based access control (Admin, Manager, Waiter, Cashier, Kitchen)
- Dynamic permission UI (hide/disable unauthorized actions)

**Session Management:**
- Session timeout (15 minutes inactivity)
- Fast user switching
- Auto-logout on timeout
- Audit logging for all authentication events

---

## 2. POS Staff Application (`apps/pos-staff`)

### Dashboard

**Real-Time Metrics:**
- Today's sales total with comparison to yesterday
- Order count and average ticket size
- Active tables count (occupied/total)
- Kitchen queue depth

**Visual Floor Plan:**
- Table status display with color coding:
  - Green: Available
  - Yellow: Occupied
  - Red: Needs attention (bill ready, service request)
  - Blue: Reserved
- Click table to view details or take action
- Real-time status updates via Socket.IO

**Quick Navigation:**
- Navigation cards to POS, Orders, Tables, Menu, Settings
- Notifications center:
  - Kitchen orders ready for pickup
  - Manager approval requests
  - System alerts
  - Failed sync warnings

**User Profile:**
- Current user display with role and photo
- Quick logout button
- User switch option

### POS Order Taking

**Menu Browsing:**
- Category grid with photos (Appetizers, Entrees, Drinks, Desserts, etc.)
- Search functionality (find items by name or keyword)
- Filter options (dietary restrictions, popular items, new items)
- Badge indicators (spicy, vegetarian, gluten-free, popular)

**Item Selection:**
- Grid or list view toggle
- Large photos with appealing presentation
- Item name, description, and price
- Calorie count (if available)
- Availability status (in-stock, 86'd)

**Customization Wizard:**
- Step-by-step customization flow
- Size selection with price differences
- Temperature/cooking preferences
- Add-ons and modifiers with visual toggles
- Side selection (for combos)
- Special instructions text field
- Running price updates as options change

**Shopping Cart:**
- Persistent cart display (sidebar or bottom panel)
- Item list with thumbnails, names, and customizations
- Quantity adjustment (+/- buttons)
- Edit item (reopens customization)
- Remove item (trash icon)
- Subtotal calculation
- "Continue ordering" or "Review order" buttons

**Order Review:**
- Full order summary before firing
- Edit quantities or remove items
- Split by course:
  - Fire appetizers now
  - Hold entrees for later
  - All at once option
- Add order-level notes
- Assign to table or ticket number

**Fire to Kitchen:**
- "Send to Kitchen" button
- Confirmation dialog with course split options
- Auto-route items to appropriate kitchen stations
- Real-time confirmation via Socket.IO
- Order appears on kitchen displays immediately

**Order Modifications:**
- Edit existing orders (with timestamp tracking)
- Add items to existing order
- Void items (manager approval required for high-value)
- Add rush flag for priority
- Order history and audit trail

### Table Management

**Floor Plan View:**
- Visual representation of restaurant layout
- Drag-and-drop table placement (admin mode)
- Table shapes (square, round, rectangular)
- Table numbering and capacity

**Table Status:**
- Real-time status tracking:
  - Available (green)
  - Occupied (yellow)
  - Needs attention (red)
  - Reserved (blue)
- Time occupied display
- Server assignment
- Current order summary

**Table Actions:**
- Select table → New order / Add to order / Request bill / Clear table
- Assign/reassign to server
- Mark as reserved with time/name
- View complete order history for table
- Transfer orders between tables
- Combine orders from multiple tables

**Reservation Integration:**
- View upcoming reservations
- Mark table as reserved
- Customer name and party size
- Estimated arrival and duration

### Payment Processing

**Select Order:**
- List of orders ready for payment
- Organized by table number or ticket number
- Highlight urgent/waiting orders
- Filter by server or order type

**Bill Review:**
- Itemized bill with all items and prices
- Subtotal, tax, tip (if added), and total
- Order details (table, server, time)
- Edit options (add items, void items)

**Discounts & Comps:**
- Apply discount (percentage or fixed amount)
- Manager approval required for high-value discounts
- Comp entire order or specific items
- Reason code and notes required
- Audit trail for all discounts

**Split Bill:**
- Split by item (drag items to separate bills)
- Split evenly (2, 3, 4, 5 people)
- Split by custom amounts
- Each split can have separate payment methods

**Payment Methods:**
- Cash
- Card (send to terminal)
- Mobile wallet (Apple Pay, Google Pay via terminal)
- Gift card
- Loyalty points
- Split payment (multiple methods)

**Tip Handling:**
- Suggested tip amounts (15%, 18%, 20%, 25%)
- Custom tip amount
- No tip option
- Tip can be added to card payment or paid separately in cash

**Terminal Integration:**
- Send amount to Dejavoo/PAX terminal
- Display "Processing..." with spinner
- Customer completes transaction on terminal
- Receive response (approved/declined/error)
- If offline: Queue transaction, notify customer

**Receipt & Completion:**
- Print receipt on thermal printer
- Email receipt option (if customer email available)
- SMS receipt option (if phone number available)
- Mark order complete
- Update table status to available
- Record transaction in database

### Cash Drawer Management

**Cash Operations:**
- Track cash in/out
- Opening cash amount
- Cash sales recorded
- Cash refunds tracked
- Manager approval for large bills

**End-of-Shift:**
- Cash drawer reconciliation
- Expected cash vs. actual cash
- Report discrepancies
- Submit reconciliation report
- Print cash drawer report

---

## 3. Kitchen Display System (`apps/kitchen-display`)

### Order Display

**Real-Time Order Cards:**
- New orders appear automatically via Socket.IO
- Priority-based ordering:
  - Rush orders (red border, top priority)
  - Dine-in orders (ordered by fire time, oldest first)
  - Delivery/takeout (ordered by promised time)
- Automatic refresh (no manual reload needed)

**Order Card Layout:**
- Large, clear order number
- Table/ticket number prominently displayed
- Items for this station only (filtered by station config)
- Quantity and item name in large font
- Modifiers and customizations clearly listed
- Special instructions highlighted
- Allergy notes in red/warning color
- Timer showing minutes since fired

**Color Coding:**
- Red border: Rush orders
- Yellow highlight: In progress (cook tapped item)
- Green checkmark: Ready (cook marked complete)
- White/default: New orders

**Station Filtering:**
- Display only items assigned to this station
- Stations: Grill, Fryer, Salad, Expo, Desserts, Drinks, etc.
- Multi-station support (item can appear on multiple screens)

### Order Management

**Item Status Tracking:**
- Tap item → Mark "In Progress" (yellow highlight)
- Tap again → Mark "Ready" (green checkmark)
- Undo option if tapped by mistake
- Status syncs to all connected devices in real-time

**Order Completion:**
- When all items ready → Order card highlights for completion
- "Complete" button appears
- Tap "Complete" → Order bumps off screen
- Notification sent to waiter/expo
- Delivery platform updated (if applicable)

**Timer Alerts:**
- Color changes based on time elapsed:
  - < 5 minutes: White/normal
  - 5-10 minutes: Yellow/warning
  - > 10 minutes: Red/urgent
- Configurable thresholds per order type
- Audio alert for overdue orders

### Kitchen Features

**Auto-Login:**
- Station-specific login (select station on startup)
- Persistent session (no timeout)
- No password required for kitchen (PIN optional)
- Display stays logged in 24/7

**Recall & History:**
- "Recall" button to view completed orders
- Show last 2 hours of completed orders
- Filter by station or all stations
- Reprint ticket option

**Performance Metrics:**
- Average prep time per station
- Items completed per hour
- Late orders count
- Target time vs. actual time

**Display Optimization:**
- Full-screen mode (hide browser chrome)
- Large touch targets (80px minimum)
- High contrast for kitchen lighting
- No hover states (touch-first)
- Portrait or landscape support
- Optimized for wall-mounted displays (1920x1080 or 1080x1920)

---

## 4. Customer Kiosk Application (`apps/pos-kiosk`)

### Welcome & Onboarding

**Welcome Screen:**
- Large hero image (daily special, brand image, or video)
- Three primary actions:
  - "Start Order" (large, prominent button)
  - "Reorder" (for loyalty members with QR/phone lookup)
  - "Browse Menu" (for experienced customers)
- Language selector (if multi-language enabled)
- Accessibility options button

**Language Support:**
- Configurable languages (English, Spanish, etc.)
- Language persists through entire session
- Full translation of UI and menu items

**Accessibility Options:**
- High contrast mode
- Larger text size
- Audio cues for button presses
- Longer timeout before session reset
- Screen reader support (ARIA labels)

**Call for Help:**
- Always-visible button to summon staff
- Audio alert and on-screen notification to staff devices
- Emergency button styling

### Guided Ordering Flow

**Category Selection:**
- Large photo cards in grid layout (2-3 columns)
- Categories: Burgers, Salads, Drinks, Desserts, etc.
- Each card shows:
  - High-quality photo
  - Category name
  - Item count or starting price
  - "Popular" or "New" badges

**Item Selection:**
- Menu items within selected category
- Grid or list view (configurable by restaurant)
- Each item shows:
  - Large appetizing photo
  - Name and short description
  - Price
  - Badges: Popular, Spicy, Vegetarian, Gluten-Free, Vegan
  - Calorie count (if available)
- Tap to select and customize

**Customization Wizard:**
- Step-by-step customization (only show relevant options)
- Progress indicator (Step 1 of 4)
- Size selection with price differences
- Temperature/doneness (for burgers, steaks)
- Add-ons with visual toggles (checkboxes with photos)
- Side selection (for combos)
- Drink selection (for combos)
- Special instructions text field (optional, on-screen keyboard)
- Running price updates as options change
- "Add to Order" button always visible

**Contextual Upsells:**
- After adding item to cart:
  - "Make it a combo?" (add drink + side for $X more)
  - "Add fries for just $2?"
  - "Customers also love [item]" (carousel of related items)
- Easy to dismiss ("No thanks" button)
- Upsells configurable by restaurant

### Cart & Checkout

**Persistent Cart Summary:**
- Sidebar (landscape) or bottom drawer (portrait)
- Shows:
  - Item thumbnails
  - Names and customizations
  - Individual prices
  - Quantity with +/- buttons
  - Remove item (trash icon)
- Subtotal, tax, and total prominently displayed
- "Continue ordering" or "Checkout" buttons

**Checkout Flow:**
- Review full order one last time
- Add special instructions for entire order
- Select order type:
  - Dine-in (enter table number on touchscreen)
  - Takeout (enter name for pickup)
- Loyalty member lookup:
  - Phone number entry
  - QR code scan
  - Skip option (continue as guest)

**Loyalty Integration:**
- Display available rewards
- Apply rewards to order
- Show points that will be earned
- Display current points balance
- Encourage sign-up if not a member

### Payment & Confirmation

**Payment Options:**
- Card reader (insert, swipe, or tap)
- Mobile wallet (Apple Pay, Google Pay)
- No cash option (cashless kiosk)
- Loyalty points as payment (if enough points)

**Payment Processing:**
- Clear instructions: "Insert card" or "Tap phone/card"
- Visual feedback during processing (spinner, progress bar)
- If offline: "Payment queued, you'll receive confirmation when processed"
- Timeout handling (if customer doesn't complete)

**Order Confirmation:**
- Large order number for pickup (e.g., #42)
- Estimated ready time (e.g., "Ready in 12 minutes")
- Option to print receipt or SMS receipt
- "Track your order" link (if online ordering app available)
- "Done" button returns to welcome screen
- Auto-return to welcome after 30 seconds

### Touch Optimization

**Touch-First Design:**
- Minimum touch target: 80px × 80px
- Spacing between targets: 16px minimum
- Large, readable fonts (24px+ for body text, 16px minimum for small text)
- No hover states (all feedback via tap)
- Immediate visual feedback on tap (ripple effect)

**Responsive Layouts:**
- Portrait orientation support (common for kiosks)
- Landscape orientation support (tablets)
- Adapt layout based on screen size
- Full-screen mode (hide browser chrome)

**Session Management:**
- Inactivity timeout (2 minutes on order screen, 30 seconds on confirmation)
- "Are you still there?" prompt before timeout
- Clear visual countdown
- Auto-cancel incomplete orders on timeout

---

## 5. Admin Dashboard Application (`apps/admin-dashboard`)

### Real-Time Dashboard

**Today's Snapshot Cards:**
- **Sales Total:** $X,XXX.XX with comparison to yesterday (+X%)
- **Order Count:** XXX orders with average ticket ($XX.XX)
- **Active Tables:** X of XX occupied
- **Kitchen Queue:** X orders in progress

**Charts & Graphs:**
- **Hourly Sales Trend:** Line graph comparing today vs. yesterday vs. last week
- **Order Volume:** Bar chart by hour
- **Payment Type Breakdown:** Pie chart (Cash, Card, Mobile Wallet, Gift Card, etc.)
- **Top Selling Items:** Horizontal bar chart (top 10)

**Alerts & Notifications:**
- Low inventory warnings (red badge)
- Failed payment syncs (yellow badge)
- Delivery platform issues (orange badge)
- Pending approvals (void requests, refunds, comps)
- System issues (offline terminals, sync failures)

**Quick Actions:**
- Open cash drawer reconciliation
- View pending voids/comps for approval
- Generate end-of-day report
- Export today's data (CSV, Excel, PDF)
- Send test order to kitchen (for testing)

### Financial Reports

**Sales Reports:**
- Report types:
  - Sales by period (hour, day, week, month, custom range)
  - Sales by payment type
  - Sales by staff member
  - Sales by order type (dine-in, takeout, delivery)
  - Sales by category or item
- Comparison views:
  - vs. previous period
  - vs. same period last year
  - vs. budget/target
- Breakdown sections:
  - Subtotal, tax, tips, discounts, total
  - Refunds and voids
  - Net sales

**Payment Type Analysis:**
- Cash vs. Card vs. Mobile wallet percentages
- Average transaction value by payment type
- Failed transactions and reasons
- Payment method trends over time

**Tips Analysis:**
- Total tips by staff member
- Average tip percentage by server
- Tip trends over time (by day/week/month)
- Tip vs. sales ratio

**Tax Reports:**
- Total tax collected by period
- Tax breakdown by rate (if multiple tax rates)
- Tax-exempt sales
- Export for accounting software (QuickBooks, Xero format)

**Discounts & Comps:**
- Total value of discounts and comps
- Frequency of use
- Staff attribution (who applied them)
- Reason codes breakdown

**Export Options:**
- CSV, Excel, PDF formats
- Scheduled email reports (daily, weekly, monthly)
- Integration with accounting software (future)

### Operational Reports

**Order Volume & Timing:**
- Orders per hour, day, week, month
- Average order value
- Order type breakdown (dine-in, takeout, delivery)
- Peak hours identification
- Rush vs. standard orders

**Prep Time Analysis:**
- Average prep time by kitchen station
- Order to ready time distribution
- Bottleneck identification
- Late orders report
- Target time vs. actual time

**Table Turnover:**
- Average table occupancy time
- Tables served per shift
- Table turnover rate
- Peak hours analysis
- Server efficiency (tables per server)

**Staff Productivity:**
- Orders per hour by waiter
- Average ticket size by waiter
- Void rate by staff member
- Speed of service metrics
- Tips earned per staff member

**Delivery Platform Performance:**
- Order volume by platform (GrubHub, DoorDash, Uber Eats)
- Average order value by platform
- Error rate and issues log
- Commission costs by platform
- Customer ratings from platforms

### Inventory Management (Admin Only)

**Real-Time Stock Levels:**
- Current inventory by item
- Low-stock alerts (configurable thresholds)
- Out-of-stock items (86'd)
- Overstock warnings
- Last updated timestamp

**Recipe Management:**
- Menu item to ingredient mapping
- Portion sizes and yields
- Auto-deduction on sale (recipe-based inventory)
- Recipe costing with current ingredient prices
- COGS calculation per menu item

**COGS Analysis:**
- Per menu item COGS
- Overall COGS percentage
- COGS trends over time
- High-cost items identification
- Profitability by menu item

**Vendor Management:**
- Vendor contact information
- Price lists per vendor
- Price comparison across vendors
- Vendor performance tracking
- Order history per vendor

**Purchase Orders:**
- Create PO from low-stock alerts
- Send to vendors (email/print)
- Receive and reconcile deliveries
- Track PO status (pending, received, partial)
- Inventory adjustments on receipt

**Waste Tracking:**
- Daily waste entry (spoilage, prep errors, customer returns)
- Waste by category (produce, meat, dairy, etc.)
- Cost of waste over time
- Variance reports (expected vs. actual inventory)
- Waste reduction goals and tracking

**Price Optimization:**
- Suggest menu price adjustments based on COGS
- Ingredient price trend analysis
- Profitability by menu item
- Recommendations for high-margin items to promote
- Competitive pricing data (if integrated)

### Management Functions

**Menu Management:**
- CRUD operations: Create, read, update, delete menu items
- Category management (add, edit, reorder)
- Item details: Name, description, price, photo, allergens, dietary info
- Modifiers and customization options
- Availability toggle (in-stock, 86'd)
- Pricing by location (if multi-location)

**User Management:**
- Add/edit/deactivate staff accounts
- Assign 4-6 digit PINs (hashed, never stored in plaintext)
- Role assignment (Admin, Manager, Waiter, Cashier, Kitchen)
- Scope-based permissions (granular access control)
- View user activity log
- Reset PIN (manager can reset staff PINs)

**Table Layout Configuration:**
- Drag-and-drop floor plan editor
- Add/remove/resize tables
- Table shapes (square, round, rectangular)
- Table numbering and capacity
- Section assignment (for multi-section restaurants)
- Save multiple floor plan layouts (lunch vs. dinner)

**Kitchen Station Setup:**
- Define stations (Grill, Fryer, Salad, Expo, Desserts, Drinks)
- Assign menu items to stations (item can go to multiple stations)
- Configure station-specific printers
- Set prep time targets per station

**Settings:**
- Business information (name, address, phone, hours)
- Tax rates (single or multiple rates, tax-exempt items)
- Printer configuration (receipt, kitchen ticket, labels)
- Payment terminal settings (IP address, terminal IDs)
- Delivery platform API keys
- Loyalty program configuration (earn rates, rewards)
- Email/SMS notification settings
- Offline sync settings (priority, retry logic)

**Approval Workflows:**
- Void high-value items (configurable threshold, e.g., > $25)
- Comp meals (manager approval required)
- Override discounts (manager can approve higher discounts)
- Refund requests (manager approval for > $X)
- Approval queue with notifications
- Audit trail for all approvals

---

## 6. Customer Web Application (`apps/customer-web`)

### Online Ordering Interface

**Responsive PWA:**
- Mobile-first design (primary use case)
- Tablet and desktop support
- Installable on iOS/Android (add to home screen)
- Offline capability (view menu, browse items)

**Landing Page:**
- Hero image or video (brand identity, daily specials)
- "Order now" button (large, prominent)
- "Schedule for later" option
- "Pickup" or "Delivery" selector
- Location selector (if multi-location)
- Login or continue as guest

**Authentication:**
- Login with email/password
- Social login (Google, Facebook, Apple)
- Guest checkout option
- Password reset flow
- Account creation during checkout

### Menu & Ordering

**Menu Browsing:**
- Category navigation (tabs or sidebar)
- Search functionality (find items by name, ingredient, keyword)
- Filter options:
  - Dietary preferences (vegetarian, vegan, gluten-free, etc.)
  - Allergen filters (no nuts, no dairy, etc.)
  - Price range
  - Popular items
  - New items
- Sort options:
  - Popular (most ordered)
  - Price (low to high, high to low)
  - Newest items
  - A-Z

**Item Details:**
- Large photo (zoomable)
- Full description
- Price
- Customization options preview
- Badges (Popular, Spicy, Vegetarian, Gluten-Free, Vegan, New)
- Calorie count and nutrition info (if available)
- Customer reviews/ratings (future feature)

**Customization:**
- Same wizard-style customization as kiosk
- Mobile-optimized form controls
- Visual toggles for add-ons
- Special instructions text field
- Running price updates

**Favorites:**
- Save frequently ordered items
- Quick add to cart from favorites
- Reorder past orders with one tap
- Edit favorite before adding to cart

### Cart & Checkout

**Cart Review:**
- Item list with thumbnails and details
- Edit quantities and customizations
- Remove items
- Apply loyalty rewards
- Apply promo codes
- Subtotal, tax, tip (if enabled), delivery fee (if delivery), total

**Scheduled Ordering:**
- ASAP option (default)
- Schedule for specific date/time
- Future orders (order today for tomorrow)
- Catering orders (large orders, advance notice required)
- Recurring orders option ("Every Friday at 12 PM")

**Order Type:**
- Pickup (default)
  - Estimated ready time displayed
  - Store location selection (if multi-location)
- Delivery
  - Delivery address entry and validation
  - Delivery fee calculated based on distance
  - Driver tip option
  - Delivery instructions field

**Loyalty Integration:**
- View available rewards
- Apply rewards to order
- Show points that will be earned
- Display current points balance
- Encourage sign-up if not a member

### Payment & Confirmation

**Payment Methods:**
- Saved payment methods (tokenized, PCI-compliant)
- New card entry (Stripe, Square, or similar payment gateway)
- Apple Pay / Google Pay
- Loyalty points as payment
- Split payment option (future feature)

**Checkout Form:**
- Contact information (name, phone, email)
- Payment method selection
- Billing address (if different from delivery)
- Save payment method for future (optional)
- Terms and conditions checkbox

**Order Confirmation:**
- Order confirmation number
- Estimated ready time (pickup) or delivery time
- Order summary
- Receipt email sent automatically
- "Track your order" button
- Add to calendar option (for scheduled orders)

### Order Tracking

**Real-Time Status:**
- **Received:** Order sent to restaurant
- **Preparing:** Kitchen is working on it
- **Ready:** Available for pickup
- **On the way:** Driver is en route (delivery only)
- **Delivered/Completed:** Order complete

**Status Updates:**
- Visual progress bar or stepper
- Estimated time updates from kitchen
- SMS/push notifications on status change (opt-in)

**Map View (Delivery):**
- Driver location on map (if available from delivery platform)
- ETA countdown
- Driver contact option

**Order Details:**
- View full order details
- View receipt
- Reorder option
- Rate your experience (post-delivery)

### Account Features

**Order History:**
- List of all past orders
- Filter by date range, order type, location
- Details: Items, date, total, status
- "Reorder" button for instant repeat
- Download receipts

**Profile Management:**
- Edit personal information (name, phone, email)
- Change password
- Profile photo (optional)
- Dietary restrictions and allergens
- Communication preferences

**Saved Addresses:**
- Multiple delivery addresses
- Home, Work, Other labels
- Default address selection
- Edit/delete addresses
- Address validation on entry

**Payment Methods:**
- Multiple saved cards (last 4 digits shown)
- Expiry date tracking (alert when card is expiring)
- Default payment method
- Add/remove cards
- Secure tokenization (PCI-compliant, no full card numbers stored)

**Loyalty Program:**
- Points balance display
- Points history (earned and redeemed)
- Available rewards
- Tier status (Bronze, Silver, Gold)
- Benefits by tier
- Referral program (future feature)

**Notifications:**
- Email preferences (order confirmations, promotions, newsletters)
- SMS preferences (order updates, delivery alerts)
- Push notification preferences (order status, special offers)

---

## 7. Offline Sync & Advanced Features

### Offline-First Architecture (`libs/offline-sync`)

**IndexedDB Implementation:**
- Database schema design (orders, menu, customers, inventory, settings)
- AES-256 encryption for sensitive data at rest
- Encryption keys derived from device + user credentials
- Secure key storage using Web Crypto API
- Storage quota management (request persistent storage)

**Sync Queue Service:**
- Priority queue implementation:
  1. Critical: Payment processing, order placement, kitchen status
  2. High: Order modifications, table status changes
  3. Medium: Customer data updates, inventory adjustments
  4. Low: Audit logs, analytics data
- Queue persistence (survives app restart)
- Queue depth monitoring and alerts

**Connection Monitoring:**
- Detect online/offline status (navigator.onLine API)
- Detect connection type (WiFi, cellular, ethernet)
- Automatic failover (Ethernet → WiFi → Cellular)
- Alert staff when on cellular (limited data warning)
- Connection quality monitoring (latency, packet loss)

**Retry Logic:**
- Exponential backoff: 1s → 2s → 4s → 8s → 16s → 30s → 60s
- Max retries: 10 attempts
- Manual retry button in UI
- Alert staff if sync fails after max retries
- Per-item retry tracking

**Conflict Resolution:**
- **Server timestamp wins** for most data (standard conflict resolution)
- **Client wins** for user input (order modifications)
- Audit trail logs all conflicts and resolutions
- Manual resolution for critical conflicts (notify manager)
- Conflict scenarios:
  - Same order modified on two devices offline → Last modification timestamp wins
  - Inventory adjusted on multiple devices → Sum all adjustments, apply to server value
  - Menu item price changed during offline sale → Sale records price at time of order

**Offline Capabilities:**
- Take orders (full order flow works offline)
- Modify orders (edit, void items)
- Process cash payments (recorded locally, synced later)
- Queue card payments (processed when online)
- Apply discounts (with cached manager approvals)
- Split bills
- Print receipts (local thermal printers)
- View cached menu data
- View customer loyalty info (cached)
- Generate reports from locally cached data

**Sync Status Indicators:**
- Visual indicators throughout UI:
  - **Green dot:** Online, real-time sync active
  - **Yellow dot:** Offline, X items queued for sync
  - **Red dot:** Sync failed, requires attention
- Detailed sync status view (admin):
  - Queue depth by priority
  - Last successful sync timestamp
  - Failed sync items with error details
  - Manual sync trigger button

---

### Payment Terminal Integration (`libs/payment`)

**Supported Terminals:**
- Dejavoo models: Z6, Z8, Z9, Z11
- PAX models: A920, A80, S300
- Connectivity: USB, Ethernet, WiFi, Bluetooth

**SDK Integration:**
- Use official Dejavoo/PAX SDKs
- Backend service handles terminal communication (not direct from frontend)
- Frontend sends payment requests to backend API
- Backend communicates with terminal via SDK
- Response returned to frontend

**Terminal Configuration:**
- Admin interface to configure terminals
- Map terminals to stations (Cashier 1, Cashier 2, etc.)
- Terminal settings:
  - IP address (for network terminals)
  - USB port (for USB terminals)
  - Tip prompts (yes/no, suggested percentages)
  - Signature capture threshold (e.g., $25+)
  - Receipt printing (terminal or POS printer)
- Test connection button
- Test transaction feature

**Payment Processing Flow:**
1. Cashier selects payment method "Card"
2. Frontend sends payment request to backend API
3. Backend sends transaction to terminal via SDK
4. Terminal prompts customer: "Insert, swipe, or tap card"
5. Customer completes payment on terminal (PIN if required)
6. Terminal processes transaction (encrypted communication with processor)
7. Terminal returns response to backend (approved/declined/error)
8. Backend updates order status and returns response to frontend
9. Frontend displays result and prints receipt

**Transaction Details:**
- Request includes: Amount, transaction type (sale, refund, void), invoice number (order ID)
- Response includes: Status, authorization code, transaction ID, masked card number (last 4), card type

**Offline Transaction Queue:**
- If internet down: Terminal queues transaction internally (Dejavoo/PAX feature)
- POS records "Payment Pending" status locally
- Store transaction details in IndexedDB
- Print receipt: "Payment pending processing"
- When connectivity restored: Terminal auto-submits queued transactions
- POS polls terminal for status updates
- Update order status when transaction completes

**Refunds and Voids:**
- **Refund** (settled transaction):
  - Manager permission required
  - Customer re-presents card (or use original card token)
  - Refund processed, funds returned in 3-5 days
- **Void** (same-day, unsettled):
  - Cashier or manager can void
  - Send void request with original transaction ID
  - Terminal voids authorization immediately
  - Funds never leave customer account
- **Partial refunds** supported (item-level refunds)

**Terminal Management:**
- Admin view: List all configured terminals
- Terminal status display (online, offline, busy)
- View terminal logs and errors
- Failed transaction alerts
- Terminal offline alerts
- Transaction volume reports

---

### Loyalty Program

**Customer Enrollment:**
- **Kiosk enrollment:**
  - Tap "Join Loyalty" on welcome screen
  - Enter phone number (primary identifier)
  - Optional: Email, name
  - Instant enrollment, start earning points
- **Staff-assisted enrollment:**
  - Waiter or cashier can enroll customers
  - Same info collection
  - Immediate points for current order
- **Online enrollment:**
  - Sign up via customer web app
  - QR code on receipts: "Join for rewards"

**Member Lookup:**
- Phone number entry (numeric keypad)
- QR code scan (loyalty card in app)
- Email address entry
- Not found? Option to enroll immediately

**Points System:**
- Earning: $1 spent = X points (configurable, default: 1 point)
- Bonus points for specific items or categories
- Double points days/hours (happy hour, promotions)
- Birthday bonus (100 points on birthday)
- Anniversary bonus (annual signup date)

**Tiered Membership:**
- **Bronze:** 0-999 points (1x earn rate)
- **Silver:** 1,000-4,999 points (1.25x earn rate)
- **Gold:** 5,000+ points (1.5x earn rate)
- Benefits by tier:
  - Bronze: Earn and redeem points
  - Silver: + Priority support, early access to new items
  - Gold: + Exclusive rewards, free birthday meal, concierge service

**Reward Catalog:**
- **Free items:** "Free coffee" (500 points), "Free burger" (1,500 points)
- **Discounts:** "$5 off $25+" (1,000 points), "20% off order" (2,000 points)
- **Exclusive items:** Limited menu items only for loyalty members
- **Experiences:** "Skip the line pass", "Chef's table reservation"

**Redemption:**
- At kiosk: View available rewards, tap to apply
- At POS: Staff can apply rewards to order
- Online ordering: Select reward at checkout
- Multiple rewards can be combined (if allowed)

**Points Expiration:**
- Configurable (default: 12 months of inactivity)
- Notification before expiration (email/SMS 30 days before)
- Activity = any earn or redeem action

**Fraud Prevention:**
- Limit redemptions per day (max 3 rewards/day)
- Transaction minimum for earning ($5+)
- Account verification (email or SMS code)
- Suspicious activity monitoring

---

### Delivery Platform Integration

**Supported Platforms:**
- GrubHub
- DoorDash
- Uber Eats
- Postmates
- Extensible to add more

**Integration Approach:**
- **Recommended:** Aggregator service (Otter, Chowly)
  - Single integration, normalized data
  - Maintained by vendor (handles API changes)
  - Monthly fee per location
- **Alternative:** Direct API integration per platform
  - More control, no middleman fees
  - Must maintain integrations for each platform

**Inbound Order Flow:**
1. Customer orders on delivery platform (GrubHub, DoorDash, etc.)
2. Platform sends webhook to backend
3. Backend parses platform-specific format
4. Map platform items to POS menu items (SKU matching)
5. Create order in POS with "Delivery - [Platform]" tag
6. Assign to delivery prep station (if configured)
7. Order appears on kitchen display with "Delivery" indicator
8. Kitchen preps order
9. Status update sent to platform when ready
10. Platform dispatches driver (if marketplace delivery)

**Outbound Menu Sync:**
- Manage menu once in POS admin
- Push changes to all delivery platforms
- What syncs:
  - Menu items (name, description, price)
  - Categories and organization
  - Photos (resized to platform requirements)
  - Availability (in-stock, out-of-stock, 86'd)
  - Modifiers and customization options
- Sync triggers:
  - Manual: "Push to platforms" button
  - Automatic: On menu save (configurable)
  - Scheduled: Nightly sync for consistency

**Order Status Updates:**
- Kitchen to platform:
  - **Order Received:** Confirmed
  - **Preparing:** Items in progress
  - **Ready for Pickup:** Driver can collect
  - **Picked Up:** Driver confirmed pickup
- Platform to POS:
  - **Driver Assigned:** Name and ETA
  - **Driver Arriving:** 5 minutes away
  - **Delivered:** Order completed

**86'd Item Handling:**
- Mark item unavailable in POS
- Instantly disables on all platforms
- Prevents orders for out-of-stock items
- Re-enable syncs availability back

**Payment Reconciliation:**
- Platforms deposit (sales - commission) weekly
- POS records full sale amount
- Commission tracked as expense
- Reconciliation report:
  - Daily: Total delivery sales by platform
  - Weekly: Expected deposit vs. actual deposit
  - Identify discrepancies (refunds, adjustments)

**Error Handling:**
- Menu item mapping failures: Alert staff, allow manual entry
- Webhook failures: Fallback polling (every 60 seconds)
- Status update failures: Retry with exponential backoff, alert after max retries

---

## 8. Testing, Quality & Documentation

### Unit Testing (Jest)

**Business Logic Coverage (80% target):**
- **Order calculations:**
  - Subtotal = sum of (item price + modifiers) × quantity
  - Tax calculation (single rate, multiple rates, tax-exempt items)
  - Discount application (percentage, fixed amount, BOGO)
  - Tip calculation (percentage, fixed amount)
  - Total = subtotal + tax + tip - discounts
- **Loyalty points:**
  - Points earned = (order total × earn rate) × tier multiplier
  - Points redemption value
  - Tier threshold calculations (upgrade/downgrade)
- **Inventory deduction:**
  - Recipe-based ingredient tracking
  - Portion sizes and yields
  - Stock level updates on order completion
- **Permission checks:**
  - RBAC enforcement (user has required scope?)
  - Dynamic permissions (manager approval needed?)

**Service Layer Testing:**
- Offline sync queue (priority sorting, retry logic, conflict resolution)
- Authentication (PIN validation, token generation, session timeout)
- API client (request/response handling, error cases, retries)

**Utilities:**
- Date/time helpers
- Formatting (currency, phone numbers)
- Validation (email, phone, credit card format)

### Integration Testing

**API Integration:**
- Order flow: Frontend → API → Database → Socket.IO broadcast
- Payment processing: POS → Backend → Terminal SDK → Mock terminal
- Delivery webhooks: Mock GrubHub → Backend → Order creation
- Menu sync: Admin → Backend → Push to platforms

**Environment:**
- Test database (reset before each suite)
- In-memory Redis
- Mock external services (payment terminals, delivery platforms)

**Tools:**
- Supertest (HTTP assertions)
- Mock Socket.IO server/client
- Mock payment terminal responses

### E2E Testing (Cypress)

**Critical User Paths:**
1. **Waiter takes order:**
   - Login with PIN → Select table → Add items → Customize → Fire to kitchen
   - Verify: Order appears on kitchen display
2. **Payment processing:**
   - Select order → Process card payment → Terminal approval → Receipt printed
   - Verify: Order status "Completed", table available
3. **Kiosk order:**
   - Start order → Select items → Customize → Checkout → Pay → Confirmation
   - Verify: Order appears in kitchen display
4. **Offline mode:**
   - Disconnect network → Take order → Reconnect → Verify sync
5. **Kitchen workflow:**
   - New order → Mark in progress → Mark ready → Complete → Order bumps off

**Visual Regression:**
- Screenshot comparison for critical screens
- Material Design consistency checks
- Responsive testing (tablet, kiosk portrait, desktop)
- Tools: Percy or Applitools

### Code Quality

**Standards:**
- ESLint with Angular recommended rules
- Prettier for code formatting
- TypeScript strict mode enabled
- WCAG AA accessibility compliance
- Component documentation with examples

### Documentation

**Technical Documentation:**
- API endpoint documentation (Swagger/OpenAPI)
- Component library documentation (Storybook)
- State management architecture (NgRx flow diagrams)
- Deployment guide (Docker, environment setup)

**User Documentation:**
- User training materials (video tutorials)
- Admin configuration guide (menu setup, user management, settings)
- Troubleshooting guide (common issues and solutions)

### CI/CD Pipeline

**Continuous Integration:**
- **On every commit:**
  - Lint code (ESLint, Prettier)
  - Run unit tests (Jest)
  - Build all apps (check for compile errors)
- **On pull request:**
  - All above + integration tests
  - Code coverage report (fail if < 70%)
- **Nightly:**
  - Full E2E test suite (Cypress)
  - Visual regression tests
  - Performance benchmarks

**Deployment Pipeline:**
```
Commit → Lint & Unit Tests → Build → Integration Tests
  ↓
Merge to main → E2E Tests → Deploy to Staging → Smoke Tests
  ↓
Manual Approval → Deploy to Production → Smoke Tests → Monitor
```

**Deployment Strategy:**
- Zero-downtime deployments (Docker rolling updates)
- Database migrations run automatically
- Rollback capability (keep previous Docker images)
- Health checks before marking deployment successful

---

## Timeline Estimate

**Phase 1: Foundation (Weeks 1-2)**
- Shared UI components library
- Complete NgRx feature stores
- Authentication flow with backend integration

**Phase 2: POS Staff App (Weeks 3-6)**
- Dashboard with real-time metrics
- Complete POS order taking flow
- Table management
- Payment processing

**Phase 3: Kitchen Display (Weeks 7-8)**
- Real-time order display
- Order management and status tracking
- Station-specific filtering

**Phase 4: Customer Kiosk (Weeks 9-11)**
- Guided ordering flow
- Customization wizard
- Payment integration
- Touch optimization

**Phase 5: Admin Dashboard (Weeks 12-14)**
- Real-time dashboard
- Financial and operational reports
- Management functions (menu, users, settings)

**Phase 6: Customer Web App (Weeks 15-17)**
- Online ordering interface
- Order tracking
- Account and loyalty features

**Phase 7: Advanced Features (Weeks 18-20)**
- Offline sync implementation
- Payment terminal integration
- Delivery platform integration
- Loyalty program complete

**Phase 8: Testing & Polish (Weeks 21-24)**
- Complete test suites (unit, integration, E2E)
- Bug fixes and refinements
- Performance optimization
- Documentation
- User acceptance testing

**Total Estimated Timeline:** 24 weeks (6 months)

---

## Success Criteria

**Functional Requirements:**
- All 5 applications fully functional
- All features from design document implemented
- End-to-end order flow working (POS → Kitchen → Payment → Receipt)
- Real-time updates working across all devices
- Offline mode working with sync recovery

**Quality Requirements:**
- 80% unit test coverage on business logic
- All E2E critical paths passing
- WCAG AA accessibility compliance
- Material Design 3 consistency throughout
- No critical bugs in production

**Performance Requirements:**
- Order processing < 30 seconds (online) or instant (offline)
- Page load times < 3 seconds on cellular
- Real-time updates < 1 second latency
- Sync recovery < 5 minutes after reconnection

**User Satisfaction:**
- NPS (Net Promoter Score) > 50
- Staff training < 1 hour per role
- Less than 5% error rate in order entry
- Zero payment processing errors

---

## Next Steps

1. ✅ Scope validated and documented
2. → Create detailed implementation plan with task breakdown
3. → Set up git worktree for isolated development
4. → Begin implementation in phases
5. → Regular check-ins and progress reviews

---

**Document Status:** Validated and Ready
**Date:** 2025-11-23
**Approved By:** User
