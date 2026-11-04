# KisanConnect — Production Deployment Guide (Vercel & Supabase)

This guide provides step-by-step instructions for deploying **KisanConnect — Smart Agriculture Network** to production using **Vercel** and **Supabase (PostgreSQL & Auth)**.

---

## 1. Supabase Cloud Configuration

### 1.1 Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and log in or create an account.
2. Click **New Project** and select your organization.
3. Configure the project:
   - **Name**: `kisanconnect-prod`
   - **Database Password**: Set a strong, secure password (store securely).
   - **Region**: Choose the closest region (e.g., `Singapore (ap-southeast-1)` or `Mumbai (ap-south-1)` for Nepal).
4. Click **Create new project** and wait ~2 minutes for provisioning to finish.

### 1.2 Retrieve API Credentials
1. In the Supabase project dashboard, navigate to **Project Settings** > **API**.
2. Note the following values:
   - **Project URL** (`https://xxxxxxxxxxxx.supabase.co`)
   - **Project API Keys** > `anon` `public` key

---

## 2. Execute Database Migrations

KisanConnect includes full PostgreSQL migrations with schema tables, foreign key constraints, Row-Level Security (RLS) policies, and performance indexes.

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open and copy the contents of `/supabase/migrations/20261102000000_kisanconnect_initial_schema.sql` from this repository.
4. Paste into the SQL Editor and click **Run**.
5. Create another query, copy the contents of `/supabase/migrations/20261102000001_kisanconnect_part2_expansion.sql`, paste, and click **Run**.
6. Verify in the **Table Editor** that the following 12 tables exist:
   - `profiles`
   - `user_roles`
   - `farmer_profiles`
   - `buyer_profiles`
   - `expert_profiles`
   - `products` (and `product_images`)
   - `marketplace_inquiries` (and `inquiry_messages`)
   - `crop_records` (and `crop_activities`)
   - `market_prices`
   - `farming_articles`
   - `notifications`
   - `activity_logs`

---

## 3. Configure Supabase Storage

1. In the Supabase dashboard, navigate to **Storage**.
2. Click **New Bucket**:
   - **Name**: `produce-images`
   - **Public Bucket**: Enable (toggle **ON** so produce photos can be displayed in the public marketplace).
   - **File Size Limit**: `5MB`.
   - **Allowed MIME Types**: `image/jpeg, image/png, image/webp`.
3. Create a second public bucket:
   - **Name**: `article-assets` (for agronomy guides and disease symptom photos).
4. Set storage security policies in the **Policies** tab to allow authenticated farmers to upload to `produce-images`.

---

## 4. Configure Environment Variables

Create `.env.production` or configure these variables in the **Vercel Project Settings**:

```bash
# Supabase Production API
VITE_SUPABASE_URL="https://xxxxxxxxxxxx.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

*(Note: Never commit `.env` or service role secrets to public Git repositories).*

---

## 5. Connect GitHub to Vercel

1. Push your KisanConnect repository to your GitHub account:
   ```bash
   git add .
   git commit -m "feat: complete KisanConnect Part 3 advanced features and Vercel config"
   git push origin main
   ```
2. Go to [https://vercel.com](https://vercel.com) and log in.
3. Click **Add New...** > **Project**.
4. Select your `kisanconnect` GitHub repository from the list and click **Import**.

---

## 6. Deploy on Vercel

1. In the Vercel project setup screen:
   - **Framework Preset**: `Vite` (automatically detected).
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (or `vite build`)
   - **Output Directory**: `dist`
2. Expand the **Environment Variables** section and add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase Anon Key
3. Click **Deploy**.
4. Vercel will run `vite build` and deploy the production bundle to global Edge networks.

---

## 7. Verify the Production Application

After deployment completes, test the live URL provided by Vercel:

1. **SPA Routing**:
   - Direct link to deep routes (e.g. `/marketplace`, `/weather`, `/farming-assistant`, `/knowledge-hub`, `/dashboard/farmer`) should load seamlessly without 404 errors due to `vercel.json` rewrite configuration.
2. **User Authentication**:
   - Register a new account selecting a role (Farmer, Buyer, or Expert).
   - Confirm profile creation in Supabase `profiles` table.
   - Test sign out and sign in.
3. **Marketplace & Negotiations**:
   - As a Farmer, publish a new crop listing with quantity, grade, and asking price.
   - Switch role to Buyer, search the crop, and send a direct purchase proposal.
   - As Farmer, accept the proposal and verify that buyer phone details unlock.
4. **Live Weather & Mandi Rates**:
   - Verify Open-Meteo live weather telemetry loads for all 12 Nepal districts.
   - Inspect historical Mandi price charts (Kalimati, Pokhara, Birtamod).
5. **Security & Audits**:
   - As an Administrator, inspect `/dashboard/admin`, review platform metrics, verify user records, and check that activity logs are updating.
