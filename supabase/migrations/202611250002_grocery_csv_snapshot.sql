-- Additive migration: preserves the older grocery prototype tables if they exist.
-- CSV column names and flyer-to-location relationship follow user-provided files.
-- Apply AFTER 202611250001_grocery_prices.sql (for grocery_admins/is_grocery_admin).
create table if not exists public.grocery_csv_batches (
 id uuid primary key default gen_random_uuid(),
 snapshot_date date not null unique,
 status text not null default 'draft' check (status in ('draft','published')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 published_at timestamptz
);

create table if not exists public.wpb_grocery_stores (
 batch_id uuid not null references public.grocery_csv_batches(id) on delete cascade,
 id integer not null,
 chain text not null, flyer_id text not null, store_number text,
 address text not null, city text not null, state text not null, zip text not null,
 phone text, hours_mon_sat text, hours_sun text,
 palm_beach_county text not null check (palm_beach_county in ('yes','no')),
 primary key(batch_id,id),
 check (length(trim(chain))>0 and length(trim(flyer_id))>0),
 check (length(trim(address))>0 and length(trim(city))>0)
);
create index if not exists wpb_stores_flyer_idx on public.wpb_grocery_stores(batch_id,flyer_id,chain);

create table if not exists public.wpb_grocery_prices (
 batch_id uuid not null references public.grocery_csv_batches(id) on delete cascade,
 id integer not null,
 chain text not null, flyer_id text not null,
 valid_from date not null, valid_to date not null,
 department text not null,
 item_en text not null, item_es text,
 brand text, size text, advertised_price text not null,
 deal_qty numeric, deal_price numeric, unit_price numeric,
 unit text, origin text, notes text, source_url text,
 price_type text not null, membership_required text not null,
 compare_item text, compare_qty numeric, compare_unit text,
 price_per_compare_unit numeric, match_note text,
 primary key (batch_id,id),
 check(valid_to>=valid_from and valid_to<=valid_from+31),
 check(length(trim(chain))>0 and length(trim(flyer_id))>0),
 check(length(trim(item_en))>0 and length(trim(advertised_price))>0),
 check(compare_item is null or (price_per_compare_unit>0 and compare_unit is not null and length(trim(compare_unit))>0)),
 check(price_per_compare_unit is null or price_per_compare_unit>0)
);
create index if not exists wpb_prices_flyer_idx on public.wpb_grocery_prices(batch_id,flyer_id,chain);
create index if not exists wpb_prices_compare_idx on public.wpb_grocery_prices(compare_item,compare_unit,valid_from,valid_to);

alter table public.grocery_csv_batches enable row level security;
alter table public.wpb_grocery_stores enable row level security;
alter table public.wpb_grocery_prices enable row level security;

revoke all on public.grocery_csv_batches,public.wpb_grocery_stores,public.wpb_grocery_prices from anon,authenticated;
grant select on public.grocery_csv_batches,public.wpb_grocery_stores,public.wpb_grocery_prices to anon,authenticated;

DO $policy_guard$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'grocery_csv_batches'
      AND policyname = 'csv batches published or admin'
  ) THEN
    EXECUTE $policy_sql$
      create policy "csv batches published or admin" on public.grocery_csv_batches for select
 to anon,authenticated using(status='published' or (select public.is_grocery_admin()))
    $policy_sql$;
  END IF;
END
$policy_guard$;
DO $policy_guard$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wpb_grocery_stores'
      AND policyname = 'csv stores published or admin'
  ) THEN
    EXECUTE $policy_sql$
      create policy "csv stores published or admin" on public.wpb_grocery_stores for select
 to anon,authenticated using(
 exists(select 1 from public.grocery_csv_batches b where b.id=batch_id and b.status='published')
 or (select public.is_grocery_admin()))
    $policy_sql$;
  END IF;
END
$policy_guard$;
DO $policy_guard$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wpb_grocery_prices'
      AND policyname = 'csv prices published or admin'
  ) THEN
    EXECUTE $policy_sql$
      create policy "csv prices published or admin" on public.wpb_grocery_prices for select
 to anon,authenticated using(
 exists(select 1 from public.grocery_csv_batches b where b.id=batch_id and b.status='published')
 or (select public.is_grocery_admin()))
    $policy_sql$;
  END IF;
END
$policy_guard$;

