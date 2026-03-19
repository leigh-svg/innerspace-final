-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE public.profiles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    style_dna JSONB DEFAULT '{}'::jsonb,
    tier TEXT CHECK (tier IN ('Guest', 'Quick Fix', 'Style Elevate', 'Luxury Suite', 'Full Concept')) DEFAULT 'Guest',
    budget_cap NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE public.projects (
    project_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    room_type TEXT NOT NULL,
    status TEXT CHECK (status IN ('Scanning', 'Designing', 'Procuring', 'Completed')) DEFAULT 'Scanning',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Spatial Scans Table
CREATE TABLE public.spatial_scans (
    scan_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(project_id) ON DELETE CASCADE,
    dimensions JSONB NOT NULL, -- { floorSpace: 24000, ceilingHeight: 2850 }
    lidar_metadata JSONB, -- Raw point cloud context or device info
    wall_area_gross NUMERIC(10, 2), -- Computed in Edge Function
    wall_area_net NUMERIC(10, 2),   -- Computed in Edge Function (Gross reqs openings)
    floor_area NUMERIC(10, 2),      -- Computed
    video_path TEXT, -- Reference to Supabase Storage (To be auto-deleted post-processing)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Products Table (Master Catalog & Sourcing)
CREATE TABLE public.products (
    item_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(project_id) ON DELETE SET NULL, -- Nullable if it's a global catalog item, set if bespoke to project
    tier_category TEXT NOT NULL, -- e.g., 'Paint_Wallcoverings', 'Textiles_Rugs'
    brand TEXT NOT NULL,
    name TEXT NOT NULL,
    retail_price NUMERIC(10, 2) NOT NULL,
    trade_price NUMERIC(10, 2) NOT NULL,
    purchase_url TEXT,
    in_stock_status BOOLEAN DEFAULT TRUE,
    last_stock_check TIMESTAMPTZ DEFAULT NOW(),
    style_tags JSONB DEFAULT '[]'::jsonb -- ['velvet', 'minimalist']
);

-- 5. Unified Basket (Cart/Procurement linking Projects to Products)
CREATE TABLE public.project_items (
    basket_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(project_id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.products(item_id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    status TEXT CHECK (status IN ('Suggested', 'Approved', 'Ordered', 'Swapped')) DEFAULT 'Suggested',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Consultancy Table (Hybrid Pro layer)
CREATE TABLE public.consultancy (
    appointment_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(project_id) ON DELETE CASCADE,
    designer_id UUID, -- References internal auth or designer roster table
    appointment_date TIMESTAMPTZ,
    site_visit BOOLEAN DEFAULT FALSE,
    meeting_link TEXT,
    status TEXT CHECK (status IN ('Pending', 'Confirmed', 'Completed')) DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- SECURITY & RLS (Row Level Security)
-- =========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spatial_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_items ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Projects: Users can only see their own projects
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);

-- Spatial Scans: Access restricted via Project ownership
CREATE POLICY "Users can access own spatial scans" ON public.spatial_scans
    FOR ALL USING (project_id IN (SELECT project_id FROM public.projects WHERE user_id = auth.uid()));

-- Project Items: Access restricted via Project ownership
CREATE POLICY "Users can access own basket items" ON public.project_items
    FOR ALL USING (project_id IN (SELECT project_id FROM public.projects WHERE user_id = auth.uid()));
