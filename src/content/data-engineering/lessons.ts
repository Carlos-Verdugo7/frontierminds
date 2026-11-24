import type { Lesson } from '@/lib/learning/types';

// Open, vendor-optional data engineering path. All cases and numbers are fictional.
export const dataEngineeringLessons: Lesson[] = [
  {
    "id": "1.1",
    "title": "Follow one data product from source to decision",
    "summary": "Map an end-to-end pipeline before choosing Fivetran, Snowflake, DuckDB, or AI agents.",
    "group": "foundation",
    "minutes": 25,
    "objectives": [
      "Identify what ingestion, transformation and analysis each own.",
      "Describe Bronze, Silver and Gold as contracts, not just folder names.",
      "Define a decision and an independently verifiable metric."
    ],
    "blocks": [
      {
        "title": "A useful outcome comes first",
        "body": "A fictional shop needs monthly completed-order revenue by region. Begin with the decision: which regions grew, what revenue counts, how often it refreshes, and who trusts it. Specify the event time, currency, refunds, late updates, and reporting grain before selecting technology."
      },
      {
        "title": "Divide responsibility",
        "body": "A source provides transactions; an ingestion connector copies updates; Bronze preserves source evidence; Silver normalizes types, deduplicates, and flags invalid rows; Gold applies the agreed business definition; downstream analysis and PDF reports consume Gold. A managed connector does not automatically invent a correct business metric."
      },
      {
        "title": "AI is an assistant, not the authority",
        "body": "Use Claude or Codex to inspect a *sanitized schema*, propose dbt models and tests, review SQL, and draft analysis code. Review each file/diff, run tests, compare row counts and aggregates to source data, and require a human to approve definitions and release steps."
      },
      {
        "title": "Keep it portable and free to learn",
        "body": "Start with fictional CSVs and DuckDB locally: no paid data warehouse, no API key, no ingestion account. Later, substitute a Fivetran connector and a cloud destination without changing the metric definition."
      }
    ],
    "example": {
      "question": "An AI tool summarizes $450 from raw order amounts while the business wants completed-order revenue. Is the raw sum trustworthy?",
      "solution": "No. It includes duplicates, an invalid negative amount, and pending/refunded orders. The verified metric in the companion lab is $280 after documented deduplication and filtering."
    },
    "lab": [
      "Write one question a business owner would ask about orders and define the required grain, currency, and statuses.",
      "Sketch the complete source → ingestion → Bronze → Silver → Gold → report sequence.",
      "Record at least three reasons a raw sum may disagree with the Gold metric."
    ],
    "snippets": [
      {
        "title": "Reusable architecture prompt",
        "language": "text",
        "code": "Design a small, reproducible data product using synthetic orders.\nStart with the business definition and grain before SQL.\nProvide a source contract, Bronze/Silver/Gold responsibilities,\nreconciliation checks, expected failures, and a local DuckDB option.\nLabel assumptions. Do not claim you accessed a database or ran tests."
      }
    ],
    "problems": [
      {
        "id": 1,
        "question": "What should be defined before generating a Gold table?",
        "options": [
          "A PDF color palette",
          "The business metric, grain, and inclusion rules",
          "An AI model name",
          "A dashboard filter chosen at random",
          "A cloud provider logo"
        ],
        "correctIndex": 1,
        "explanation": "A correct Gold model begins with an agreed definition of the metric.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Business semantics"
      },
      {
        "id": 2,
        "question": "What does a managed ingestion connector primarily provide?",
        "options": [
          "Guaranteed business-correct metrics",
          "Automated extraction and synchronization of source data",
          "Review of all reports",
          "A free cloud database",
          "Guaranteed AI accuracy"
        ],
        "correctIndex": 1,
        "explanation": "Ingestion moves data; transformation and metric validation are separate responsibilities.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Architecture"
      },
      {
        "id": 3,
        "question": "Which is the best starting point for a free student lab?",
        "options": [
          "A production customer export",
          "A paid cloud subscription",
          "Fictional CSV files in local DuckDB",
          "An unrestricted API token",
          "A public write credential"
        ],
        "correctIndex": 2,
        "explanation": "Local synthetic datasets are reproducible and avoid cloud charges and sensitive data.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Free-first"
      }
    ],
    "source": {
      "title": "Databricks medallion architecture",
      "url": "https://docs.databricks.com/aws/en/lakehouse/medallion"
    }
  },
  {
    "id": "1.2",
    "title": "Use Fivetran without confusing free plans and trials",
    "summary": "Learn a connector workflow, how MAR is counted, and how to monitor limits.",
    "group": "foundation",
    "minutes": 30,
    "objectives": [
      "Outline source, destination, permissions and sync monitoring.",
      "Recognize monthly active rows (MAR) rather than treating them as total storage rows.",
      "Compare the ongoing Fivetran Free Plan with optional cloud trials."
    ],
    "blocks": [
      {
        "title": "What Fivetran automates",
        "body": "Fivetran is a managed data-movement service. Select a supported source and destination, authorize least-privilege access, configure tables/schema, perform the initial sync, and monitor sync health and schema changes. Connector prerequisites, destination support, and schedules differ, so follow the source-specific setup guide."
      },
      {
        "title": "Free does not mean unlimited",
        "body": "As of November 2026 Fivetran advertises a no-time-limit Free Plan with up to 500,000 connector MAR, 3,500 activation MAR, and 5,000 monthly model runs, subject to current terms. MAR roughly reflects distinct source records that become active in a billing month; it is not identical to table size or bytes. Review the current billing dashboard and plan status, especially after any trial."
      },
      {
        "title": "Separate vendor bills",
        "body": "The Fivetran Free Plan does *not* pay Snowflake, cloud storage, external API, or Claude/Codex fees. Snowflake currently offers a time-limited trial; DuckDB + local files can remain free indefinitely. Prefer a read-only sample connector and set budgets/alerts if you explore the cloud."
      },
      {
        "title": "Check sync behavior and failure cases",
        "body": "Track last successful sync, new/updated records, schema drift, deletes, re-syncs, rate limits, and destination permissions. Save an ingestion run identifier/time for lineage. Never put production credentials or personal data into a public AI prompt."
      }
    ],
    "example": {
      "question": "A connector is under 500,000 monthly active rows, but your warehouse trial expired. Is the whole pipeline still free?",
      "solution": "No. Fivetran plan limits and warehouse compute/storage are separate. Pause paid resources or switch to a local DuckDB exercise."
    },
    "lab": [
      "Read the Fivetran Free Plan terms and write down the current MAR/model-run thresholds.",
      "Choose a publicly accessible or synthetic source, a destination, permissions, and a basic sync-health checklist; do not use production credentials.",
      "Write an alert condition for changed-row volume, failed syncs, and delayed freshness."
    ],
    "snippets": [
      {
        "title": "AI connector-planning prompt",
        "language": "text",
        "code": "For a [synthetic source] → [approved destination] pipeline,\nlist the least-privilege setup steps, available Fivetran connector\nrequirements, schema-change risks, and sync monitoring checks.\nDistinguish Fivetran usage from warehouse costs.\nUse official documentation and say what you cannot verify."
      }
    ],
    "problems": [
      {
        "id": 1,
        "question": "What does MAR stand for in Fivetran pricing?",
        "options": [
          "Managed API requests",
          "Monthly active rows",
          "Memory allocation rate",
          "Monthly aggregate revenue",
          "Metadata audit records"
        ],
        "correctIndex": 1,
        "explanation": "Fivetran uses monthly active rows as a usage measure.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Billing"
      },
      {
        "id": 2,
        "question": "What may still cost money even on a free Fivetran plan?",
        "options": [
          "Reading this guide",
          "A local CSV file",
          "DuckDB local SQL",
          "Cloud warehouse compute and storage",
          "Writing a text prompt"
        ],
        "correctIndex": 3,
        "explanation": "Destination infrastructure is billed separately by its provider.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Cost awareness"
      },
      {
        "id": 3,
        "question": "A sync runs but a source column unexpectedly changes type. What should you do?",
        "options": [
          "Assume Gold stays correct",
          "Monitor schema changes and validate downstream models",
          "Remove all tests",
          "Give Fivetran broader admin rights",
          "Copy raw data straight to a PDF"
        ],
        "correctIndex": 1,
        "explanation": "Schema drift should trigger validation and downstream impact review.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Ingestion"
      }
    ],
    "source": {
      "title": "Fivetran Free Plan",
      "url": "https://www.fivetran.com/pricing/free-plan"
    }
  },
  {
    "id": "1.3",
    "title": "Build a no-account ingestion practice pipeline",
    "summary": "Load sample CSV data into DuckDB, preserve lineage, and define a source contract.",
    "group": "foundation",
    "minutes": 30,
    "objectives": [
      "Load an immutable sample into Bronze.",
      "Capture ingestion timestamps and source schema assumptions.",
      "Avoid silent changes when columns or data types drift."
    ],
    "blocks": [
      {
        "title": "CSV is a genuine ingestion source",
        "body": "For a completely free route, save a small fictional orders.csv, install DuckDB locally, and read it with SQL. CSV is not a substitute for production CDC or Fivetran connectors, but it teaches the same downstream contracts."
      },
      {
        "title": "Define the source contract",
        "body": "Fields: order_id (text), customer_id (text), status (text), amount_usd (decimal-compatible), updated_at (timestamp), ingested_at (timestamp). Assume updates to order_id may arrive later, and ingested_at is a tie-breaker when source update times are equal. Never assume source order equals event order."
      },
      {
        "title": "Keep Bronze reproducible",
        "body": "Retain raw rows, including duplicate updates and invalid amounts, with their timestamps. Bronze is an evidence layer: silently deleting troublesome source records makes debugging and reconciliation harder."
      },
      {
        "title": "Inspect before modeling",
        "body": "Ask AI to propose schema and anomaly queries, but use counts, DISTINCT, null scans, timestamp comparisons, and sample review to verify the ingest. For production, add the necessary access checks, retention policy and monitoring."
      }
    ],
    "example": {
      "question": "The source contains order 1002 twice: $80 and then $90. Should ingestion overwrite the historical line in the raw evidence?",
      "solution": "No. Preserve the incoming versions or equivalent source history in Bronze. Silver can choose the latest valid version using a deterministic ordering rule."
    },
    "lab": [
      "Download or copy the synthetic rows from the interactive lab, saving them as orders.csv.",
      "Load the CSV locally and verify there are eight raw rows and seven distinct order IDs.",
      "Explain why keeping both versions of order 1002 makes troubleshooting possible."
    ],
    "snippets": [
      {
        "title": "Local DuckDB example",
        "language": "sql",
        "code": "-- After saving the lab's sample as orders.csv:\nCREATE TABLE bronze_orders AS\nSELECT * FROM read_csv_auto('orders.csv');\nSELECT COUNT(*) AS rows,\n       COUNT(DISTINCT order_id) AS orders\nFROM bronze_orders;\n-- Expected: 8 rows and 7 distinct orders."
      },
      {
        "title": "Install commands",
        "language": "bash",
        "code": "python -m pip install duckdb\n# Run the SQL in a DuckDB CLI or through Python.\n# All exercise records are synthetic; no cloud account is required."
      }
    ],
    "problems": [
      {
        "id": 1,
        "question": "How many distinct orders exist in the sample eight-row Bronze dataset?",
        "options": [
          "5",
          "6",
          "7",
          "8",
          "9"
        ],
        "correctIndex": 2,
        "explanation": "The later update to order 1002 adds a row but not a new order ID.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Source grain"
      },
      {
        "id": 2,
        "question": "What is the most useful reason to preserve raw updates?",
        "options": [
          "To maximize the PDF file size",
          "To make reconciliation and replay possible",
          "To eliminate data contracts",
          "To avoid timestamps",
          "To bypass permissions"
        ],
        "correctIndex": 1,
        "explanation": "Raw history supports auditability and troubleshooting.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Bronze"
      },
      {
        "id": 3,
        "question": "Which field helps break a tie between equal source updated_at values?",
        "options": [
          "A random number",
          "A decorative report title",
          "The ingestion timestamp, with an agreed deterministic rule",
          "The destination URL",
          "A password"
        ],
        "correctIndex": 2,
        "explanation": "Use a deterministic tie-breaker such as ingested_at when ordering updates.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Incremental"
      }
    ],
    "source": {
      "title": "DuckDB CSV importer",
      "url": "https://duckdb.org/docs/current/data/csv/overview"
    }
  },
  {
    "id": "2.1",
    "title": "Bronze: keep source evidence and detect changes",
    "summary": "Create a raw-data contract and understand how incremental ingestion interacts with lineage.",
    "group": "foundation",
    "minutes": 25,
    "objectives": [
      "Keep source rows available for reconciliation.",
      "Identify differences between source changes and ingestion artifacts.",
      "Write Bronze quality checks without silently rewriting inputs."
    ],
    "blocks": [
      {
        "title": "Raw does not mean unobservable",
        "body": "Bronze captures what arrived: original keys, raw amounts and statuses, source updated timestamps and ingestion times. Document the grain (an event/change, not necessarily one current order), connector sync state, and expected null/late records."
      },
      {
        "title": "Incremental does not mean correct",
        "body": "Fivetran may synchronize updates efficiently, but your business logic must still handle deletes, resyncs, late-arriving changes, and source corrections. A destination table containing one current row per primary key has different semantics from an append-only change log. Validate the connector's exact behavior."
      },
      {
        "title": "Use AI for a profiling checklist",
        "body": "Ask Claude/Codex to propose null counts, duplicate keys, min/max timestamps, impossible numeric values, source-to-destination counts, and schema-drift checks. Review and execute them, then attach results before any Gold report is released."
      }
    ],
    "example": {
      "question": "Bronze has eight rows and Gold has four completed orders. Does that indicate data loss?",
      "solution": "Not necessarily. Bronze counts source versions; Gold counts business-qualified current orders. Reconcile distinct IDs, invalid records, status exclusions, and the duplicate update before judging loss."
    },
    "lab": [
      "Write checks for duplicate order_id values, empty status, negative amount, and late records.",
      "Compare ingestion timestamps with source update timestamps; note that late arrival does not always mean bad data.",
      "Write an AI review prompt that asks for missing lineage and schema-contract assumptions."
    ],
    "snippets": [
      {
        "title": "Bronze profiling SQL",
        "language": "sql",
        "code": "SELECT COUNT(*) AS raw_rows,\n       COUNT(DISTINCT order_id) AS distinct_orders,\n       SUM(CASE WHEN amount_usd < 0 THEN 1 ELSE 0 END) AS negative_amounts\nFROM bronze_orders;\n-- Expected with lab data: 8 rows, 7 IDs, 1 negative row."
      }
    ],
    "problems": [
      {
        "id": 1,
        "question": "What is the grain of Bronze in the sample?",
        "options": [
          "One report month",
          "One source-arrived order version",
          "One Gold region",
          "One PDF page",
          "One customer segment"
        ],
        "correctIndex": 1,
        "explanation": "Bronze retains update versions as separate evidence rows.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Grain"
      },
      {
        "id": 2,
        "question": "What does a smaller Gold row count prove by itself?",
        "options": [
          "A broken warehouse",
          "Nothing until grain and filters are reconciled",
          "An incorrect AI model",
          "A missing API token",
          "A free-tier overage"
        ],
        "correctIndex": 1,
        "explanation": "Counts across different grains need reconciliation to be meaningful.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Reconciliation"
      },
      {
        "id": 3,
        "question": "What is appropriate when the source changes a column unexpectedly?",
        "options": [
          "Silently ignore it",
          "Recheck the schema contract and downstream dependencies",
          "Disable tests",
          "Hardcode sample values into Gold",
          "Merge immediately"
        ],
        "correctIndex": 1,
        "explanation": "Schema changes can alter transformations and need review.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Schema drift"
      }
    ],
    "source": {
      "title": "Databricks medallion pattern",
      "url": "https://docs.databricks.com/aws/en/lakehouse/medallion"
    }
  },
  {
    "id": "2.2",
    "title": "Silver: deduplicate, type and quarantine",
    "summary": "Use deterministic SQL to select current orders and isolate bad values without hiding them.",
    "group": "foundation",
    "minutes": 35,
    "objectives": [
      "Partition updates by business key and order by source and ingestion timestamps.",
      "Reject or quarantine invalid amounts while recording reasons.",
      "Check nullability and allowable statuses before producing Gold."
    ],
    "blocks": [
      {
        "title": "Build a deterministic current-state table",
        "body": "Use ROW_NUMBER() PARTITION BY order_id ORDER BY updated_at DESC, ingested_at DESC to select the latest order version. If timestamps tie fully, add a stable source sequence or event ID rather than rely on unstable row order."
      },
      {
        "title": "Quarantine is observable",
        "body": "The -$20 completed order in the sample is invalid under this fictional contract, so capture the order ID and a reason. In a real business, negative values may represent legitimate credits; this is a domain decision, not a universal cleaning rule."
      },
      {
        "title": "Validate types, keys and statuses",
        "body": "Require non-null order IDs, plausible timestamps, recognized statuses and decimal-compatible amounts. Ask AI for tests and identify assumptions about refunds and corrections. Review every exception type, not just the happy path."
      },
      {
        "title": "Treat old updates carefully",
        "body": "Late arrival is different from latest business state. Incremental models must support updates and corrections, with explicit MERGE/upsert and delete behavior. Verify results for replay and out-of-order delivery."
      }
    ],
    "example": {
      "question": "You deduplicate by first row rather than latest update. What happens to order 1002?",
      "solution": "It remains $80 rather than the latest $90; completed revenue is understated by $10 in the sample. The interactive lab exposes the difference."
    },
    "lab": [
      "Run the lab with deduplication disabled, then enabled. Compare record counts and revenue.",
      "Add an amount validity rule and identify the rejected order ID. Decide where to store rejection reasons.",
      "Ask AI to generate one late-arriving-update test and one null-key test; inspect the proposed SQL for deterministic ordering."
    ],
    "snippets": [
      {
        "title": "Silver SQL for DuckDB",
        "language": "sql",
        "code": "WITH ranked AS (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY order_id\n    ORDER BY updated_at DESC, ingested_at DESC\n  ) AS rn\n  FROM bronze_orders\n)\nSELECT order_id, customer_id, status,\n       TRY_CAST(amount_usd AS DECIMAL(12,2)) AS amount_usd,\n       updated_at\nFROM ranked\nWHERE rn = 1\n  AND TRY_CAST(amount_usd AS DECIMAL(12,2)) >= 0;\n-- Save rejected/current rows separately for audit."
      },
      {
        "title": "AI Silver review prompt",
        "language": "text",
        "code": "Review this deduplication SQL using synthetic rows only.\nFind non-deterministic tie cases, null keys, late updates,\nnegative/invalid amounts, delete handling, and quarantined rows.\nWrite a failure case for each issue and explain the expected result.\nDo not assume a negative amount is always invalid in every domain."
      }
    ],
    "problems": [
      {
        "id": 1,
        "question": "Which rule selects the most recent order version?",
        "options": [
          "ORDER BY amount DESC",
          "ROW_NUMBER partitioned by order_id and ordered by timestamps DESC",
          "Random row sampling",
          "Alphabetical customer IDs",
          "A PDF page number"
        ],
        "correctIndex": 1,
        "explanation": "A deterministic window rule makes current-state selection explicit.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Deduplication"
      },
      {
        "id": 2,
        "question": "How should rejected rows be handled?",
        "options": [
          "Disappear without a trace",
          "Go to a documented quarantine with reasons",
          "Be counted as revenue",
          "Be rewritten to arbitrary positive values",
          "Be sent to AI unredacted"
        ],
        "correctIndex": 1,
        "explanation": "Auditability requires a record of exceptions.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Quality"
      },
      {
        "id": 3,
        "question": "What is true about negative amounts?",
        "options": [
          "Always wrong in every domain",
          "Always correct in every domain",
          "Need a business rule distinguishing refunds/credits from invalid values",
          "Should be ignored in testing",
          "Cannot be stored in SQL"
        ],
        "correctIndex": 2,
        "explanation": "Business semantics determine acceptable signs and statuses.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Data semantics"
      }
    ],
    "source": {
      "title": "DuckDB window functions",
      "url": "https://duckdb.org/docs/stable/sql/functions/window_functions.html"
    }
  },
  {
    "id": "2.3",
    "title": "Gold: publish one trustworthy business metric",
    "summary": "Define completed-order revenue, reconcile it against Bronze, and make the metric reusable.",
    "group": "foundation",
    "minutes": 30,
    "objectives": [
      "Specify metric grain, status inclusion and currency.",
      "Reconcile Gold to the latest valid Silver records.",
      "Document limitations of status and timing definitions."
    ],
    "blocks": [
      {
        "title": "Gold is a semantic contract",
        "body": "Our sample definition is sum(amount_usd) for current, valid orders with status='completed'. Count each business order once. Exclude pending and refunded rows by this definition, and quarantine the negative completed amount. This is an exercise policy, not an accounting standard."
      },
      {
        "title": "Reconcile three layers",
        "body": "Eight Bronze versions → seven current orders → six valid Silver orders → four completed Gold orders worth $280. Show which IDs changed or were excluded. All reports should derive from the same tested metric, not independent AI-written SQL."
      },
      {
        "title": "Avoid plausible but incorrect stories",
        "body": "A model may say growth increased because $450 appears in raw data. The assistant should be forced to query Gold, include metric definitions and compare totals before writing prose. Supply bounded evidence, not an unrestricted data export."
      },
      {
        "title": "Design for change",
        "body": "A region breakdown may have missing dimension keys; a corrected order may arrive after month end; currencies may vary. Document effective dates, handling for unknown regions and updated reporting windows."
      }
    ],
    "example": {
      "question": "The Gold output is $280 but an AI-written report says $450. Which figure should be published?",
      "solution": "Only the reconciled $280 under the stated completed-order metric. Investigate why $450 was computed from raw data; the business definition and evidence take priority over the AI narrative."
    },
    "lab": [
      "Open the free medallion lab and establish the four expected completed orders.",
      "Write a definition of revenue that explicitly mentions status, deduplication and invalid rows.",
      "Create a small reconciliation table listing raw, current, valid, completed counts and Gold revenue."
    ],
    "snippets": [
      {
        "title": "Gold SQL",
        "language": "sql",
        "code": "WITH ranked AS (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY order_id\n    ORDER BY updated_at DESC, ingested_at DESC\n  ) AS rn\n  FROM bronze_orders\n), silver AS (\n  SELECT * FROM ranked\n  WHERE rn = 1 AND TRY_CAST(amount_usd AS DECIMAL(12,2)) >= 0\n)\nSELECT COUNT(*) AS completed_orders,\n       SUM(TRY_CAST(amount_usd AS DECIMAL(12,2))) AS revenue_usd\nFROM silver\nWHERE status = 'completed';\n-- Expected: completed_orders=4; revenue_usd=280.00"
      }
    ],
    "problems": [
      {
        "id": 1,
        "question": "How many completed, valid, current orders are in the sample?",
        "options": [
          "3",
          "4",
          "5",
          "6",
          "8"
        ],
        "correctIndex": 1,
        "explanation": "Orders 1001, 1002, 1006 and 1007 satisfy the example policy.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Gold metric"
      },
      {
        "id": 2,
        "question": "What is completed-order revenue for the sample?",
        "options": [
          "$450",
          "$360",
          "$340",
          "$280",
          "$260"
        ],
        "correctIndex": 3,
        "explanation": "$120 + $90 + $40 + $30 = $280.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Reconciliation"
      },
      {
        "id": 3,
        "question": "What should happen if a report disagrees with Gold?",
        "options": [
          "Trust AI wording",
          "Verify the metric definition and underlying rows before publishing",
          "Delete all raw data",
          "Exclude the largest customer",
          "Ignore status"
        ],
        "correctIndex": 1,
        "explanation": "Evidence and agreed definitions determine accuracy.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Reporting"
      }
    ],
    "source": {
      "title": "dbt source documentation",
      "url": "https://docs.getdbt.com/docs/build/sources"
    }
  },
  {
    "id": "3.1",
    "title": "Make Claude or Codex a dbt engineering reviewer",
    "summary": "Generate source/model YAML, tests and docs, then execute and inspect results yourself.",
    "group": "foundation",
    "minutes": 30,
    "objectives": [
      "Use AI prompts with explicit schema and metric contracts.",
      "Generate and review model-level non-null, unique and accepted-values tests.",
      "Differentiate source freshness, tests and actual production readiness."
    ],
    "blocks": [
      {
        "title": "Give AI a bounded repository task",
        "body": "Provide synthetic CSV schema, expected Gold outcome, SQL dialect, dbt adapter and directory structure. Ask for source definitions, models, tests, documentation and a diff explanation. Require the assistant to identify uncertain adapter/version features instead of inventing syntax."
      },
      {
        "title": "A credible test strategy",
        "body": "Tests can cover not_null/unique(order_id) for current Silver rows, accepted_values(status), allowed amount ranges, relationship to a customer dimension, and singular reconciliation logic for Gold. Source freshness monitors source lag and is separate from transformation tests."
      },
      {
        "title": "Execute, don't merely accept",
        "body": "Run the recommended dbt commands in a real local project, review failures, and compare outputs to known fixtures. AI can suggest fixes, but a passing test must be observed. Track a manifest and model dependency graph."
      },
      {
        "title": "Do not merge generated SQL blind",
        "body": "AI may introduce implicit joins, non-deterministic deduplication, accidental filters and hidden revenue changes. Ask for a row-level diff and quantify changes before reviewing a pull request."
      }
    ],
    "example": {
      "question": "An AI-generated dbt test checks only that the Gold table exists. Is that sufficient?",
      "solution": "No. Existence does not prove uniqueness, type validity, status rules, freshness, or reconciliation. Add tests that fail on intentional bad rows and prove expected outputs."
    },
    "lab": [
      "Ask an AI tool for a source YAML and three meaningful data quality tests using the lesson's synthetic schema.",
      "Inspect each generated test and deliberately introduce one failing row.",
      "Write a pull-request checklist that requires SQL review, data tests, and the $280 reference total."
    ],
    "snippets": [
      {
        "title": "AI dbt generation prompt",
        "language": "text",
        "code": "Using fictional orders, generate a dbt project outline for DuckDB.\nInclude sources.yml, Bronze/Silver/Gold models, schema.yml tests,\na singular reconciliation test, and documented definitions.\nDo not invent columns or assume models were executed.\nShow the files, explain adapter-dependent syntax and expected counts:\n8 Bronze versions, 7 current IDs, 6 valid Silver, 4 completed,\nGold completed revenue $280. Make any contradiction explicit."
      },
      {
        "title": "Local dbt commands (adapter needed)",
        "language": "bash",
        "code": "python -m pip install dbt-duckdb\n# From a correctly configured dbt project:\ndbt debug\ndbt build\n# Review test results before trusting the metrics."
      }
    ],
    "problems": [
      {
        "id": 1,
        "question": "Which test helps prevent double-counting in a current-order Silver table?",
        "options": [
          "unique(order_id)",
          "A PDF title check",
          "A CSS color test",
          "A random sample with no assertions",
          "A connector logo comparison"
        ],
        "correctIndex": 0,
        "explanation": "A unique business key confirms one current row per order.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "dbt tests"
      },
      {
        "id": 2,
        "question": "What does source freshness measure?",
        "options": [
          "Customer retention",
          "How recently source data arrived relative to a configured expectation",
          "How pretty a chart looks",
          "AI model size",
          "Warehouse account age"
        ],
        "correctIndex": 1,
        "explanation": "Freshness helps detect stale ingestion but does not prove metric correctness.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Freshness"
      },
      {
        "id": 3,
        "question": "When is an AI-generated dbt model ready for release?",
        "options": [
          "When the prompt is eloquent",
          "When SQL is syntactically valid only",
          "After observed tests, reconciliations and approved review",
          "When it uses many CTEs",
          "When a PDF is generated"
        ],
        "correctIndex": 2,
        "explanation": "Deployment requires validated behavior, not just generated code.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Engineering review"
      }
    ],
    "source": {
      "title": "dbt command reference",
      "url": "https://docs.getdbt.com/reference/dbt-commands"
    }
  },
  {
    "id": "3.2",
    "title": "Analyze Gold with AI without inventing insights",
    "summary": "Build an evidence-first analysis workflow with clear limits on claims, privacy and uncertainty.",
    "group": "foundation",
    "minutes": 25,
    "objectives": [
      "Constrain questions to tested Gold tables.",
      "Distinguish observed numbers from explanations and hypotheses.",
      "Review privacy and access permissions before AI tools inspect data."
    ],
    "blocks": [
      {
        "title": "Prompt from a real evidence bundle",
        "body": "Provide a documented Gold query result, row counts, definitions, reporting period, known nulls and reconciliation evidence. Ask the assistant to explain what is *observed*, what is *inferred*, and what cannot be concluded without more data."
      },
      {
        "title": "Investigate unusual numbers",
        "body": "An AI tool should flag raw vs Gold disagreement and propose diagnostic queries. It should not change business rules, omit unfavorable records or invent a cause for an increase. Verification remains a human responsibility."
      },
      {
        "title": "Minimize data exposure",
        "body": "Use synthetic rows in this course. In a workplace, restrict Claude/Codex access to approved views and tools; remove personal data and secrets; follow organizational data policies. Record which data was sent to which model and who approved publication."
      },
      {
        "title": "Know when statistical reasoning matters",
        "body": "With only one eight-row sample you cannot claim regional trends, causality or forecasting accuracy. Good analysis can say 'the sample has four qualified completed orders worth $280' and explain that no historical comparison is present."
      }
    ],
    "example": {
      "question": "An AI-generated paragraph claims revenue grew 20% based on this one sample. Is the claim supported?",
      "solution": "No. There is no previous-period comparison or region dimension in the exercise data. Ask for the missing evidence or remove the growth claim."
    },
    "lab": [
      "Generate a two-paragraph executive summary strictly from the verified sample metrics.",
      "Underline each numerical or causal claim and identify its source query or mark it unsupported.",
      "Rewrite the narrative to separate observations, assumptions and next questions."
    ],
    "snippets": [
      {
        "title": "AI analysis prompt",
        "language": "text",
        "code": "You are reviewing verified Gold results (fictional data).\nMetric: completed-order revenue for current valid orders.\nObserved: Bronze 8 rows, 7 IDs, Silver 6, Gold 4 orders/$280.\nWrite: (1) factual summary, (2) quality caveats, (3) questions.\nCite the exact input metric for every number.\nDo not invent growth rates, regions, customer names or causes.\nMark anything not supported by the supplied data as unknown."
      }
    ],
    "problems": [
      {
        "id": 1,
        "question": "What is unsupported by a single period of sample data?",
        "options": [
          "Four completed orders",
          "$280 completed revenue",
          "A 20% growth claim without a comparison period",
          "One duplicate source ID",
          "One invalid amount"
        ],
        "correctIndex": 2,
        "explanation": "Growth requires a comparable previous period and a defined measure.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Evidence"
      },
      {
        "id": 2,
        "question": "What should AI analysis consume?",
        "options": [
          "Unrestricted personal records",
          "A verified metric result with definitions and limitations",
          "Unreviewed generated SQL only",
          "Production API keys",
          "Entire logs with secrets"
        ],
        "correctIndex": 1,
        "explanation": "Bounded verified data reduces wrong claims and exposure.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Guardrails"
      },
      {
        "id": 3,
        "question": "What is a responsible response to a suspicious aggregate?",
        "options": [
          "Publish the AI draft immediately",
          "Hide the anomaly",
          "Run reconciliation queries and explain differences",
          "Change the expected metric silently",
          "Disable lineage"
        ],
        "correctIndex": 2,
        "explanation": "Evidence-first investigation should precede publication.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Analytics"
      }
    ],
    "source": {
      "title": "DuckDB documentation",
      "url": "https://duckdb.org/docs/stable/"
    }
  },
  {
    "id": "3.3",
    "title": "Generate a verifiable PDF report with Python and AI",
    "summary": "Produce a local PDF from approved metrics, then audit every number and label.",
    "group": "foundation",
    "minutes": 35,
    "objectives": [
      "Generate a report locally using an open-source Python PDF library.",
      "Keep numbers grounded in a verified metrics artifact.",
      "Require a verification step before publication."
    ],
    "blocks": [
      {
        "title": "The PDF is a rendering, not the source of truth",
        "body": "Let AI draft document layout and explanatory prose, but generate numbers from a controlled file or query. In this lesson use a tiny verified CSV with completed_orders=4 and revenue_usd=280; build a PDF with ReportLab locally. The generated report must say the data are fictional."
      },
      {
        "title": "Reproducibility",
        "body": "Record the metric definition, SQL/build version, as-of date, source filename and report-generation command. Prefer deterministic templates with a data-driven section so a rerun changes numbers only when the verified input changes."
      },
      {
        "title": "Verify the output",
        "body": "Check report numbers against Gold, missing values, page rendering, labels, sensitive-data leakage and unsupported commentary. If AI changes a formula or adds a claim such as '20% growth', reject it until evidence exists."
      },
      {
        "title": "Make it genuinely accessible",
        "body": "ReportLab and DuckDB are open source and run locally. Claude or Codex may require a paid plan or usage, so provide copyable prompts as optional accelerators, never prerequisites. FrontierMinds displays the learning content without a model key."
      }
    ],
    "example": {
      "question": "The report generator successfully writes a PDF, but its narrative says completed revenue is $450. Is the pipeline done?",
      "solution": "No. PDF creation is only output formatting. Compare the rendered figures with the verified $280 Gold aggregate and remove or correct unsupported statements."
    },
    "lab": [
      "Copy the verified gold.csv example and run the ReportLab script locally.",
      "Inspect the PDF and compare its two displayed metrics to Gold.",
      "Ask an AI tool to propose one improvement to the layout without allowing any changes to the metric definition, and review the diff."
    ],
    "snippets": [
      {
        "title": "Verified input: gold.csv",
        "language": "csv",
        "code": "completed_orders,revenue_usd\n4,280.00"
      },
      {
        "title": "Free ReportLab generator",
        "language": "python",
        "code": "import csv\nfrom reportlab.pdfgen import canvas\n\nwith open('gold.csv', newline='', encoding='utf-8') as file:\n    metrics = next(csv.DictReader(file))\n\norders = int(metrics['completed_orders'])\nrevenue = float(metrics['revenue_usd'])\nassert orders == 4 and abs(revenue - 280.00) < 0.001\n\npdf = canvas.Canvas('orders-summary.pdf')\npdf.setTitle('Fictional Orders — Verified Summary')\npdf.drawString(72, 770, 'Fictional Orders — Verified Summary')\npdf.drawString(72, 742, f'Completed orders: {orders}')\npdf.drawString(72, 720, f'Completed-order revenue: ${revenue:,.2f}')\npdf.drawString(72, 685, 'Source: gold.csv; status=completed, latest valid orders only.')\npdf.drawString(72, 660, 'Educational synthetic data — not real financial results.')\npdf.save()\nprint('Wrote orders-summary.pdf')"
      },
      {
        "title": "Local install commands",
        "language": "bash",
        "code": "python -m pip install reportlab\npython generate_report.py\n# Open orders-summary.pdf and verify the metrics."
      }
    ],
    "problems": [
      {
        "id": 1,
        "question": "What is the authoritative source for PDF numbers?",
        "options": [
          "The AI-generated narrative",
          "A verified Gold result or exported metrics artifact",
          "A random marketing headline",
          "A screenshot label",
          "The Python library version"
        ],
        "correctIndex": 1,
        "explanation": "Reports should render reconciled metrics, not independently invented values.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Reporting"
      },
      {
        "id": 2,
        "question": "Does writing a PDF prove the numbers are correct?",
        "options": [
          "Yes, always",
          "Only if it is colorful",
          "No; values and claims must be checked against the source",
          "Only with a paid AI account",
          "Only when it contains charts"
        ],
        "correctIndex": 2,
        "explanation": "File generation and metric validation are separate gates.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Quality"
      },
      {
        "id": 3,
        "question": "Which stack can create this learning PDF without cloud fees?",
        "options": [
          "Fivetran Enterprise required",
          "Snowflake production required",
          "A paid Codex subscription required",
          "Python + open-source ReportLab + a verified local CSV",
          "A live Salesforce org"
        ],
        "correctIndex": 3,
        "explanation": "A local Python script with ReportLab can generate the PDF free of cloud services.",
        "hint": "Identify the source of truth, the transformation contract, and how you would verify the answer.",
        "topic": "Accessibility"
      }
    ],
    "source": {
      "title": "ReportLab open-source installation",
      "url": "https://docs.reportlab.com/install/open_source_installation/"
    }
  }
];
