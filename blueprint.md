# Zimbari: Personal & Business Finance Ecosystem

## 1. Project Overview & Philosophy

A "Web-First, Mobile-Ready" application built with **Node.js/Vite** and ported via **CapacitorJS**. The system is designed to solve "mental accounting" by physically and psychologically separating money into distinct "worlds."

* **The Safe-Balance Rule:** Total Money - (Goals + Pending Bills) = **Safe to Spend**.
* **Out of Sight, Out of Mind:** Once money is allocated to a goal, it is removed from the main dashboard balance to prevent impulse spending.
* **Low Friction:** Minimalist entry—Amount is the only required field; everything else is optional.

---

## 2. Visual Identity (Hex Scheme)

* **Primary Background:** `#fcfcfc` (Clean, minimalist canvas)
* **Surface/Cards:** `#e3e4e6` (Subtle depth for business & goal cards)
* **Muted Text/Borders:** `#c3c3c5` (Secondary info like timestamps)
* **Primary Action/Flow:** `#1297fd` (Main CTA buttons)
* **Progress/Accents:** `#8bcaf9` & `#40aaf8` (Goal bars and "Money In" indicators)

---

## 3. The 4-Way M-Pesa Logic (Hybrid Integration)

The app provides four distinct ways to capture data, catering to both personal and business needs.

### A. SMS Scraper (Real-Time / Personal)

* **Tech:** Capacitor SMS Plugin (Android).
* **Usage:** Automatically detects incoming M-Pesa messages.
* **Workflow:** App parses the text $\rightarrow$ Extracts Amount/Ref $\rightarrow$ User clicks "Confirm" to assign it to Personal or Business.

### B. PDF Statement Parser (Onboarding / Historical)

* **Tech:** `pdf.js` or `pdf-parse`.
* **Usage:** User uploads an M-Pesa statement received via email.
* **Workflow:** The app reads months of data at once to populate historical spending trends and calculate average monthly "Salary/Income."

### C. CSV Import (Business Portal)

* **Tech:** `PapaParse` (Fast CSV parsing).
* **Usage:** For users with high-volume businesses using the Safaricom Business Portal.
* **Workflow:** User exports a CSV from the portal and uploads it to a specific "Business Card" in the app for bulk reconciliation.

### D. Daraja 3.0 API (Automated Business Gateway)

* **Restriction:** Only available for users with a **Registered Till or Paybill**.
* **Tech:** Node.js Backend with HTTPS Webhooks.
* **Usage:** * **STK Push:** Trigger a payment request directly from the app for Goods/Services.
* **C2B Register URL:** Real-time logging. When a customer pays the Till, the app logs the income automatically without user intervention.



---

## 4. Multi-Entity Business Management

Users can create multiple "Business Worlds." Each card tracks:

* **Type: Goods:** Includes Inventory/Stock tracking. Selling a good reduces stock and calculates profit based on cost vs. retail price.
* **Type: Services:** Includes Time/Labor tracking. No stock required. Focuses on "Invoiced Amount" vs. "Time Spent."
* **Simplified Entry:**
1. Input **Amount** (Mandatory).
2. Input **Description** (Optional).
3. Add **Photo/Receipt** (Optional - "Extra Info").



---

## 5. The "Invisible" Vault (Goals vs. Bills)

The system distinguishes between where money *must* go and where money *should* stay.

* **Bills (Liability):** Recurring outflows (Rent, KPLC). These are tracked as "Pending" and deducted from the Safe Balance.
* **Goals (Assets):** Long-term savings. When $500$ is moved to the "Tuition Goal," the UI hides that $500$ from the "Available Funds" total to ensure the user feels they have less to spend.

---

## 6. Knowledge Hub (Articles)

* **Format:** JSON-based local library (`/src/content/articles.json`).
* **Function:** A "Read" section where users access financial literacy content.
* **Smart Suggestions:** If a user’s "Service" business shows low profit, the app suggests an article: *"How to Price Your Services for Growth."*

---

## 7. Technical Structure (Vite/Node)

```text
/
├── index.html            # Entry point (Empty mount)
├── Blueprint.md          # Project Roadmap
├── capacitor.config.json # Mobile port settings
├── /src
│   ├── main.js           # App Logic & Routing
│   ├── /modules
│   │   ├── mpesa-sms.js  # Android SMS listener logic
│   │   ├── daraja.js     # API hooks for Till/Paybill
│   │   ├── parser.js     # PDF & CSV logic
│   │   └── vault.js      # The "Safe-to-Spend" math engine
│   ├── /ui
│   │   ├── components.js # Business Cards, Goal Bars
│   │   └── styles.css    # Hex-palette implementation
│   └── /content
│       └── articles.json # Articles database
└── /server
    └── mpesa-hook.js     # Node.js Daraja Webhook listener

```

---

## 8. Additional Porting Ideas

1. **Haptic Feedback:** Use Capacitor Haptics to give a physical "vibration" when a Goal is reached or an M-Pesa log is confirmed.
2. **Biometric Lock:** Use Capacitor Biometrics (FaceID/Fingerprint) to lock the Business/Vault sections.
3. **Local Notifications:** Remind the user at 8:00 PM: *"You had 3 M-Pesa transactions today. Tap to categorize them."*
4. **Dark Mode Toggle:** A high-contrast dark version of the hex palette for night use.

Should be Production ready. DATABASE_URL and GOOGLE_CLIENT_ID are environment Variables. Database is a PostgreDB Server. Generate Query for Database as well