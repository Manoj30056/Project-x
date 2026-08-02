-- ENGRAM PROJECT: Idempotent Database & Storage Migration
-- Version: 1.2 (Handles existing policies and triggers)

-- ========================================================
-- 1. UTILITY FUNCTIONS
-- ========================================================

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================================
-- 2. CORE TABLES
-- ========================================================

-- Profiles: Connected to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT UNIQUE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  is_guest BOOLEAN DEFAULT FALSE NOT NULL,
  preferences JSONB DEFAULT '{"theme": "system", "language": "en", "notifications": true}'::JSONB NOT NULL,
  storage_used BIGINT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Events: The primary memory containers
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  cover_color VARCHAR(7) DEFAULT '#6366f1',
  event_code VARCHAR(12) NOT NULL UNIQUE,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  organizer_name TEXT NOT NULL DEFAULT 'Organizer',
  password_hash TEXT, -- For private events
  visibility VARCHAR(20) DEFAULT 'public' NOT NULL, -- public, private, hidden
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  timezone TEXT DEFAULT 'UTC',
  location_name TEXT,
  latitude REAL,
  longitude REAL,
  guest_count INTEGER DEFAULT 0 NOT NULL,
  media_count INTEGER DEFAULT 0 NOT NULL,
  settings JSONB DEFAULT '{"allowGuestUploads": true, "requireApproval": false}'::JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Event Members: Who is participating
CREATE TABLE IF NOT EXISTS public.event_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL DEFAULT 'Guest',
  role VARCHAR(20) DEFAULT 'guest' NOT NULL, -- organizer, co-organizer, photographer, guest, viewer
  is_guest_account BOOLEAN DEFAULT FALSE NOT NULL,
  permissions JSONB DEFAULT '{}'::JSONB NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(event_id, user_id)
);

-- Photos
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  uploader_name TEXT NOT NULL,
  original_url TEXT NOT NULL,
  thumbnail_url TEXT,
  width INTEGER,
  height INTEGER,
  file_size BIGINT,
  mime_type VARCHAR(50),
  latitude REAL, -- GPS
  longitude REAL, -- GPS
  ai_tags JSONB DEFAULT '[]'::JSONB NOT NULL,
  caption TEXT,
  is_favorite BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Videos
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  uploader_name TEXT NOT NULL,
  original_url TEXT NOT NULL,
  optimized_url TEXT,
  thumbnail_url TEXT,
  preview_url TEXT,
  duration INTEGER, -- In seconds
  width INTEGER,
  height INTEGER,
  file_size BIGINT,
  mime_type VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comments
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID NOT NULL,
  media_type VARCHAR(10) NOT NULL, -- 'photo' or 'video'
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Likes
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID NOT NULL,
  media_type VARCHAR(10) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(media_id, user_id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL, -- upload, like, join, etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::JSONB NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- QR Codes
CREATE TABLE IF NOT EXISTS public.qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  type VARCHAR(20) DEFAULT 'join' NOT NULL,
  usage_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT,
  action VARCHAR(50) NOT NULL,
  details JSONB DEFAULT '{}'::JSONB NOT NULL,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================================
-- 3. INDEXES
-- ========================================================

CREATE INDEX IF NOT EXISTS idx_events_event_code ON public.events(event_code);
CREATE INDEX IF NOT EXISTS idx_event_members_user_event ON public.event_members(user_id, event_id);
CREATE INDEX IF NOT EXISTS idx_photos_event ON public.photos(event_id);
CREATE INDEX IF NOT EXISTS idx_videos_event ON public.videos(event_id);
CREATE INDEX IF NOT EXISTS idx_comments_media ON public.comments(media_id);
CREATE INDEX IF NOT EXISTS idx_likes_media ON public.likes(media_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- ========================================================
-- 4. TRIGGERS
-- ========================================================

-- Update Updated At Triggers
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('profiles', 'events', 'photos', 'videos', 'comments')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS tr_updated_at_%I ON public.%I', t, t);
        EXECUTE format('CREATE TRIGGER tr_updated_at_%I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()', t, t);
    END LOOP;
END $$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email), NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================================
-- 5. STORAGE BUCKETS
-- ========================================================

-- Ensure storage schema extensions are present (buckets insertion)
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('event-photos', 'event-photos', true),
  ('event-videos', 'event-videos', true),
  ('profile-images', 'profile-images', true),
  ('qr-codes', 'qr-codes', true),
  ('event-covers', 'event-covers', true)
ON CONFLICT (id) DO NOTHING;

-- ========================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- CLEANUP OLD POLICIES TO PREVENT "ALREADY EXISTS" ERRORS
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        OR (schemaname = 'storage' AND tablename = 'objects')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, 'public', pol.tablename);
    END LOOP;
END $$;

-- Profiles: Anyone can view, owner can update
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Events: Everyone sees public, members see private, organizer can manage
CREATE POLICY "Public events are viewable by everyone" ON public.events FOR SELECT USING (visibility = 'public');
CREATE POLICY "Private events are viewable by members" ON public.events FOR SELECT USING (
  visibility = 'private' AND (
    EXISTS (SELECT 1 FROM public.event_members WHERE event_id = events.id AND user_id = auth.uid())
  )
);
CREATE POLICY "Organizers have full control of their events" ON public.events FOR ALL USING (organizer_id = auth.uid());

-- Photos/Videos: Linked to event visibility/membership
CREATE POLICY "Media is viewable by authorized users" ON public.photos FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.events WHERE id = photos.event_id AND visibility = 'public') OR
  EXISTS (SELECT 1 FROM public.event_members WHERE event_id = photos.event_id AND user_id = auth.uid())
);
CREATE POLICY "Members can upload photos" ON public.photos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.event_members WHERE event_id = photos.event_id AND user_id = auth.uid())
);

-- Notifications: Only owner
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());

-- Activity Logs: Only Organizer or Admin
CREATE POLICY "Organizers view activity logs" ON public.activity_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND organizer_id = auth.uid())
);

-- Storage Object Policies (Idempotent cleanup handled above)
CREATE POLICY "Anyone can view public storage" ON storage.objects FOR SELECT USING (bucket_id IN ('event-photos', 'event-videos', 'event-covers', 'profile-images', 'qr-codes'));
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
