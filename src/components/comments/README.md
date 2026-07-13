# Comments subsystem

## Overview

Client-side comment threads attached to posts and projects. All data lives in
Supabase; the API layer in `src/app/api/comments/` enforces row-level security
and rate limiting.

## Threading model

| Field          | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| `content_type` | `'post'` or `'project'` - the content this comment belongs to |
| `slug`         | The slug of the post or project                               |
| `parent_id`    | `null` for top-level, or the UUID of the parent comment       |

Comments are fetched flat and rendered in a single list (no nested tree UI).
Replies appear as siblings with a `parent_id` set.

## Authorization

| Role                                    | Can do                            |
| --------------------------------------- | --------------------------------- |
| Anonymous                               | Read approved comments            |
| Authenticated user                      | Create, edit, delete own comments |
| Admin (`app_metadata.role === 'admin'`) | Edit or delete any comment        |

## Key files

| File                   | Purpose                                                               |
| ---------------------- | --------------------------------------------------------------------- |
| `CommentsSection.tsx`  | Orchestrator; fetches comments, tracks auth state, dispatches updates |
| `CommentForm.tsx`      | Create-comment form                                                   |
| `CommentItem.tsx`      | Single comment row with edit/delete controls                          |
| `CommentsSkeleton.tsx` | Loading placeholder matching the list layout                          |
| `styles.ts`            | Shared Pigment CSS styled components                                  |
| `skeleton-styles.ts`   | Shimmer keyframes for loading state                                   |

## Error policy

`CommentsSection` now surfaces a visible error state when the fetch fails - it
does **not** silently return an empty list. See `CONVENTIONS.md` for the
no-silent-fallbacks rule.
