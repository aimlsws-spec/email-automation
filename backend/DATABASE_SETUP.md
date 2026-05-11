# Database Setup Guide

## Quick Start (Postgrace/PostgreSQL)

### 1. Configure Database Connection

Edit `backend/.env`:

```env
# For local PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=automate_mail
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false

# For Postgrace Cloud
DB_HOST=your-postgrace-host.com
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password
DB_SSL=true
```

### 2. Initialize Database

```bash
cd backend
node init-db.js
```

This will:
- Create the `leads` table
- Import data from `D:\automate mail\data.csv`
- Verify the import

### 3. Start Backend

```bash
npm start
```

### 4. Verify API

Open browser: http://localhost:4000/api/dashboard

Expected: JSON with leads data

## Troubleshooting

### Empty Dashboard

**Check 1: Database Connection**
```bash
node init-db.js
```
Look for: `✅ DB connected successfully`

**Check 2: Data in Database**
```sql
SELECT COUNT(*) FROM leads;
```
Should return > 0

**Check 3: API Response**
Open: http://localhost:4000/api/dashboard
Should return JSON with `metrics`, `leads`, `events`

**Check 4: Frontend Logs**
Open browser console (F12)
Look for: `🔵 Dashboard data received`

### Common Issues

**"Table does not exist"**
→ Run: `node init-db.js`

**"No data in leads table"**
→ Check `D:\automate mail\data.csv` exists
→ Run: `node init-db.js`

**"Connection refused"**
→ Check PostgreSQL is running
→ Verify .env credentials

**"SSL required"**
→ Set `DB_SSL=true` in .env (for Postgrace cloud)

## Manual Database Setup

If you prefer manual setup:

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE automate_mail;

-- Connect to database
\c automate_mail

-- Run schema
\i schema.sql

-- Verify
SELECT COUNT(*) FROM leads;
```

Then import CSV via API:
- Upload file at dashboard UI
- Or use: `POST /api/upload-leads`
