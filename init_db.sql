-- Clear all tables
DROP TABLE IF EXISTS invitations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS event_members CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS albums CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS downloads CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS qr_codes CASCADE;
DROP TABLE IF EXISTS face_profiles CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS guests CASCADE;
DROP TABLE IF EXISTS media CASCADE;

-- Create tables
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
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

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  cover_color VARCHAR(7) DEFAULT '#6366f1',
  event_code VARCHAR(12) NOT NULL UNIQUE,
  organizer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  organizer_name TEXT NOT NULL DEFAULT 'Organizer',
  organizer_email TEXT,
  password_hash TEXT,
  visibility VARCHAR(20) DEFAULT 'public' NOT NULL,
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

CREATE TABLE event_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL DEFAULT 'Guest',
  role VARCHAR(20) DEFAULT 'guest' NOT NULL,
  is_guest_account BOOLEAN DEFAULT FALSE NOT NULL,
  permissions JSONB DEFAULT '{}'::JSONB NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_photo_id UUID,
  sort_order INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
  uploader_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
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

CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
  uploader_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
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

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID NOT NULL,
  media_type VARCHAR(10) NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID NOT NULL,
  media_type VARCHAR(10) NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::JSONB NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_name TEXT,
  action VARCHAR(50) NOT NULL,
  details JSONB DEFAULT '{}'::JSONB NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  type VARCHAR(20) DEFAULT 'join' NOT NULL,
  expires_at TIMESTAMPTZ,
  usage_count INTEGER DEFAULT 0 NOT NULL,
  max_usage INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_name TEXT,
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL,
  file_url TEXT,
  media_ids JSONB DEFAULT '[]'::JSONB NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  ready_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);
