# Angular Frontend Rebuild - Complete Redesign

**Date:** 2025-11-22
**Status:** Design Approved
**Scope:** Complete frontend redesign with Angular, Material Design 3, and enterprise-grade features

---

## Executive Summary

This document outlines the complete redesign of Resolute POS frontend using Angular 18+, Material Design 3, and offline-first architecture. The system will support full-service restaurants, quick-service operations, and self-service kiosks with enterprise-grade security, comprehensive integrations, and multi-location readiness.

**Key Goals:**
- Fresh start with modern, enterprise-grade Google-backed tools
- Very modern look with Material Design 3
- Ease of use for all user types (staff, kitchen, customers)
- Offline-first reliability with real-time sync
- PCI/GDPR compliance and SOC 2 readiness
- Single location deployment with multi-location architecture

---

## 1. High-Level Architecture

### Frontend: Angular 18+ with Material Design 3

**Core Technologies:**
- Angular 18+ (latest stable)
- Angular Material with Material Design 3 theming
- Progressive Web App (PWA) with Service Workers
- NgRx for state management
- IndexedDB for encrypted local storage
- Socket.IO client for real-time updates
- RxJS for reactive programming

**PWA Capabilities:**
- Offline-first architecture
- Background sync for queued operations
- Push notifications for orders and alerts
- App-like installation on all devices
- Service Worker caching strategies

### Backend: Node.js/Express (Current)

**Keep existing backend with noted improvements:**
- Existing REST API structure maintained
- MySQL database retained
- Socket.IO server for real-time broadcasts
- JWT authentication preserved

**Future improvements (tracked separately):**
- Migration to NestJS for TypeScript consistency
- Microservices architecture for delivery integrations
- GraphQL API option for flexible queries
- Enhanced caching and performance optimization
- Centralized cloud backend for multi-location owner dashboard

### Data Flow

**Online Mode:**
```
Angular → REST API → MySQL → Socket.IO → Real-time updates to all clients
```

**Offline Mode:**
```
Angular → IndexedDB (encrypted) → Queue for background sync
```

**Sync Recovery:**
```
Background Sync Service → Priority queue (payments first) → API → Conflict resolution
```

**Payment Terminal Integration:**
```
POS → Dejavoo/PAX SDK → Terminal → Response → Queue if offline → Process when online
```

### Multi-Location Architecture

**Current deployment:**
- Single location on Intel N100 hardware
- Independent POS instance per location
- Self-hosted with cellular backup

**Multi-location readiness:**
- Tenant ID architecture built-in
- Future cloud backend aggregates data
- Centralized owner dashboard (Phase 3)
- Location-specific configurations

---

## 2. Application Structure & Modules

### Angular Workspace Organization

```
apps/
├── pos-staff/          # Waiter/cashier interface (tablet/desktop)
├── pos-kiosk/          # Customer self-service kiosk (touchscreen)
├── kitchen-display/    # Kitchen display system (wall-mounted screens)
├── admin-dashboard/    # Manager/admin interface (desktop/tablet)
└── customer-web/       # Online ordering web app (mobile/desktop)

libs/ (shared libraries)
├── ui-components/      # Shared Material Design components
│   ├── buttons/
│   ├── cards/
│   ├── modals/
│   ├── navigation/
│   └── themes/
├── data-access/        # API services, state management
│   ├── api-client/
│   ├── state/          # NgRx store, effects, reducers
│   └── models/
├── auth/               # Authentication & authorization
│   ├── pin-auth/
│   ├── jwt-service/
│   └── guards/
├── offline-sync/       # Offline queue & sync logic
│   ├── indexeddb/
│   ├── sync-service/
│   └── conflict-resolution/
└── payment/            # Payment terminal integrations
    ├── dejavoo/
    ├── pax/
    └── queue/
```

### Why Separate Apps?

**Different devices, different UIs:**
- Kitchen displays: Large text, minimal interaction, auto-refresh
- Kiosks: Touch-optimized, customer-friendly, guided flows
- Staff POS: Dense information, fast data entry, keyboard shortcuts
- Admin: Charts, tables, complex forms, detailed reports

**Performance benefits:**
- Each app bundles only required features
- Smaller bundle sizes = faster load times
- Critical for offline-first PWA installation

**Security isolation:**
- Kiosk has zero access to admin features
- Kitchen display can't access financial data
- Role-based app deployment

**Deployment flexibility:**
- Update kitchen display without touching POS
- Roll out kiosk features independently
- Test admin features in isolation

### Module Lazy Loading

**Immediately loaded (critical path):**
- Authentication (PIN login)
- Order taking core features
- Kitchen display basics
- Payment processing

**Lazy loaded (on-demand):**
- Reports and analytics
- Settings and configuration
- Inventory management
- Customer management
- Reservation system

**Benefits:**
- Fast initial load (< 3 seconds on cellular)
- Reduced memory footprint
- Better offline cache management

---

## 3. Core User Workflows

### Waiter Workflow (pos-staff app)

**1. PIN Login**
- Enter 4-6 digit PIN on shared tablet/terminal
- Fast authentication without passwords
- Role-based permissions loaded
- Session persists until manual logout or timeout

**2. Dashboard View**
- Visual floor plan with table status:
  - Green: Available
  - Yellow: Occupied
  - Red: Needs attention (bill ready, service request)
  - Blue: Reserved
- Quick stats: Orders in progress, tables assigned to user
- Notifications: Kitchen ready, manager approval needed

**3. Table Selection**
- Tap table on floor plan
- View current order (if any)
- Options: New order / Add to order / Request bill / Clear table

**4. Order Taking**
- Category grid (Appetizers, Entrees, Drinks, Desserts)
- Item selection with photos and prices
- Customization modal:
  - Size, temperature, cooking preferences
  - Add-ons and modifiers
  - Special instructions (allergy notes)
- Add to order, continue shopping

**5. Review & Fire to Kitchen**
- Review full order with pricing
- Edit quantities, remove items
- Split by course (appetizers first, then entrees)
- Fire to kitchen → Auto-routes by station configuration

**6. Order Modifications**
- Edit existing orders (with timestamp tracking)
- Void items (manager approval required for high-value)
- Add rush flag for priority

**7. Handoff to Payment**
- Transfer order to cashier station
- Or process payment directly (if permissions allow)

### Kitchen Staff Workflow (kitchen-display app)

**1. Auto-Login**
- Station-specific login (Grill, Fryer, Salad, Expo, etc.)
- Persistent session (no timeout on kitchen displays)

**2. Order Display**
- Cards appear in priority order:
  - Rush orders (red border)
  - Dine-in orders (ordered by fire time)
  - Delivery/takeout (ordered by promised time)
- Each card shows:
  - Order number
  - Table/ticket number
  - Items for this station only
  - Modifiers and special instructions
  - Timer (minutes since fired)

**3. Prep Tracking**
- Tap item → Marks "In Progress" (yellow highlight)
- Tap again → Marks "Ready" (green checkmark)
- All items ready → Order card highlights for completion

**4. Order Completion**
- Tap "Complete" → Order bumps off screen
- Notification sent to expo/waiter
- Delivery platform updated (if applicable)

**5. Recall & History**
- Access completed orders (last 2 hours)
- Reprint tickets if needed
- View average prep times

### Cashier Workflow (pos-staff app)

**1. PIN Login**
- Quick PIN entry
- Cashier-specific dashboard

**2. Open Orders View**
- List of orders ready for payment
- Organized by table number or ticket number
- Highlight urgent/waiting orders

**3. Select Order**
- View itemized bill
- Apply discounts (with manager approval)
- Split bill options:
  - Split by item (drag items to separate bills)
  - Split evenly by count (2, 3, 4 people)
  - Split by custom amounts

