-- ==============================================================================
-- KisanConnect — Smart Agriculture Network (Nepal)
-- Part 2: Database Expansion, Crop Management, Market Intelligence & Notifications
-- ==============================================================================

-- 1. Create Enums for Part 2
DO $$ BEGIN
    CREATE TYPE crop_quality_grade AS ENUM ('grade_a_premium', 'grade_b_standard', 'grade_c_fair', 'organic_certified');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE crop_growth_stage AS ENUM ('sowing_germination', 'vegetative', 'flowering', 'fruiting_grain_filling', 'harvest_ready', 'harvested');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE crop_health_status AS ENUM ('healthy', 'pest_alert', 'weather_watch', 'treatment_underway', 'harvested');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type_enum AS ENUM ('inquiry_received', 'inquiry_status_changed', 'crop_activity_reminder', 'harvest_due', 'new_article', 'announcement');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- TABLE: product_categories
-- Canonical categories with Nepal agricultural metadata
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    nepali_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'Sprout',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: products (Enhanced marketplace product listings)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    crop_variety TEXT,
    quality crop_quality_grade DEFAULT 'grade_a_premium',
    quantity NUMERIC(12,2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'Kg',
    price_per_unit NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NPR',
    harvest_date DATE,
    availability_status TEXT NOT NULL DEFAULT 'in_stock', -- 'in_stock', 'forward_harvest', 'pre_order', 'paused'
    province TEXT NOT NULL DEFAULT 'Bagmati Province',
    district TEXT NOT NULL,
    municipality TEXT,
    is_organic BOOLEAN DEFAULT false,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    is_approved BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: product_images
-- Multiple high-resolution images per agricultural product
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: saved_products (Buyer bookmarks / watchlists)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.saved_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(buyer_id, product_id)
);

