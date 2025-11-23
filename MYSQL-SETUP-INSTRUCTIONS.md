# MySQL Setup Instructions

## Current Issue
MySQL is running but the credentials in `.env` don't work.

**Current `.env` settings:**
```
DATABASE_URL='mysql://root:admin@localhost:3306/resolutepos_db'
```

## Solution Options

### Option 1: Update MySQL Root Password to Match .env

Run these commands in a new terminal:

```bash
# If MySQL has NO password (new installation)
mysql -u root

# OR if MySQL has a different password
mysql -u root -p

# Then run these SQL commands:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'admin';
FLUSH PRIVILEGES;
EXIT;
```

### Option 2: Update .env to Match MySQL Password

If you want to keep your current MySQL password, update `backend/.env`:

```bash
# If MySQL has no password:
DATABASE_URL='mysql://root@localhost:3306/resolutepos_db'

# If MySQL has a different password (e.g., "mypass"):
DATABASE_URL='mysql://root:mypass@localhost:3306/resolutepos_db'
```

## Once MySQL Credentials Match

Run these commands:

```bash
cd /Users/n809m/Desktop/Resolute-Pos-v1.0.0/backend
node setup-database.js      # Creates database and imports schema
node migrate-add-pin.js     # Adds PIN support
```

## Quick Test

To test your MySQL credentials:

```bash
# Try connecting (replace password if different):
mysql -u root -padmin -e "SELECT 1"

# If that works, you're good to go!
# If it fails, update the password or .env file
```