**4. Payment Processing**
- Select payment type:
  - Cash
  - Card (send to terminal)
  - Mobile wallet (terminal)
  - Gift card
  - Loyalty points
  - Split payment (multiple types)
- Add tip (suggested amounts or custom)

**5. Terminal Integration**
- Send amount to Dejavoo/PAX terminal
- Customer completes transaction on terminal
- If offline: Queue transaction, notify customer
- Receive response (approved/declined)

**6. Receipt & Completion**
- Print receipt (thermal printer)
- Email receipt (if customer provides email)
- SMS receipt option
- Mark order complete
- Table status updates to available

**7. Cash Drawer Management**
- Track cash in/out
- Manager approvals for large bills
- End-of-shift reconciliation

### Manager Workflow (admin-dashboard app)

**1. Real-time Dashboard**
- Today's sales total and order count
- Hourly sales trend graph
- Active tables and kitchen queue depth
- Alerts: Low inventory, failed syncs, delivery issues

**2. Reports Access**
- Financial: Sales, payments, tips, discounts
- Operational: Order volume, timing, table turnover
- Staff: Performance, productivity
- Inventory: Stock levels, COGS, waste

**3. Settings & Configuration**
- Menu management
- User management (add staff, assign PINs)
- Table layout configuration
- Kitchen station setup
- Tax and pricing rules

**4. Approvals**
- Void high-value items
- Comp meals
- Override discounts
- Refund requests

**5. Inventory Management (Admin only)**
- Recipe management
- Vendor and purchase orders
- COGS analysis
- Price optimization

### Customer Workflow (pos-kiosk app)

**See Section 4 for detailed kiosk experience**

---

## 4. Customer Kiosk Experience

### Visual Design Principles

**Material Design 3 implementation:**
- Dynamic color theming from food photography
- Elevated surfaces for cards and buttons
- High contrast ratios (WCAG AA compliant)
- Consistent spacing and alignment
- Smooth transitions and micro-interactions

**Touch-optimized:**
- Minimum touch target: 80px × 80px
- Spacing between targets: 16px minimum
- Large, readable fonts (24px+ for body text)
- No hover states (touch-first design)

**Layout:**
- Portrait or landscape orientation support
- Persistent cart summary (right sidebar on landscape, bottom drawer on portrait)
- Always-visible navigation: "Back", "Start Over", "Call for Help"
- Full-screen mode (hide browser chrome)

### Guided Ordering Flow

**1. Welcome Screen**
- Large hero image (daily special or brand image)
- Three primary actions:
  - **Start Order** (large, prominent button)
  - **Reorder** (for loyalty members with QR/phone lookup)
  - **Browse Menu** (for experienced customers who prefer browsing)
- Language selector (if multi-language)
- Accessibility options button

**2. Category Selection**
- Large photo cards in grid layout (2-3 columns)
- Categories: Burgers, Salads, Drinks, Desserts, etc.
- Each card shows:
  - High-quality photo
  - Category name
  - Item count or starting price
- "Popular" or "New" badges

**3. Item Selection**
- Menu items within selected category
- Grid or list view (configurable)
- Each item shows:
  - Large photo (appetizing, professional)
  - Name and short description
  - Price
  - Badges: Popular, Spicy, Vegetarian, Gluten-Free, etc.
  - Calorie count (if available)
- Tap to select and customize

**4. Customization Wizard**
- Step-by-step customization (only show relevant options):
  - **Size?** (Small, Medium, Large) with price differences
  - **Temperature?** (for burgers, steaks)
  - **Add-ons?** (Cheese, Bacon, Avocado) with visual toggles
  - **Side?** (Fries, Salad, Fruit)
  - **Drink?** (if combo)
- Visual feedback: Selected options highlighted
- Running price updates as options change
- "Special instructions" text field (optional)

**5. Contextual Upsells**
- After adding item to cart:
  - "Make it a combo?" (add drink + side for $X more)
  - "Add fries for just $2?"
  - "Customers also love [item]"
- Easy to dismiss ("No thanks" button)

**6. Cart Review**
- Persistent cart summary shows:
  - Item thumbnails
  - Names and customizations
  - Individual prices
  - Quantity adjustment (+/- buttons)
  - Remove item (trash icon)
- Subtotal, tax, and total prominently displayed
- "Continue ordering" or "Checkout" buttons

**7. Checkout**
- Review full order one last time
- Add special instructions for entire order
- Select order type:
  - Dine-in (table number entry)
  - Takeout (name for pickup)
- Payment options (card reader or mobile wallet only, no cash)
- Loyalty member lookup (phone number or scan code)

**8. Payment Processing**
- Clear instructions: "Insert card" or "Tap phone/card"
- Visual feedback during processing
- If offline: "Payment queued, you'll receive confirmation when processed"

**9. Order Confirmation**
- Large order number for pickup
- Estimated ready time
- Option to print receipt or SMS receipt
- "Track your order" link (if online ordering app)
- "Done" button returns to welcome screen

### Accessibility Features

**Screen reader support:**
- Semantic HTML and ARIA labels
- Descriptive alt text for all food images
- Announced state changes ("Item added to cart")

**High contrast mode:**
- Toggle for high contrast colors
- Increased border visibility
- No reliance on color alone for information

**Multiple languages:**
- Language selector on welcome screen
- Full translation of UI and menu items
- Language persists through session

**Call for help:**
- Always-visible button to summon staff
- Audio alert and on-screen notification to staff devices

**Accessibility settings:**
- Font size adjustment
- Longer timeout before session reset
- Audio cues for button presses

---

## 5. Admin Dashboard & Reporting

### Dashboard Home - Real-Time Metrics

**Today's Snapshot (top row):**
- **Sales Total:** $X,XXX.XX (vs. yesterday: +X%)
- **Order Count:** XXX orders (avg ticket: $XX.XX)
- **Active Tables:** X of XX occupied
- **Kitchen Queue:** X orders in progress

**Charts & Graphs:**
- **Hourly Sales Trend:** Line graph, compare to previous day/week
- **Order Volume:** Bar chart by hour
- **Payment Type Breakdown:** Pie chart (Cash, Card, Mobile, etc.)
- **Top Selling Items:** Horizontal bar chart (top 10)

**Alerts & Notifications:**
- Low inventory warnings (red badge)
- Failed payment syncs (yellow badge)
- Delivery platform issues (orange badge)
- Pending approvals (void requests, refunds)

**Quick Actions:**
- Open cash drawer reconciliation
- View pending voids
- Generate end-of-day report
- Export today's data

### Financial Reports

**Sales Reports:**
- **By period:** Hour, day, week, month, custom range
- **Comparison:** vs. previous period, vs. same period last year
- **Breakdown:** By payment type, by staff member, by order type (dine-in, takeout, delivery)
- **Discounts & Comps:** Total value, frequency, staff attribution
- **Refunds:** Total, reasons, frequency

**Payment Type Analysis:**
- Cash vs. Card vs. Mobile wallet percentages
- Average transaction value by payment type
- Failed transactions and reasons

**Tips Analysis:**
- Total tips by staff member
- Average tip percentage by server
- Tip trends over time

**Tax Reports:**
- Total tax collected by period
- Tax breakdown by rate (if multiple tax rates)
- Export for accounting software (CSV, QuickBooks format)

**Export Options:**
- CSV, Excel, PDF
- Scheduled email reports (daily, weekly, monthly)
- Integration with accounting software

### Operational Reports

**Order Volume & Timing:**
- Orders per hour, day, week
- Average prep time by kitchen station
- Order to ready time distribution
- Rush vs. standard orders

