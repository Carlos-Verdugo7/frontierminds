-- FrontierMinds grocery price data, reviewed and published weekly.
-- Run in the linked Supabase project SQL Editor or via migrations; safe to rerun
-- only once. No real offers are seeded and no keys are stored in the repository.
create extension if not exists pgcrypto;

create table if not exists public.grocery_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.grocery_weeks (
  id uuid primary key default gen_random_uuid(),
  week_start date not null unique,
  week_end date not null,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint grocery_week_monday check (extract(isodow from week_start) = 1),
  constraint grocery_week_span check (week_end = week_start + 6)
);

create table if not exists public.grocery_stores (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (length(name) between 2 and 120),
  street_address text not null check (length(street_address) between 5 and 200),
  city text not null check (length(city) between 2 and 90),
  state text not null default 'FL' check (state = 'FL'),
  zip text not null check (zip ~ '^[0-9]{5}$')
);

create table if not exists public.grocery_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (length(name) between 2 and 120),
  category text not null check (category in ('beef','chicken','pork','other')),
  specification text not null check (length(specification) between 1 and 150),
  unit text not null check (unit in ('lb','each','oz'))
);

create table if not exists public.grocery_offers (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.grocery_weeks(id) on delete cascade,
  store_id uuid not null references public.grocery_stores(id),
  item_id uuid not null references public.grocery_items(id),
  price_usd numeric(10,2) not null check (price_usd > 0 and price_usd <= 10000),
  unit text not null check (unit in ('lb','each','oz')),
  promotion_details text not null default '',
  valid_from date not null,
  valid_to date not null,
  source_url text not null check (source_url ~ '^https://[^[:space:]]+$'),
  verified_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint grocery_offer_dates check (valid_to >= valid_from and valid_to <= valid_from + 21),
  constraint grocery_one_offer_per_item_store_week unique (week_id, store_id, item_id)
);
create index if not exists grocery_offers_week_item_idx on public.grocery_offers(week_id,item_id,price_usd);
create index if not exists grocery_offers_week_store_idx on public.grocery_offers(week_id,store_id);

alter table public.grocery_admins enable row level security;
alter table public.grocery_weeks enable row level security;
alter table public.grocery_stores enable row level security;
alter table public.grocery_items enable row level security;
alter table public.grocery_offers enable row level security;

-- Prevent writes to tables through exposed REST endpoints. All authenticated
-- editorial writes go through two vetted functions below.
revoke all on public.grocery_admins from anon, authenticated;
revoke all on public.grocery_weeks from anon, authenticated;
revoke all on public.grocery_stores from anon, authenticated;
revoke all on public.grocery_items from anon, authenticated;
revoke all on public.grocery_offers from anon, authenticated;
grant select on public.grocery_admins to authenticated;
grant select on public.grocery_weeks, public.grocery_stores, public.grocery_items, public.grocery_offers to anon, authenticated;

create policy "Admins may read own membership" on public.grocery_admins
  for select to authenticated using (user_id = (select auth.uid()));

create or replace function public.is_grocery_admin()
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select exists(select 1 from public.grocery_admins where user_id = (select auth.uid()));
$$;
revoke all on function public.is_grocery_admin() from public;
grant execute on function public.is_grocery_admin() to anon, authenticated;

create policy "Published weeks or editors can read" on public.grocery_weeks
  for select to anon, authenticated using (status = 'published' or (select public.is_grocery_admin()));
create policy "Stores can be read" on public.grocery_stores
  for select to anon, authenticated using (true);
create policy "Items can be read" on public.grocery_items
  for select to anon, authenticated using (true);
create policy "Published offers or editors can read" on public.grocery_offers
  for select to anon, authenticated using (
    exists(select 1 from public.grocery_weeks w where w.id=week_id and w.status='published')
    or (select public.is_grocery_admin())
  );

create or replace view public.grocery_public_prices
with (security_invoker = true) as
select
  o.id, w.week_start, w.week_end, w.published_at, w.updated_at as week_updated_at,
  s.slug as store_slug, s.name as store_name, s.street_address, s.city, s.state, s.zip,
  i.slug as item_slug, i.name as item_name, i.category, i.specification,
  o.price_usd, o.unit, o.promotion_details, o.valid_from, o.valid_to,
  o.source_url, o.verified_at, o.updated_at
from public.grocery_offers o
join public.grocery_weeks w on w.id=o.week_id
join public.grocery_stores s on s.id=o.store_id
join public.grocery_items i on i.id=o.item_id
where w.status='published';

create or replace view public.grocery_editor_prices
with (security_invoker = true) as
select o.id, w.week_start, w.status, s.slug as store_slug, s.name as store_name,
  s.street_address, s.city, s.zip, i.slug as item_slug, i.name as item_name,
  i.category, i.specification, o.price_usd, o.unit, o.promotion_details,
  o.valid_from, o.valid_to, o.source_url, o.verified_at, o.updated_at
from public.grocery_offers o
join public.grocery_weeks w on w.id=o.week_id
join public.grocery_stores s on s.id=o.store_id
join public.grocery_items i on i.id=o.item_id;

revoke all on public.grocery_public_prices, public.grocery_editor_prices from public;
grant select on public.grocery_public_prices to anon, authenticated;
grant select on public.grocery_editor_prices to authenticated;

