-- Monster Battler game tables
-- Run this SQL in your Supabase SQL editor

-- Create monster_battler_scores table
create table if not exists monster_battler_scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  mode text not null check (mode in ('gauntlet', 'bossRush', 'endless', 'tutorial')),
  score bigint not null,
  monsters_defeated integer not null,
  completion_time integer not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  play_history jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index if not exists idx_monster_battler_scores_user_id on monster_battler_scores(user_id);
create index if not exists idx_monster_battler_scores_score on monster_battler_scores(score desc);
create index if not exists idx_monster_battler_scores_mode on monster_battler_scores(mode);
create index if not exists idx_monster_battler_scores_timestamp on monster_battler_scores(timestamp desc);

-- Enable RLS
alter table monster_battler_scores enable row level security;

-- Policy: Users can view their own scores
create policy "Users can view their own scores"
  on monster_battler_scores for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own scores
create policy "Users can insert their own scores"
  on monster_battler_scores for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own scores
create policy "Users can update their own scores"
  on monster_battler_scores for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policy: Users can delete their own scores
create policy "Users can delete their own scores"
  on monster_battler_scores for delete
  using (auth.uid() = user_id);
