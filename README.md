# KisanConnect — Smart Agriculture Network (नेपाल)

> **Empowering Nepali farmers, wholesale buyers, agronomists, and administrators through a sovereign digital agricultural ecosystem.**

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Postgres-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.10-22c55e)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

---

## 1. Project Introduction

**KisanConnect (किसान कनेक्ट)** is a full-stack digital agricultural platform built to modernize agricultural commerce, information distribution, and crop field stewardship in Nepal. 

Historically, smallholder farmers across Nepal's mid-hills and Terai face steep broker margins (middlemen capturing 40–60% of produce value), fragmented market price visibility, lack of accessible agronomic advice during pest outbreaks, and climate vulnerabilities. KisanConnect solves these challenges through verified direct trade, transparent daily Mandi pricing, live localized agro-weather intelligence, and scientific agronomy advisories grounded in NARC guidelines.

---

## 2. Problem Statement & Objectives

### Problem Statement
- **Broker Exploitation**: Middlemen exploit geographic isolation, underpaying farmers at the farm-gate while charging inflated prices to urban wholesalers.
- **Price Opacity**: Disparate mandi rates across Kalimati, Pokhara, Birtamod, and Chitwan are difficult for rural growers to compare.
- **Unscientific Farming & Input Abuse**: Misuse of synthetic pesticides and unverified chemical cocktails creates soil acidity and pest resistance.
- **No Direct Forward Contracts**: Farmers harvest without guaranteed buyers, causing distress selling of perishable produce.

### Platform Objectives
1. **Direct Farm-to-Buyer Marketplace**: Enable growers to list produce with quality grades (Grade A, Grade B, Organic Certified) and conduct transparent, direct volume negotiations.
2. **Transparent Price Intelligence**: Provide daily minimum, maximum, and average prices across 6 major Nepali mandis with historical trend analysis and inter-mandi spread comparisons.
3. **Smart Agri-Weather & Spray Advisories**: Integrate Open-Meteo telemetry to provide actionable advice on chemical spraying windows, irrigation necessity, and sun-drying indices.
4. **Field Plot Tracking & Harvest Calendars**: Empower farmers to track multi-stage crop growth, schedule field operations (weeding, fertilization, pest bio-sprays), and pre-list forward harvests.
5. **Multi-Role Governance**: Enforce strict server-side Row-Level Security (RLS) across 4 dedicated user roles: Farmers, Buyers, Agro-Experts, and Administrators.

---

## 3. Technology Stack

- **Frontend Core**: React 19 (Functional components, custom hooks, context providers).
- **Language**: Pure JavaScript ES6+ and JSX ONLY (zero TypeScript requirement strictly enforced).
- **Build Tool**: Vite 8 with fast HMR and optimized production bundling.
- **Styling**: Tailwind CSS v4 featuring Forest Green (`#14532D`), Fresh Leaf Green, off-white background (`#F8FAF8`), and dark charcoal typography.
- **Navigation**: React Router DOM v7 for declarative client-side routing.
- **Iconography**: Lucide React.
- **Analytics & Data Visualization**: Recharts (LineChart, AreaChart, BarChart).
- **Backend & Database**: Supabase (PostgreSQL with Row Level Security, Supabase Auth, and Storage).
- **External Telemetry**: Open-Meteo API for real-time Nepal weather forecasting.
- **Deployment**: Vercel (Edge network deployment with SPA rewrites via `vercel.json`).

---

## 4. Main Features

### 🌾 1. Farm-Gate Agricultural Marketplace
- **Search & Cascading Filters**: Search by crop variety, province, district, agricultural category, quality grade, organic certification, and price range.
- **Direct Trade Inquiries**: Commercial buyers send volume bids and proposed rates directly to farmers.
- **Secure Negotiation Threads**: Real-time communication history between buyer and grower without exposing private phone numbers until offer acceptance.
- **Mandi Benchmark Comparison**: Live comparison of asking prices against Kalimati wholesale averages to highlight farmer savings.
- **Produce Moderation & Reporting**: Product reporting mechanism with administrative review and 1-click renewal for expiring listings.

### 📊 2. Mandi Price Intelligence
- **6 Key Wholesale Mandis**: Kalimati (Kathmandu), Pokhara (Kaski), Birtamod (Jhapa), Bharatpur (Chitwan), Nepalgunj (Banke), and Birgunj (Parsa).
- **Price Spread & Arbitrage Analytics**: Comparative analysis showing regional price differences to help growers direct produce to the highest-paying market.
- **Historical Price Trends**: 6-day interactive Recharts trend lines showing commodity price trajectory (Up, Down, Stable).

