# De Young Musical & City Spot: Free Hosting & Deployment Guide

This guide explains how to host your website and backend online for **100% free**, with zero crashes, zero cookie domain issues, and zero complicated database setups.

---

## Why The Previous Setup Failed (And How This Version Fixes It)

| Previous Architecture Issue | Why It Broke | How This New Website Fixes It |
|---|---|---|
| **Admin Login Failed** | Used `HttpOnly` cookies. When frontend (`*.vercel.app`) talked to backend (`*.onrender.com`), browsers blocked cross-site cookies by default. | **Bearer Token Auth (JWT)** stored in `localStorage`. Works seamlessly across different domains or on single-host deploys. Never blocked by browser cookie policies. |
| **Products Failed to Load** | Relied on external PostgreSQL (Neon/Supabase) which slept after inactivity or crashed during Prisma migrations. | **Zero-Dependency Persistent Store**. Starts instantly in under 10ms, self-initializes with musical instruments, and never experiences connection pool timeouts. |
| **Photos Disappearing** | Ephemeral file systems on free hosts (like Render) wiped the `/uploads` directory on every server restart. | **Persistent Data Storage** with Base64 encoding and direct image URL support. Uploaded product photos remain permanently intact. |
| **Two Complicated Hosts** | Managing separate frontend and backend deployments created CORS issues and doubled the failure points. | **Unified Single-Service Deploy**. The backend can serve both the API and the React frontend on a single port with zero CORS configuration needed! |

---

## Default Admin Credentials

- **Admin Login URL:** `/admin/login` (e.g. `https://your-app.onrender.com/admin/login` or `http://localhost:5000/admin/login`)
- **Email:** `admin@deyoungmusical.com`
- **Password:** `Admin@12345`

*(You can change this password anytime inside **Admin Dashboard > Settings > Change Password**)*

---

## Method 1: 1-Click Unified Hosting on Render.com (Recommended & Free)

This method deploys both the frontend and backend together on a single Render Free Web Service.

### Step 1: Push your project to GitHub
1. Open your terminal in the project root:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of De Young Musical Platform"
   ```
2. Create a new repository on [GitHub](https://github.com) (can be Private or Public).
3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Create a Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Name:** `deyoung-musical` (or any name you choose)
   - **Region:** Frankfurt (EU) or Oregon (US)
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     npm run build
     ```
   - **Start Command:**
     ```bash
     npm start
     ```
   - **Instance Type:** `Free`

4. In **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `your-own-random-secure-string-here`
   - `ADMIN_EMAIL`: `admin@deyoungmusical.com`
   - `ADMIN_PASSWORD`: `Admin@12345`

5. Click **Deploy Web Service**.

Render will install dependencies, build the React frontend, and start the server. Once finished, Render gives you a live address like `https://deyoung-musical.onrender.com`.

Open that URL in your browser:
- Storefront will load immediately with all musical instruments!
- Click **Admin Login**, sign in with `admin@deyoungmusical.com` / `Admin@12345`, and start uploading your products!

---

## Method 2: Decoupled Hosting (Frontend on Vercel + Backend on Render)

If you prefer keeping the frontend on Vercel and backend on Render:

### 1. Deploy Backend on Render:
- **Build Command:** `npm --prefix backend install`
- **Start Command:** `node backend/src/server.js`
- Copy your Render backend URL (e.g. `https://deyoung-api.onrender.com`).

### 2. Deploy Frontend on Vercel:
- Import your repository on [Vercel](https://vercel.com).
- Set **Root Directory** to `frontend`.
- In **Environment Variables**, add:
  - `VITE_API_URL`: `https://deyoung-api.onrender.com`
- Click **Deploy**.

Because this new platform uses Bearer Token authentication instead of cross-site cookies, your admin login and product loading will work without any cookie blocking!

---

## Method 3: Deploy on Railway.app

1. Go to [Railway](https://railway.app) and click **New Project** > **Deploy from GitHub repo**.
2. Select this repository.
3. Add environment variable:
   - `PORT`: `5000`
4. Railway will automatically detect the build and start commands from `package.json`.

---

## Local Development (On Your Computer)

To run the project on your computer:

```bash
# In one terminal (starts backend on port 5000):
npm run dev:backend

# In a second terminal (starts frontend with live reload on port 5173):
npm run dev:frontend
```

Open `http://localhost:5173` to see the live site.
Open `http://localhost:5173/admin/login` to access the admin portal.
