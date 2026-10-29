# Comunidad: West Palm Beach

The Spanish-first `/comunidad` section sits alongside the existing courses. Homepage navigation and a community introduction link to it.

The page follows four numbered sections: choose a resource, prepare with AI, read updates, and share feedback. Topic cards open one focused guide with steps, a preparation checklist, and agency contacts. Links such as `/comunidad#guia-escuela` select the corresponding guide and support browser back/forward navigation. The guide's AI action preselects that topic; changing the guide does not relabel an existing AI result. Longer program notes, AI explanations, and Analytics details sit in expandable disclosures.

## Publish guides and posts

Edit `src/content/community.ts`. Each guide has steps, preparation items, official source links, a contact, and an explicit review date. Check the linked official pages before changing the review date. Add editorial updates to `communityPosts`; they appear on the community page after the normal website deployment. This first version uses GitHub for publishing and has no browser-based editor.

Never put visitor emails, messages, or personal documents into this public repository. Visitor feedback is private email, not public comments.

## Email feedback

The form requires a reply email, topic, comment, and consent. It opens a mailto draft addressed to the existing site contact, `info@frontierminds.io`. Visitors must send it in their email application. Opening a draft does not confirm delivery. The page also displays the contact address when no email app is configured. There is no feedback database or automatic email service in this version.

## AI preparation helper

Uses the existing server-only `OPENAI_API_KEY` with `gpt-4o-mini`. No new dependencies. The independent `/api/community-help` endpoint accepts only allowlisted `topic` and `task` values; it sends the corresponding reviewed guide and a fixed task to OpenAI. Visitors can request simple steps, a preparation list, or bilingual questions. It receives no free-text visitor input or personal information. The page explains that AI has no live availability data and does not determine eligibility or submit applications. Missing API configuration and provider failures show a recoverable message while guides remain available.

Requests have a 1 KB streaming body cap, fixed input validation, a 25-second provider timeout, no automatic retries, no-store responses, and a best-effort global limit of 20 provider requests per minute per running instance. A distributed deployment should add a shared gateway rate limit and project usage limits; the in-memory counter is not shared across instances. `store: false` disables completion storage for this request; it does not imply zero provider retention. No visitor content is logged by the route.

## Understand what to improve with existing GA4

The section uses the existing root Google Analytics setup (`G-6CDFK61KQ8`); it does not add a second tracker. It emits these events when `window.gtag` is available:

| Event | Parameters | What it can tell you |
| --- | --- | --- |
| `community_guide_open` | topic | Which category cards people choose |
| `community_resource_click` | topic, resource (numeric source index) | Which official sources or contact actions they open |
| `community_helpfulness` | topic, value (`yes` or `needs_help`) | Which guides need clearer follow-through |
| `community_ai_request`, `community_ai_success`, `community_ai_error` | topic, task | Demand for AI preparation and completion reliability |
| `community_feedback_email_open` | topic | Draft-opening intent, not delivery |

All events include `language=es` and `area=west_palm_beach`, describing the page's audience, not an inferred visitor location. Register event-scoped custom dimensions for `topic`, `task`, and `value` in GA4 to compare them in Explore. `resource` can be registered as a custom metric. Compare guide interest with `needs_help` responses and official-link clicks to choose the next guide to improve. Feedback buttons limit voting within the current mounted page only; these are directional signals, not unique people or confirmed service outcomes.

Emails and message bodies are not custom-event parameters. The feedback fields and AI results are not put in URLs or browser storage. Review the existing GA4 property's enhanced-measurement and retention settings before public rollout; no account-level Analytics settings were changed here. Tracking may be blocked, so absence of events does not prove absence of need. Counts become available only after deployment and real usage.

## Verification

Run the repository checks: `npm test`, `npx tsc --noEmit`, and `npm run build`. Check `/` and `/comunidad` on a phone-sized viewport. Verify guide anchors, keyboard focus, official links, feedback validation/draft content, AI success, missing-key and failure states. In GA4 DebugView or browser network tools, verify topic events contain no email or comment text. Do not send a real email as a test without authorization.