### ⛅ 3. Live Weather Intelligence & Spray Windows
- **12 Nepal Agro-Ecological Coordinates**: Accurate Open-Meteo weather data for Kathmandu, Kavre, Dhading, Chitwan, Kaski, Jhapa, Mustang, Banke, Surkhet, etc.
- **Farming Operation Indices**:
  - *Spray Window Advisory*: Evaluates wind speed (< 12 km/h) and rain probability (< 20%) to prevent chemical wash-off.
  - *Irrigation Guidance*: Assesses recent precipitation against soil evaporation demand.
  - *Grain Drying Index*: Sun-curing suitability for paddy, maize, and cardamom.

### 🚜 4. Field Crop Management & Harvest Calendar
- **Plot-by-Plot Tracking**: Record planting dates, plot names, land areas (Ropani / Bigha), and expected yields.
- **6-Stage Growth Lifecycle**: Sowing/Seedling → Vegetative Canopy → Flowering Stage → Fruit/Grain Filling → Ready for Harvest → Harvest Completed.
- **Field Activity Logger**: Track fertilization, biological sprays, weeding, and irrigation with timestamps and expense notes.
- **Harvest Calendar**: Visual countdown of maturing crops with 1-click pre-listing onto the public marketplace.

### 📚 5. Agricultural Knowledge Hub & Smart Assistant
- **10-Category Guide Library**: Rice, wheat, maize, off-season vegetables, organic farming, soil reclamation, IPM pest control, and post-harvest storage.
- **Step-by-Step Field Protocols**: Illustrated cultural practices and biological stewardship.
- **Nepali Agro-Climatic Seasonal Calendar**: Comprehensive guidelines across Basanta, Barsha, Sharad, and Hemanta/Shishir seasons.
- **Nepal Agricultural FAQs**: Government subsidies (PMAMP), 80% Krishi Bima insurance subsidies, and soil testing laboratory directories.

### 🛡️ 6. Platform Governance & Admin Analytics
- **Recharts Analytics Engine**: Total registered users, active farmers, buyers, listings, completed vs pending inquiries, popular categories, and monthly growth trends.
- **User Directory Administration**: Ward verification badge management, account suspension/restoration, and role reassignment.
- **Listing & Article Moderation**: Approve, draft, or reject farm offerings and agronomic articles.
- **Immutable Security Audit Log**: Immutable record of all administrative and marketplace security events with 1-click CSV export.

---

## 5. Folder Structure

