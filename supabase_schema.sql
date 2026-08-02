-- 1. CLEANUP (Optional - use with caution)
-- DROP TABLE IF EXISTS public.activity_logs, public.qr_codes, public.notifications, public.likes, public.comments, public.videos, public.photos, public.event_members, public.events, public.profiles CASCADE;

-- 2. TABLES SETUP
-- Profiles: Extends Supabase Auth users
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

-- Events: The core memory spaces
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  cover_color VARCHAR(7) DEFAULT '#6366f1',
  event_code VARCHAR(12) NOT NULL UNIQUE,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  organizer_name TEXT NOT NULL DEFAULT 'Organizer',
  organizer_email TEXT,
  password_hash TEXT,
  visibility VARCHAR(20) DEFAULT 'public' NOT NULL, -- public, private, hidden
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  timezone TEXT DEFAULT 'UTC',
  location_name TEXT,
  latitude REAL,
  longitude REAL,
  guest_count INTEGER DEFAULT 0 NOT NULL,
  media_count INTEGER DEFAULT 0 NOT NULL,
  settings JSONB DEFAULT '{"allowGuestUploads": true, "requireApproval": false, "isOnline": false}'::JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Event Members: Junction table between events and profiles
CREATE TABLE IF NOT EXISTS public.event_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL DEFAULT 'Guest',
  role VARCHAR(20) DEFAULT 'guest' NOT NULL, -- organizer, co-organizer, photographer, guest
  is_guest_account BOOLEAN DEFAULT FALSE NOT NULL,
  permissions JSONB DEFAULT '{}'::JSONB NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(event_id, user_id)
);

-- Photos: Image uploads
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  uploader_name TEXT NOT NULL,
  original_url TEXT NOT NULL,
  optimized_url TEXT,
  thumbnail_url TEXT,
  width INTEGER,
  height INTEGER,
  file_size BIGINT,
  mime_type VARCHAR(50),
  metadata JSONB DEFAULT '{}'::JSONB NOT NULL,
  ai_tags JSONB DEFAULT '[]'::JSONB NOT NULL,
  caption TEXT,
  is_favorite BOOLEAN DEFAULT FALSE NOT NULL,
  is_approved BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  taken_at TIMESTAMPTZ
);

-- Videos: Video uploads
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  uploader_name TEXT NOT NULL,
  original_url TEXT NOT NULL,
  optimized_url TEXT,
  thumbnail_url TEXT,
  preview_url TEXT,
  duration INTEGER, -- in seconds
  width INTEGER,
  height INTEGER,
  file_size BIGINT,
  mime_type VARCHAR(50),
  metadata JSONB DEFAULT '{}'::JSONB NOT NULL,
  ai_tags JSONB DEFAULT '[]'::JSONB NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE NOT NULL,
  is_approved BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comments: Social interaction
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID NOT NULL, -- reference either photo or video ID
  media_type VARCHAR(10) NOT NULL, -- 'photo' or 'video'
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Likes: Quick reactions
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID NOT NULL,
  media_type VARCHAR(10) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(media_id, user_id)
);

-- Notifications: User alerts
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::JSONB NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- QR Codes: For event joining
CREATE TABLE IF NOT EXISTS public.qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  type VARCHAR(20) DEFAULT 'join' NOT NULL,
  usage_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Activity Logs: Audit trail
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

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_events_event_code ON public.events(event_code);
CREATE INDEX IF NOT EXISTS idx_event_members_event_id ON public.event_members(event_id);
CREATE INDEX IF NOT EXISTS idx_photos_event_id ON public.photos(event_id);
CREATE INDEX IF NOT EXISTS idx_videos_event_id ON public.videos(event_id);
CREATE INDEX IF NOT EXISTS idx_comments_media_id ON public.comments(media_id);

-- 4. ROW LEVEL SECURITY (RLS)
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

-- 5. POLICIES
-- Profiles: Users can see all but only edit their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Events: Public events visible to all, private to members
CREATE POLICY "Public events are viewable by everyone" ON public.events FOR SELECT USING (visibility = 'public');
CREATE POLICY "Private events are viewable by members" ON public.events FOR SELECT USING (
  visibility = 'private' AND (
    EXISTS (SELECT 1 FROM public.event_members WHERE event_id = events.id AND user_id = auth.uid())
  )
);
CREATE POLICY "Organizers can manage their events" ON public.events FOR ALL USING (organizer_id = auth.uid());

-- Photos/Videos: Same logic as events
CREATE POLICY "Photos are viewable if event is viewable" ON public.photos FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.events WHERE id = photos.event_id AND (visibility = 'public' OR organizer_id = auth.uid()))
  OR EXISTS (SELECT 1 FROM public.event_members WHERE event_id = photos.event_id AND user_id = auth.uid())
);
CREATE POLICY "Members can upload photos" ON public.photos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.event_members WHERE event_id = photos.event_id AND user_id = auth.uid())
);

-- 6. TRIGGERS
-- Create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email), NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. STORAGE BUCKETS (SQL implementation)
-- Note: Requires storage schema extensions to be enabled in Supabase
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('event-photos', 'event-photos', true),
  ('event-videos', 'event-videos', true),
  ('profile-images', 'profile-images', true),
  ('qr-codes', 'qr-codes', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('event-photos', 'event-videos', 'profile-images', 'qr-codes'));
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('event-photos', 'event-videos', 'profile-images', 'qr-codes') AND auth.role() = 'authenticated');
