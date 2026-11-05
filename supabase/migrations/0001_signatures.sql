-- Visitor signature wall.
-- Rows are written ONLY by the /api/sign serverless function (service-role key) after it has verified
-- the wallet signature. The anon role can read a few public columns of non-hidden rows, nothing else.

create table if not exists public.signatures (
  id          uuid primary key default gen_random_uuid(),
  address     text not null unique check (address ~ '^0x[0-9a-f]{40}$'),  -- stored lowercase
  ens         text,
  message     text not null,
  signature   text not null,
  signed_at   timestamptz not null default now(),
  hidden      boolean not null default false                               -- moderation: set true to remove from the wall
);

create index if not exists signatures_signed_at_idx on public.signatures (signed_at desc);

alter table public.signatures enable row level security;

drop policy if exists "public can read visible signatures" on public.signatures;
create policy "public can read visible signatures"
  on public.signatures for select
  to anon
  using (hidden = false);

-- column-level: the raw signature/message never leave the database through the anon key
revoke all on public.signatures from anon, authenticated;
grant select (address, ens, signed_at) on public.signatures to anon;
