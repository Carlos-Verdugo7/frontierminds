import type { Lesson } from '@/lib/learning/types';

/** Fictionalized, hands-on examples of an AI-assisted Salesforce release workflow. */
export const aiDeploymentLessons: Lesson[] = [
  {
    "id": "2.1",
    "title": "Turn a requirement into an AI-assisted implementation plan",
    "summary": "Use AI to clarify behavior, acceptance checks, and metadata before writing a Flow or Apex class.",
    "group": "foundation",
    "minutes": 25,
    "objectives": [
      "Separate a business request from an implementation choice.",
      "Create a metadata/dependency inventory and testable acceptance criteria.",
      "Use AI without exposing production data or accepting unreviewed changes."
    ],
    "blocks": [
      {
        "title": "Begin with the actual decision",
        "body": "Example (fictionalized from support operations): When a Case arrives from Email, send the appropriate acknowledgement. A Case with a linked Account takes the member path; otherwise it takes the general-inquiry path. First define how the recipient is resolved, whether missing email is allowed, and which existing automations already run. Do not start by asking AI to write code."
      },
      {
        "title": "Ask AI for a plan, not a blind patch",
        "body": "Provide object names, field API names, entry conditions, desired outcomes, current Flow/Apex behavior, and anonymized errors. Ask for alternative implementations (Flow, validation rule, Apex), assumptions, required permissions, environment differences, and a testing matrix. Review the recommendation against actual org metadata before editing anything."
      },
      {
        "title": "Build a change inventory",
        "body": "Inventory Flow versions, Apex classes, custom fields, email templates/alerts, permission sets, Named Credentials, and any referenced settings. Explicitly mark what must be deployed, what must be manually configured per org, and what is intentionally out of scope. An AI-generated list is only a hypothesis until checked against the org."
      },
      {
        "title": "Protect the data",
        "body": "Use synthetic records and redact personal information, API tokens, session identifiers, and internal endpoints from prompts, logs, and published examples. AI output is not an authorization to bypass access controls or change production. Keep a human-reviewed acceptance checklist."
      }
    ],
    "snippets": [
      {
        "title": "Reusable AI planning prompt",
        "language": "text",
        "code": "You are helping with a Salesforce change in a sandbox.\nBusiness need: [desired support behavior].\nObjects and field API names: [verified metadata].\nExisting automation: [Flow / Apex / assignment rules].\nEnvironments: Dev -> UAT -> Production.\nConstraints: [permissions, record types, integration limits].\nPlease return:\n1. Missing assumptions and acceptance criteria.\n2. Flow vs Apex recommendation, including tradeoffs.\n3. Metadata dependencies and environment-specific configuration.\n4. Positive, negative, bulk, and permission test cases.\n5. Deployment/rollback plan and things to verify manually.\nUse fictional data. Do not invent fields or claim an org was tested."
      }
    ],
    "example": {
      "question": "An email-created Case has no Contact or Account, but the design assumes a related Contact email address. What should be decided before implementation?",
      "solution": "Define a safe, permitted recipient fallback and behavior for missing/invalid addresses; verify org-supported email actions and existing email-to-case automation. Then write tests for both member and general-inquiry paths. AI should flag the unknown rather than fabricate a Contact."
    },
    "lab": [
      "Write a one-page requirement for a fictional email-to-Case acknowledgement (member path and general inquiry).",
      "Ask AI for a change inventory; verify each API name against a Playground or sandbox.",
      "Create an acceptance table: Account exists / missing, email exists / missing, entry conditions, expected recipient and action.",
      "List what the AI must never receive from your org (secrets, personal records, internal endpoints)."
    ],
    "problems": [
      {
        "id": 1,
        "question": "What is the best first input to an AI Salesforce engineering assistant?",
        "options": [
          "A request to deploy immediately",
          "A clear requirement with known metadata and expected behavior",
          "Production credentials",
          "An unfiltered customer export",
          "Only the desired button color"
        ],
        "correctIndex": 1,
        "explanation": "Well-defined outcomes, actual metadata, and constraints enable useful design and test generation.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "Planning"
      },
      {
        "id": 2,
        "question": "The AI recommends a field that does not exist in UAT. What should you do?",
        "options": [
          "Assume it will appear automatically",
          "Remove all tests",
          "Verify the metadata dependency and include it or revise the design",
          "Deploy directly to production",
          "Share an admin session token"
        ],
        "correctIndex": 2,
        "explanation": "AI can invent field names; dependencies must be verified in the target org.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "Dependencies"
      },
      {
        "id": 3,
        "question": "Which example is safe to provide to a public learning lab?",
        "options": [
          "Live customer cases",
          "An access token",
          "An internal API endpoint with credentials",
          "Synthetic Cases and redacted metadata examples",
          "A production data export"
        ],
        "correctIndex": 3,
        "explanation": "Synthetic data demonstrates the workflow without exposing confidential records.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "AI safety"
      }
    ],
    "source": {
      "title": "Salesforce CLI project commands",
      "url": "https://developer.salesforce.com/docs/platform/salesforce-cli-reference/guide/cli_reference_project.html"
    }
  },
  {
    "id": "2.2",
    "title": "Choose Flow or Apex and map dependencies",
    "summary": "Make a maintainable change by understanding automation boundaries and the metadata it references.",
    "group": "foundation",
    "minutes": 30,
    "objectives": [
      "Choose Flow, Apex, or a combination based on constraints.",
      "Identify referenced metadata and avoid hardcoded org-specific IDs.",
      "Review a small Apex callout client using a Named Credential."
    ],
    "blocks": [
      {
        "title": "Use the simplest approach that meets the requirement",
        "body": "For straightforward Case routing, field updates, and email decisions, consider a record-triggered Flow first. Prefer Apex when the requirement calls for complex transformations, reusable behavior, sophisticated error handling, or integration logic that Flow cannot express cleanly. Document interactions with assignment rules, other Flows, and triggers to prevent loops or duplicate actions."
      },
      {
        "title": "Dependency mapping before deploy",
        "body": "Draw arrows from callers to callees: Flow -> invocable Apex -> helper class -> Named Credential; or Flow -> email alert -> template/org-wide email settings. Track fields, record types, custom metadata, permission sets, and test classes. For classes referencing one another, deploy the related source together when the target org lacks required definitions; still fix genuine circular design problems rather than assuming a combined deploy makes them safe."
      },
      {
        "title": "Illustrative Apex integration seam",
        "body": "The example below is fictional and intentionally small. It uses a Named Credential alias instead of embedding a URL or token. A production client also needs explicit timeouts, handling of more response shapes and status codes, least-privilege execution, and an agreed retry/idempotency policy. Verify the Named Credential and principal access in each org."
      }
    ],
    "snippets": [
      {
        "title": "Illustrative Apex: TicketStatusClient.cls",
        "language": "apex",
        "code": "public with sharing class TicketStatusClient {\n    public class StatusException extends Exception {}\n\n    public static String fetchStatus(String ticketId) {\n        HttpRequest request = new HttpRequest();\n        request.setEndpoint('callout:Training_API/tickets/' +\n            EncodingUtil.urlEncode(ticketId, 'UTF-8'));\n        request.setMethod('GET');\n        request.setTimeout(10000);\n\n        HttpResponse response = new Http().send(request);\n        if (response.getStatusCode() != 200) {\n            throw new StatusException('Status service unavailable');\n        }\n\n        try {\n            Map<String, Object> payload =\n                (Map<String, Object>) JSON.deserializeUntyped(response.getBody());\n            if (payload == null ||\n                !(payload.get('status') instanceof String)) {\n                throw new StatusException('Missing status');\n            }\n            return (String) payload.get('status');\n        } catch (System.JSONException ex) {\n            throw new StatusException('Malformed response');\n        }\n    }\n}"
      }
    ],
    "example": {
      "question": "A Flow calls an invocable Apex action that references a helper class. UAT has neither class. What belongs in the release inventory?",
      "solution": "The Flow metadata, both Apex classes, their relevant tests, any referenced fields/configuration, and permissions. Resolve target-org dependencies and test the complete integration path. Avoid hardcoding org IDs or tokens."
    },
    "lab": [
      "Choose Flow or Apex for: Case routing, an external REST callout, and a complicated bulk transformation. Explain each choice.",
      "For the fictional client above, draw the dependency map including the Named Credential and its permission configuration.",
      "Ask AI to identify failure cases and refactor suggestions; independently check its answers.",
      "Write a deployment manifest checklist that includes the dependent metadata, not only the visible Flow."
    ],
    "problems": [
      {
        "id": 1,
        "question": "A simple Case priority routing rule is needed. What is a reasonable first implementation to evaluate?",
        "options": [
          "A record-triggered Flow",
          "A hardcoded production-only API",
          "An undocumented trigger per field",
          "A data export every minute",
          "A global admin permission"
        ],
        "correctIndex": 0,
        "explanation": "Simple declarative automation often fits Flow; evaluate conflicts with existing automation.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "Architecture"
      },
      {
        "id": 2,
        "question": "An Apex class calls a Named Credential that is missing in UAT. The best response is to:",
        "options": [
          "Embed a real token in source",
          "Ignore the integration test",
          "Remove UAT",
          "Provision and verify the credential plus required principal permissions",
          "Use a production org ID"
        ],
        "correctIndex": 3,
        "explanation": "Metadata and configuration dependencies include credentials and access, not just source code.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "Configuration"
      },
      {
        "id": 3,
        "question": "Two Apex classes reference one another and the deployment fails. Which action is most responsible?",
        "options": [
          "Disable validation",
          "Deploy relevant dependent classes together and investigate any actual circular design issue",
          "Retry without reading the error",
          "Delete their unit tests",
          "Run production first"
        ],
        "correctIndex": 1,
        "explanation": "Bundling related classes may solve missing-definition errors, but design cycles still need review.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "Dependencies"
      }
    ],
    "source": {
      "title": "Salesforce developer documentation",
      "url": "https://developer.salesforce.com/docs"
    }
  },
  {
    "id": "2.3",
    "title": "Generate meaningful Apex tests with AI",
    "summary": "Use HttpCalloutMock, assertions, and negative paths to prove behavior instead of chasing coverage alone.",
    "group": "foundation",
    "minutes": 35,
    "objectives": [
      "Write controlled HTTP callout mocks and assert business outcomes.",
      "Test non-200 responses, malformed JSON, and missing fields.",
      "Use Test.startTest/stopTest correctly, including for asynchronous work."
    ],
    "blocks": [
      {
        "title": "Mock the boundary, not the behavior being tested",
        "body": "Apex unit tests normally avoid real HTTP callouts. HttpCalloutMock supplies deterministic responses; the production parser and error logic still run. For a client that expects {\"status\":\"open\"}, test a successful response, HTTP failure, malformed body, and missing status. Assert values or exception behavior rather than merely executing lines."
      },
      {
        "title": "Use startTest and stopTest intentionally",
        "body": "Set up data first. Test.startTest() gives the test execution a separate set of governor limits; Test.stopTest() executes eligible asynchronous work queued in that interval. For a Queueable integration, register the mock, enqueue the job between these calls, then inspect the resulting records or side effects after stopTest. Follow Salesforce guidance when combining DML setup and mocked callouts."
      },
      {
        "title": "Coverage is a minimum gate, not a quality measure",
        "body": "Salesforce deployments involving Apex have coverage requirements, but a high number is not proof of correctness. Verify error handling, permission behavior, bulk limits, asynchronous boundaries, and expected record state. AI can propose tests; you must run them in the right org and review assertions."
      }
    ],
    "snippets": [
      {
        "title": "Illustrative Apex: TicketStatusClientTest.cls",
        "language": "apex",
        "code": "@IsTest\nprivate class TicketStatusClientTest {\n    private class StubResponse implements HttpCalloutMock {\n        private Integer statusCode;\n        private String body;\n\n        StubResponse(Integer statusCode, String body) {\n            this.statusCode = statusCode;\n            this.body = body;\n        }\n\n        public HttpResponse respond(HttpRequest request) {\n            System.assertEquals('GET', request.getMethod());\n            HttpResponse response = new HttpResponse();\n            response.setStatusCode(statusCode);\n            response.setBody(body);\n            return response;\n        }\n    }\n\n    @IsTest static void returnsStatus() {\n        Test.startTest();\n        Test.setMock(HttpCalloutMock.class,\n            new StubResponse(200, '{\"status\":\"open\"}'));\n        String result = TicketStatusClient.fetchStatus('T-101');\n        Test.stopTest();\n        System.assertEquals('open', result);\n    }\n\n    @IsTest static void rejectsHttpError() {\n        Test.startTest();\n        Test.setMock(HttpCalloutMock.class,\n            new StubResponse(503, '{}'));\n        try {\n            TicketStatusClient.fetchStatus('T-101');\n            System.assert(false, 'Expected StatusException');\n        } catch (TicketStatusClient.StatusException ex) {\n            System.assert(ex.getMessage().contains('unavailable'));\n        }\n        Test.stopTest();\n    }\n\n    @IsTest static void rejectsMalformedJson() {\n        Test.startTest();\n        Test.setMock(HttpCalloutMock.class,\n            new StubResponse(200, '{bad json'));\n        try {\n            TicketStatusClient.fetchStatus('T-101');\n            System.assert(false, 'Expected StatusException');\n        } catch (TicketStatusClient.StatusException ex) {\n            System.assert(ex.getMessage().contains('Malformed'));\n        }\n        Test.stopTest();\n    }\n}"
      },
      {
        "title": "AI test-review prompt",
        "language": "text",
        "code": "Review this anonymized Apex class and its tests.\nFind untested branches: success, non-2xx, malformed JSON, empty\nresponse, missing configuration, permission differences, bulk and async.\nFor each, give setup, execution, expected assertion, and why it matters.\nDo not optimize solely for coverage. Flag any uncertain Apex syntax."
      }
    ],
    "example": {
      "question": "An Apex test reaches 90% coverage but only asserts that no exception was thrown. Is it ready?",
      "solution": "Not necessarily. Assert returned data and persisted state; add negative responses, malformed and missing fields, permission-sensitive cases, and async effects as applicable. A passing percentage alone is insufficient."
    },
    "lab": [
      "Create the two fictional Apex classes in an isolated practice org, with a Named Credential called Training_API; do not send live requests from tests.",
      "Run the included tests, then add a missing-status mock case and verify it throws the documented exception.",
      "Ask AI for further negative scenarios and choose at least one that changes the code design.",
      "For a Queueable example, enqueue between startTest and stopTest, and assert a real record result after stopTest (not just job submission)."
    ],
    "problems": [
      {
        "id": 1,
        "question": "What is the purpose of HttpCalloutMock in a standard Apex unit test?",
        "options": [
          "Make a real HTTP call quicker",
          "Provide predictable fake HTTP responses without calling the service",
          "Bypass authentication in production",
          "Guarantee a successful deployment",
          "Replace all assertions"
        ],
        "correctIndex": 1,
        "explanation": "Mocks make the boundary deterministic while keeping parser and error logic under test.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "Mocks"
      },
      {
        "id": 2,
        "question": "Why wrap a Queueable invocation in Test.startTest()/Test.stopTest()?",
        "options": [
          "To hide test failures",
          "To disable governor limits",
          "To force eligible async work to run during the test and assert effects",
          "To avoid creating test data",
          "To skip callout mocks"
        ],
        "correctIndex": 2,
        "explanation": "Eligible async work queued inside the interval runs at stopTest so its outcome can be asserted.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "Async testing"
      },
      {
        "id": 3,
        "question": "Which test best improves confidence beyond coverage?",
        "options": [
          "A test with no assertions",
          "Only a happy-path mock",
          "One that catches any error and ignores it",
          "A 503 response that asserts the expected error handling",
          "A test that reads production cases"
        ],
        "correctIndex": 3,
        "explanation": "Negative-path assertions verify intended failure behavior.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "Quality"
      }
    ],
    "source": {
      "title": "Salesforce: testing HTTP callouts",
      "url": "https://developer.salesforce.com/docs/platform/apex-dev/references/apex-dev/apex-classes-restful-http-testing-httpcalloutmock.html"
    }
  },
  {
    "id": "2.4",
    "title": "Use AI to troubleshoot deployment errors",
    "summary": "Diagnose missing metadata, compilation failures, configuration drift, and failed tests using evidence.",
    "group": "foundation",
    "minutes": 25,
    "objectives": [
      "Categorize errors before changing code.",
      "Recognize missing metadata and cross-class dependency failures.",
      "Give AI a sanitized diagnostic packet and verify each proposed fix."
    ],
    "blocks": [
      {
        "title": "Classify the failure",
        "body": "Compilation: unknown type, wrong method signature, invalid field, or access modifier. Metadata: Flow references a missing template, Apex action, custom field, or permission set. Configuration: Named Credential or principal missing in the target org. Test: assertion failed, unexpected automation, limits, or no mock. For each case, separate actual cause from the failing symptom."
      },
      {
        "title": "Create a minimal, useful diagnostic packet",
        "body": "Provide the exact redacted error, file/line, changed component list, API versions, target environment (not secrets), and related sanitized code. Ask AI for a ranked hypothesis list and a verification step for each. When a dependency is absent in UAT, compare source metadata and target state before deploying more changes."
      },
      {
        "title": "Repair safely",
        "body": "Deploy related Apex definitions together when missing-class compilation order is the issue. If a true dependency cycle or trigger recursion exists, refactor it. Never remove tests, turn off security, ignore deployment conflicts, or force a production deploy just to silence an error. Rerun relevant tests and preserve an evidence trail."
      }
    ],
    "snippets": [
      {
        "title": "AI debugging prompt",
        "language": "text",
        "code": "Deployment target: [Dev or UAT sandbox].\nError (redacted): [exact message and line].\nChanged metadata: [files and API names].\nAlready present in target: [verified items].\nTest results: [failures and relevant assertions].\nReturn:\n- Top 3 possible causes, ranked by evidence.\n- What to inspect before editing.\n- Smallest safe fix and affected dependencies.\n- Tests to rerun and how to verify the fix.\nDo not recommend disabling tests or weakening permissions."
      }
    ],
    "example": {
      "question": "A Flow deploy fails with a reference to an unknown Apex action. The action's class exists in Dev but not UAT. What is the next move?",
      "solution": "Confirm the invocable class and its dependencies are in the release scope, check any org-specific configuration, and validate them together in UAT. If the action signature changed, update the Flow and its tests accordingly."
    },
    "lab": [
      "Write down three fictional failures: missing custom field, Apex unknown type, and a test assertion mismatch.",
      "For each, create a minimal sanitized error packet and ask AI for likely causes plus verification commands.",
      "Rank fixes from low to high risk; explain why bypassing tests is not an acceptable shortcut.",
      "Document which errors can be addressed by including metadata and which demand a code/logic change."
    ],
    "problems": [
      {
        "id": 1,
        "question": "An unknown field error appears only in UAT. What should you inspect first?",
        "options": [
          "Whether the field is deployed and has the expected API name",
          "The homepage color",
          "The test coverage headline only",
          "The user's browser history",
          "Production credentials"
        ],
        "correctIndex": 0,
        "explanation": "The target org may be missing or have a different version of referenced metadata.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "Troubleshooting"
      },
      {
        "id": 2,
        "question": "What is most useful to share with an AI debugger?",
        "options": [
          "An unredacted session token",
          "Only 'it failed'",
          "The exact redacted error, relevant files, environment, and known dependencies",
          "An entire private customer export",
          "A production admin password"
        ],
        "correctIndex": 2,
        "explanation": "Specific sanitized evidence allows focused diagnosis without leaking data.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "AI debugging"
      },
      {
        "id": 3,
        "question": "After fixing a missing dependency, what should follow?",
        "options": [
          "Immediately declare success",
          "Ignore the next error",
          "Disable validation",
          "Rerun validation and appropriate tests",
          "Delete change history"
        ],
        "correctIndex": 3,
        "explanation": "Fixes must be revalidated against the target environment.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "Verification"
      }
    ],
    "source": {
      "title": "Salesforce: deployment CLI reference",
      "url": "https://developer.salesforce.com/docs/platform/salesforce-cli-reference/guide/cli_reference_project_deploy_start.html"
    }
  },
  {
    "id": "2.5",
    "title": "Validate releases across Dev, UAT, and Production",
    "summary": "Practice a Salesforce CLI deployment path with sandbox dry runs and production validation gates.",
    "group": "foundation",
    "minutes": 35,
    "objectives": [
      "Distinguish development, UAT, and production release checkpoints.",
      "Use sandbox dry-run and production validation commands appropriately.",
      "Understand test levels, approvals, release scope, and quick-deploy constraints."
    ],
    "blocks": [
      {
        "title": "Dev: build and prove the unit",
        "body": "Use source control and a Salesforce DX project. Deploy scoped metadata to Dev, run unit tests, inspect Flow outcomes, and review the diff. Keep the manifest aligned with actual dependencies. AI can prepare commands and explain failures, but the engineer confirms the target alias and executes authorized deployments."
      },
      {
        "title": "UAT: dry-run, then test the business behavior",
        "body": "For a sandbox, use sf project deploy start --dry-run with an explicit test level to validate without persisting metadata. When the dry run passes and change approval allows, deploy to UAT, run scenario tests with realistic roles and fictional data, and capture sign-off. Sandbox dry-run is distinct from the production-oriented sf project deploy validate command."
      },
      {
        "title": "Production: approve and validate",
        "body": "For production, use sf project deploy validate with the full manifest and appropriate tests, then inspect its result and job ID. After approval and successful validation, sf project deploy quick can use that job ID (Salesforce currently documents a 10-day validity window). If the payload or target state has changed, revalidate rather than assuming an earlier check still applies. A CLI success is not business acceptance."
      },
      {
        "title": "Commands are examples, not automatic execution",
        "body": "Run these only inside a valid Salesforce DX project with authorized org aliases and a real package.xml. The commands below are educational examples and have not been executed against any connected org. Permissions, test requirements, release gates, and org-specific configuration vary."
      }
    ],
    "snippets": [
      {
        "title": "Example Salesforce CLI release sequence",
        "language": "bash",
        "code": "# Confirm your aliases before deploying:\nsf org list\n\n# Dev: deploy and execute local tests.\nsf project deploy start --target-org dev \\\n  --manifest manifest/package.xml --test-level RunLocalTests\n\n# UAT sandbox: validate with tests, without saving changes.\nsf project deploy start --target-org uat \\\n  --manifest manifest/package.xml --dry-run --test-level RunLocalTests\n\n# UAT: actual deploy only after the dry run and approval.\nsf project deploy start --target-org uat \\\n  --manifest manifest/package.xml --test-level RunLocalTests\n\n# Production: validation only; inspect successful result/job ID.\nsf project deploy validate --target-org prod \\\n  --manifest manifest/package.xml --test-level RunLocalTests\n\n# Production: after approval, quick-deploy the validated payload.\nsf project deploy quick --target-org prod \\\n  --job-id VALIDATION_JOB_ID"
      },
      {
        "title": "Release gate checklist",
        "language": "text",
        "code": "[ ] Requirements/metadata scope reviewed\n[ ] Source diff reviewed; secrets excluded\n[ ] Apex/Flow tests and negative paths pass\n[ ] Dev behavior demonstrated\n[ ] UAT dry run and business scenarios pass\n[ ] Permission sets and credentials verified per org\n[ ] Business owner approves production release\n[ ] Production validation passes with required tests\n[ ] Deployment job/result captured\n[ ] Post-release smoke tests and rollback plan ready"
      }
    ],
    "example": {
      "question": "Someone suggests using sf project deploy validate --target-org uat as the routine sandbox validation command. What do the current Salesforce docs recommend?",
      "solution": "For sandbox validation with tests, use sf project deploy start --dry-run --test-level RunLocalTests. Salesforce documents sf project deploy validate as production-oriented. Never infer that a successful UAT test automatically validates production."
    },
    "lab": [
      "In a local Salesforce DX project, generate a manifest for a fictional Flow and its Apex dependencies.",
      "Write the Dev, UAT, and production commands with explicit aliases. Explain how you would confirm each alias.",
      "Describe required approval and acceptance evidence between UAT and production; do not execute a live deployment for this exercise.",
      "Explain what would force you to revalidate after an earlier successful production validation."
    ],
    "problems": [
      {
        "id": 1,
        "question": "Which command is appropriate for a sandbox test validation without saving metadata?",
        "options": [
          "sf project deploy start --dry-run --target-org uat --manifest manifest/package.xml --test-level RunLocalTests",
          "sf project deploy quick --target-org uat",
          "sf org delete scratch",
          "sf project retrieve start --target-org prod",
          "sf project deploy start --ignore-errors --target-org prod"
        ],
        "correctIndex": 0,
        "explanation": "Salesforce recommends deploy start with --dry-run for sandbox validations with tests.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "CLI validation"
      },
      {
        "id": 2,
        "question": "What does a successful production validation prove?",
        "options": [
          "All users love the new feature",
          "Permissions and business outcomes need no checks",
          "The release is technically valid for the checked payload and test level, not that all business scenarios are proven",
          "The payload can be changed without revalidation",
          "All future releases are safe"
        ],
        "correctIndex": 2,
        "explanation": "Validation verifies a deployment with tests but does not replace UAT and smoke testing.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "Release quality"
      },
      {
        "id": 3,
        "question": "Before using production quick deploy, what is required?",
        "options": [
          "An old job ID from any org",
          "A successful relevant production validation and appropriate approval",
          "Skipping test results",
          "Hardcoded credentials in the repository",
          "A new undocumented Flow"
        ],
        "correctIndex": 1,
        "explanation": "Quick deploy uses the successful validation job; ensure the payload and approval remain applicable.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "Production"
      }
    ],
    "source": {
      "title": "Salesforce: project deploy validate",
      "url": "https://developer.salesforce.com/docs/platform/salesforce-cli-reference/guide/cli_reference_project_deploy_validate.html"
    }
  },
  {
    "id": "2.6",
    "title": "Verify outcomes after deployment and hand off the release",
    "summary": "A successful metadata deploy is the start of production verification, not the end.",
    "group": "foundation",
    "minutes": 30,
    "objectives": [
      "Design a post-deploy smoke test for real user roles.",
      "Capture release evidence, monitoring, and rollback decisions.",
      "Use AI for a transparent handoff without claiming tests it never ran."
    ],
    "blocks": [
      {
        "title": "Check what users actually do",
        "body": "After a release, confirm the feature using the intended agent/manager personas, not just an administrator. For a fictional Case acknowledgement, create a safe test Case with and without Account, confirm the email action/recipient, examine relevant logs, and ensure no duplicate response. Check object/field access, queues, email deliverability, and integration principal access."
      },
      {
        "title": "Monitor and plan rollback",
        "body": "Watch logs, failed Flow interviews, exceptions, scheduled jobs, queue backlog, and customer-visible outcomes relevant to the change. Preserve the last known-good source and a documented rollback path. A rollback may require configuration and/or compensating data actions; redeploying older metadata is not always sufficient. Define owners and escalation triggers before production."
      },
      {
        "title": "Give AI the evidence, not a success narrative",
        "body": "Ask AI to summarize actual commands, test results, UAT sign-off, deployed components, known risks, and post-release findings. Label unrun steps clearly. AI may help write the release note or investigate a failure, but it cannot independently certify deployment or business success without evidence."
      }
    ],
    "snippets": [
      {
        "title": "Handoff template and AI summarization prompt",
        "language": "text",
        "code": "Change: [brief requirement]\nScope: [metadata components and dependencies]\nDev checks: [executed commands and results]\nUAT checks: [scenarios, roles, results, approver]\nProduction validation: [result, job ID, test level]\nDeployment: [date, operator, result]\nSmoke tests: [scenario, persona, observed result]\nMonitoring owner: [name/role]\nKnown limitations: [specific]\nRollback/escalation: [steps and decision trigger]\n\nAI: Turn the verified entries above into a concise handoff.\nDo not claim any missing or unrun item passed."
      }
    ],
    "example": {
      "question": "A deployment completed successfully, but agents cannot access the new Case action. Is the release done?",
      "solution": "No. Verify permission sets, object/field access, action visibility, and relevant Flow/Apex execution permissions with a representative agent. Record the failure and remediate or roll back according to the release plan."
    },
    "lab": [
      "Write a smoke-test matrix for an email-to-Case flow: member/general inquiry, valid/missing recipient, agent/admin permissions, and duplicate prevention.",
      "Prepare a handoff using only observed evidence, with 'not run' for incomplete tests.",
      "Create a risk trigger (e.g., duplicate acknowledgements) and describe who decides whether to pause or roll back.",
      "Ask AI to peer review the handoff for unsupported claims and missing verification."
    ],
    "problems": [
      {
        "id": 1,
        "question": "A successful metadata deployment returns no errors, but a standard agent cannot use the action. What is the right conclusion?",
        "options": [
          "The feature is complete",
          "Permission and functional verification are still required",
          "Give all agents administrator access",
          "Ignore the user",
          "Delete the Flow"
        ],
        "correctIndex": 1,
        "explanation": "Deployment success does not guarantee access or working business behavior.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "Smoke tests"
      },
      {
        "id": 2,
        "question": "What belongs in an honest AI-assisted release handoff?",
        "options": [
          "Only the phrase 'works great'",
          "Inferred test results",
          "No mention of limitations",
          "Actual deployment evidence, business tests, owners, and rollback steps",
          "A production credential"
        ],
        "correctIndex": 3,
        "explanation": "A traceable handoff distinguishes verified results from proposed work.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "Handoff"
      },
      {
        "id": 3,
        "question": "Which statement about rollback is most accurate?",
        "options": [
          "It is always a one-click metadata revert",
          "It requires no preparation",
          "It can involve metadata, config, and data correction, so the plan must be specific",
          "Only AI can approve it",
          "It is never necessary after tests"
        ],
        "correctIndex": 2,
        "explanation": "Org configuration and data effects may outlive a metadata rollback.",
        "hint": "Identify the requirement, the risk, and the evidence that proves the change works.",
        "topic": "Operations"
      }
    ],
    "source": {
      "title": "Salesforce: project deploy report",
      "url": "https://developer.salesforce.com/docs/platform/salesforce-cli-reference/guide/cli_reference_project_deploy_report.html"
    }
  }
];
