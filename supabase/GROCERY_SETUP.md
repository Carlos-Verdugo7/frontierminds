# FrontierMinds Weekly Grocery Price Watch — Supabase setup

The public pages remain in a **safe empty state** until a Supabase project is
connected, a migration is applied, and real store offers are published.
No sample prices are ever represented as real advertised offers.

## 1. Connect Supabase to Vercel

Use the Vercel Supabase integration on the **existing FrontierMinds project**,
and verify the Production and Preview scopes. This code accepts
\`SUPABASE_URL\` and \`SUPABASE_PUBLISHABLE_KEY\`, or
\`NEXT_PUBLIC_SUPABASE_URL\` and
\`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY\` / \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`.
The Next.js server uses the public/anon key **only on the server**.
**Never use or expose a service-role key in frontend code.**
Vercel deployments must be rebuilt after adding environment variables.

## 2. Apply the SQL migration

Open your linked Supabase project → SQL Editor. Review and apply:

\`supabase/migrations/202611250001_grocery_prices.sql\`

This creates stores, items, weeks, offers, a public published-only view,
RLS policies, and admin-only transactional import/publish functions.
Do not run the same SQL against an unrelated database.

## 3. Create your private admin

In Supabase Authentication → Users, create an account for yourself,
with a strong password and confirmed email. In SQL Editor (not GitHub):

\`\`\`sql
insert into public.grocery_admins(user_id)
select id from auth.users where email = 'YOUR_OWN_ADMIN_EMAIL';
\`\`\`

Verify this inserted exactly one row. Keep admin invitation/signup
disabled for the public. Ideally enable MFA on the Auth account and
add Supabase Auth sign-in throttling and bot protection.

## 4. Import data

Visit \`/admin/grocery-prices\`, sign in, download the blank CSV template,
and populate real verified weekly offers. CSV columns:

\`\`\`csv
store_slug,store_name,street_address,city,zip,item_slug,item_name,category,specification,price_usd,unit,promotion_details,valid_from,valid_to,source_url
\`\`\`

- Week starts Monday, covers seven days; promotion validity can be narrower.
- Store slug describes a *specific branch*, not just a chain.
- Item slugs should encode product specification and unit, for example
  \`ground-beef-80-20-lb\` (not a generic beef product).
- Accepted categories: \`beef\`, \`chicken\`, \`pork\`, \`other\`.
- Units: \`lb\`, \`oz\`, \`each\`.
- Source URL: direct HTTPS retailer ad or offer details.
- Include loyalty-card, digital coupon, quantity limits, and eligibility
  in \`promotion_details\`. Avoid advertisements that cannot be verified.
- The import uses a database transaction: invalid entries fail the batch.
- Review the saved week and then click **Publish**. Drafts are not public.
- CSV re-import updates matching offers; it does not automatically delete
  entries missing from the uploaded batch. To remove a mistaken offer, use
  the authenticated Supabase SQL Editor and record the correction.

## 5. Public pages and indexing

- \`/comunidad/precios\` — current, verified offers only
- \`/comunidad/precios/buscar\` — server-rendered search and filters
- \`/comunidad/precios/[item]\` — item comparison
- \`/comunidad/precios/tiendas/[store]/[week]\` — store/week archive
- \`/comunidad/precios/archivo\` — historical listing
- \`/api/grocery-prices/current\` — read-only published JSON
- \`/sitemap.xml\` and \`/robots.txt\` — public discoverability

The public endpoint and pages are CDN cached for five minutes.
Apply a shared Vercel WAF/CDN rate limit to the public JSON endpoint
if usage grows; per-process counters are not reliable across serverless
instances. Also configure a login rate limit and authentication bot
protection before distributing admin access.

## 6. Before launch

- Verify exact store addresses and retailer-specific promotions.
- Verify no draft offers are returned by PostgREST anonymous reads.
- Verify anonymous INSERT, UPDATE, DELETE and RPC calls are rejected.
- Verify non-admin login cannot import or publish.
- Verify canonical HTML includes plain table rows without JavaScript.
- Check product comparisons use identical specifications and units.
- Test links to retailer ads, date expiration, time zone and archive.
- Confirm no price is published without a verifiable source.
- Use Search Console to monitor discovery; crawlers are not guaranteed to
  index or cite any page.

No user accounts are offered to the public. The only authentication is for
the private editorial administrator; the site does not collect shopper data.
