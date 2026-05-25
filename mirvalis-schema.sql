create table if not exists public.produtos_mirvalis (
  id text primary key,
  name text not null,
  category text not null,
  price numeric(10, 2) not null default 0,
  promotional_price numeric(10, 2),
  promotion_active boolean not null default false,
  featured boolean not null default false,
  description text not null default '',
  images jsonb not null default '[]'::jsonb,
  available_quantity integer not null default 0,
  sold_out boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mirvalis_promotions (
  id text primary key,
  name text not null default 'Promoção MIRVALIS',
  active boolean not null default true,
  product_ids jsonb not null default '[]'::jsonb,
  promotional_price numeric(10, 2),
  discount_percent numeric(5, 2),
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.produtos_mirvalis enable row level security;
alter table public.mirvalis_promotions enable row level security;

grant usage on schema public to anon;
grant select, insert, update, delete on public.produtos_mirvalis to anon;
grant select, insert, update, delete on public.mirvalis_promotions to anon;
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.produtos_mirvalis to authenticated;
grant select, insert, update, delete on public.mirvalis_promotions to authenticated;

drop policy if exists "Public can read Mirvalis products" on public.produtos_mirvalis;
drop policy if exists "Public can read Mirvalis promotions" on public.mirvalis_promotions;
drop policy if exists "Prototype admin can write Mirvalis products" on public.produtos_mirvalis;
drop policy if exists "Prototype admin can write Mirvalis promotions" on public.mirvalis_promotions;

create policy "Public can read Mirvalis products"
on public.produtos_mirvalis
for select
to anon
using (true);

create policy "Public can read Mirvalis promotions"
on public.mirvalis_promotions
for select
to anon
using (true);

-- Prototype policy: allows the current static admin panel to write.
-- For a production admin, replace this with Supabase Auth policies.
create policy "Prototype admin can write Mirvalis products"
on public.produtos_mirvalis
for all
to anon
using (true)
with check (true);

create policy "Prototype admin can write Mirvalis promotions"
on public.mirvalis_promotions
for all
to anon
using (true)
with check (true);