-- A flyer can cover many distinct store locations. Preserve original rows and
-- join only when BOTH flyer_id and chain match, so chains cannot leak prices.
create or replace view public.grocery_csv_public_prices with (security_invoker=true) as
select
 concat(p.batch_id::text,'-',p.id::text,'-',s.id::text) as id,
 p.batch_id, b.snapshot_date, b.updated_at as last_updated,b.published_at,
 p.id as price_row_id, s.id as store_location_id,
 p.chain,p.flyer_id,p.valid_from,p.valid_to,p.department,
 p.item_en,p.item_es,p.brand,p.size,p.advertised_price,
 p.deal_qty,p.deal_price,p.unit_price,p.unit,p.origin,p.notes,p.source_url,
 p.price_type,p.membership_required,p.compare_item,p.compare_qty,
 p.compare_unit,p.price_per_compare_unit,p.match_note,
 s.store_number,s.address,s.city,s.state,s.zip,s.phone,s.hours_mon_sat,
 s.hours_sun,s.palm_beach_county
from public.wpb_grocery_prices p
join public.grocery_csv_batches b on b.id=p.batch_id and b.status='published'
join public.wpb_grocery_stores s on s.batch_id=p.batch_id
 and s.flyer_id=p.flyer_id and s.chain=p.chain;

create or replace view public.grocery_csv_editor_prices with (security_invoker=true) as
select p.batch_id,b.snapshot_date,b.status,p.id as price_row_id,p.chain,p.flyer_id,
 p.item_en,p.item_es,p.advertised_price,p.price_type,p.membership_required,
 p.valid_from,p.valid_to,p.source_url,p.compare_item,p.match_note,
 (select count(*) from public.wpb_grocery_stores s
  where s.batch_id=p.batch_id and s.flyer_id=p.flyer_id and s.chain=p.chain) as store_count
from public.wpb_grocery_prices p
join public.grocery_csv_batches b on b.id=p.batch_id;
revoke all on public.grocery_csv_public_prices,public.grocery_csv_editor_prices from public;
grant select on public.grocery_csv_public_prices to anon,authenticated;
grant select on public.grocery_csv_editor_prices to authenticated;

-- Atomic weekly snapshot import. Non-privileged users cannot mutate data.
-- The CSV values remain in the same columns; nullable empty values become NULL.
create or replace function public.grocery_import_csv_batch(
 p_snapshot_date date,p_stores jsonb,p_prices jsonb,p_replace_published boolean default false
) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_batch_id uuid;v_status text;v_store_count int;v_price_count int;
begin
 if not public.is_grocery_admin() then raise exception 'Not authorized';end if;
 if p_snapshot_date is null or p_snapshot_date>current_date+7 or p_snapshot_date<date '2020-01-01'
 then raise exception 'Invalid batch date';end if;
 if jsonb_typeof(p_stores)<>'array' or jsonb_typeof(p_prices)<>'array'
 or jsonb_array_length(p_stores) not between 1 and 1000
 or jsonb_array_length(p_prices) not between 1 and 5000
 then raise exception 'Invalid CSV size';end if;

 insert into public.grocery_csv_batches(snapshot_date) values(p_snapshot_date)
 on conflict(snapshot_date) do nothing;
 select id,status into v_batch_id,v_status from public.grocery_csv_batches
 where snapshot_date=p_snapshot_date for update;
 if v_status='published' and not p_replace_published then
 raise exception 'Published snapshot requires explicit correction';end if;
 delete from public.wpb_grocery_prices where batch_id=v_batch_id;
 delete from public.wpb_grocery_stores where batch_id=v_batch_id;

 insert into public.wpb_grocery_stores(
 batch_id,id,chain,flyer_id,store_number,address,city,state,zip,phone,
 hours_mon_sat,hours_sun,palm_beach_county)
 select v_batch_id,x.id,trim(x.chain),trim(x.flyer_id),nullif(x.store_number,''),
 x.address,x.city,x.state,x.zip,nullif(x.phone,''),
 nullif(x.hours_mon_sat,''),nullif(x.hours_sun,''),lower(trim(x.palm_beach_county))
 from jsonb_to_recordset(p_stores) as x(
 id integer,chain text,flyer_id text,store_number text,address text,
 city text,state text,zip text,phone text,hours_mon_sat text,
 hours_sun text,palm_beach_county text);
 get diagnostics v_store_count=row_count;

 insert into public.wpb_grocery_prices(
 batch_id,id,chain,flyer_id,valid_from,valid_to,department,item_en,item_es,
 brand,size,advertised_price,deal_qty,deal_price,unit_price,unit,
 origin,notes,source_url,price_type,membership_required,compare_item,
 compare_qty,compare_unit,price_per_compare_unit,match_note)
 select v_batch_id,x.id,trim(x.chain),trim(x.flyer_id),x.valid_from,x.valid_to,
 x.department,x.item_en,nullif(x.item_es,''),nullif(x.brand,''),
 nullif(x.size,''),x.advertised_price,x.deal_qty,x.deal_price,x.unit_price,
 nullif(x.unit,''),nullif(x.origin,''),nullif(x.notes,''),nullif(x.source_url,''),
 x.price_type,x.membership_required,nullif(trim(x.compare_item),''),
 x.compare_qty,nullif(x.compare_unit,''),x.price_per_compare_unit,
 nullif(x.match_note,'')
 from jsonb_to_recordset(p_prices) as x(
 id integer,chain text,flyer_id text,valid_from date,valid_to date,
 department text,item_en text,item_es text,brand text,size text,
 advertised_price text,deal_qty numeric,deal_price numeric,unit_price numeric,
 unit text,origin text,notes text,source_url text,price_type text,
 membership_required text,compare_item text,compare_qty numeric,
 compare_unit text,price_per_compare_unit numeric,match_note text);
 get diagnostics v_price_count=row_count;
 if exists(select 1 from public.wpb_grocery_prices p where p.batch_id=v_batch_id
  and not exists(select 1 from public.wpb_grocery_stores s where
  s.batch_id=v_batch_id and s.flyer_id=p.flyer_id and s.chain=p.chain))
 then raise exception 'Every price flyer needs a matching store chain and flyer_id';end if;
 update public.grocery_csv_batches set updated_at=now() where id=v_batch_id;
 return jsonb_build_object('batch_date',p_snapshot_date,'stores',v_store_count,
 'prices',v_price_count,'status',v_status);
