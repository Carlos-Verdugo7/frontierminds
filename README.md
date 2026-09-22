# FrontierMinds

Interactive learning paths for Actuarial Exam P and Salesforce Foundations, built with Next.js, TypeScript, and React. Snowflake is planned; financial mathematics is on hold.

## Run locally

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. Set `OPENAI_API_KEY` in `.env.local` to enable the AI tutor. Lessons, simulations, and practice work without an AI key.

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
- `/courses/salesforce`: six applied foundations lessons and a support-workflow capstone.
- `/courses/{course}/study`: saved progress, topic accuracy, and mistake review.

Progress saves in the current browser, separately for each course. It does not sync between devices. Timed exams use a stored absolute deadline and keep running when the page is closed. This is a learning tool, not an official SOA exam or pass predictor. Salesforce labs are carried out manually in a practice org; the application does not connect to Salesforce.

## Content structure

`src/content/catalog.ts` connects course metadata and question banks. New lessons are data in `src/content/{course}/lessons.ts`; the original Exam P questions live in `src/content/exam-p/problems.ts`. Shared learning components are in `src/components/learning`. Existing Exam P lesson pages and simulators are preserved. Legacy `/chapter/...` URLs redirect to their course-specific equivalents.

See [PROGRESS.md](PROGRESS.md) for current coverage, scope, and remaining work.
