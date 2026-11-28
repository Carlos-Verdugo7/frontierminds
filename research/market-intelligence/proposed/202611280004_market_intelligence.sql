-- PROPOSAL ONLY: do not apply to production without review.
-- Optional private model runs and source-level verification queue.
create table if not exists public.market_research_runs (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 data_cutoff date not null,
 model_version text not null check (char_length(model_version) between 3 and 100),
 status text not null check (status in ('draft','tested','rejected')),
 metrics jsonb not null default '{}'::jsonb,
 notes text not null default '' check(char_length(notes)<=1000)
);
create index if not exists market_research_runs_by_date
 on public.market_research_runs(data_cutoff desc,created_at desc);
create table if not exists public.market_collection_queue (
 id uuid primary key default gen_random_uuid(),
 run_id uuid not null references public.market_research_runs(id) on delete cascade,
 source_key text not null check(char_length(source_key) between 1 and 250),
 chain text not null,
 flyer_id text not null,
 score numeric(10,4) not null check(score>=0),
 reasons jsonb not null default '[]'::jsonb,
 exploration boolean not null default false,
 cost_units numeric(10,4) not null check(cost_units>=0),
 status text not null default 'queued' check(status in ('queued','verified','skipped')),
 verified_at timestamptz,
 unique(run_id,source_key)
);
create index if not exists market_collection_queue_by_run
 on public.market_collection_queue(run_id,score desc);
alter table public.market_research_runs enable row level security;
alter table public.market_collection_queue enable row level security;
revoke all on public.market_research_runs,public.market_collection_queue from public,anon,authenticated;
grant select on public.market_research_runs,public.market_collection_queue to authenticated;
grant select,insert,update,delete on public.market_research_runs,public.market_collection_queue to service_role;
do $guard$
begin
 if not exists(select 1 from pg_policies
   where schemaname='public' and tablename='market_research_runs'
   and policyname='Private research runs for grocery administrators') then
  create policy "Private research runs for grocery administrators"
  on public.market_research_runs for select to authenticated
  using ((select public.is_grocery_admin()));
 end if;
 if not exists(select 1 from pg_policies
   where schemaname='public' and tablename='market_collection_queue'
   and policyname='Private collection queue for grocery administrators') then
  create policy "Private collection queue for grocery administrators"
  on public.market_collection_queue for select to authenticated
  using ((select public.is_grocery_admin()));
 end if;
end
$guard$;
