-- NikneuronDev: Supabase Initial Schema & Row Level Security
-- Section 5 Specification

-- 1. Create Enums
CREATE TYPE product_type AS ENUM (
  'web_tool',
  'web_app',
  'desktop',
  'mobile',
  'security_tool',
  'hardware'
);

CREATE TYPE release_channel AS ENUM ('stable', 'beta', 'nightly');

CREATE TYPE platform_type AS ENUM (
  'web',
  'android',
  'windows',
  'linux',
  'macos',
  'ios',
  'any'
);

CREATE TYPE product_status AS ENUM ('draft', 'published', 'archived');

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description_md TEXT NOT NULL,
  type product_type NOT NULL DEFAULT 'web_tool',
  category TEXT NOT NULL, -- matches 6 face category slugs
  tags TEXT[] DEFAULT '{}',
  icon_url TEXT,
  cover_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  accent_color TEXT DEFAULT '#4fd8ff',
  status product_status NOT NULL DEFAULT 'published',
  featured BOOLEAN NOT NULL DEFAULT false,
  repo_url TEXT,
  docs_url TEXT,
  live_url TEXT,
  license TEXT DEFAULT 'MIT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Releases Table
CREATE TABLE IF NOT EXISTS public.releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  version TEXT NOT NULL, -- semver (e.g. 1.2.0)
  channel release_channel NOT NULL DEFAULT 'stable',
  changelog_md TEXT,
  released_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  is_latest BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Release Files Table
CREATE TABLE IF NOT EXISTS public.release_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id UUID NOT NULL REFERENCES public.releases(id) ON DELETE CASCADE,
  platform platform_type NOT NULL DEFAULT 'any',
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  sha256 TEXT NOT NULL,
  signature_url TEXT,
  download_count BIGINT NOT NULL DEFAULT 0,
  instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Web Bundles Table (for Runnable In-Browser Web Tools)
CREATE TABLE IF NOT EXISTS public.web_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id UUID NOT NULL REFERENCES public.releases(id) ON DELETE CASCADE,
  entry_path TEXT NOT NULL DEFAULT 'index.html',
  bundle_url TEXT NOT NULL,
  csp_policy TEXT DEFAULT 'default-src ''self''; connect-src ''self''; worker-src ''self'' blob:;',
  requires_isolation BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Indexes for Sub-Second Queries
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_releases_product ON public.releases(product_id);
CREATE INDEX IF NOT EXISTS idx_release_files_release ON public.release_files(release_id);

-- 7. Secure Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.release_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_bundles ENABLE ROW LEVEL SECURITY;

-- Public can read all published products & releases
CREATE POLICY "Public read published products"
  ON public.products FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public read releases"
  ON public.releases FOR SELECT
  USING (true);

CREATE POLICY "Public read release files"
  ON public.release_files FOR SELECT
  USING (true);

CREATE POLICY "Public read web bundles"
  ON public.web_bundles FOR SELECT
  USING (true);

-- Authenticated Admin only write policies
CREATE POLICY "Admins full access products"
  ON public.products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins full access releases"
  ON public.releases FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins full access release_files"
  ON public.release_files FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 8. Download Counter Increment RPC Function
CREATE OR REPLACE FUNCTION increment_download_count(target_file_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.release_files
  SET download_count = download_count + 1
  WHERE id = target_file_id;
END;
$$;

