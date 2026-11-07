# Vercel Deployment Guide for MANTHUSA TVS (Backend + Frontend on Same Link)

This repository is configured so that **Frontend and Backend run seamlessly on the exact same domain/link** (e.g. `https://your-domain.vercel.app`) with:
- **0 404 Errors**: Next.js automatically rewrites all `/api/*` and `/uploads/*` requests to the NestJS backend.
- **0 CORS Errors**: Browser requests stay on the same origin (`/api/...`).
- **Unified Experience**: Users, staff, and customers only ever see one domain name.

---

## Step 1: Deploy Backend on Vercel

1. In **[Vercel Dashboard](https://vercel.com/dashboard)**, click **Add New...** > **Project**.
2. Select your repository.
3. In **Project Settings**:
   - **Project Name**: `manthusa-tv-api` (or any name you like)
   - **Framework Preset**: Other
   - **Root Directory**: Click *Edit* and select **`backend`**
4. Under **Environment Variables**, add:
   - `MONGO_URI`: `mongodb+srv://raxwotechnology_db_user:0Bk8CNwvPAenfq1y@cluster0.nziv5e7.mongodb.net/?retryWrites=true&w=majority`
   - `JWT_SECRET`: `your-secure-jwt-secret-key-salesplus`
   - `JWT_EXPIRES_IN`: `1d`
   - `FRONTEND_ORIGIN`: `*`
5. Click **Deploy**.
6. Once deployed, copy your backend URL (e.g. `https://manthusa-tv-api.vercel.app`).

---

## Step 2: Deploy Frontend on Vercel (Main Link)

1. In **Vercel Dashboard**, click **Add New...** > **Project** again.
2. Select the **same repository**.
3. In **Project Settings**:
   - **Project Name**: `manthusa-tv` (this will be your primary website URL)
   - **Framework Preset**: **Next.js**
   - **Root Directory**: Click *Edit* and select **`frontend`**
4. Under **Environment Variables**, add:
   - `BACKEND_URL`: Paste the backend URL from Step 1 (e.g. `https://manthusa-tv-api.vercel.app`)
5. Click **Deploy**.

---

## How It Works (Same Link Traffic)

- When users visit `https://manthusa-tv.vercel.app`:
  - **All Web Pages**: Rendered by Next.js at `/`, `/bikes`, `/login`, `/dashboard`, etc.
  - **All API Requests**: Sent to `https://manthusa-tv.vercel.app/api/...`
  - Next.js automatically proxies `/api/*` to `https://manthusa-tv-api.vercel.app/*` via [frontend/next.config.ts](file:///d:/Intern/November/Vehicle%20Sales/frontend/next.config.ts).
- No subdomains or external URLs are exposed to the user.