-- Atomic CSV-import RPC. Always validate again inside Postgres, not only in the
-- Next.js parser. A published week cannot be overwritten without explicit opt-in.
create or replace function public.grocery_import_week(
  p_week_start date,
  p_rows jsonb,
  p_allow_published boolean default false
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_week_id uuid;
  v_status text;
  v_row jsonb;
  v_store_id uuid;
  v_item_id uuid;
  v_price numeric(10,2);
  v_from date;
  v_to date;
  v_unit text;
  v_source text;
  v_store_slug text;
  v_item_slug text;
  v_count integer := 0;
begin
  if not public.is_grocery_admin() then raise exception 'Not authorized'; end if;
  if p_week_start is null or extract(isodow from p_week_start) <> 1
    then raise exception 'Week must start on Monday'; end if;
  if p_rows is null or jsonb_typeof(p_rows) <> 'array'
    or jsonb_array_length(p_rows) < 1 or jsonb_array_length(p_rows) > 250
    then raise exception 'Batch must contain 1 to 250 rows'; end if;

  insert into public.grocery_weeks(week_start, week_end)
  values(p_week_start, p_week_start + 6)
  on conflict (week_start) do nothing;
  select id, status into v_week_id, v_status
    from public.grocery_weeks where week_start = p_week_start for update;
  if v_status = 'published' and not p_allow_published then
    raise exception 'Week is published; explicitly allow corrections to change it';
  end if;

  for v_row in select value from jsonb_array_elements(p_rows)
  loop
    if jsonb_typeof(v_row) <> 'object' then raise exception 'Row must be an object'; end if;
    v_store_slug := v_row->>'store_slug';
    v_item_slug := v_row->>'item_slug';
    v_unit := v_row->>'unit';
    v_source := v_row->>'source_url';
    if v_store_slug is null or v_store_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
      or v_item_slug is null or v_item_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
      then raise exception 'Invalid store or item slug'; end if;
    if v_unit not in ('lb','each','oz') or v_unit is null
      then raise exception 'Invalid unit'; end if;
    if v_source is null or length(v_source) > 1500 or v_source !~ '^https://[^[:space:]]+$'
      then raise exception 'Source must be an HTTPS URL'; end if;
    if length(coalesce(v_row->>'promotion_details','')) > 600
      then raise exception 'Promotion text is too long'; end if;
    v_price := (v_row->>'price_usd')::numeric;
    if v_price is null or v_price <= 0 or v_price > 10000
      then raise exception 'Price must be positive and less than 10000'; end if;
    v_from := (v_row->>'valid_from')::date;
    v_to := (v_row->>'valid_to')::date;
    if v_from is null or v_to is null or v_from > v_to or v_to > v_from + 21
      or v_to < p_week_start or v_from > p_week_start + 6
      then raise exception 'Offer validity dates are incompatible with the week'; end if;

    insert into public.grocery_stores(slug,name,street_address,city,state,zip)
    values (v_store_slug, v_row->>'store_name',
            v_row->>'street_address', v_row->>'city', 'FL', v_row->>'zip')
    on conflict(slug) do update set name=excluded.name
      where public.grocery_stores.street_address=excluded.street_address
        and public.grocery_stores.city=excluded.city
        and public.grocery_stores.zip=excluded.zip
    returning id into v_store_id;
    if v_store_id is null then
      raise exception 'A store slug cannot refer to a different location';
    end if;

    insert into public.grocery_items(slug,name,category,specification,unit)
    values(v_item_slug, v_row->>'item_name', v_row->>'category',
      v_row->>'specification', v_unit)
    on conflict(slug) do update set name=excluded.name
      where public.grocery_items.category=excluded.category
        and public.grocery_items.specification=excluded.specification
        and public.grocery_items.unit=excluded.unit
    returning id into v_item_id;
    if v_item_id is null then
      raise exception 'An item slug cannot mix specifications or units';
    end if;

    insert into public.grocery_offers(
      week_id,store_id,item_id,price_usd,unit,promotion_details,
      valid_from,valid_to,source_url,verified_at,updated_at)
    values(v_week_id,v_store_id,v_item_id,v_price,v_unit,
      coalesce(v_row->>'promotion_details',''),v_from,v_to,v_source,now(),now())
    on conflict(week_id,store_id,item_id) do update
      set price_usd=excluded.price_usd,unit=excluded.unit,
        promotion_details=excluded.promotion_details,
        valid_from=excluded.valid_from,valid_to=excluded.valid_to,
        source_url=excluded.source_url,verified_at=now(),updated_at=now();
    v_count := v_count + 1;
  end loop;
  update public.grocery_weeks set updated_at=now()
    where id=v_week_id;
  return jsonb_build_object('week_start',p_week_start, 'imported_rows',v_count, 'status',v_status);
end;
$$;
revoke all on function public.grocery_import_week(date,jsonb,boolean) from public;
grant execute on function public.grocery_import_week(date,jsonb,boolean) to authenticated;

create or replace function public.grocery_publish_week(p_week_start date)
returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_week_id uuid; v_count integer;
begin
  if not public.is_grocery_admin() then raise exception 'Not authorized'; end if;
  select id into v_week_id from public.grocery_weeks where week_start=p_week_start for update;
  if v_week_id is null then raise exception 'Draft week not found'; end if;
  select count(*) into v_count from public.grocery_offers where week_id=v_week_id;
  if v_count < 1 then raise exception 'Cannot publish an empty week'; end if;
  update public.grocery_weeks set status='published',published_at=now(),updated_at=now()
    where id=v_week_id;
  return jsonb_build_object('week_start',p_week_start,'published_offers',v_count);
end;
$$;
revoke all on function public.grocery_publish_week(date) from public;
grant execute on function public.grocery_publish_week(date) to authenticated;

-- After creating your ONE Supabase Auth administrator, grant access manually:
-- insert into public.grocery_admins(user_id)
-- select id from auth.users where email = 'YOUR_ADMIN_EMAIL@example.com';
-- Do NOT place the admin email or any credential in a Git repository.
