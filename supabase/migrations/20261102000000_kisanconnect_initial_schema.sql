-- ==============================================================================
-- KisanConnect — Smart Agriculture Network (Nepal)
-- Part 1: Initial Database Schema, RLS Policies, Indexes & Seed Data
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Enum Types for robust data integrity
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('farmer', 'buyer', 'expert', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE farming_type_enum AS ENUM ('organic', 'conventional', 'mixed', 'hydroponic');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE buyer_business_type AS ENUM ('wholesaler', 'retailer', 'processor', 'hotel_restaurant', 'exporter', 'individual');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_status_type AS ENUM ('draft', 'active', 'reserved', 'sold', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inquiry_status_type AS ENUM ('pending', 'accepted', 'rejected', 'negotiating', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- TABLE 1: profiles
-- Base user profile linked to Supabase auth.users
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role_type NOT NULL DEFAULT 'farmer',
    avatar_url TEXT,
    province TEXT NOT NULL DEFAULT 'Bagmati',
    district TEXT NOT NULL DEFAULT 'Kathmandu',
    municipality TEXT,
    ward_no INTEGER,
    address_detail TEXT,
    bio TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE 2: user_roles
-- Role-based access control audit & management table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role_type NOT NULL,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    granted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    UNIQUE(user_id, role)
);

-- ==============================================================================
-- TABLE 3: farmer_profiles
-- Farmer-specific agricultural details
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_name TEXT,
    farm_size_ropani NUMERIC(8,2) DEFAULT 0,
    primary_crops TEXT[] DEFAULT '{}',
    farming_type farming_type_enum DEFAULT 'conventional',
    irrigation_source TEXT,
    kisan_card_number TEXT,
    verified_by_ward BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE 4: buyer_profiles
-- Agribusiness, wholesaler, and retail buyer specifics
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.buyer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    business_type buyer_business_type DEFAULT 'wholesaler',
    pan_vat_number TEXT,
    preferred_categories TEXT[] DEFAULT '{}',
    delivery_locations TEXT[] DEFAULT '{}',
    annual_demand_quintals NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE 5: expert_profiles
-- Agronomists, plant pathologists, agricultural officers
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.expert_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    designation TEXT NOT NULL,
    specialization TEXT NOT NULL,
    institution_affiliation TEXT NOT NULL,
    qualification TEXT,
    license_number TEXT,
    years_of_experience INTEGER DEFAULT 1,
    total_answers INTEGER DEFAULT 0,
    rating NUMERIC(3,2) DEFAULT 5.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE 6: agricultural_categories
-- Canonical categories of crops and products in Nepal
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.agricultural_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    nepali_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'Sprout',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE 7: crop_listings
-- Farmer marketplace listings for produce
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.crop_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.agricultural_categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    crop_variety TEXT,
    quantity NUMERIC(10,2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'Quintal',
    price_per_unit NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NPR',
    harvest_date DATE,
    district TEXT NOT NULL,
    municipality TEXT,
    is_organic BOOLEAN DEFAULT false,
    status listing_status_type DEFAULT 'active',
    images TEXT[] DEFAULT '{}',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE 8: purchase_inquiries
-- Buyer offers and trade inquiries sent to farmers
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.purchase_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES public.crop_listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    requested_quantity NUMERIC(10,2) NOT NULL,
    offered_price_per_unit NUMERIC(10,2) NOT NULL,
    message TEXT,
    delivery_date DATE,
    status inquiry_status_type DEFAULT 'pending',
    response_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE 9: expert_articles & advisories
-- Technical farming articles published by agronomists
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.expert_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expert_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    category_id UUID REFERENCES public.agricultural_categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    views_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE 10: farmer_questions
-- Farmer Q&A for pest, disease, and weather queries
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.farmer_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    crop_name TEXT,
    status TEXT DEFAULT 'open',
    answered_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    answer_text TEXT,
    answered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE 11: activity_logs
-- Immutable audit log of key platform events
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE 12: mandi_prices
-- Official wholesale market price records (Kalimati, Birtamod, Pokhara, etc.)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.mandi_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commodity TEXT NOT NULL,
    nepali_name TEXT,
    category TEXT NOT NULL,
    market_name TEXT NOT NULL DEFAULT 'Kalimati Fruits and Vegetable Market',
    district TEXT NOT NULL DEFAULT 'Kathmandu',
    min_price NUMERIC(10,2) NOT NULL,
    max_price NUMERIC(10,2) NOT NULL,
    avg_price NUMERIC(10,2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'Kg',
    price_date DATE NOT NULL DEFAULT CURRENT_DATE,
    source TEXT NOT NULL DEFAULT 'Kalimati Fruits and Vegetable Market Development Board (KFVMDB)',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE & QUERY OPTIMIZATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_district ON public.profiles(district);
CREATE INDEX IF NOT EXISTS idx_crop_listings_farmer ON public.crop_listings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_crop_listings_status ON public.crop_listings(status);
CREATE INDEX IF NOT EXISTS idx_crop_listings_category ON public.crop_listings(category_id);
CREATE INDEX IF NOT EXISTS idx_purchase_inquiries_buyer ON public.purchase_inquiries(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchase_inquiries_farmer ON public.purchase_inquiries(farmer_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mandi_prices_date ON public.mandi_prices(price_date DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agricultural_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandi_prices ENABLE ROW LEVEL SECURITY;

-- Helper security function: Check if current authenticated user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by all authenticated users"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can manage any profile"
ON public.profiles FOR ALL
USING (public.is_admin());

-- FARMER PROFILES POLICIES
CREATE POLICY "Farmer profiles viewable by all authenticated users"
ON public.farmer_profiles FOR SELECT
USING (true);

CREATE POLICY "Farmers can insert their own farmer profile"
ON public.farmer_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Farmers can update their own farmer profile"
ON public.farmer_profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage farmer profiles"
ON public.farmer_profiles FOR ALL
USING (public.is_admin());

-- BUYER PROFILES POLICIES
CREATE POLICY "Buyer profiles viewable by all authenticated users"
ON public.buyer_profiles FOR SELECT
USING (true);

CREATE POLICY "Buyers can insert their own buyer profile"
ON public.buyer_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Buyers can update their own buyer profile"
ON public.buyer_profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage buyer profiles"
ON public.buyer_profiles FOR ALL
USING (public.is_admin());

-- EXPERT PROFILES POLICIES
CREATE POLICY "Expert profiles viewable by all"
ON public.expert_profiles FOR SELECT
USING (true);

CREATE POLICY "Experts can insert their own expert profile"
ON public.expert_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Experts can update their own expert profile"
ON public.expert_profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage expert profiles"
ON public.expert_profiles FOR ALL
USING (public.is_admin());

-- CATEGORIES POLICIES
CREATE POLICY "Categories viewable by everyone"
ON public.agricultural_categories FOR SELECT
USING (true);

CREATE POLICY "Only admins can modify categories"
ON public.agricultural_categories FOR ALL
USING (public.is_admin());

-- CROP LISTINGS POLICIES
CREATE POLICY "Active crop listings viewable by everyone"
ON public.crop_listings FOR SELECT
USING (status = 'active' OR auth.uid() = farmer_id OR public.is_admin());

CREATE POLICY "Farmers can insert crop listings"
ON public.crop_listings FOR INSERT
WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own crop listings"
ON public.crop_listings FOR UPDATE
USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete their own crop listings"
ON public.crop_listings FOR DELETE
USING (auth.uid() = farmer_id);

CREATE POLICY "Admins can manage all crop listings"
ON public.crop_listings FOR ALL
USING (public.is_admin());

-- PURCHASE INQUIRIES POLICIES
CREATE POLICY "Users can view inquiries they sent or received"
ON public.purchase_inquiries FOR SELECT
USING (auth.uid() = buyer_id OR auth.uid() = farmer_id OR public.is_admin());

CREATE POLICY "Buyers can create purchase inquiries"
ON public.purchase_inquiries FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Inquiry participants can update status"
ON public.purchase_inquiries FOR UPDATE
USING (auth.uid() = buyer_id OR auth.uid() = farmer_id OR public.is_admin());

-- MANDI PRICES POLICIES
CREATE POLICY "Mandi prices viewable by everyone"
ON public.mandi_prices FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert or update mandi prices"
ON public.mandi_prices FOR ALL
USING (public.is_admin());

-- ACTIVITY LOGS POLICIES
CREATE POLICY "Users can view their own activity logs"
ON public.activity_logs FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "System and users can insert activity logs"
ON public.activity_logs FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR public.is_admin());

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    assigned_role user_role_type;
BEGIN
    assigned_role := COALESCE(
        (NEW.raw_user_meta_data->>'role')::user_role_type,
        'farmer'::user_role_type
    );

    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        phone,
        role,
        province,
        district,
        municipality
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'phone',
        assigned_role,
        COALESCE(NEW.raw_user_meta_data->>'province', 'Bagmati'),
        COALESCE(NEW.raw_user_meta_data->>'district', 'Kathmandu'),
        NEW.raw_user_meta_data->>'municipality'
    );

    -- Insert role into user_roles audit table
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, assigned_role);

    -- Auto-seed specific child profile based on role
    IF assigned_role = 'farmer' THEN
        INSERT INTO public.farmer_profiles (user_id, farm_name, farm_size_ropani, primary_crops)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'farm_name', 'Farm of ' || split_part(NEW.email, '@', 1)),
            COALESCE((NEW.raw_user_meta_data->>'farm_size_ropani')::numeric, 5.0),
            ARRAY[COALESCE(NEW.raw_user_meta_data->>'primary_crop', 'Paddy Rice')]
        );
    ELSIF assigned_role = 'buyer' THEN
        INSERT INTO public.buyer_profiles (user_id, company_name, business_type)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'company_name', 'AgriTrade ' || split_part(NEW.email, '@', 1)),
            'wholesaler'
        );
    ELSIF assigned_role = 'expert' THEN
        INSERT INTO public.expert_profiles (user_id, designation, specialization, institution_affiliation)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'designation', 'Agronomist'),
            COALESCE(NEW.raw_user_meta_data->>'specialization', 'Crop Science & Soil Management'),
            COALESCE(NEW.raw_user_meta_data->>'institution_affiliation', 'Nepal Agricultural Research Council (NARC)')
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- INITIAL SEED DATA: Agricultural Categories in Nepal
-- ==============================================================================
INSERT INTO public.agricultural_categories (name, nepali_name, slug, description, icon, display_order)
VALUES
    ('Cereal & Grains', 'खाद्यान्न बाली', 'cereal-grains', 'Rice (Dhan), Wheat, Maize, Millet, Buckwheat', 'Wheat', 1),
    ('Vegetables', 'तरकारी बाली', 'vegetables', 'Fresh seasonal vegetables, leafy greens, tubers and gourds', 'Carrot', 2),
    ('Fruits', 'फलफूल बाली', 'fruits', 'Apples (Mustang), Oranges, Bananas, Mangoes, Kiwi', 'Apple', 3),
    ('Pulses & Legumes', 'दलहन बाली', 'pulses-legumes', 'Lentils (Musuro), Chickpeas, Black gram, Soybeans', 'Boxes', 4),
    ('Cash Crops & Spices', 'नगदे तथा मसला बाली', 'cash-crops-spices', 'Large Cardamom (Alainchi), Ginger, Turmeric, Tea, Coffee', 'Flame', 5),
    ('Oilseeds', 'तेलहन बाली', 'oilseeds', 'Mustard (Tori), Sunflower, Sesame', 'Droplet', 6),
    ('Dairy & Livestock', 'पशुपालन तथा दुग्ध', 'dairy-livestock', 'Milk, Chhurpi, Ghee, Honey, Goat & Poultry products', 'Milk', 7)
ON CONFLICT (name) DO NOTHING;
