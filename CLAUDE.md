# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Resolute POS is a full-stack restaurant Point of Sale system with real-time order management, kitchen display, reservations, and reporting capabilities. It uses a React frontend with Vite, Node.js/Express backend, and MySQL database, with Socket.IO for real-time communication.

## Development Setup

### Running the Application

The project uses Docker Compose to run all services (frontend, backend, database):

```bash
# Start all services with hot-reload
docker compose up

# Start specific service
docker compose up web   # Frontend only
docker compose up api   # Backend only
docker compose up db    # Database only

# Rebuild and start
docker compose up --build
```

Services will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- MySQL: localhost:3306

### Local Development (without Docker)

**Backend:**
```bash
cd backend
npm install
npm run dev          # Development with nodemon
npm start            # Production mode
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev          # Development server with hot-reload
npm run build        # Production build
npm run preview      # Preview production build
```

### Environment Configuration

Backend requires a `.env` file (see `backend/.env.example`):
- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET`, `JWT_EXPIRY`, `JWT_EXPIRY_REFRESH`: Authentication tokens
- `COOKIE_EXPIRY`, `COOKIE_EXPIRY_REFRESH`: Cookie expiration in milliseconds
- `PASSWORD_SALT`: bcrypt salt rounds
- `FRONTEND_DOMAIN`: CORS whitelist (e.g., http://localhost:5173)
- `FRONTEND_DOMAIN_COOKIE`: Cookie domain (e.g., localhost)

Frontend uses Vite environment variables in `.env`:
- `VITE_BACKEND`: Backend API URL (e.g., http://localhost:3000/api/v1)
- `VITE_BACKEND_SOCKET_IO`: Socket.IO server URL

### Database Setup

Import the SQL schema:
```bash
mysql -u root -p < backend/resolutepos_db.sql
```

The database includes tables for: categories, customers, menu_items, orders, order_items, reservations, settings, tables, transactions, and users.

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
- Access tokens (short-lived, 15m) stored in httpOnly cookies
- Refresh tokens (long-lived, 30d) for token renewal
- Scope-based authorization using `authorize()` middleware
- Admin role bypasses scope checks

**Socket.IO events:**
- `new_order_backend` → broadcasts `new_order` to all clients
- `order_update_backend` → broadcasts `order_update` to all clients

### Frontend Architecture

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

The system uses scope-based permissions defined in `frontend/src/config/scopes.jsx` and enforced by `ScopeProtectedRoute`. Common scopes include:
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

4. **Create frontend controller** in `frontend/src/controllers/*.controller.js`:
   ```javascript
   import apiClient from '../helpers/ApiClient';

   export const method = async (data) => {
     const response = await apiClient.post('/endpoint', data);
     return response.data;
   };
   ```

### Working with Socket.IO

Backend (`index.js`):
```javascript
socket.on("event_name_backend", (payload) => {
  socket.broadcast.emit("event_name", payload);
});
```

Frontend (using SocketContext):
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

## Testing and Deployment

Currently, the project does not include automated tests. When adding tests, ensure they cover:
- API endpoint validation
- Authentication and authorization flows
- Database operations
- Socket.IO event handling

For deployment, the backend includes a `captain-definition` file for CapRover deployment.