-- ==============================================================================
-- TABLE: marketplace_inquiries
-- Formal procurement inquiries submitted by commercial buyers
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.marketplace_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    requested_quantity NUMERIC(10,2) NOT NULL,
    offered_price_per_unit NUMERIC(10,2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'Kg',
    proposed_delivery_date DATE,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'negotiating', 'completed'
    farmer_response_note TEXT,
    contact_phone_revealed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: inquiry_messages
-- Negotiation and communication thread per inquiry
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.inquiry_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_id UUID NOT NULL REFERENCES public.marketplace_inquiries(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: market_locations (Verified wholesale agricultural hubs in Nepal)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.market_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    nepali_name TEXT NOT NULL,
    district TEXT NOT NULL,
    province TEXT NOT NULL,
    is_primary_board BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: market_prices (Historical and daily commodity mandi prices)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.market_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commodity_name TEXT NOT NULL,
    nepali_name TEXT,
    category TEXT NOT NULL,
    market_location_id UUID REFERENCES public.market_locations(id) ON DELETE CASCADE,
    market_name TEXT NOT NULL,
    district TEXT NOT NULL,
    min_price NUMERIC(10,2) NOT NULL,
    max_price NUMERIC(10,2) NOT NULL,
    avg_price NUMERIC(10,2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'Kg',
    price_date DATE NOT NULL DEFAULT CURRENT_DATE,
    source TEXT NOT NULL,
    is_manually_entered BOOLEAN DEFAULT false,
    entered_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: crop_records (Farmer crop planning, tracking and lifecycle)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.crop_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    category TEXT NOT NULL,
    variety TEXT,
    field_name TEXT NOT NULL, -- e.g. 'North Terrace Plot A'
    land_area TEXT NOT NULL, -- e.g. '4 Ropani' or '1.5 Bigha'
    plantation_date DATE NOT NULL,
    expected_harvest_date DATE NOT NULL,
    growth_stage crop_growth_stage DEFAULT 'vegetative',
    expected_production_quantity NUMERIC(10,2) NOT NULL,
    production_unit TEXT NOT NULL DEFAULT 'Quintal',
    health_status crop_health_status DEFAULT 'healthy',
    notes TEXT,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: crop_activities (Field work records: spray, irrigation, fertilizer)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.crop_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_record_id UUID NOT NULL REFERENCES public.crop_records(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'fertilizer', 'irrigation', 'weeding', 'pest_spray', 'pruning', 'harvesting'
    activity_date DATE NOT NULL,
    details TEXT NOT NULL,
    cost_npr NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: farming_articles (Comprehensive educational knowledge hub)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.farming_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL DEFAULT 'expert',
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL, -- 'Vegetable Farming', 'Rice Cultivation', 'Soil Management', etc.
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    step_by_step_guide JSONB DEFAULT '[]'::jsonb,
    reading_time_minutes INTEGER DEFAULT 5,
    cover_image TEXT,
    is_scientific_advisory BOOLEAN DEFAULT false, -- differentiates research from general guide
    views_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: article_bookmarks
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.article_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES public.farming_articles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, article_id)
);

-- ==============================================================================
-- TABLE: notifications (In-app notifications)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type_enum NOT NULL DEFAULT 'announcement',
    link_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR FAST QUERYING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_farmer ON public.products(farmer_id);
CREATE INDEX IF NOT EXISTS idx_products_district ON public.products(district);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active, is_approved);
CREATE INDEX IF NOT EXISTS idx_inquiries_buyer ON public.marketplace_inquiries(buyer_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_farmer ON public.marketplace_inquiries(farmer_id);
CREATE INDEX IF NOT EXISTS idx_inquiry_messages_inquiry ON public.inquiry_messages(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_crop_records_farmer ON public.crop_records(farmer_id);
CREATE INDEX IF NOT EXISTS idx_crop_activities_crop ON public.crop_activities(crop_record_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_market_prices_commodity ON public.market_prices(commodity_name, price_date DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiry_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farming_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Products Policies
CREATE POLICY "Public active products viewable by all"
ON public.products FOR SELECT
USING (is_active = true OR auth.uid() = farmer_id OR public.is_admin());

CREATE POLICY "Farmers can insert products"
ON public.products FOR INSERT
WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update own products"
ON public.products FOR UPDATE
USING (auth.uid() = farmer_id OR public.is_admin());

CREATE POLICY "Farmers can delete own products"
ON public.products FOR DELETE
USING (auth.uid() = farmer_id OR public.is_admin());

-- Inquiries Policies
CREATE POLICY "Inquiry participants view inquiries"
ON public.marketplace_inquiries FOR SELECT
USING (auth.uid() = buyer_id OR auth.uid() = farmer_id OR public.is_admin());

CREATE POLICY "Buyers insert inquiries"
ON public.marketplace_inquiries FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Inquiry participants update status"
ON public.marketplace_inquiries FOR UPDATE
USING (auth.uid() = buyer_id OR auth.uid() = farmer_id OR public.is_admin());

-- Inquiry Messages Policies
CREATE POLICY "Inquiry participants view messages"
ON public.inquiry_messages FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.marketplace_inquiries i
    WHERE i.id = inquiry_messages.inquiry_id
    AND (i.buyer_id = auth.uid() OR i.farmer_id = auth.uid() OR public.is_admin())
));

CREATE POLICY "Inquiry participants insert messages"
ON public.inquiry_messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Saved Products Policies
CREATE POLICY "Buyers view and manage own saved products"
ON public.saved_products FOR ALL
USING (auth.uid() = buyer_id);

-- Crop Records & Activities Policies
CREATE POLICY "Farmers manage own crop records"
ON public.crop_records FOR ALL
USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers manage own crop activities"
ON public.crop_activities FOR ALL
USING (auth.uid() = farmer_id);

-- Farming Articles Policies
CREATE POLICY "Articles viewable by all"
ON public.farming_articles FOR SELECT
USING (is_published = true OR auth.uid() = author_id OR public.is_admin());

CREATE POLICY "Experts and admins insert articles"
ON public.farming_articles FOR INSERT
WITH CHECK (public.is_admin() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('expert', 'admin')
));

CREATE POLICY "Authors and admins update articles"
ON public.farming_articles FOR UPDATE
USING (auth.uid() = author_id OR public.is_admin());

-- Notifications Policies
CREATE POLICY "Users view own notifications"
ON public.notifications FOR ALL
USING (auth.uid() = user_id);

-- Storage bucket note:
-- Create public bucket 'crop-images' and 'article-media' in Supabase dashboard
-- with public read policies and authenticated upload policies.
