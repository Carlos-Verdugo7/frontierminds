# Grocery usefulness experiment / optional follow-up

This feature is staged until the privacy/security steps below are complete.
It **never touches** public grocery price batches or CSV data.

## Tracking

GA4 measurement ID is already configured in the root app layout. Each grocery
page emits \`grocery_page_view\` with only a categorical page section.
The following interaction events carry only categorical details (no identity,
free text, search query, or exact source URLs):

- \`grocery_page_view\` — page section.
- \`grocery_search\` — user applied search form.
- \`grocery_compare_open\` — opened a comparable item page.
- \`grocery_store_open\` — opened a store page.
- \`grocery_flyer_open\` — opened a linked source flyer.
- \`grocery_feedback_vote\` — selected yes/no (anonymous).
- \`grocery_feedback_submitted\` — server accepted a response.

These are aggregate signals, not a durable visitor identity or proof of saving
money. Real-world impact still requires user follow-up.

## Deploying feedback safely

1. In **Supabase SQL Editor**, apply
   \`supabase/migrations/202611250003_grocery_feedback.sql\` **once**.
   The new table has RLS enabled, denies visitor CRUD, and only allows
   authorized grocery editors to read responses using the authenticated Supabase
   session. The server uses the already-existing Vercel \`SUPABASE_SERVICE_ROLE_KEY\`
   only after a successful Turnstile verification. Never expose that key on
   the frontend or in analytics.
2. In **Cloudflare → Turnstile**, create a **managed** widget with the hostnames
   \`www.frontierminds.io\` and \`frontierminds.io\`. Only add preview domains
   if explicitly testing preview submissions. Leave its protection active.
3. Add these Vercel environment variables to both Production and Preview
   (Preview can remain unconfigured to keep submissions disabled):
   - \`NEXT_PUBLIC_GROCERY_TURNSTILE_SITE_KEY\` — public, browser-safe site key.
   - \`GROCERY_TURNSTILE_SECRET_KEY\` — server-only secret.
   - \`GROCERY_TURNSTILE_ALLOWED_HOSTNAMES\` —
     \`www.frontierminds.io,frontierminds.io\`.
   The existing \`SUPABASE_SERVICE_ROLE_KEY\` is reused server-side.
   No new service-role secret should be created or pasted into GitHub.
4. Redeploy to pick up the environment changes. With no Turnstile key,
   the UI explains the form is not yet active and the API returns HTTP 503.
   With site key but no valid secret, it also refuses to store feedback.
5. Set a **distributed WAF rate limit** at Vercel/CDN for
   \`/api/grocery-prices/feedback\` (example: 5 POST requests per minute per IP,
   with accommodations for shared NAT). Turnstile is necessary but not a
   guarantee against abuse; avoid instance-memory limits on serverless.
6. Configure a 90-day retention job in Supabase (Cron/pg_cron) **before
   collecting real contact details**. Example SQL job body:
   \`delete from public.grocery_feedback where submitted_at < now() - interval '90 days';\`
   Verify it runs, and document owner and frequency. No automatic cleanup job
   is created by the migration. The form does not claim automatic deletion.
7. Verify anon cannot \`SELECT\` or \`INSERT\` directly. Verify an
   authenticated regular user cannot read other responses; a grocery editor
   can view them with an authenticated Supabase SQL query/client.
   SQL Editor runs with elevated access, so do not mistake it for an anon test.
8. Verify empty/oversized/invalid input, bad origin, missing Turnstile,
   reused Turnstile token, and no service key all fail without inserting.
   Verify one genuine browser submission, that the record is private, and
   nothing private appears in GA4 or response bodies.

## Privacy, contact and follow-up

- \`helpful\`, categorical \`section\`, optional safe \`context_slug\`, and
  max-400-character \`comment\` may be sent by any verified user.
- Contact is **entirely optional** and must specify exactly one of email or
  US phone number. Explicit consent covers follow-up about the submitted
  comment only; not marketing, newsletters, automated texts, or bulk outreach.
- Contact is normalized to lowercase email or \`+1XXXXXXXXXX\` phone
  so administrators can match returning users **who voluntarily provide the
  same contact**, but the system does not prove identity or send messages.
- Never connect these contacts to Google Analytics visitor IDs, advertising,
  grocery price rows, or unrelated products without new disclosure/consent.
- Do not log the request body, Turnstile token, or database credentials.
- For deletion requests email \`info@frontierminds.io\`, verify the requester's
  ownership of the contact before removing records.
- Do not promise an automatic follow-up. Replies, if any, are handled by an
  authorized human with the user's chosen method.
- A phone contact should be used for a direct individual callback, **not**
  automated SMS or promotional texting; those would need additional consent
  and compliance review.

## Queries for the authorized Supabase SQL Editor

\`\`\`sql
select helpful, section, count(*) as responses
from public.grocery_feedback
group by helpful, section
order by section, helpful;

-- For private review only; never expose this response as a public API.
select id,submitted_at,helpful,section,comment,
  contact_email,contact_phone,followup_consent
from public.grocery_feedback order by submitted_at desc limit 50;

-- Clean up after a verified request to remove one specific response:
-- delete from public.grocery_feedback where id = 'UUID_FROM_VERIFIED_REQUEST';
\`\`\`
