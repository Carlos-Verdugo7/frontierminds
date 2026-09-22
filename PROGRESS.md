# FrontierMinds development status

Updated September 18, 2026.

## Product roadmap

1. Exam P: expand and improve the existing probability path.
2. Salesforce: applied foundations are available; deeper administrator/developer specializations can follow.
3. Snowflake: planned, with no lessons advertised as available yet.
4. Financial mathematics / Exam FM: on hold. Linear algebra is no longer promoted as an upcoming path.

## Exam P

- Six chapters, 25 lessons, plus an optional calculus/notation refresher.
- The original 15 lessons and simulators are preserved under `/courses/exam-p/chapter/...`.
- Chapters 4–6 add 10 lessons: joint distributions, marginals/conditionals, conditional moments, covariance/correlation, sums, order statistics, CLT, deductibles/limits, coinsurance/inflation, and payment moments.
- Each new lesson has learning objectives, explanation, a worked example, an activity, and three original multiple-choice questions. The new questions are introductory checks; additional varied exam-level questions remain valuable future work.
- 230 questions total, including the original 197 plus 33 new questions (30 in Chapters 4–6 and 3 in the refresher). This total includes optional enrichment.
- Joint-table explorer, sampling explorer, and insurance-payment explorer support the new chapters.
- Course overview uses the November 2026 SOA topic groups and links to the syllabus. Chapter weights are not presented as official SOA weights.
- MGF techniques, chi-square, Weibull, and Pareto questions are classified as enrichment and excluded from timed/core mixed practice. Beta remains in the core path.
- Mixed practice selects 10 core questions. Timed sessions select 30 unique questions: 8 general, 14 univariate, 8 multivariate, with a three-hour deadline.
- Timed sessions persist their questions, answers, and deadline. Leaving/reloading does not pause or restart the timer. Expired sessions submit on return. Solutions appear after submission; unanswered items count as incorrect.
- Formula reference links back to lessons. The study desk shows latest-answer accuracy and questions to revisit; neither is a pass prediction.

## Salesforce

- One foundations chapter with six lessons and 18 questions.
- Topics: customer-support data model, access, Flow routing, reporting, SOQL/integration foundations, and capstone handoff.
- A local routing lab illustrates `High priority OR VIP` and provides a four-case test matrix.
- Hands-on activities use a Trailhead Playground or sandbox with fictional data. No Salesforce connection, org mutation, or automated lab verification is included.
- The path is an applied foundation, not a complete certification preparation course.

## Shared platform

- Course/chapter/lesson metadata: `src/content/catalog.ts`.
- Original Exam P question bank: `src/content/exam-p/problems.ts`.
- New lesson content and questions: `src/content/exam-p/lessons.ts`, `src/content/salesforce/lessons.ts`.
- Shared lesson, practice, course overview, study desk, and simulator components: `src/components/learning` and `src/components/PracticeProblems.tsx`.
- Local progress is namespaced by course and schema version. It records explicit lesson completion, question attempts, retry history, scratch work, practice position, and last lesson.
- Progress is browser-local, with an in-memory fallback and visible notice if persistence is unavailable. No account sync is implemented.
- Existing `/chapter/...` links permanently redirect to the corresponding Exam P route. Invalid course/lesson paths return 404.
- AI tutor receives course context from a server allowlist and restricts conversation roles to user/assistant. The existing `OPENAI_API_KEY` configuration is still required.

## Validation

- `npm test`: probability/insurance math, question integrity, repeated exam composition, storage recovery, course isolation, and late/submitted exam answer rejection.
- `npx tsc --noEmit`: application type checking.
- `npm run build`: production compilation and route generation.
- Browser regression checks cover saved answers/scratch work, retries, completion, course isolation, redirects, route availability, exam resume/expiry, and mobile overflow.

## Sources and next work

- SOA November 2026 syllabus: https://www.soa.org/globalassets/assets/files/edu/2026/fall/syllabi/2026-11-exam-p-syllabus.pdf
- Salesforce official learning references are linked from individual lessons.
- Expand and independently review question difficulty and explanations before claiming comprehensive exam readiness. The original question bank was preserved, not fully re-audited.
- Add account-backed progress only when sign-in and cross-device sync are needed.
- Future Salesforce chapters can deepen Flow debugging, Apex/LWC, API integrations, and deployment practice. Snowflake follows afterward.
