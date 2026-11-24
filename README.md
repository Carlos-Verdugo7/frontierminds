# FrontierMinds

Free interactive learning paths for Data Engineering with AI, Actuarial Exam P and Salesforce & AI Development, built with Next.js, TypeScript and React. Snowflake appears as an optional warehouse in the Data Engineering path; financial mathematics remains on hold.

## Comunidad

`/comunidad` adds Spanish resource guides for West Palm Beach families, editorial posts, private email feedback, topic-level Analytics events, and AI-assisted preparation using reviewed guides. The existing courses remain available. See [COMMUNITY.md](COMMUNITY.md) for posting instructions, Analytics setup, email behavior, and AI deployment details.

The homepage features a new Data Engineering field guide alongside the existing actuarial and Salesforce courses and Spanish community resources. Choosing a deductible carries it into the full actuarial lab. The fair-coin explorer is available under Learning paths. Course counts come from the catalog.

## Run locally

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. Set `OPENAI_API_KEY` in `.env.local` to enable the AI tutor. Lessons, simulations, and practice work without an AI key.

For the live activities, set the server-only `OPENAI_API_KEY` in the Vercel project's Production environment and redeploy. The school rehearsal provides a preset bilingual follow-up and the Salesforce lab includes case-specific hints when live coaching is unavailable.

## Validate

```sh
npm test
npx tsc --noEmit
npm run build
```

The existing layout downloads Geist fonts during builds. In environments requiring system CA certificates, use `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1 npm run build`.

## Learning paths

- `/courses/exam-p`: six chapters and an optional readiness refresher.
- `/courses/exam-p/practice`: mixed sets and timed exam practice.
- `/courses/exam-p/reference`: linked formula reference.
- `/courses/data-engineering`: nine lessons in three chapters, covering Fivetran ingestion, Bronze/Silver/Gold modeling, DuckDB, AI-assisted dbt reviews, grounded analysis and local PDF reporting.
- `/courses/data-engineering/labs/medallion`: an interactive synthetic pipeline you can run without login, external data, a warehouse, AI API key, or paid services. Download the CSV, switch validation rules, reconcile Gold metrics and print the fictional summary as a PDF.
- `/courses/salesforce`: 12 lessons across two chapters: six applied foundations lessons and a six-lesson AI-assisted Salesforce development/deployment path. Includes sample Apex/HTTP mocks, Salesforce CLI validation examples, change inventories, practice labs, and release checklists.
- `/comunidad/practicar-llamada-escuela`: Spanish and English school-call rehearsal with audio, optional AI follow-up, and a copyable script.
- `/courses/salesforce/labs/email-to-case`: a three-case acknowledgment simulator with rule traces and an optional AI coach, also available inside lesson 2.1.
- `/courses/exam-p/labs/deductible` compares weighted contract payments with paired Monte Carlo samples. Learners train a linear regression on three loss sizes, test it on a held-out loss, and audit a sample AI calculation.
- `/courses/salesforce/labs/response-review` lets learners rank records with local TF-IDF search and review three fictional agent drafts against case evidence. Both new labs work in the browser without credentials.
- `/courses/{course}/study`: saved progress, topic accuracy, and mistake review.

Progress saves in the current browser, separately for each course. It does not sync between devices. Timed exams use a stored absolute deadline and keep running when the page is closed. This is a learning tool, not an official SOA exam or pass predictor. Salesforce activities include local case simulations and manual practice-org labs; the application does not connect to Salesforce or deploy changes. Data Engineering labs run locally in the browser and are not connected to Fivetran, Claude, Codex or Snowflake; these external tools are optional and subject to their own pricing. The completely free hands-on path uses DuckDB, dbt-duckdb and ReportLab. Code snippets and CLI examples are educational and are not executed by the app.

## Content structure

`src/content/catalog.ts` connects course metadata and question banks. New lessons are data in `src/content/{course}/lessons.ts`; the original Exam P questions live in `src/content/exam-p/problems.ts`. Shared learning components are in `src/components/learning`. Existing Exam P lesson pages and simulators are preserved. Legacy `/chapter/...` URLs redirect to their course-specific equivalents.

See [PROGRESS.md](PROGRESS.md) for current coverage, scope, and remaining work.

