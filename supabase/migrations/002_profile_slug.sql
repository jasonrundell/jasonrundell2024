-- Applied via Supabase (project yvvaolzsbaetqvzellpt). Kept in repo for reference.
-- Public profile URLs: unique profile_slug + change tracking for 90-day rule (enforced in app).

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS profile_slug text,
  ADD COLUMN IF NOT EXISTS profile_slug_changed_at timestamptz;

UPDATE public.users u
SET
  profile_slug = (
    CASE
      WHEN length(
        regexp_replace(
          regexp_replace(
            lower(trim(coalesce(nullif(trim(u.full_name), ''), split_part(coalesce(u.email, 'user'), '@', 1), 'user'))),
            '[^a-z0-9]+',
            '-',
            'g'
          ),
          '^-+|-+$',
          '',
          'g'
        )
      ) >= 3
      THEN left(
        regexp_replace(
          regexp_replace(
            lower(trim(coalesce(nullif(trim(u.full_name), ''), split_part(coalesce(u.email, 'user'), '@', 1), 'user'))),
            '[^a-z0-9]+',
            '-',
            'g'
          ),
          '^-+|-+$',
          '',
          'g'
        ),
        20
      ) || '-' || right(replace(u.id::text, '-', ''), 8)
      ELSE 'user-' || right(replace(u.id::text, '-', ''), 8)
    END
  ),
  profile_slug_changed_at = now()
WHERE u.profile_slug IS NULL;

ALTER TABLE public.users
  ALTER COLUMN profile_slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS users_profile_slug_key ON public.users (profile_slug);

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_profile_slug_format_chk;
ALTER TABLE public.users ADD CONSTRAINT users_profile_slug_format_chk
  CHECK (
    profile_slug ~ '^[a-z0-9-]+$'
    AND char_length(profile_slug) >= 3
    AND char_length(profile_slug) <= 30
  );
