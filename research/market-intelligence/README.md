# Market Intelligence Engine — Phase 1 research

**Status: separate research branch; NOT merged or applied to production.**
Incremental cloud spend target: **$0/month**, subject to existing Vercel/Supabase quotas.

## 1. Inspected architecture

Verified repository migrations 001/002/003, the Supabase public grocery view, the data access module, CSV validation, admin login, feedback RLS, and the two committed 2026-11-25 CSVs. Migration 001 contains an older grocery prototype. **The current grocery pipeline** uses:

- grocery_csv_batches: a snapshot date and draft/published status.
- wpb_grocery_prices: source flyer price rows with compare_item, compare_unit and price_per_compare_unit.
- wpb_grocery_stores: locations per batch, chain and flyer.
- grocery_csv_public_prices: security-invoker view, joining source prices to locations on BOTH chain and flyer_id and filtering to published batches.
- is_grocery_admin and grocery_admins for protected editorial operations; grocery_feedback is separately private.

The application reads this view in pages of 1,000 with caching, and serves search-engine-indexable offer pages. CSV imports still require explicit editor publication. This inspection is based on the actual schema files and published snapshot, NOT privileged access to the private PostgreSQL catalog. No migrations were applied.

## 2. Evidence profile — repository CSV as of 2026-11-27

| Measure | Observed |
|---|---:|
| Distinct imported price rows | 482 |
| Store locations / within Palm Beach County | 22 / 17 |
| Supermarket chains / chain-flyer pairs | 4 / 5 |
| Distinct English product-name strings (not standardized SKUs) | 361 |
| Comparable source rows / comparable product groups | 162 / 55 |
| Source rows without comparison group | 320 |
| Comparable source rows with no match note | 44 |
| Store-expanded listings / county listings | 2,416 / 1,822 |
| Valid county listings on Nov 27 from this snapshot | 1,645 |
| Distinct imported snapshot dates | 1 |
| Store-product pairs with observations on multiple dates | 0 |
| Duplicate CSV price IDs | 0 |
| Independently measured historical volatility | Not measurable |
| Historical promotional frequency or calibrated prediction intervals | Not measurable |

Some promotion validity windows begin Nov 19/20 and end Nov 25/26, Dec 1/8. These dates are NOT historical price observations. Expanded listings repeat flyer prices across applicable stores; this must never inflate statistical evidence counts. Uploaded advertisements are evidence of published promotions, not independently verified checkout prices. Price differences between stores are not temporal volatility. Some source_url entries are references rather than usable URLs; link availability and accuracy are not validated here.

## 3. Phase 1 design and scientific boundaries

Read-only published prices → provenance-aware grouping → statistics → explainable source queue → manual verification in existing CSV workflow → next dated snapshot. No vector DB, graph DB, Python daemon, AI API, external fetch or extra provider.

See src/lib/market-intelligence/core.ts for deterministic logic. Baselines:

- Last observation: available with one valid past source observation, but only as a descriptive experimental reference.
- Rolling three-date average: unavailable until at least three distinct nonconflicting historical dates.
- EWMA: same minimum; fixed alpha=0.4, not tuned on market data.
- Bayesian priors, interval coverage, volatility and price-change probabilities: intentionally NOT produced without repeated observations and chronological validation.
- Same-date conflicting prices are excluded from a baseline rather than averaged invisibly.
- Future evidence is excluded from any earlier as-of estimate.

Collection prioritization is a **heuristic, not an EVSI**. It scores flyer age, expired or soon-to-expire offers, cross-store price spread (not temporal volatility), missing comparison notes and comparable product coverage. It groups visits by chain+flyer_id (one assumed effort unit per flyer), exposes reasons, and includes deterministic approximately 10%-expected exploration. With only five flyers, the realized exploration fraction may differ from 10%. Demand, minutes spent collecting, and true source reliability are unknown rather than invented. Score weights are hypotheses, not scientifically calibrated probabilities.

