-- When the ENS name was last resolved. The API re-resolves stale rows (> 24h) a few at a time, so
-- names registered or changed after signing show up on the wall.
alter table public.signatures add column if not exists ens_checked_at timestamptz;
