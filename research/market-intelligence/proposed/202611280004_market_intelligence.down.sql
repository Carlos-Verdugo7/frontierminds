-- Rollback for the optional 004 proposal, if it was ever applied.
-- Drops research-only tables. Does NOT affect published grocery prices.
drop table if exists public.market_collection_queue;
drop table if exists public.market_research_runs;