end;$$;
revoke all on function public.grocery_import_csv_batch(date,jsonb,jsonb,boolean) from public;
grant execute on function public.grocery_import_csv_batch(date,jsonb,jsonb,boolean) to authenticated;

create or replace function public.grocery_publish_csv_batch(p_snapshot_date date)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_id uuid;v_prices int;v_stores int;
begin
 if not public.is_grocery_admin() then raise exception 'Not authorized';end if;
 select id into v_id from public.grocery_csv_batches
 where snapshot_date=p_snapshot_date for update;
 if v_id is null then raise exception 'No batch found';end if;
 select count(*) into v_prices from public.wpb_grocery_prices where batch_id=v_id;
 select count(*) into v_stores from public.wpb_grocery_stores where batch_id=v_id;
 if v_prices<1 or v_stores<1 then raise exception 'Cannot publish incomplete CSVs';end if;
 update public.grocery_csv_batches set status='published',published_at=now(),
 updated_at=now() where id=v_id;
 return jsonb_build_object('date',p_snapshot_date,'prices',v_prices,'stores',v_stores);
end;$$;
revoke all on function public.grocery_publish_csv_batch(date) from public;
grant execute on function public.grocery_publish_csv_batch(date) to authenticated;

create or replace function public.grocery_remove_csv_price(
 p_batch_id uuid,p_price_row_id integer,p_allow_published boolean default false
) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_status text;
begin
 if not public.is_grocery_admin() then raise exception 'Not authorized';end if;
 select status into v_status from public.grocery_csv_batches where id=p_batch_id for update;
 if v_status is null then raise exception 'Batch not found';end if;
 if v_status='published' and not p_allow_published then
 raise exception 'Published offer requires explicit correction';end if;
 delete from public.wpb_grocery_prices
 where batch_id=p_batch_id and id=p_price_row_id;
 if not found then raise exception 'Price row not found';end if;
 update public.grocery_csv_batches set updated_at=now() where id=p_batch_id;
 return jsonb_build_object('removed',true);
end;$$;
revoke all on function public.grocery_remove_csv_price(uuid,integer,boolean) from public;
grant execute on function public.grocery_remove_csv_price(uuid,integer,boolean) to authenticated;
