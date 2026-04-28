-- Replace row-wide anon SELECT on public.users with a column-safe view.
-- RLS cannot restrict columns; this view exposes only public profile fields.

drop policy if exists "Public profiles are readable" on public.users;

create or replace view public.public_user_profiles
  with (security_invoker = false) as
select
  profile_slug,
  full_name,
  auth_user_id,
  created_at
from public.users
where profile_slug is not null;

comment on view public.public_user_profiles is
  'Public read surface for profiles with a slug; avoids exposing email, github_id, etc.';

grant select on public.public_user_profiles to anon, authenticated;
