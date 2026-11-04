# KisanConnect — Supabase Database Architecture & Setup

This directory contains the production database migrations and Row Level Security (RLS) policies for **KisanConnect — Smart Agriculture Network**.

## Architecture Overview

KisanConnect is architected around 4 core user personas:
1. **Farmer (`farmer`)**: Manages crops, views market mandi prices, receives buyer inquiries, accesses expert guides.
2. **Buyer (`buyer`)**: Agribusinesses, wholesalers, processors browsing produce and negotiating purchase contracts.
3. **Agricultural Expert (`expert`)**: Agronomists and extension officers publishing advisory articles and answering farmer questions.
4. **Administrator (`admin`)**: Verifies users and listings, manages commodity categories, monitors activity logs.

## Tables Included

- `profiles`: Core identity linked to Supabase `auth.users(id)` with district, province, role, contact info.
- `user_roles`: Role assignment audit table with granted_by tracking.
- `farmer_profiles`: Specific farm metrics (farm size in Ropani/Bigha, farming type, kisan card).
- `buyer_profiles`: Company details, PAN/VAT, preferred agricultural categories, annual demand.
- `expert_profiles`: Credentials, specialization, institution (e.g. NARC), experience.
- `agricultural_categories`: Canonical agricultural categories in Nepal with bilingual Nepali names.
- `crop_listings`: Farmer crop offerings with variety, harvest dates, quantities, and pricing.
- `purchase_inquiries`: Buyer-to-farmer trade proposals and negotiation thread.
- `expert_articles`: Scientific agricultural guides and pest prevention advisories.
- `farmer_questions`: Farmer-to-expert consultation queries.
- `activity_logs`: Immutable audit trails for administrative review.
- `mandi_prices`: Wholesale price discovery data from Kalimati & regional agriculture markets.

## Setup Instructions

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project or select an existing one.
3. Go to the **SQL Editor** tab.
4. Paste the contents of `migrations/20261102000000_kisanconnect_initial_schema.sql` and click **Run**.
5. Copy your **Project URL** and **anon public key** from Project Settings -> API.
6. Add them to your `.env` or deployment environment variables:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
