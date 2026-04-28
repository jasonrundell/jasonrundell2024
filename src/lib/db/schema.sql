-- Supabase schema reference for the app's current auth, profile, and comments
-- features. Apply manually through Supabase SQL tooling, and keep this file
-- updated whenever table shape, indexes, or RLS expectations change.

create extension if not exists "uuid-ossp";

create table if not exists public.users (
  id uuid default uuid_generate_v4() primary key,
  github_id bigint unique,
  username text,
  email text,
  avatar_url text,
  full_name text,
  provider text not null,
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  profile_slug text unique,
  profile_slug_changed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint users_profile_slug_format check (
    profile_slug is null
    or profile_slug ~ '^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$'
  )
);

create index if not exists idx_users_github_id on public.users(github_id);
create index if not exists idx_users_provider on public.users(provider);
create index if not exists idx_users_email on public.users(email);
create index if not exists idx_users_auth_user_id on public.users(auth_user_id);
create index if not exists idx_users_profile_slug on public.users(profile_slug);

alter table public.users enable row level security;

drop policy if exists "Users can view their own data" on public.users;
drop policy if exists "Users can insert their own data" on public.users;
drop policy if exists "Users can update their own data" on public.users;
drop policy if exists "Public profiles are readable" on public.users;

create policy "Users can view their own data"
  on public.users for select
  using (auth_user_id = auth.uid() or email = auth.jwt() ->> 'email');

create policy "Public profiles are readable"
  on public.users for select
  using (profile_slug is not null);

create policy "Users can insert their own data"
  on public.users for insert
  with check (auth_user_id = auth.uid() or email = auth.jwt() ->> 'email');

create policy "Users can update their own data"
  on public.users for update
  using (auth_user_id = auth.uid() or email = auth.jwt() ->> 'email')
  with check (auth_user_id = auth.uid() or email = auth.jwt() ->> 'email');

create table if not exists public.comments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  content_type text not null check (content_type in ('post', 'project')),
  content_slug text not null,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_comments_content
  on public.comments(content_type, content_slug, created_at desc);
create index if not exists idx_comments_user_id on public.comments(user_id);

alter table public.comments enable row level security;

drop policy if exists "Comments are readable" on public.comments;
drop policy if exists "Authenticated users can create comments" on public.comments;
drop policy if exists "Users can update their own comments" on public.comments;
drop policy if exists "Users can delete their own comments" on public.comments;

create policy "Comments are readable"
  on public.comments for select
  using (true);

create policy "Authenticated users can create comments"
  on public.comments for insert
  with check (user_id = auth.uid());

create policy "Users can update their own comments"
  on public.comments for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete their own comments"
  on public.comments for delete
  using (user_id = auth.uid());