**Table Turnover:**
- Average table occupancy time
- Tables per shift
- Peak hours analysis
- Table assignment efficiency

**Kitchen Performance:**
- Average prep time by station
- Bottleneck identification
- Item prep time trends
- Late orders report

**Staff Productivity:**
- Orders per hour by waiter
- Average ticket size by waiter
- Void rate by staff member
- Speed of service metrics

**Delivery Platform Performance:**
- Order volume by platform (GrubHub, DoorDash, etc.)
- Average order value by platform
- Error rate and issues log
- Commission costs by platform

### Inventory & Supply Chain (Admin Only)

**Real-Time Stock Levels:**
- Current inventory by item
- Low-stock alerts (configurable thresholds)
- Out-of-stock items
- Overstock warnings

**Recipe Management:**
- Menu item to ingredient mapping
- Portion sizes and yields
- Auto-deduction on sale (recipe-based inventory)
- Recipe costing with current ingredient prices

**COGS (Cost of Goods Sold):**
- Per menu item COGS
- Overall COGS percentage
- Trends over time
- Identify high-cost items

**Vendor Management:**
- Vendor contact information
- Price lists per vendor
- Purchase order creation
- Order history and tracking

**Purchase Orders:**
- Create PO from low-stock alerts
- Send to vendors (email/print)
- Receive and reconcile deliveries
- Track PO status (pending, received, partial)

**Waste Tracking:**
- Daily waste entry (spoilage, prep errors)
- Waste by category (produce, meat, etc.)
- Cost of waste over time
- Variance reports (expected vs. actual inventory)

**Price Optimization:**
- Suggest menu price adjustments based on COGS
- Ingredient price trend analysis
- Profitability by menu item
- Recommendations for high-margin items to promote

### Customizable Dashboard Views

**Widget System:**
- Drag-and-drop dashboard widgets
- Resize and reorder
- Hide/show widgets based on role
- Save custom layouts per user

**Saved Report Templates:**
- Save frequently used report configurations
- One-click report generation
- Share templates with other managers

**Scheduled Reports:**
- Auto-generate and email reports
- Daily: End-of-day sales summary
- Weekly: Sales and labor reports
- Monthly: Full financial and inventory reports

**Role-Based Visibility:**
- **Managers:** See operational reports, limited financial
- **Owners/Admins:** See everything including COGS, profit margins
- **Kitchen Managers:** See kitchen performance, inventory only

---

## 6. Offline-First Architecture & Sync Strategy

### Local Data Storage (IndexedDB)

**What's stored locally:**
- **Menu data:** Items, categories, prices, images (cached for fast load)
- **Customer data:** Loyalty members, order history (encrypted)
- **Order queue:** Pending orders, modifications, voids
- **Transaction queue:** Payments pending processing
- **Audit logs:** All actions for compliance
- **Configuration:** Settings, table layouts, kitchen stations
- **Images:** Menu photos, branding assets

**Encryption:**
- AES-256 encryption for all sensitive data at rest
- Encryption keys derived from device + user credentials
- Secure key storage using Web Crypto API

**Storage quotas:**
- Request persistent storage (no eviction)
- Monitor storage usage, alert when approaching limits
- Cleanup old data (configurable retention periods)

### What Works Offline

**Full POS Functionality:**
- Take orders, modify orders, void items
- Apply discounts, split bills
- Process cash payments (recorded locally)
- Queue card payments (processed when online)
- Print receipts (local thermal printers)

**Kitchen Display:**
- Receive orders via local sync (WebRTC peer-to-peer when available)
- Update order status (prep, ready)
- Orders sync across local devices via broadcast

**Inventory:**
- View current stock levels (cached locally)
- Record waste and usage
- Low-stock alerts based on local data

**Reports:**
- Generate reports from locally cached data
- View historical data (last 30 days cached)
- Export cached data to CSV

**Kiosk:**
- Full ordering functionality
- Queue payments for processing
- Notify customers of offline status

### What Requires Online (with Graceful Degradation)

**Card Payment Authorization:**
- Queue transactions locally
- Notify customer: "Payment will process when connection returns"
- Process queue when online, send confirmation

**Delivery Platform Orders:**
- Queue incoming orders (if platform supports webhooks offline)
- Sync bidirectionally when online
- Alert staff of pending delivery orders

**Menu Updates from Admin:**
- Updates queued until sync
- Local devices continue with cached menu
- Sync when connection restored

**Multi-Device Real-Time:**
- Real-time via Socket.IO when online
- Falls back to periodic local sync (every 30 seconds)
- WebRTC peer-to-peer for local network sync

### Sync Strategy

**Background Sync Service:**

**Connection monitoring:**
- Constantly monitor network status (online/offline)
- Detect connection type (WiFi, cellular, none)
- Fallback from WiFi → Cellular automatically
- Alert staff when on cellular (limited data)

**Priority Queue:**
1. **Critical (sync immediately):**
   - Payment processing
   - Order placement
   - Kitchen status updates
2. **High priority (sync within 1 minute):**
   - Order modifications
   - Table status changes
3. **Medium priority (sync within 5 minutes):**
   - Customer data updates
   - Inventory adjustments
4. **Low priority (sync when idle):**
   - Audit logs
   - Analytics data

**Retry Logic:**
- Exponential backoff: 1s → 2s → 4s → 8s → 16s → 30s → 60s
- Max retries: 10 attempts
- Manual retry button in UI
- Alert staff if sync fails after max retries

**Conflict Resolution:**
- **Server timestamp wins** for most data
- **Client wins** for user input (order modifications)
- Audit trail logs all conflicts and resolutions
- Manual resolution for critical conflicts (notify manager)

**Conflict scenarios:**
1. **Same order modified on two devices offline:**
   - Last modification timestamp wins
   - Log both versions in audit trail
2. **Inventory adjusted on multiple devices:**
   - Sum all adjustments, apply to server value
3. **Menu item price changed during offline sale:**
   - Sale records price at time of order (client wins)

### Sync Status Indicators

**Visual indicators throughout UI:**
- **Green dot:** Online, real-time sync
- **Yellow dot:** Offline, X items queued for sync
- **Red dot:** Sync failed, requires attention

**Detailed sync status (admin view):**
- Queue depth by priority
- Last successful sync timestamp
- Failed sync items with error details
- Manual sync trigger button

**Staff notifications:**
- Toast notification when going offline
- Alert when queue depth exceeds threshold
- Notification when critical sync fails (payment processing)

---

## 7. Security, Authentication & Compliance

### Authentication & Authorization

**PIN-Based Login for Staff:**

**PIN Management:**
- Admin assigns 4-6 digit PIN to each staff member
- PIN hashed using Scrypt (memory-hard, GPU-resistant)
- Never stored in plaintext
- PIN change required every 90 days (configurable)

**Login Flow:**
1. Staff enters PIN on shared terminal
2. PIN validated against hashed value
3. JWT tokens issued (access + refresh)
4. Session created with role/permissions loaded
5. Device fingerprint recorded for audit

**Security Measures:**
- **Rate limiting:** 3 failed attempts → 30-second lockout
- **Progressive delays:** Each failed attempt adds delay
- **Account lockout:** 5 failed attempts → manager unlock required
- **Session timeout:** 15 minutes inactivity on shared stations
- **Auto-logout:** Configurable timeout (30 min default)

**Fast User Switching:**
- "Switch User" button (no full logout required)
- Previous user session paused, new PIN entry
- Original user can resume with PIN re-entry
- Audit log records all user switches

**JWT Tokens for API:**

