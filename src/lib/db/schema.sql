-- Create users table
create table if not exists users (
  id uuid default uuid_generate_v4() primary key,
  github_id bigint unique,
  username text,
  email text,
  avatar_url text,
  full_name text,
  provider text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index if not exists idx_users_github_id on users(github_id);
create index if not exists idx_users_provider on users(provider);

-- Create RLS policies
alter table users enable row level security;

-- Allow users to view their own data
create policy "Users can view their own data"
  on users for select
  using (true);

-- Allow users to insert their own data
create policy "Users can insert their own data"
  on users for insert
  with check (true);

-- Allow users to update their own data
create policy "Users can update their own data"
  on users for update
  using (id = auth.uid());
  with check (id = auth.uid());
