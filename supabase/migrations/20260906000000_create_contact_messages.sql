-- Contact form submissions. Anyone (including anonymous visitors) may
-- submit a message; only the site owner's account may read them back.
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can submit a contact message"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

create policy "Only the owner can read contact messages"
  on public.contact_messages
  for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'dominik.knieriemen@gmail.com');
