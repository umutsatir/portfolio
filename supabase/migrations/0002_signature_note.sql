-- Optional short note a visitor can sign along with their address (shown when hovering their ball).
alter table public.signatures
  add column if not exists note text check (note is null or char_length(note) <= 80);

grant select (note) on public.signatures to anon;
