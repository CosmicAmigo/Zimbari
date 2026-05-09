# Zimbari

A web-first, mobile-ready personal and business finance dashboard built with Node.js, Vite, and a minimal Express backend.

## Project structure

- `index.html` — site entry point
- `src/main.js` — app bootstrap and state
- `src/style.css` — visual styling and palette
- `src/modules/` — core logic for vault math, parser, SMS parsing, and Daraja integration
- `src/ui/components.js` — dashboard rendering, transaction entry, upload widgets, and articles
- `src/content/articles.json` — knowledge hub articles
- `server/` — Express webhook server and PostgreSQL database helper
- `capacitor.config.json` — Capacitor mobile port configuration

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Set `DATABASE_URL` and `GOOGLE_CLIENT_ID` in `.env`.

4. Start the Vite site:

```bash
npm run dev
```

5. Start the webhook server:

```bash
npm run serve
```

## Database

The site includes a PostgreSQL-ready schema in `server/schema.sql`.

### Example SQL schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  balance NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  progress NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE bills (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  transaction_id TEXT UNIQUE NOT NULL,
  amount NUMERIC NOT NULL,
  reference TEXT,
  source TEXT,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Safe balance query

```sql
SELECT
  (SUM(t.amount) - COALESCE((SELECT SUM(amount) FROM goals), 0) - COALESCE((SELECT SUM(amount) FROM bills), 0)) AS safe_balance
FROM transactions t;
```

## Notes

- `server/db.js` uses `DATABASE_URL` and connects with SSL when `NODE_ENV=production`.
- `server/mpesa-hook.js` exposes `/api/mpesa-hook` for webhook payloads.
- `src/modules/parser.js` includes CSV import logic and a PDF stub for future onboarding support.
- `src/modules/daraja.js` includes a placeholder Daraja integration path for STK push automation.