**Token Structure:**
- **Access token:** 15-minute expiry, stored in httpOnly cookie
- **Refresh token:** 7-day expiry, stored in httpOnly cookie
- Tokens include: user ID, role, scopes, device ID, issued/expiry timestamps

**Token Storage:**
- HttpOnly cookies prevent XSS attacks
- Secure flag requires HTTPS
- SameSite=Strict prevents CSRF
- Encrypted copy in IndexedDB for offline sessions

**Token Refresh:**
- Automatic refresh before expiry
- Refresh token rotation (new token issued on refresh)
- Invalid refresh token → full re-authentication

**Offline Authentication:**
- Cached encrypted tokens allow offline login
- Local PIN validation against cached hash
- Sync authentication events when online

### Role-Based Access Control (RBAC)

**Roles:**
- **Admin:** Full system access
- **Manager:** Reports, inventory, settings, approvals
- **Waiter:** Order taking, table management
- **Cashier:** Payment processing, order completion
- **Kitchen:** Order display, status updates
- **Customer:** Kiosk ordering only

**Scopes (granular permissions):**
- `pos:order` - Take and modify orders
- `pos:void` - Void items (may require manager approval)
- `pos:discount` - Apply discounts
- `kitchen:view` - View kitchen display
- `kitchen:update` - Update order status
- `payment:process` - Process payments
- `payment:refund` - Issue refunds
- `admin:reports` - View reports
- `admin:inventory` - Manage inventory
- `admin:settings` - Change settings
- `admin:users` - Manage users and PINs

**Enforcement:**
- **Angular route guards:** Prevent navigation to unauthorized routes
- **UI component guards:** Hide/disable unauthorized actions
- **Backend middleware:** Validate every API call
- **Scope checks:** Granular permission checks on sensitive actions

**Dynamic permissions:**
- Manager approval required for high-value voids
- Cashier can process payments < $500, manager approval for > $500
- Configurable thresholds per action

### Audit Logging

**What's logged:**
- All user actions: Login, logout, user switches
- Order operations: Create, modify, void, complete
- Payment transactions: Process, refund, split
- Inventory adjustments: Manual counts, waste, receiving
- Settings changes: Menu updates, price changes, user management
- Security events: Failed logins, permission denials, token refresh
- System events: Offline/online transitions, sync failures

**Log Structure:**
```json
{
  "timestamp": "2025-11-22T10:30:45.123Z",
  "userId": "user_123",
  "userName": "John Doe",
  "role": "waiter",
  "action": "order:void",
  "resource": "order_456",
  "details": {
    "items": ["Burger", "Fries"],
    "reason": "Customer changed mind",
    "approvedBy": "manager_789"
  },
  "deviceId": "terminal_001",
  "ipAddress": "192.168.1.100",
  "success": true
}
```

**Log Storage:**
- Append-only table (immutable)
- Encrypted at rest
- Indexed for fast searching
- Retained per compliance requirements (default: 7 years)

**Audit Log Interface (Admin):**
- Search by user, action, date range, resource
- Filter by success/failure
- Export for external audit
- Real-time monitoring dashboard

### PCI Compliance (SAQ A)

**Why SAQ A (simplest PCI level):**
- Payment terminals (Dejavoo/PAX) handle all card data
- Your system never sees, stores, or transmits card numbers
- Only transaction amounts and approval codes in your system

**PCI Requirements Met:**

**1. Secure Network:**
- HTTPS everywhere (TLS 1.3)
- Firewall between POS and internet
- No default passwords
- Encrypted WiFi (WPA3)

**2. Cardholder Data:**
- **NOT stored in your system** (terminals handle it)
- Transaction IDs and approval codes only
- No CVV, track data, or PINs ever stored

**3. Vulnerability Management:**
- Regular software updates
- Security patches applied promptly
- Antivirus on terminals (if applicable)

**4. Access Control:**
- Unique PIN per user
- RBAC limits payment access
- Physical security for terminals

**5. Network Monitoring:**
- Audit logging (all access tracked)
- Failed login monitoring
- Sync failure alerts

**6. Information Security Policy:**
- Documented security policies
- Staff training on PCI compliance
- Incident response plan

**Quarterly scans and annual assessments:**
- Self-assessment questionnaire (SAQ A)
- Network vulnerability scans
- Document compliance for card processors

### GDPR Compliance

**Data Collection & Consent:**

**Customer data collected:**
- Phone number, email, name (loyalty program)
- Order history and preferences
- Payment metadata (not card numbers)

**Consent management:**
- Explicit opt-in for marketing communications
- Separate consent for data collection vs. marketing
- Consent timestamp and source logged
- Easy withdrawal of consent (one-click unsubscribe)

**Data Subject Rights:**

**1. Right to Access:**
- Customer portal: View all collected data
- API endpoint: Export data as JSON
- Email request: Human-readable PDF export

**2. Right to Rectification:**
- Customer can update profile information
- Request corrections via staff or online

**3. Right to Erasure ("Right to be Forgotten"):**
- Anonymize customer data (replace with "Deleted User")
- Retain transaction history for accounting (7 years)
- Remove personally identifiable info (PII)
- Cannot delete if legal obligation to retain (taxes, disputes)

**4. Right to Data Portability:**
- Export customer data in machine-readable format (JSON, CSV)
- Include order history, preferences, loyalty points

**5. Right to Object:**
- Opt-out of marketing communications
- Object to automated decision-making (profiling for offers)

**Data Minimization:**
- Only collect necessary data
- No excessive data retention
- Regular data cleanup (purge old guest orders after 1 year)