```
kisanconnect/
├── DEPLOYMENT.md              # Step-by-step production deployment guide
├── README.md                  # Comprehensive project documentation
├── index.html                 # HTML5 entry point with Plus Jakarta Sans & meta tags
├── jsconfig.json              # JavaScript path aliases (@/*)
├── metadata.json              # Applet metadata & capability configuration
├── package.json               # Dependencies and scripts (ES Modules)
├── vercel.json                # Vercel SPA rewrite & asset caching configuration
├── vite.config.js             # Vite configuration with Tailwind CSS plugin
├── supabase/
│   └── migrations/
│       ├── 20261102000000_kisanconnect_initial_schema.sql    # Part 1 database schema
│       └── 20261102000001_kisanconnect_part2_expansion.sql   # Part 2 & 3 schema expansion
└── src/
    ├── App.jsx                # Application root, routing, ErrorBoundary & ToastProvider
    ├── main.jsx               # React DOM entry point
    ├── index.css              # Tailwind CSS imports & global design directives
    ├── components/
    │   ├── common/
    │   │   ├── ConfirmModal.jsx       # Reusable confirmation modal for actions
    │   │   ├── ErrorBoundary.jsx      # Global UI error boundary
    │   │   ├── Footer.jsx             # Universal platform footer
    │   │   ├── HonestyBanner.jsx      # Production & transparency banner
    │   │   ├── Navbar.jsx             # Responsive navigation with role indicators
    │   │   ├── NotificationBell.jsx   # In-app notification drawer & preferences
    │   │   └── ProtectedRoute.jsx     # Role-based route guard
    │   └── layout/
    │       └── DashboardLayout.jsx    # Unified dashboard shell with responsive sidebar
    ├── config/
    │   └── supabase.js        # Supabase client initializer with sandbox fallback
    ├── contexts/
    │   ├── AuthContext.jsx    # Authentication & user role state management
    │   └── ToastContext.jsx   # Lightweight accessible toast notification system
    ├── pages/
    │   ├── admin/
    │   │   └── AdminDashboard.jsx     # Advanced Recharts analytics & governance
    │   ├── auth/
    │   │   ├── LoginPage.jsx          # Email login with 1-click demo switcher
    │   │   └── RegisterPage.jsx       # Multi-role registration & profile setup
    │   ├── buyer/
    │   │   └── BuyerDashboard.jsx     # Proposal tracking, saved watchlist & farmer cards
    │   ├── expert/
    │   │   └── ExpertDashboard.jsx    # Article publishing & consultation inbox
    │   ├── farmer/
    │   │   └── FarmerDashboard.jsx    # Harvest calendar, plot tracker & negotiation
    │   └── public/
    │       ├── AboutPage.jsx          # Mission, values & sovereign infrastructure
    │       ├── ArticleDetailPage.jsx  # Full agronomic guide view with steps
    │       ├── ContactPage.jsx        # Helplines, regional offices & inquiry form
    │       ├── FarmingAssistantPage.jsx # Smart advisory, seasonal calendar & reminders
    │       ├── FeaturesPage.jsx       # Platform capability breakdown
    │       ├── HowItWorksPage.jsx     # Step-by-step role journey
    │       ├── KnowledgeHubPage.jsx   # 10-category educational guide directory
    │       ├── LandingPage.jsx        # Public homepage with statistics & testimonials
    │       ├── MandiPricesPage.jsx    # Multi-mandi live prices & trend charts
    │       ├── MarketplacePage.jsx    # Farm produce directory with multi-filters
    │       ├── NotFoundPage.jsx       # 404 handler
    │       ├── ProductDetailPage.jsx  # Product inspection & direct inquiry dialog
    │       ├── SettingsPage.jsx       # Account & password configuration
    │       ├── UserProfilePage.jsx    # Ward verification & farm details
    │       └── WeatherPage.jsx        # Live Open-Meteo telemetry & farm advisories
    ├── services/
    │   ├── api.js                     # Unified data layer (Supabase + Local fallback)
    │   ├── marketPriceService.js      # Mandi prices provider with spread calculator
    │   └── weatherService.js          # Open-Meteo API provider with spray algorithms
    └── utils/
        └── nepalData.js               # Canonical geographic taxonomy & seed data
```

---

## 6. Getting Started & Installation

### Prerequisites
- Node.js version 18.x or 20.x or higher
- npm or yarn or bun package manager

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/kisanconnect.git
   cd kisanconnect
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-public-key"
   ```
   *(If left empty, the application runs in interactive sandbox mode with full persistent demonstration data).*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   ```
   The production-ready artifacts are generated in the `/dist` directory.

---

## 7. Database Setup & Migrations

Execute the SQL scripts located in `/supabase/migrations/` in your Supabase SQL editor:
1. `20261102000000_kisanconnect_initial_schema.sql` (Profiles, Roles, RLS policies).
2. `20261102000001_kisanconnect_part2_expansion.sql` (Products, Inquiries, Crops, Activities, Mandi prices, Articles, Notifications, Audit logs).

For detailed steps, refer to `DEPLOYMENT.md`.

---

## 8. Role-Based Demo Accounts

To quickly test all 4 platform roles in development:

| Role | Name | Email | Default Focus |
|---|---|---|---|
| **Farmer** | Ramesh Bahadur Thapa | `ramesh.farmer@kisanconnect.np` | Crop Listings, Field Tracker, Inquiries |
| **Buyer** | Sita Shrestha | `sita.agrotrade@kisanconnect.np` | Browse Marketplace, Send Bids, Negotiations |
| **Agro-Expert** | Dr. Anil Karki | `dr.anil.agronomist@kisanconnect.np` | Publish Guides, Answer Farmer Queries |
| **Admin** | Platform Administrator | `admin@kisanconnect.np` | Recharts Analytics, User Management, RLS Audit |

---

## 9. Future Enhancements

- **Mobile SMS Gateway**: Integration with Nepal Telecom / Ncell SMS API to deliver mandi rates and frost warnings via feature phone SMS.
- **Nepali Localization Toggle**: Full bilingual interface switch between English and Nepali (नेपाली भाषा).
- **Cold Storage Directory**: Real-time capacity monitoring of public and private cold storages in major agricultural corridors.
- **Decentralized QR Verification**: Dynamic QR codes printed on produce sacks linked directly to farmer ward certificates and pesticide-free audit reports.

---

## 10. License

Licensed under the Apache License, Version 2.0. Built with dedication for Nepal's farmers and agricultural community.
