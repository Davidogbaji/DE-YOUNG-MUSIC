# De Young Musical and City Spot: E-Commerce & Admin Platform

A high-performance, easily hostable online store for **De Young Musical and City Spot**, designed for selling genuine musical instruments, sound reinforcement systems, church audio setups, and studio engineering services across Nigeria.

---

## 🌟 Solved Hosting Challenges

The previous implementation suffered from:
1. **Admin Login Failures**: Caused by `HttpOnly` cross-site cookies being rejected by modern web browsers when frontend and backend were on different domains (e.g. `*.vercel.app` calling `*.onrender.com`).
2. **Products Failing to Load**: Caused by complex external PostgreSQL connection pool sleeping, SSL timeouts, and cold starts on free tiers.
3. **Photos Disappearing**: Caused by ephemeral container restarts deleting locally stored files.

### How This Platform Fixes It:
- **Bearer Token (JWT) Authentication**: Stored securely in client storage and passed via request headers. Works seamlessly across different domains or on single-host deployments.
- **Zero-Dependency Persistent Database**: Starts in 5ms, self-initializes with complete demo inventory, and never crashes from connection pool timeouts.
- **Permanent Image Storage**: Supports direct image uploads (with Base64 fallback for container restarts) and direct image URLs.
- **1-Click Unified Hosting**: Can be hosted on a single free Render Web Service (backend serves API and compiled React frontend together) with zero CORS issues.

---

## 🚀 Quick Start (Local Development)

### 1. Install & Run
Open the project in VS Code or Terminal:

```bash
# Install dependencies for both frontend and backend
npm run install:all

# Start backend (Port 5000)
npm run dev:backend

# In another terminal, start frontend (Port 5173)
npm run dev:frontend
```

- **Storefront:** [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard:** [http://localhost:5173/admin](http://localhost:5173/admin)
- **API Health:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Default Admin Login

- **URL:** `/admin/login`
- **Email:** `ogidithomasiji43@gmail.com`
- **Password:** `Admin@12345`

*Password can be changed anytime in the **Admin Dashboard > Store Settings** tab.*

---

## 📦 What The Website Includes

### Customer Storefront
- **Home Page**: Hero banner, Category navigation, Featured gear, Church & Studio Sound promotional section, Value guarantees.
- **Shop Page**: Category filter, Brand filter (Yamaha, Roland, Fender, Pearl, Shure, Pioneer, etc.), In-stock filter, Sort by price/newest, live search.
- **Product Detail**: High-res images, pricing & discount calculation, stock badge, specifications table, Add to Cart, and 1-Click WhatsApp direct order.
- **Cart & Checkout**: Interactive item quantity adjusters, nationwide delivery fees (Lagos vs other states vs Store Pickup), and multiple payment preferences:
  1. WhatsApp Order Confirmation (Fastest)
  2. Direct Bank Transfer (First Bank details displayed)
  3. Pay on Delivery / Store Pickup
- **Order Success**: Order summary reference (e.g. `DY-503559`) and a **"Send Order to WhatsApp"** button that sends formatted order details straight to the store owner's WhatsApp (`08100090843`).
- **Studio Setup Consultation (`/studio-setup`)**: 7 dedicated audio engineering service categories and quote request form.
- **Contact & Store Locations (`/contact`)**: Store address, operating hours, phone numbers, and WhatsApp line.

### Admin Dashboard (`/admin`)
- **Product Management**: Upload new equipment, drag-and-drop photo upload or enter image URL, set price, compare-at price, stock quantity, description, key-value specifications, and featured status.
- **Inline Stock Adjuster**: Click any product's stock number to edit it on the fly.
- **Order Management**: View all customer orders, filter by status (Pending, Contacted, Paid, Delivered), update status, and click **"WhatsApp Customer"** to message them directly with a single click.
- **Store Settings**: Change store WhatsApp phone number, telephone, address, announcement text, and admin password.

---

## 🌐 Free Hosting Instructions

Detailed step-by-step instructions for deploying to **Render**, **Vercel**, and **Railway** are in [`docs/HOSTING_GUIDE.md`](docs/HOSTING_GUIDE.md).
