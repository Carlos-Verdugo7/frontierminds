# FrontierMinds · Grocery Price Watch (CSV-first)

This is the **two-file** grocery dataset, not the original 15-column prototype.
The accepted input schemas are the *exact headers* in:

- \`data/grocery/wpb_grocery_prices.csv\` (482 source price records)
- \`data/grocery/wpb_grocery_stores.csv\` (22 locations: original 21 + the
  provided Bravo at 5011 Broadway, West Palm Beach, FL 33407)

The CSVs in this repository are **seed inputs**, not evidence that the live
Supabase database has been populated. They are not automatically published.
The last-column price list is never generated or uploaded separately.

## 1. Supabase and Vercel configuration

Confirm FrontierMinds' Vercel Preview and Production environments have
\`SUPABASE_URL\` and \`SUPABASE_PUBLISHABLE_KEY\` (or supported public/anon
alternatives). Vercel's project-level integration provides them. Never paste
a service-role or secret key into frontend code. No service-role key is used
by this feature. Redeploy after changing environment variables.

## 2. Run BOTH SQL migrations in Supabase SQL Editor

Apply each file **once, in this order**, after reviewing them against your
actual Supabase project:

1. \`supabase/migrations/202611250001_grocery_prices.sql\` creates the
   administrator membership and baseline permissions.
2. \`supabase/migrations/202611250002_grocery_csv_snapshot.sql\` adds the
   new authoritative tables, published-only views, and import/publish RPCs.

The original prototype tables are left intact for safety, but the new site
reads from \`grocery_csv_public_prices\` and only the new CSV editor functions
write to the new tables.

The new data model is an immutable *uploaded snapshot* in
\`grocery_csv_batches\` with original CSV fields stored under
\`wpb_grocery_prices\` and \`wpb_grocery_stores\`.
A price joins locations using **both** \`chain\` and \`flyer_id\`.
One flyer may match many stores. A chain may have multiple flyers.
Public pages show only published snapshot rows according to RLS.

## 3. Create a private administrator

In Supabase Authentication → Users, invite yourself and verify the email.
In the *private Supabase SQL Editor* run, substituting your own email:

\`\`\`sql
insert into public.grocery_admins(user_id)
select id from auth.users where email = 'YOUR_EMAIL_HERE';
\`\`\`

Check that exactly one row was inserted. Keep public sign-up disabled,
enable multifactor authentication if available, and rate-limit login
requests. RLS and protected RPCs prevent anonymous writes, but the
editor also requires the private account.

## 4. Seed the initial prices using the exact two CSVs

After deploying the website, go to \`/admin/grocery-prices\`.

1. Log in with the authorized Supabase account.
2. Choose a **snapshot date**, e.g. \`2026-11-25\`, for the CSV upload.
3. Upload **both** \`wpb_grocery_prices.csv\` and
   \`wpb_grocery_stores.csv\` from \`data/grocery/\`. These are exact
   25- and 12-column files; a UTF-8 BOM is accepted.
4. The server checks headers/order, IDs, dates, amounts, comparison-unit
   availability, \`chain + flyer_id\` joins, and maximum file sizes.
5. Confirm 482 source prices and 22 locations were imported.
   \`BRAVO\` must have 61 prices and the matching new Broadway location.
6. Check original promotions and advertised dates, especially expired
   Bravo and Tapatia flyers and text-only source references.
7. **Publish** explicitly. No price appears publicly until the batch is
   published. Incorrect published records can be removed or a full snapshot
   corrected after a separate confirmation.

Only manually verified store ads should be published. Imported rows with
non-URL source references show the label, not a fabricated hyperlink. If
the source is a private uploaded flyer, consider publicly hosting a legally
permitted source document first so readers and crawlers can verify it.

## 5. How public comparisons work

- Today's date is evaluated in \`America/New_York\` and must fall between
  \`valid_from\` and \`valid_to\` (inclusive) for an offer to be current.
- Default: \`palm_beach_county=yes\`. Other branches can be included
  explicitly on the search page.
- \`compare_item\` is the only comparable-group identifier. If blank,
  the price appears on the **store page only**, not comparison/search pages.
- Comparisons order rows by \`price_per_compare_unit\`, not raw sticker
  price. The \`compare_unit\` and \`compare_qty\` display beside the amount.
- Every price displays \`price_type\`, \`membership_required\`, and dates.
- Comparable prices display \`match_note\` adjacent to normalized price.
  Empty notes are labeled as unspecified; never invented.
- Archive routes preserve prices after expiration. Published snapshots
  are not deleted automatically.
- \`wpb_price_comparison.csv\` is *not* imported. Comparisons are generated
  from \`wpb_grocery_prices.csv\` and matching store rows.

## 6. Public and editor routes

- \`/comunidad/precios\` — county-first grocery watch and stores
- \`/comunidad/precios/[item]\` — current comparable offers, cheapest first
- \`/comunidad/precios/tiendas/[store]/[week]\` — all offers for a given
  store and snapshot, including noncomparable and expired records
- \`/comunidad/precios/buscar\` — read-only filters, county toggle
- \`/comunidad/precios/archivo/[week]\` — archived batch history
- \`/api/grocery-prices/current\` — public, read-only JSON (same rules)
- \`/admin/grocery-prices\` — authorized editor
- \`/sitemap.xml\`, \`/robots.txt\` — public crawler discovery

All public price rows render into server HTML, not client-side fetching.

## 7. Launch checklist

- [ ] Both migrations applied to intended Supabase project.
- [ ] Supabase administrator added and login works.
- [ ] Anonymous user can read **published** offers and cannot read drafts.
- [ ] Anonymous user cannot call import/publish/remove RPCs.
- [ ] CSV upload validates 482 prices + 22 stores and the Bravo flyer.
- [ ] No unpublished or expired price is described as current.
- [ ] Comparisons show unit prices + match notes, not store-only rows.
- [ ] Retailer references verified; source labels are not turned into fake URLs.
- [ ] Verify 17 store locations are within Palm Beach County (16 original + Bravo).
- [ ] Preview build, TypeScript and CSV fixture tests pass.
- [ ] Add shared Vercel WAF/CDN rate limits for JSON and admin login if needed;
      in-memory counters do not work reliably across serverless functions.
- [ ] Only merge after source verification and release approval.

A successful Vercel build **does not** imply the Supabase migration was
executed or that the actual prices were published.
