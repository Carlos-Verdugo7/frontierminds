# Data Engineering with AI — free-first learning path

This course is independent education. It does not require Fivetran, Snowflake, Claude, Codex, a credit card, or a connection to real data. Exercises use a fictional seven-order, eight-version source.

## Learning options

- **Fully free:** download synthetic CSV from /courses/data-engineering/labs/medallion, work locally with DuckDB, dbt-duckdb and ReportLab (all open-source), and use no-key browser lessons and checks.
- **Managed ingestion (optional):** Fivetran Free Plan for eligible low-volume usage, after explicitly selecting the plan; up to 500k connection MAR, 3.5k activation MAR and 5k monthly model runs at publication. See https://www.fivetran.com/pricing/free-plan for current eligibility and limits.
- **Cloud warehouse (optional):** Snowflake trials expire and use credit limits. Warehouse charges are separate from any Fivetran plan.
- **AI assistance (optional):** copy the included prompts into Claude, Codex, or another code assistant according to the provider's current access and pricing. AI should not receive secrets or private customer records. Learners can complete the path without model access.

## Course structure
Chapter 1: pipeline mental model, Fivetran and pricing, local ingest.
Chapter 2: Bronze provenance, Silver deduplication and quarantine, Gold verified metrics.
Chapter 3: dbt and AI code review, evidence-first analysis, local PDF generation.

## Expected synthetic dataset
Raw Bronze: 8 rows / 7 distinct order IDs / $450 sum of row amounts.
Latest per order: 7 rows / $370.
Valid Silver (exclude a fictional invalid negative amount): 6 rows / $390.
Completed Gold: 4 orders / **$280** (orders 1001 $120, 1002 $90, 1006 $40 and 1007 $30).

Amount-negative-is-invalid is a *fictional domain assumption*, not a general rule for refunds or bookkeeping. The dashboard is a teaching simulation, not a Fivetran or Snowflake connection. No data leaves the browser through the lab.

## Acceptance criteria
- Every lesson contains objectives, explanations, a worked example, a lab, a reusable prompt/code sample, source, and three graded questions.
- Lab toggles illustrate how turning off deduplication, validation and completed-only filtering affects totals. Default should reconcile to $280.
- Search indexing, course navigation, progress tracking, and metadata include the new course.
- Existing actuarial, Salesforce and Comunidad routes continue to work.
- Local QA: npm test; npx tsc --noEmit; npm run build.
