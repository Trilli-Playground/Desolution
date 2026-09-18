-- Cached daily snapshot of the top 10 richest men (Forbes real-time data,
-- fetched server-side and refreshed once a day by a Vercel cron job).
-- Anyone may read it; only the service role (used by the cron function,
-- which bypasses RLS) may write it.
create table public.billionaires_top10_men (
  position int primary key check (position between 1 and 10),
  global_rank int not null,
  source_id text not null,
  name text not null,
  country text,
  age int,
  image text,
  current_worth numeric not null,
  previous_worth numeric,
  wealth_source text,
  snapshot_date date,
  fetched_at timestamptz not null default now()
);

alter table public.billionaires_top10_men enable row level security;

create policy "Anyone can read the cached top 10"
  on public.billionaires_top10_men
  for select
  to anon, authenticated
  using (true);