**Privacy by Design:**
- Encryption at rest and in transit
- Anonymization where possible
- Access controls (staff can't view all customer data)

**Data Breach Response:**
- Detection: Monitoring and alerts
- Containment: Isolate affected systems
- Notification: 72-hour breach notification to authorities (GDPR requirement)
- Customer notification: Inform affected customers
- Documentation: Incident report and remediation

### SOC 2 Readiness

**Security Principle (Common Criteria):**
- Access controls (RBAC, PIN authentication)
- Logical and physical access restrictions
- System monitoring and logging
- Change management process

**Availability:**
- Offline-first ensures uptime
- Cellular backup for connectivity
- Redundant hardware recommended
- Disaster recovery plan

**Processing Integrity:**
- Audit trails for all transactions
- Data validation and error handling
- Reconciliation processes (cash drawer, inventory)

**Confidentiality:**
- Encryption at rest and in transit
- Access controls to sensitive data
- NDA for staff with data access

**Privacy:**
- GDPR compliance (above)
- Privacy policy displayed and accessible
- Customer consent management

**Documentation Required:**
- Policies and procedures manual
- Risk assessment and mitigation
- Incident response plan
- Change management process
- Employee training records
- Vendor management (third-party risk assessment)

---

## 8. Third-Party Integrations

### Delivery Platform Integration (Full Two-Way Sync)

**Supported Platforms:**
- GrubHub
- DoorDash
- Uber Eats
- Postmates
- (Extensible to add more)

**Integration Approach:**

**Option A: Direct API Integration**
- Pros: Full control, no middleman fees
- Cons: Maintain integrations for each platform

**Option B: Aggregator Service (Recommended)**
- Use: Otter, Chowly, or similar
- Pros: Single integration, normalized data, maintained by vendor
- Cons: Monthly fee per location

**Recommendation:** Start with aggregator service, migrate to direct APIs if volume justifies.

### Inbound Order Flow

**1. Customer Orders on Delivery App**
- Customer browses menu on GrubHub/DoorDash/etc.
- Places order, pays on platform

**2. Webhook to Backend**
- Delivery platform sends webhook to your backend
- Payload includes: Items, customizations, customer info, delivery address, promised time

**3. Parse and Normalize**
- Backend service parses platform-specific format
- Maps platform items to your menu items (SKU matching)
- Handles name variations ("Lg Burger" → "Large Burger")

**4. Create Order in POS**
- Order created with "Delivery - [Platform]" tag
- Assigned to delivery prep station (if configured)
- Customer name and delivery notes included

**5. Route to Kitchen Display**
- Order appears on kitchen displays
- Special "Delivery" indicator
- Promised time displayed (e.g., "Ready by 12:30 PM")

**6. Kitchen Prep**
- Kitchen marks items in progress / ready
- System tracks prep time

**7. Order Ready**
- Kitchen marks complete
- Status update sent to delivery platform
- Platform dispatches driver (if marketplace delivery)
- Driver ETA communicated to customer

**Offline Handling:**
- Delivery orders queue if backend offline
- Alert staff: "X delivery orders pending sync"
- Orders sync when connection restored
- Delayed orders flagged for staff attention

### Outbound Menu Sync

**Menu Management:**
- Manage menu once in your POS admin
- Push changes to all delivery platforms

**What Syncs:**
- Menu items (name, description, price)
- Categories and organization
- Photos (platform-specific size requirements)
- Availability (in-stock / out-of-stock / 86'd)
- Modifiers and customization options

**Sync Triggers:**
- Manual: "Push to platforms" button
- Automatic: On menu save (configurable)
- Scheduled: Nightly sync for consistency

**Platform-Specific Handling:**
- Map your categories to platform categories
- Adjust pricing per platform (account for commission)
- Handle platform-specific features (DoorDash promotions)

**86'd Item Handling:**
- Mark item unavailable in POS
- Instantly disables on all platforms
- Prevents orders for out-of-stock items
- Re-enable syncs availability back

### Order Status Updates

**Kitchen to Platform:**
- **Order Received:** Confirmed by kitchen
- **Preparing:** Items in progress
- **Ready for Pickup:** Driver can collect
- **Picked Up:** Driver confirmed pickup (if platform supports)

**Platform to POS:**
- **Driver Assigned:** Driver name and ETA
- **Driver Arriving:** Driver 5 minutes away
- **Delivered:** Order completed

**Benefits:**
- Accurate ETAs for customers
- Driver efficiency (no waiting)
- Better ratings on platforms

### Payment Reconciliation

**Platform Deposits:**
- Delivery platforms typically deposit (sales - commission) weekly
- Your POS records full sale amount
- Commission tracked as expense

**Reconciliation Report:**
- Daily: Total delivery sales by platform
- Weekly: Expected deposit vs. actual deposit
- Identify discrepancies (refunds, adjustments)

**Integration with Accounting:**
- Export delivery sales separately
- Track commission expense per platform
- Automated journal entries (future)

### Error Handling

**Menu Item Mapping Failures:**
- Platform sends item not in your system
- Alert staff, allow manual order entry
- Log for future mapping configuration

**Webhook Failures:**
- Platform webhook fails to reach your server
- Fallback: Poll platform API every 60 seconds
- Alert if orders delayed > 5 minutes

**Status Update Failures:**
- Retry status updates (exponential backoff)
- Alert staff if update fails after retries
- Manual status update option

---

## 9. Payment Terminal Integration

### Supported Terminals

**Dejavoo:**
- Models: Z6, Z8, Z9, Z11
- Connectivity: USB, Ethernet, WiFi

**PAX:**
- Models: A920, A80, S300
- Connectivity: USB, Ethernet, WiFi, Bluetooth

### Integration Architecture

**SDK Integration:**
- Use official Dejavoo/PAX SDKs
- Backend service handles terminal communication
- Frontend sends payment requests to backend

**Communication Flow:**
```
POS Frontend → Backend API → Terminal SDK → Terminal Device
    ↓                                              ↓
 Display "Processing..."                    Customer completes
    ↓                                              ↓
Response ← Backend ← Terminal SDK ← Response (Approved/Declined)
    ↓
Update order, print receipt
```

**Terminal Configuration:**
- Admin configures terminals in settings
- Map terminals to stations (cashier 1, cashier 2, etc.)
- Test connection and transaction

### Payment Processing Flow

**1. Cashier Initiates Payment**
- Select payment method: "Card"
- Enter amount (including tip if pre-entered)
- Tap "Process Payment"

**2. Send to Terminal**
- Backend sends transaction request to terminal SDK
- Request includes:
  - Amount
  - Transaction type (sale, refund, void)
  - Invoice number (order ID)
  - Optional: Tip amount

**3. Customer Interaction**
- Terminal prompts: "Insert, swipe, or tap card"
- Customer completes payment:
  - Insert chip card
  - Swipe mag stripe
  - Tap contactless (NFC)
  - Mobile wallet (Apple Pay, Google Pay)
- Terminal prompts for PIN if required
- Customer confirms amount

**4. Terminal Processes**
- Terminal communicates with payment processor
- Encryption handled by terminal (E2E encryption)
- Approved or declined response

**5. Response to POS**
- Terminal SDK returns response to backend
- Response includes:
  - Status (approved, declined, error)
  - Authorization code (if approved)
  - Transaction ID
  - Masked card number (last 4 digits)
  - Card type (Visa, Mastercard, etc.)
  - NO full card data (PCI compliance)

**6. Update Order**
- Backend updates order status
- Payment recorded with transaction ID
- Frontend displays result
- Print receipt

### Offline Transaction Queue

**Scenario: Internet down, cellular down**

**1. Cashier Processes Payment**
- Customer pays as normal
- Terminal queues transaction internally (Dejavoo/PAX feature)

**2. Transaction Queued**
- Terminal stores transaction locally
- Awaits connectivity to submit to processor

**3. POS Records Pending Payment**
- Order marked "Payment Pending"
- Store transaction details locally:
  - Amount
  - Terminal ID
  - Timestamp
  - Order ID

**4. Notify Customer**
- Receipt printed: "Payment pending processing"
- Customer informed of offline status
- Provide order anyway (trust-based, or collect alternate payment)

**5. Connectivity Restored**
- Terminal auto-submits queued transactions
- Backend polls terminal for status
- Update order status (approved/declined)

**6. Reconciliation**
- End-of-day report includes pending transactions
- Manually verify all pending resolved
- Follow up on declined transactions

**Edge Cases:**
- **Declined after offline:** Contact customer, request alternate payment
- **Duplicate transaction:** Terminal SDK prevents, but log and alert if occurs
- **Timeout:** Retry logic, manual void/reprocess if needed

### Refunds and Voids

**Refund (settled transaction):**
- Manager permission required
- Send refund request to terminal
- Customer re-presents card (or use original card token)
- Refund processed, funds returned in 3-5 days

**Void (same-day, unsettled transaction):**
- Cashier or manager can void
- Send void request with original transaction ID
- Terminal voids authorization
- Funds never leave customer account

**Partial Refunds:**
- Support partial refund amounts
- Useful for item-level refunds

### Terminal Management

**Admin Interface:**
- List all configured terminals
- View terminal status (online, offline, busy)
- Test transaction (swipe test card)
- View terminal logs and errors

**Terminal Settings:**
- Tip prompts (yes/no, suggested percentages)
- Receipt printing (terminal or POS printer)
- Signature capture threshold (e.g., $25+)
- PIN debit vs. credit preference

**Monitoring:**
- Failed transaction alerts
- Terminal offline alerts
- Transaction volume reports

---

## 10. Customer Engagement & Loyalty

### Loyalty Program

**Enrollment:**

**Kiosk Enrollment:**
1. Customer taps "Join Loyalty" on welcome screen
2. Enter phone number (primary identifier)
3. Optional: Email for receipts and promos
4. Optional: Name for personalization
5. Instant enrollment, start earning points

**Staff-Assisted Enrollment:**
- Waiter or cashier can enroll customers
- Same info collection
- Immediate points for current order

**Online Enrollment:**
- Sign up via customer web app
- QR code on receipts: "Join for rewards"

**Member Lookup:**
- Phone number entry (fastest)
- QR code scan (loyalty card in app)
- Email address

**Points & Rewards:**

**Earning Points:**
- Configurable: $1 spent = X points (default: 1 point)
- Bonus points for specific items or categories
- Double points days/hours (happy hour, promotions)
- Birthday bonus (configurable, e.g., 100 points)
- Anniversary bonus (annual signup date)

**Tiered Membership:**
- **Bronze:** 0-999 points (default, 1x earn rate)
- **Silver:** 1,000-4,999 points (1.25x earn rate)
- **Gold:** 5,000+ points (1.5x earn rate)

**Benefits by Tier:**
- **Bronze:** Earn points, redeem rewards
- **Silver:** + Priority support, early access to new items
- **Gold:** + Exclusive rewards, free birthday meal, concierge service

**Reward Catalog:**
- **Free items:** "Free coffee" (500 points), "Free burger" (1,500 points)
- **Discounts:** "$5 off $25+" (1,000 points), "20% off" (2,000 points)
- **Exclusive items:** Limited menu items for loyalty members
- **Experiences:** "Skip the line pass", "Chef's table reservation"

**Redemption:**
- **At kiosk:** View available rewards, tap to apply
- **At POS:** Staff can apply rewards to order
- **Online ordering:** Select reward at checkout

**Points Expiration:**
- Configurable (default: points expire after 12 months of inactivity)
- Notification before expiration (email/SMS)
- Activity = any earn or redeem action

**Fraud Prevention:**
- Limit redemptions per day (e.g., max 3 rewards/day)
- Transaction minimum for point earning ($5+)
- Account verification (email or SMS code)

### Online Ordering (customer-web app)

**Platform:**
- Progressive Web App (PWA)
- Installable on iOS/Android (add to home screen)
- Responsive: Mobile, tablet, desktop

**Ordering Interface:**

**1. Landing Page**
- Order now / Schedule for later
- Pickup or Delivery selector
- Login or continue as guest

**2. Menu Browsing**
- Same guided ordering as kiosk
- Search functionality (find items quickly)
- Filter: Dietary preferences, allergies
- Sort: Popular, price, new items

**3. Customization**
- Same wizard-style customization as kiosk
- Save favorites for quick reorder

**4. Cart & Checkout**
- Review order
- Apply loyalty rewards
- Scheduled pickup time (ASAP or future time)
- Delivery address entry (if delivery)

**5. Payment**
- Saved payment methods (tokenized, PCI-compliant)
- New card entry (processed via terminal on pickup, or online payment gateway for delivery)
- Loyalty points as payment option

**6. Order Tracking**
- Real-time status:
  - **Received:** Order sent to kitchen
  - **Preparing:** Kitchen working on it
  - **Ready:** Available for pickup
  - **On the way:** Driver en route (if delivery)
  - **Delivered/Completed**
- Estimated time updates
- SMS/push notifications on status change

**Account Features:**

**Order History:**
- View all past orders
- Details: Items, date, total
- "Reorder" button for instant repeat

**Favorites:**
- Save frequently ordered items
- Quick add to cart

**Saved Addresses:**
- Multiple delivery addresses
- Default address selection

**Payment Methods:**
- Save multiple cards (tokenized)
- Default payment method

**Preferences:**
- Dietary restrictions (saved to profile)
- Allergy information
- Notification preferences (SMS, email, push)

**Scheduled Ordering:**

**Future Orders:**
- Order now for pickup tomorrow
- Catering orders (large orders, advance notice)
- Recurring orders (e.g., "Every Friday at 12 PM")

**Kitchen Planning:**
- Scheduled orders visible in kitchen with prep time
- Alert kitchen when prep should start
- Avoid overwhelming kitchen with all scheduled orders at once

### CRM & Marketing

**Customer Database:**

**Data Collected:**
- Contact info: Phone, email, name
- Order history: Frequency, recency, monetary value (RFM analysis)
- Preferences: Favorite items, dietary restrictions
- Engagement: Email opens, click-throughs, app usage
- Source: Kiosk, online, in-store, delivery platform

**Customer Profiles:**
- View individual customer details
- Lifetime value (LTV)
- Visit frequency
- Average ticket size
- Last visit date

**Segmentation:**

**Automatic Segments:**
- **VIPs:** High LTV, frequent visits (top 10%)
- **Regulars:** Visit 2+ times/month
- **Occasionals:** Visit 1 time/month
- **Lapsed:** Haven't visited in 30+ days
- **At Risk:** Used to be regular, now occasional
- **New Customers:** First visit in last 30 days

**Custom Segments:**
- Create segments based on:
  - Order frequency
  - Average ticket size
  - Favorite items
  - Loyalty tier
  - Signed up for emails
  - Location (if multi-location)

**Marketing Campaigns:**

**Email Campaigns:**
- Integration: Mailchimp, SendGrid, or built-in email
- Templates: Welcome, birthday, lapsed customer, new item announcement
- Personalization: Customer name, favorite items, reward balance
- Tracking: Open rates, click-through rates, conversions

**SMS Campaigns:**
- Integration: Twilio, SimpleTexting
- Use cases: Order ready, delivery on the way, flash sales
- Opt-in required (GDPR/TCPA compliance)

**Targeted Promotions:**
- **VIPs:** Exclusive early access to new menu items
- **Lapsed customers:** "We miss you! 20% off your next order"
- **Regulars:** "Thanks for your loyalty, here's a free dessert"
- **New customers:** "Welcome back! 10% off second visit"

**Automated Triggers:**
- **Welcome series:** Day 1: Welcome, Day 3: How to use loyalty, Day 7: Favorite items
- **Birthday:** Email 1 week before with birthday reward
- **Lapsed:** 30 days no visit → "Miss you" email, 60 days → Discount offer
- **Post-purchase:** "Thanks for your order, rate your experience"

**Analytics:**

**Customer Lifetime Value (LTV):**
- Total revenue per customer over lifetime
- Segment by acquisition source (kiosk, online, delivery)
- Identify high-LTV acquisition channels

**Churn Rate:**
- % of customers who stop visiting
- Cohort analysis (customers acquired in Jan, how many still active?)

**Acquisition Sources:**
- New customers by source (kiosk, online, referral, delivery platform)
- Cost per acquisition (CPA) if running paid ads

**Campaign Performance:**
- Email open rates, click-through rates
- Redemption rates for promotions
- ROI per campaign

---

## 11. Testing Strategy

### Unit Testing (Jest)

**What to Test:**

**Critical Business Logic:**
- **Order calculations:**
  - Subtotal = sum of (item price + modifiers) × quantity
  - Tax calculation (single rate, multiple rates, tax-exempt items)
  - Discount application (percentage, fixed amount, BOGO)
  - Tip calculation (percentage, fixed amount)
  - Total = subtotal + tax + tip - discounts
- **Price computation:**
  - Base menu item price
  - Modifier pricing (add-ons, size upgrades)
  - Quantity discounts ("Buy 2, get 10% off")
- **Loyalty points:**
  - Points earned = (order total × earn rate) × tier multiplier
  - Points redemption value
  - Tier threshold calculations (upgrade/downgrade logic)
- **Inventory deduction:**
  - Recipe-based ingredient tracking
  - Portion sizes and yields
  - Stock level updates on order completion

**Service Layer:**
- **Offline sync queue:**
  - Priority sorting (payments first)
  - Retry logic (exponential backoff)
  - Conflict resolution (server timestamp wins)
- **Authentication:**
  - PIN validation (hash comparison)
  - Token generation and expiration
  - Session timeout logic
- **Permission checks:**
  - RBAC enforcement (user has required scope?)
  - Dynamic permissions (manager approval needed?)

**Utilities:**
- Date/time helpers
- Formatting (currency, phone numbers)
- Validation (email, phone, credit card format)

**Coverage Target:**
- 80% coverage on business logic
- Not required for UI components (expensive to test, low value)

**Test Structure:**
```typescript
describe('OrderCalculationService', () => {
  describe('calculateTotal', () => {
    it('should calculate subtotal correctly', () => {
      // Arrange
      const order = { items: [...], modifiers: [...] };
      // Act
      const result = service.calculateTotal(order);
      // Assert
      expect(result.subtotal).toBe(25.50);
    });

    it('should apply tax correctly', () => { ... });
    it('should apply discount correctly', () => { ... });
  });
});
```

### Integration Testing

**API Integration Tests:**

**Order Flow:**
1. Frontend creates order → API receives → Database insert → Socket.IO broadcast
2. Verify order saved to database
3. Verify Socket.IO emits event to all clients
4. Verify response to frontend

**Payment Processing:**
1. POS sends payment request → Backend → Terminal SDK → Mock terminal
2. Verify transaction request sent to terminal
3. Verify response handling (approved/declined)
4. Verify order status updated

**Delivery Platform Webhooks:**
1. Mock GrubHub webhook → Backend parses → Order created
2. Verify order correctly mapped to menu items
3. Verify order routed to kitchen

**Menu Sync:**
1. Admin updates menu → Backend → Push to delivery platforms
2. Verify API calls to platforms
3. Verify success/failure handling

**Tools:**
- Supertest (HTTP assertions)
- Mock Socket.IO server/client
- Mock payment terminal SDK responses

**Environment:**
- Test database (reset before each test suite)
- In-memory Redis for caching
- Mock external services (delivery platforms, payment processors)

### E2E Testing (Cypress)

**Critical User Paths:**

**1. Waiter Takes Order:**
```gherkin
Given waiter is logged in with PIN
When waiter selects table 5
And adds "Cheeseburger" with "Extra Cheese"
And fires order to kitchen
Then kitchen display shows order for table 5
And order status is "In Progress"
```

**2. Payment Processing:**
```gherkin
Given order is ready for payment
When cashier selects order
And processes card payment
Then terminal prompts customer
And payment is approved
And receipt is printed
And order status is "Completed"
```

**3. Kiosk Order:**
```gherkin
Given customer is at kiosk
When customer taps "Start Order"
And selects "Burgers" category
And selects "Cheeseburger"
And customizes with "Medium Well"
And proceeds to checkout
And pays with card
Then order confirmation is displayed
And order appears in kitchen display
```

**4. Offline Mode:**
```gherkin
Given POS is online
When network disconnects
And waiter takes order
Then order is queued locally
And "Offline" indicator is shown
When network reconnects
Then queued order syncs to server
And appears in kitchen display
```

**5. Kitchen Workflow:**
```gherkin
Given new order arrives in kitchen
When cook taps item to mark "In Progress"
And taps again to mark "Ready"
And all items are ready
Then order highlights for completion
When cook taps "Complete"
Then order bumps off screen
And waiter is notified
```

**Visual Regression Testing:**

**Screenshot Comparison:**
- Capture screenshots of critical screens
- Compare to baseline images
- Alert on visual differences (Material Design consistency)

**Screens to Test:**
- POS order entry
- Kitchen display
- Kiosk welcome and ordering flow
- Admin dashboard
- Reports

**Responsive Testing:**
- Tablet (1024x768)
- Kiosk portrait (1080x1920)
- Desktop (1920x1080)

**Tools:**
- Cypress (E2E framework)
- Percy or Applitools (visual regression)

### CI/CD Integration

**Continuous Integration:**

**On Every Commit:**
- Lint code (ESLint, Prettier)
- Run unit tests (Jest)
- Build all apps (check for compile errors)

**On Pull Request:**
- All above +
- Run integration tests
- Code coverage report (fail if < 70%)

**Nightly:**
- Full E2E test suite (Cypress)
- Visual regression tests
- Performance benchmarks

**Before Release:**
- All tests (unit, integration, E2E)
- Manual QA on staging environment
- Smoke tests on production (post-deploy)

**Deployment Pipeline:**
```
Commit → Lint & Unit Tests → Build → Integration Tests
   ↓
Merge to main → E2E Tests → Deploy to Staging → Smoke Tests
   ↓
Manual Approval → Deploy to Production → Smoke Tests → Monitor
```

**Failed Tests Block Deployment:**
- Critical tests (payment, order processing) block deploy
- Non-critical tests (reports, analytics) warn but don't block

---

## 12. Deployment & Future Roadmap

### Deployment Architecture

**On-Premises (Intel N100 Hardware):**

**Hardware Specifications:**
- Intel N100 processor (4 cores, low power, fanless)
- 8GB RAM minimum (16GB recommended)
- 128GB SSD minimum (256GB recommended)
- Dual network interfaces: Ethernet + WiFi
- Optional: 4G/5G cellular modem (USB or M.2)

**Operating System:**
- Ubuntu Server 22.04 LTS (or later)
- Minimal installation (no GUI)
- Auto-updates enabled for security patches

**Docker Compose Stack:**
```yaml
services:
  frontend:
    # Angular apps (nginx serving static files)
    # PWA with service workers
  api:
    # Node.js/Express backend
  db:
    # MySQL database
  redis:
    # Caching and session storage
  nginx:
    # Reverse proxy, SSL termination
```

**Networking:**
- **Local network:** 192.168.1.x (or customer's subnet)
- **Primary connection:** Ethernet (wired, most stable)
- **Backup connection:** WiFi or cellular modem
- **Auto-failover:** Monitor Ethernet, switch to backup if down
- **HTTPS:** SSL certificates (Let's Encrypt or self-signed for local)

**Storage:**
- **Database:** MySQL data volume (persistent)
- **Uploads:** Menu images, receipts (persistent volume)
- **Backups:** Local USB drive + cloud storage (S3, Google Cloud)

### Initial Deployment Process

**1. Hardware Setup:**
- Install Ubuntu Server on Intel N100
- Configure network interfaces (Ethernet + WiFi/cellular)
- Set static IP address (for local network)
- Install Docker and Docker Compose

**2. Application Deployment:**
- Clone repository or pull Docker images
- Configure environment variables:
  - Database credentials
  - JWT secrets
  - Payment terminal settings
  - Delivery platform API keys
- Run `docker-compose up -d`
- Verify all services running

**3. SSL Configuration:**
- Generate SSL certificate (Let's Encrypt or self-signed)
- Configure nginx with HTTPS
- Redirect HTTP → HTTPS

**4. Database Setup:**
- Import initial schema
- Seed data: Default user (admin), menu categories, settings

**5. Device Configuration:**
- Configure POS tablets: Point to local server URL
- Configure kitchen displays: Auto-login, station selection
- Configure kiosks: Kiosk mode, auto-start browser
- Configure payment terminals: IP address, test transaction

**6. Backup Configuration:**
- Schedule daily database backups (3 AM)
- Local backup: USB drive (7-day retention)
- Cloud backup: S3/GCS (30-day retention)
- Test restore process

**7. Monitoring Setup:**
- Health check endpoints
- Uptime monitoring (self-hosted or cloud service)
- Alert on failures: Email/SMS to admin

### Updates & Maintenance

**Rolling Updates:**
- Pull new Docker images
- `docker-compose up -d` (zero-downtime)
- Database migrations run automatically
- Service workers update PWA on client devices

**Rollback Capability:**
- Tag Docker images by version
- Keep previous version images
- `docker-compose down && docker-compose up -d <previous-version>`

**Maintenance Windows:**
- Scheduled: Weekly, 3 AM (low traffic)
- Emergency: Immediate (critical security patches)

**Remote Diagnostics:**
- SSH access for support team (key-based auth)
- VPN tunnel for secure remote access
- Logs exported to cloud (for debugging)

---

## Future Roadmap

### Phase 1: Angular Frontend Rebuild (Current Scope)

**Timeline:** 3-6 months

**Deliverables:**
- All 5 Angular apps (staff, kiosk, kitchen, admin, customer-web)
- Offline-first PWA with sync
- Material Design 3 UI
- Integration with existing Node.js/Express backend
- Payment terminal integration (Dejavoo/PAX)
- Delivery platform integration (via aggregator)
- Loyalty program and online ordering
- Comprehensive dashboard and reports
- Testing suite (Jest + Cypress)

**Deployment:**
- Single location on Intel N100
- Self-hosted, cellular backup
- Full training for staff

**Success Metrics:**
- System uptime > 99.5%
- Order processing < 30 seconds (online) or instant (offline)
- User satisfaction (NPS > 50)
- Zero payment processing errors

---

### Phase 2: Backend Modernization (Future)

**Timeline:** 3-4 months (after Phase 1 complete)

**Goals:**
- Replace Node.js/Express with NestJS
- TypeScript consistency across frontend and backend
- Microservices architecture for scalability

**Deliverables:**

**NestJS Migration:**
- Rewrite API with NestJS framework
- GraphQL support (optional, in addition to REST)
- TypeScript shared models (frontend and backend use same types)
- Improved testing (NestJS testing utilities)

**Microservices:**
- **Core API:** Orders, menu, customers, auth
- **Payment Service:** Terminal integration, transaction processing
- **Integration Service:** Delivery platforms, third-party APIs
- **Reporting Service:** Analytics, dashboard, exports
- **Notification Service:** Email, SMS, push notifications

**Benefits:**
- **Scalability:** Scale services independently
- **Fault isolation:** Integration service failure doesn't affect core POS
- **Easier updates:** Update delivery integrations without touching POS core
- **Performance:** Optimize each service separately

**Enhanced Caching:**
- Redis for session storage, API caching
- Cache menu data for fast lookups
- Cache customer data for loyalty lookups

**Performance Optimization:**
- Database query optimization (indexes, query tuning)
- API response caching
- Image optimization and CDN (for multi-location)

---

### Phase 3: Multi-Location & Owner Dashboard (Future)

**Timeline:** 4-6 months (after Phase 2 complete)

**Goals:**
- Support multiple restaurant locations
- Centralized owner dashboard for all locations
- Cloud-based backend for aggregation

**Architecture:**

**On-Premises (each location):**
- Keep local POS instance (offline-first)
- Data syncs to cloud backend

**Cloud Backend (AWS/GCP):**
- Aggregates data from all locations
- Owner dashboard web app
- Centralized reporting and analytics

**Deliverables:**

**Multi-Location Support:**
- Tenant isolation (each location has own data)
- Location-specific configurations (menu, pricing, staff)
- Cross-location reporting (owner dashboard)

**Owner Dashboard Web App:**

**Aggregated Analytics:**
- Total sales across all locations
- Comparative performance (Location A vs. B vs. C)
- Identify top-performing and underperforming locations

**Ingredient Pricing Intelligence:**
- Track ingredient costs across locations
- Identify cost-saving opportunities (bulk ordering)
- Alert on price discrepancies (same ingredient, different vendor prices)

**Centralized Menu Management:**
- Corporate menu (shared across locations)
- Location overrides (Location A has different pricing, Location B adds local specials)
- Push menu updates to all or selected locations

**Supply Chain Optimization:**
- Aggregate purchase orders for better pricing
- Vendor negotiations (volume discounts)
- Track vendor performance across locations

**Real-Time Sync:**
- On-premises POS → Cloud backend (every 5 minutes or on-change)
- Cloud → On-premises (menu updates, settings)

**Data Warehouse:**
- Historical data for deep analytics
- Machine learning models (demand forecasting, price optimization)

**Benefits:**
- **Owners:** Visibility across all locations from anywhere
- **Managers:** Benchmark against other locations
- **Operations:** Centralized support and updates

---

### Phase 4: Advanced Features (Future)

**Timeline:** Ongoing (feature by feature)

**AI-Powered Demand Forecasting:**
- Predict sales by day/hour based on historical data
- Account for: Weather, events, holidays, trends
- Optimize inventory ordering (reduce waste, prevent stockouts)

**Dynamic Pricing:**
- Surge pricing during peak hours (ethical considerations)
- Discount slow-moving inventory (prevent waste)
- Happy hour automation

**Labor Scheduling Optimization:**
- Predict staffing needs based on forecasted demand
- Generate optimal schedules (minimize labor cost, meet demand)
- Integrate with payroll systems

**Voice Ordering:**
- Alexa/Google Assistant integration
- "Alexa, order my usual from [Restaurant]"
- Voice ordering at kiosk (accessibility)

**Advanced Analytics & ML:**
- Customer churn prediction (proactive retention)
- Next-best-action recommendations (upsell suggestions)
- Menu optimization (identify underperforming items)

**Kitchen Automation:**
- Integration with kitchen display to automated cooking equipment
- Auto-routing to specific cooking stations (grills, fryers)
- Cook time tracking and alerts

**Franchise Management:**
- Franchise-specific features (royalty tracking, brand compliance)
- Franchisee portal (access to own data, limited corporate data)

---

## Backend Improvements Tracking

**Note:** The following backend improvements are noted for future implementation. They are NOT part of the Angular frontend rebuild (Phase 1), but should be tracked separately.

**Backend Improvements (for Phase 2+):**
1. Migration from Node.js/Express to NestJS
2. Microservices architecture for delivery integrations
3. GraphQL API option for flexible frontend queries
4. Enhanced Redis caching for performance
5. Database query optimization
6. Centralized cloud backend for multi-location aggregation
7. Data warehouse for historical analytics
8. Machine learning models for demand forecasting and pricing optimization

**Tracking:**
- Document improvements in `docs/backend-improvements.md`
- Prioritize based on business value and technical debt
- Plan Phase 2 after Phase 1 (Angular frontend) is complete and stable

---

## Summary

This design outlines a comprehensive, enterprise-grade Angular frontend rebuild for Resolute POS with:

- **Modern stack:** Angular 18+, Material Design 3, offline-first PWA
- **Comprehensive features:** Full-service, quick-service, kiosk, loyalty, online ordering
- **Enterprise security:** PCI, GDPR, SOC 2 readiness, audit logging
- **Offline-first:** Real-time sync, cellular backup, queue-and-process
- **Integrations:** Delivery platforms (full two-way sync), payment terminals (Dejavoo/PAX)
- **Scalability:** Multi-location ready architecture
- **Testing:** Practical testing strategy (Jest + Cypress)
- **Deployment:** Self-hosted on Intel N100, Docker Compose

**Next Steps:**
1. Create detailed implementation plan (task breakdown)
2. Set up git worktree for isolated development
3. Begin Phase 1: Angular frontend rebuild

---

**Approved:** 2025-11-22
**Ready for Implementation Planning**
