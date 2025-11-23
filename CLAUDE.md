# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Resolute POS is a full-stack restaurant Point of Sale system with real-time order management, kitchen display, reservations, and reporting capabilities. The project includes:
- **Angular Staff Frontend** (Modern PWA with PIN login) - `frontend-angular/`
- **React Customer Frontend** (Legacy) - `frontend/`
- **Node.js/Express Backend** - `backend/`
- **MySQL Database** with PIN authentication support

## Development Setup

### Quick Start

**Angular Frontend (Staff Interface):**
```bash
cd frontend-angular
npm install
npx nx serve pos-staff  # Runs on http://localhost:4200
```

**Backend API:**
```bash
cd backend
npm install
npm run dev             # Runs on http://localhost:3000
```

**Database Setup:**
```bash
cd backend
node setup-database.js    # Creates database and imports schema
node migrate-add-pin.js   # Adds PIN support for staff login
```

### Running the Application

**Option 1: Docker Compose (React frontend only)**
```bash
docker compose up         # All services with React frontend
docker compose up web     # React frontend only (port 5173)
docker compose up api     # Backend only (port 3000)
docker compose up db      # MySQL only (port 3306)
```

**Option 2: Local Development (Recommended for Angular)**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Angular Frontend
cd frontend-angular && npx nx serve pos-staff
```

### Services and Ports

- **Angular Frontend (Staff)**: http://localhost:4200
- **React Frontend (Customer)**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **MySQL Database**: localhost:3306

### Environment Configuration

**Backend** (`backend/.env`):
```env
DATABASE_URL='mysql://root:admin123@localhost:3306/resolutepos_db'
JWT_SECRET=resolutepos_jwt_secret
JWT_EXPIRY=15m
JWT_EXPIRY_REFRESH=30d
COOKIE_EXPIRY=300000
COOKIE_EXPIRY_REFRESH=2592000000
PASSWORD_SALT=10
FRONTEND_DOMAIN="http://localhost:4200"    # Angular dev server
FRONTEND_DOMAIN_COOKIE="localhost"
```

**Angular Frontend** (`frontend-angular/apps/pos-staff/src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  socketUrl: 'http://localhost:3000',
  enableDebugTools: true,
  logLevel: 'debug',
};
```

**React Frontend** (`frontend/.env`):
```env
VITE_BACKEND=http://localhost:3000/api/v1
VITE_BACKEND_SOCKET_IO=http://localhost:3000
```

### Database Setup

**Initial Setup:**
```bash
cd backend
node setup-database.js      # Creates database and imports schema
node migrate-add-pin.js     # Adds PIN column to users table
```

**Manual Import:**
```bash
mysql -u root -p < backend/resolutepos_db.sql
```

**Test Credentials:**
- Admin PIN: `1234` (username: admin)
- Staff PINs: `5678`, `9999`, `1111`, `2222`, `3333`

See `PIN-LOGIN-SETUP.md` for complete PIN authentication guide.

## Architecture

### Backend Architecture

**Three-layer pattern:**
- **Routes** (`src/routes/*.routes.js`): Define endpoints and apply middleware
- **Controllers** (`src/controllers/*.controller.js`): Handle HTTP request/response, validation
- **Services** (`src/services/*.service.js`): Business logic and database operations

**Key modules:**
- `src/app.js`: Express app configuration, middleware setup, route registration
- `index.js`: HTTP server creation, Socket.IO setup for real-time updates
- `src/config/mysql.db.js`: MySQL connection pool using mysql2/promise
- `src/middlewares/auth.middleware.js`: JWT authentication and scope-based authorization
- `src/utils/jwt.js`: JWT token generation and verification

**Authentication flow:**
- **PIN Login**: POST `/api/v1/auth/pin-login` - Staff authentication with 4-6 digit PIN
- **Username/Password**: POST `/api/v1/auth/signin` - Traditional login
- Access tokens (15m) and refresh tokens (30d) stored in httpOnly cookies
- Scope-based authorization using `authorize()` middleware
- Admin role bypasses all scope checks

**Socket.IO events:**
- `new_order_backend` → broadcasts `new_order` to all clients
- `order_update_backend` → broadcasts `order_update` to all clients

### Angular Frontend Architecture (Staff Interface)

**Location:** `frontend-angular/`

**Nx Monorepo Structure:**
- **Apps:**
  - `apps/pos-staff/` - Main POS staff application
  - `apps/pos-staff-e2e/` - End-to-end tests (Cypress)

- **Libraries:**
  - `libs/auth/` - Authentication services, guards, and models
  - `libs/data-access/` - NgRx state, API client, Socket.IO integration
  - `libs/ui-components/` - Shared Material Design 3 components
  - `libs/payment/` - Payment processing services
  - `libs/offline-sync/` - PWA offline sync capabilities

**Technology Stack:**
- Angular 20.3.0 with standalone components
- Material Design 3 (latest theming API)
- NgRx for state management
- Socket.IO for real-time updates
- Jest for unit testing
- Cypress for E2E testing
- PWA with service workers and offline support

**Key Features:**
- PIN-based authentication with Material Design UI
- SSR-compatible (Angular Universal)
- Offline-first architecture with background sync
- Route guards: `authGuard`, `scopeGuard`
- HTTP interceptors for token refresh
- Real-time order updates via Socket.IO

**Running Commands:**
```bash
cd frontend-angular

# Development
npx nx serve pos-staff                    # Dev server on port 4200
npx nx test pos-staff                     # Run unit tests
npx nx e2e pos-staff-e2e                  # Run E2E tests

# Build
npx nx build pos-staff                    # Production build
npx nx build pos-staff --configuration=production

# Code quality
npx nx lint pos-staff                     # ESLint
npx nx affected:test                      # Test affected projects
npx nx graph                              # View dependency graph
```

**Authentication Service** (`libs/auth/src/lib/services/auth.service.ts`):
```typescript
// PIN Login
loginWithPin(pin: string): Observable<PinLoginResponse>

// User state
currentUser$: Observable<User | null>
isAuthenticated$: Observable<boolean>

// Scope checking
hasScope(scope: string): boolean
```

### React Frontend Architecture (Customer Interface)

**Location:** `frontend/`

**React with client-side routing:**
- React Router v6 with nested routes in `App.jsx`
- Route protection via `PrivateRoute` (authentication) and `ScopeProtectedRoute` (authorization)

**State management:**
- Context API for global state (NavbarContext, SocketContext)
- SWR for data fetching with automatic revalidation
- React hooks for local component state

**API communication:**
- `helpers/ApiClient.js`: Axios instance with interceptors
  - Automatically includes credentials (httpOnly cookies)
  - Auto-refreshes expired access tokens on 401/403
  - Redirects to login on refresh failure
- Controllers (`controllers/*.controller.js`): Wrapper functions around API calls
- All controllers use the configured apiClient instance

**Real-time updates:**
- Socket.IO client in `contexts/SocketContext.jsx`
- Listens for `new_order` and `order_update` events
- Used in Kitchen and Orders pages for live updates

**UI framework:**
- Tailwind CSS + DaisyUI for component styling
- Headless UI for accessible components
- Tabler Icons for iconography

### Scopes and Authorization

The system uses scope-based permissions enforced by authorization guards. Common scopes include:
- `DASHBOARD`: Dashboard access
- `POS`: Point of Sale operations
- `ORDERS`, `ORDER_STATUS`, `ORDER_STATUS_DISPLAY`: Order management
- `KITCHEN`, `KITCHEN_DISPLAY`: Kitchen display system
- `RESERVATIONS`, `VIEW_RESERVATIONS`, `MANAGE_RESERVATIONS`: Reservation management
- `CUSTOMERS`, `VIEW_CUSTOMERS`, `MANAGE_CUSTOMERS`: Customer management
- `INVOICES`: Invoice access
- `REPORTS`: Reporting functionality
- `SETTINGS`: Settings and configuration

Admins (defined in `backend/src/config/user.config.js`) bypass all scope checks.

## Key Features

### PIN Login System (Angular)
- Material Design 3 PIN pad interface
- 4-6 digit PIN codes for staff
- Real-time validation and error feedback
- Loading states with spinner
- Automatic navigation to dashboard on success
- 15 passing unit tests

### POS System
- Two POS interfaces: standard (`POSPage`) and custom (`POSSales`)
- Real-time order processing with kitchen integration
- Table management and order tracking
- Cash register operations (`CashRegister.jsx`, `CashRegisterModal.jsx`)

### Kitchen Display System
- Real-time order display via Socket.IO
- Order status updates broadcast to all connected clients
- Token/ticket printing support

### Order Management
- Order creation, modification, and completion
- Transaction tracking with payment types
- Receipt and token printing (`PrintReceiptPage`, `PrintTokenPage`)

### Reporting and Analytics
- Dashboard with sales metrics (`DashboardPage`)
- Reports page with various analytics
- Invoice generation with PDF download support

### Progressive Web App (PWA)
- Service worker with intelligent caching
- Offline support for core features
- Background sync for queued operations
- App shell caching for instant loads
- Installable on mobile and desktop

## Common Development Patterns

### Adding a new API endpoint

1. **Define route** in `backend/src/routes/*.routes.js`:
   ```javascript
   router.post('/endpoint', isLoggedIn, isAuthenticated, authorize([SCOPE]), controller.method);
   ```

2. **Create controller** in `backend/src/controllers/*.controller.js`:
   ```javascript
   exports.method = async (req, res) => {
     try {
       const data = await service.method(req.body);
       res.json({ success: true, data });
     } catch (error) {
       res.status(500).json({ success: false, message: error.message });
     }
   };
   ```

3. **Implement service** in `backend/src/services/*.service.js`:
   ```javascript
   exports.method = async (params) => {
     const pool = getMySqlPromiseConnection();
     const [rows] = await pool.query('SELECT ...', [params]);
     return rows;
   };
   ```

4. **Angular service** in `frontend-angular/libs/*/src/lib/services/*.service.ts`:
   ```typescript
   import { HttpClient } from '@angular/common/http';
   import { environment } from '@env';

   method(data: any): Observable<Response> {
     return this.http.post<Response>(
       `${environment.apiUrl}/endpoint`,
       data,
       { withCredentials: true }
     );
   }
   ```

5. **React controller** in `frontend/src/controllers/*.controller.js`:
   ```javascript
   import apiClient from '../helpers/ApiClient';

   export const method = async (data) => {
     const response = await apiClient.post('/endpoint', data);
     return response.data;
   };
   ```

### Working with Socket.IO

**Backend** (`index.js`):
```javascript
socket.on("event_name_backend", (payload) => {
  socket.broadcast.emit("event_name", payload);
});
```

**Angular** (using SocketService):
```typescript
import { SocketService } from '@resolute-pos/data-access';

constructor(private socket: SocketService) {}

// Emit event
this.socket.emit('event_name_backend', data);

// Listen for events
this.socket.on('event_name').subscribe((data) => {
  // Handle event
});
```

**React** (using SocketContext):
```javascript
const { socket } = useContext(SocketContext);
socket.emit("event_name_backend", data);
socket.on("event_name", (data) => handleUpdate(data));
```

### Database Queries

Use the MySQL connection pool with prepared statements:
```javascript
const { getMySqlPromiseConnection } = require('../config/mysql.db');
const pool = getMySqlPromiseConnection();

const [rows] = await pool.query('SELECT * FROM table WHERE id = ?', [id]);
```

Enable multiple statements and date strings via the connection string in `mysql.db.js`.

### Adding PIN Support to Users

If you need to add PIN authentication to new users:

```javascript
// In migration or setup script
await connection.execute(
  "UPDATE users SET pin = ? WHERE username = ?",
  [pinCode, username]
);
```

See `backend/migrate-add-pin.js` for the complete migration example.

## Testing

### Angular Tests

```bash
cd frontend-angular

# Run all tests
npx nx test pos-staff

# Run specific test file
npx nx test pos-staff --testFile=login.component.spec.ts

# Run with coverage
npx nx test pos-staff --coverage

# Watch mode
npx nx test pos-staff --watch
```

**Current Test Coverage:**
- Authentication Service: 15/15 tests passing
- App State Management: 13/13 tests passing
- Login Component: 15/15 tests passing

### React Tests

Currently, the React project does not include automated tests.

## Deployment

### Angular Production Build

```bash
cd frontend-angular
npx nx build pos-staff --configuration=production
```

Output will be in `dist/apps/pos-staff/browser/` with:
- Optimized bundles
- Service worker
- Server-side rendering files (if enabled)

### Backend Deployment

The backend includes a `captain-definition` file for CapRover deployment.

For manual deployment:
```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

## Troubleshooting

### Common Issues

**Angular dev server not starting:**
- Check port 4200 is not in use: `lsof -ti:4200`
- Clear Angular cache: `rm -rf .angular/cache`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**Backend connection errors:**
- Verify MySQL is running: `mysql -u root -p`
- Check DATABASE_URL in `backend/.env`
- Ensure database exists: `SHOW DATABASES;`

**PIN login not working:**
- Verify backend is running on port 3000
- Check CORS configuration in `backend/.env`
- Ensure PIN migration ran: `node backend/migrate-add-pin.js`
- Test API directly: `curl -X POST http://localhost:3000/api/v1/auth/pin-login -H "Content-Type: application/json" -d '{"pin":"1234"}'`

**CORS errors:**
- Update `FRONTEND_DOMAIN` in `backend/.env` to match frontend port
- Restart backend server after changing .env

### Documentation Files

- `MYSQL-SETUP-INSTRUCTIONS.md` - Database setup and troubleshooting
- `PIN-LOGIN-SETUP.md` - Complete PIN authentication setup guide
- `frontend-angular/IMPLEMENTATION_SUMMARY.md` - Angular workspace details
- `docs/plans/2025-11-22-angular-workspace-setup.md` - Implementation plan

## Next Steps

After `/clear`:
1. Both servers should be running (Angular on :4200, Backend on :3000)
2. Database is configured with PIN support
3. Test login at http://localhost:4200 with PIN `1234`
4. Ready to continue building additional features
