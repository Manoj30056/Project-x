-- Supabase Setup Script for ENGRAM
-- Run this in your Supabase SQL Editor

-- 1. Tables
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT UNIQUE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  is_guest BOOLEAN DEFAULT FALSE NOT NULL,
  preferences JSONB DEFAULT '{"theme": "system", "language": "en", "notifications": true}'::JSONB NOT NULL,
  storage_used INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Events
CREATE TABLE public.events (
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
  visibility VARCHAR(20) DEFAULT 'public' NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  timezone TEXT DEFAULT 'UTC',
  location_name TEXT,
  latitude REAL,
  longitude TEXT,
  guest_count INTEGER DEFAULT 0 NOT NULL,
  media_count INTEGER DEFAULT 0 NOT NULL,
  settings JSONB DEFAULT '{"allowGuestUploads": true, "requireApproval": false, "isOnline": false}'::JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Event Members
CREATE TABLE public.event_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'guest' NOT NULL,
  is_guest_account BOOLEAN DEFAULT FALSE NOT NULL,
  permissions JSONB DEFAULT '{}'::JSONB NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Photos
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  album_id UUID, -- Added for future albums
  uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  uploader_name TEXT NOT NULL,
  original_url TEXT NOT NULL,
  optimized_url TEXT,
  thumbnail_url TEXT,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  mime_type VARCHAR(50),
  metadata JSONB DEFAULT '{}'::JSONB NOT NULL,
  ai_tags JSONB DEFAULT '[]'::JSONB NOT NULL,
  face_ids JSONB DEFAULT '[]'::JSONB NOT NULL,
  caption TEXT,
  is_favorite BOOLEAN DEFAULT FALSE NOT NULL,
  is_approved BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  taken_at TIMESTAMPTZ
);

-- Videos
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  album_id UUID, -- Added for future albums
  uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  uploader_name TEXT NOT NULL,
  original_url TEXT NOT NULL,
  optimized_url TEXT,
  thumbnail_url TEXT,
  preview_url TEXT,
  duration INTEGER,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  mime_type VARCHAR(50),
  metadata JSONB DEFAULT '{}'::JSONB NOT NULL,
  ai_tags JSONB DEFAULT '[]'::JSONB NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE NOT NULL,
  is_approved BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  recorded_at TIMESTAMPTZ
);

-- Comments
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID NOT NULL,
  media_type VARCHAR(10) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Likes
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID NOT NULL,
  media_type VARCHAR(10) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(media_id, user_id)
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::JSONB NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Downloads
CREATE TABLE public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT,
  type VARCHAR(20) NOT NULL,
  file_url TEXT,
  media_ids JSONB DEFAULT '[]'::JSONB NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Activity Logs
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT,
  action VARCHAR(50) NOT NULL,
  details JSONB DEFAULT '{}'::JSONB NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Settings
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- QR Codes
CREATE TABLE public.qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  type VARCHAR(20) DEFAULT 'join' NOT NULL,
  expires_at TIMESTAMPTZ,
  usage_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Triggers for Profiles
-- Create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url, is_guest)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'is_guest')::BOOLEAN, FALSE)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only update their own profile
CREATE POLICY "Users can view any profile" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Events: 
CREATE POLICY "Anyone can view public events" ON public.events FOR SELECT USING (visibility = 'public');
CREATE POLICY "Members can view private events" ON public.events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.event_members WHERE event_id = events.id AND user_id = auth.uid())
);
CREATE POLICY "Organizers can update their events" ON public.events FOR UPDATE USING (organizer_id = auth.uid());

-- Photos & Videos:
CREATE POLICY "Anyone can view photos of public events" ON public.photos FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.events WHERE id = photos.event_id AND visibility = 'public')
);
CREATE POLICY "Members can view photos of their events" ON public.photos FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.event_members WHERE event_id = photos.event_id AND user_id = auth.uid())
);
CREATE POLICY "Users can upload photos to events they are members of" ON public.photos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.event_members WHERE event_id = photos.event_id AND user_id = auth.uid())
);

-- Storage Buckets Setup
-- These typically need to be handled via the storage schema or dashboard
-- But we can provide the SQL for bucket creation via the storage API extensions
INSERT INTO storage.buckets (id, name, public) VALUES ('event-photos', 'event-photos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('event-videos', 'event-videos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('event-covers', 'event-covers', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('qr-codes', 'qr-codes', true) ON CONFLICT DO NOTHING;

-- Storage Policies (Simplified)
CREATE POLICY "Allow public access to event photos" ON storage.objects FOR SELECT USING (bucket_id = 'event-photos');
CREATE POLICY "Allow authenticated uploads to event photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'event-photos' AND auth.role() = 'authenticated');

-- 4. RPC Functions
-- Increment guest count
CREATE OR REPLACE FUNCTION public.increment_guest_count(event_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.events
  SET guest_count = guest_count + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment media count
CREATE OR REPLACE FUNCTION public.increment_media_count(event_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.events
  SET media_count = media_count + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