An independently testable internal basket function uses only published, county, currently valid, non-member, normalized observations with compare_qty=1 and at most two stores. Missing items return an incomplete basket, never a guessed cost. Its sums do not incorporate transportation, package thresholds, quantity-limit promotions, checkout stock or realized savings, so it remains private and is not a consumer-facing recommendation.

## 4. Evaluation and experiments

Three policies receive the same fully observed synthetic first date, then four paid observations per round for five rounds across 12 fictional product/store combinations:

- A: fixed rotating collection.
- B: observed change and staleness heuristic.
- C: synthetic demand weighted change/staleness with forced exploratory sampling.

The deterministic fixture produced these actual program-calculated results (synthetic, not observed market outcomes):

| Policy | MAE of price ($ per unit) | Average demand-weighted decision regret ($ per fictional decision) |
|---|---:|---:|
| A — fixed | 0.2783 | **0.3675** |
| B — statistical | **0.2572** | 0.6280 |
| C — decision-aware | 0.2592 | 0.5225 |

The statistical policy had the lowest prediction MAE while fixed collection had the lowest decision regret. This **does not support** a claim that adaptive collection already helps households; it shows why the decision metric must be audited separately from prediction error.

All three spend exactly **12 bootstrap + 20 sampled = 32 observation units**, compared with 72 fully observed fictional records. After bootstrap they observe 20/60 possible new records (33.33%). Each policy sees only its acquired information at each step; a separate evaluator calculates MAE and per-product choice regret against fictional hidden truth. The metrics are printed by the local report runner and do not establish real shopper savings. The 95%-of-savings with 30%-of-data objective remains untested.

For real experiments we need at least four independent chronological dates per product/store key, ideally more; ensure comparisons by equal acquisition MINUTES, not merely row counts. Evaluate missingness, coverage, predictions against the next chronological observation, and decision regret under complete evidence. Retain failures in the final study.

## 5. Security and data boundaries

The private research route /admin/grocery-prices/inteligencia reuses currentAdmin(), noindexes itself, fetches only published read-only records after checking authorization, and has no public writing API. Set MARKET_INTELLIGENCE_ENABLED=false to switch off the view. The public /comunidad/precios/inteligencia route is an educational guide without predictions. No grocery price, feedback, RLS, public URL, or source CSV is mutated.

Optional SQL files in research/market-intelligence/proposed/ are **NOT EXECUTED**. They propose private research-run and flyer verification tables with RLS and admin-only reads, plus an optional research-only rollback. This first version does not require them.

## 6. Local reproducibility

From the repo root, with Node installed:

    npm ci
    node research/market-intelligence/run.cjs > market-profile.json
    node --test tests/market-intelligence.test.cjs
    npm test
    npm run lint
    npx tsc --noEmit
    npm run build

The CLI uses only local CSV source files and synthetic fixtures. It fixes its report date to Nov 27, 2026 so runs can be compared. Generated output is not auto-uploaded or inserted into Supabase. It does not call the internet.

## 7. Incremental monthly costs

| Resource | Incremental cloud spend |
|---|---:|
| Local research CLI, TypeScript arithmetic, and tests | $0 |
| Private on-demand view on existing Vercel/Supabase quota | $0 while within existing limits |
| New worker/AI/warehouse/vector/graph provider | $0 (none) |
| Human effort collecting flyers and correcting matches | Unmeasured, not free labor |

Cloud charges can increase if normal Vercel or Supabase quotas are exceeded. This branch does not upgrade any plan, schedule paid tasks, or activate cloud services.

## 8. Next validated milestone

Collect several future dated weekly snapshots via the existing manual CSV editor while logging which flyers were independently checked, time spent, matching decisions and missing items. Review these with real families and record aggregate, consent-respecting grocery demand. Only then calibrate probabilistic models, begin credible EVSI estimates or expose basket optimization publicly. Market signals from USDA or advertisements should be included only after access/terms and incremental predictive value have been verified.
