
-- 1. USERS PROFILE TABLE
-- Extends the default auth.users table
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  nickname text,
  avatar_url text,
  partner_id uuid references public.profiles(id), -- Self-reference for pairing
  couple_id uuid, -- Link to the couple table
  
  -- REAL-TIME STATE
  current_mood jsonb, -- Stores { index: number, label: string, color: string }
  last_pulse text, -- Timestamp of last "Thinking of you" sent
  
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(nickname) >= 2)
);

-- 2. COUPLES TABLE
-- Represents the bond between two users
create table public.couples (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  pairing_code text unique, -- Short code like "LOVE-8821"
  user_1_id uuid references public.profiles(id),
  user_2_id uuid references public.profiles(id),
  
  -- FEATURES
  sticky_note jsonb -- Stores { content: string, color: string, author_id: uuid, x: number, y: number }
);

-- 3. MESSAGES TABLE
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  couple_id uuid references public.couples(id) not null,
  sender_id uuid references public.profiles(id) not null,
  content text,
  type text default 'text', -- 'text', 'action', 'image'
  emotion text default 'neutral', -- 'loving', 'calm', etc.
  action_type text, -- 'hug', 'miss_you' if type is action
  is_read boolean default false
);

-- 4. MOODS TABLE (History)
create table public.moods (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.profiles(id) not null,
  emotion text not null, -- 'happy', 'sad', 'horny', etc.
  intensity int default 5,
  note text
);

-- 5. JOURNAL ENTRIES (Our Diary)
create table public.journal_entries (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  couple_id uuid references public.couples(id) not null,
  user_id uuid references public.profiles(id) not null,
  prompt text,
  content text,
  image_url text,
  is_private boolean default false,
  mood text -- Optional mood of the day
);

-- 6. MEMORIES TABLE (Memory Wall)
-- Each memory is a placed moment, not just an upload
create table public.memories (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  couple_id uuid references public.couples(id) not null,
  added_by uuid references public.profiles(id) not null,
  
  -- Photo
  image_url text not null,
  
  -- Frame style (optional)
  frame_type text default 'none', -- 'polaroid', 'tape', 'scrapbook', 'pastel', 'minimal', 'none'
  
  -- Memory Note ("What this moment meant")
  note text,
  
  -- Optional: Link to a diary entry
  diary_entry_id uuid references public.journal_entries(id),
  
  -- Soft metadata (no timestamps emphasized)
  moment_date date -- The date the memory is about (not created_at)
);

-- RLS (Row Level Security) POLICIES
-- NOTE: These are crucial for privacy. Only the couple can see their data.

alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.messages enable row level security;
alter table public.moods enable row level security;
alter table public.journal_entries enable row level security;
alter table public.memories enable row level security;

-- OPEN ACCESS FOR PROTOTYPE (Secure this before launch!)
create policy "Public profiles access" on profiles for select using (true);
create policy "Self update profiles" on profiles for update using (auth.uid() = id);
create policy "Couples access" on couples for all using (true);
create policy "Journal access" on journal_entries for all using (true);
create policy "Memories access" on memories for all using (true);

-- SQL TO RUN TO UPDATE EXISTING TABLES:
-- alter table journal_entries add column mood text;
-- 
-- create table memories (
--   id uuid default uuid_generate_v4() primary key,
--   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
--   couple_id uuid references public.couples(id) not null,
--   added_by uuid references public.profiles(id) not null,
--   image_url text not null,
--   frame_type text default 'none',
--   note text,
--   diary_entry_id uuid references public.journal_entries(id),
--   moment_date date
-- );
-- 
-- alter table memories enable row level security;
-- create policy "Memories access" on memories for all using (true);
