-- FrontierMinds community grocery feedback. Safe, additive, isolated from price data.
-- Apply AFTER 001 and 002. No personal contact information is publicly readable.
create table if not exists public.grocery_feedback (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  helpful text not null check(helpful in ('yes','no')),
  section text not null check(section in ('home','comparison','store','search','archive')),
  context_slug text check(context_slug is null or context_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  comment text check(comment is null or char_length(comment) between 1 and 400),
  contact_email text check(contact_email is null or (char_length(contact_email)<=254 and contact_email ~ '^[^ @]+@[^ @]+\.[^ @]+$')),
  contact_phone text check(contact_phone is null or contact_phone ~ '^\+1[2-9][0-9]{9}$'),
  followup_consent boolean not null default false,
  constraint grocery_feedback_contact_consent check (
    (not followup_consent and contact_email is null and contact_phone is null)
    or (followup_consent and
      ((contact_email is not null and contact_phone is null)
      or (contact_email is null and contact_phone is not null)))
  )
);
create index if not exists grocery_feedback_submitted_idx
  on public.grocery_feedback(submitted_at desc);
create index if not exists grocery_feedback_email_idx
  on public.grocery_feedback(contact_email) where contact_email is not null;
create index if not exists grocery_feedback_phone_idx
  on public.grocery_feedback(contact_phone) where contact_phone is not null;

alter table public.grocery_feedback enable row level security;
revoke all on public.grocery_feedback from public, anon, authenticated;
-- Only an authenticated grocery editor can read feedback, never the public.
grant select on public.grocery_feedback to authenticated;
grant select, insert on public.grocery_feedback to service_role;

DO $policy_guard$
BEGIN
 IF NOT EXISTS(
  SELECT 1 FROM pg_policies
  WHERE schemaname='public' AND tablename='grocery_feedback'
  AND policyname='Only grocery administrators read feedback'
 ) THEN
  EXECUTE $policy_sql$
   create policy "Only grocery administrators read feedback"
   on public.grocery_feedback for select to authenticated
   using ((select public.is_grocery_admin()))
  $policy_sql$;
 END IF;
END
$policy_guard$;

-- Data retention: periodically run this in the private Supabase SQL Editor,
-- or schedule in Supabase pg_cron after confirming your project supports it:
-- delete from public.grocery_feedback where submitted_at < now() - interval '90 days';
-- No automatic deletion job is configured by this migration.
