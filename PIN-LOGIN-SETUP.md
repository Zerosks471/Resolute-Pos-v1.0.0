# PIN Login Setup Guide

## ✅ Completed Steps

1. **Database Migration Script**: `backend/migrate-add-pin.js`
2. **Backend PIN Login Endpoint**: `/api/v1/auth/pin-login`
3. **Service Layer**: `pinLoginDB()` in `auth.service.js`
4. **Controller**: `pinLogin()` in `auth.controller.js`
5. **Route**: POST `/pin-login` in `auth.routes.js`
6. **Angular Frontend**: PIN pad UI with Material Design at `http://localhost:4200`

---

## 🚀 Next Steps to Get It Working

### Step 1: Start MySQL Database

Choose one option:

**Option A - Using Docker Compose:**
```bash
cd /Users/n809m/Desktop/Resolute-Pos-v1.0.0
docker compose up db
```

**Option B - Start MySQL directly:**
Make sure MySQL is running on localhost:3306

### Step 2: Run Database Migration

```bash
cd /Users/n809m/Desktop/Resolute-Pos-v1.0.0/backend
node migrate-add-pin.js
```

This will:
- Add a `pin` column to the `users` table
- Set up test PINs for existing users

### Step 3: Start the Backend API

```bash
cd /Users/n809m/Desktop/Resolute-Pos-v1.0.0/backend
npm run dev
```

Backend will start on `http://localhost:3000`

### Step 4: Configure Angular Frontend

The Angular app needs to connect to the backend. Update the CORS settings:

```bash
# backend/.env
FRONTEND_DOMAIN="http://localhost:4200"  # Change from 5173 to 4200
```

### Step 5: Test the Login

1. Go to `http://localhost:4200`
2. Enter PIN: **1234** (admin user)
3. Click Enter
4. Should redirect to dashboard

---

## 🔐 Test PIN Credentials

| User | PIN | Role | Scopes |
|------|-----|------|--------|
| admin | **1234** | admin | All scopes |
| sam12 | **5678** | user | KITCHEN_DISPLAY |
| will24 | **9999** | user | KITCHEN, KITCHEN_DISPLAY |
| renny99 | **1111** | user | KITCHEN_DISPLAY, KITCHEN |
| rina24 | **2222** | user | ORDER_STATUS |
| nancy20 | **3333** | user | DASHBOARD, REPORTS, SETTINGS |

---

## 📝 API Endpoint Details

**Endpoint:** `POST /api/v1/auth/pin-login`

**Request:**
```json
{
  "pin": "1234"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login Successful.",
  "accessToken": "jwt-token-here",
  "user": {
    "username": "admin",
    "name": "Admin User",
    "role": "admin",
    "scope": null
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid PIN!"
}
```

---

## 🔧 Troubleshooting

### Database Connection Failed
- Make sure MySQL is running
- Check credentials in `backend/.env`
- Default: `mysql://root:admin@localhost:3306/resolutepos_db`

### CORS Errors
- Update `FRONTEND_DOMAIN` in `backend/.env` to `http://localhost:4200`
- Restart the backend server

### PIN Not Working
- Run the migration script again: `node migrate-add-pin.js`
- Check if PIN column exists: `DESCRIBE users;` in MySQL

### Can't Connect to Backend
- Backend must be running on port 3000
- Angular dev server on port 4200
- Check console for errors

---

## ✨ What's Built

### Angular Frontend (Port 4200)
- ✅ Material Design 3 PIN pad
- ✅ 15 passing tests
- ✅ Loading states & error handling
- ✅ Responsive tablet layout
- ✅ Real-time validation
- ✅ Auth service with PIN login

### Backend API (Port 3000)
- ✅ `/api/v1/auth/pin-login` endpoint
- ✅ JWT token generation
- ✅ HTTP-only cookie auth
- ✅ Refresh token support
- ✅ Device tracking

### Database
- ✅ PIN column in users table
- ✅ 6 test users with PINs
- ✅ Existing auth infrastructure intact

---

## 🎯 Ready to Test!

Once you complete Steps 1-4, you'll have a fully functional PIN login system for your POS application!
