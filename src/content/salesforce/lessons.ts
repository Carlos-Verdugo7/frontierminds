import type { Lesson } from '@/lib/learning/types';
export const lessons: Lesson[] = [
  {
    id: '1.1',
    title: 'Model a customer-support workspace',
    summary:
      'Connect business questions to objects, fields, records, and relationships.',
    group: 'foundation',
    minutes: 20,
    objectives: [
      'Explain the role of Account, Contact, and Case.',
      'Choose a field or a related object based on the requirement.',
    ],
    blocks: [
      {
        title: 'Start with the business',
        body: 'A support team needs to know who reported an issue, which customer it affects, its current status, and who owns the next action. Model these questions before adding fields.',
      },
      {
        title: 'Objects and records',
        body: 'An object defines a kind of record and its fields. An Account represents a customer organization in this project; a Contact represents a person; a Case represents a support issue. A field such as Priority stores one attribute of a record.',
      },
      {
        title: 'Relationships',
        body: 'A lookup connects records without implying the same ownership and deletion behavior as a master-detail relationship. Use a separate related object for a repeating collection, such as many inspections, rather than adding Inspection1, Inspection2, and Inspection3 fields.',
      },
    ],
    example: {
      question:
        'A customer can report many issues, and each issue needs its own owner and status. How should you model this?',
      solution:
        'Use an Account with related Cases. Each Case has its own lifecycle. Keep contact details on Contact records and relate the reporting contact to the Case.',
    },
    lab: [
      'In a Trailhead Playground, create a fictional Account and Contact.',
      'Create two Cases related to that customer, with different subjects and priorities.',
      'List which information belongs to the customer and which belongs to each issue. Use fictional data.',
    ],
    problems: [
      {
        id: 1,
        question: 'Where should the status of one support issue live?',
        options: [
          'Account name',
          'Contact email',
          'Case Status',
          'A new org',
          'A user password',
        ],
        correctIndex: 2,
        explanation:
          'Case Status describes the lifecycle of that individual issue.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Data modeling',
      },
      {
        id: 2,
        question:
          'A customer can have many inspections. Which model supports this cleanly?',
        options: [
          'Three fixed inspection fields',
          'A related Inspection object',
          'One giant text field',
          'One Account per inspection',
          'A profile per inspection',
        ],
        correctIndex: 1,
        explanation:
          'A related object supports a variable number of records and independent reporting.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Relationships',
      },
      {
        id: 3,
        question: 'What is a record?',
        options: [
          'The definition of all fields',
          'One instance of an object',
          'A permission set',
          'A deployment',
          'A dashboard filter',
        ],
        correctIndex: 1,
        explanation:
          'An object defines the structure; a record is one instance, such as a particular Case.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Platform concepts',
      },
    ],
    source: {
      title: 'Trailhead: Data Modeling',
      url: 'https://trailhead.salesforce.com/content/learn/modules/data_modeling',
    },
  },
  {
    id: '1.2',
    title: 'Design access deliberately',
    summary:
      'Separate permissions to use an object from access to individual records.',
    group: 'foundation',
    minutes: 20,
    objectives: [
      'Distinguish object, field, and record access.',
      'Explain a minimal-access support design.',
    ],
    blocks: [
      {
        title: 'Three questions',
        body: 'Can this user read the Case object? Can they read this particular field? Can they access this specific record? These are different questions, and a page layout is not a substitute for field-level security.',
      },
      {
        title: 'Grant capability',
        body: 'Profiles and permission sets govern capabilities such as object and field access. Permission sets can add capabilities for a job function. Treat broad bypass permissions such as View All as deliberate exceptions.',
      },
      {
        title: 'Grant record access',
        body: 'Organization-wide defaults establish baseline record access. Ownership, hierarchy, and sharing mechanisms can extend record access, depending on the object and configuration. Sharing a record does not by itself grant missing object permissions.',
      },
    ],
    example: {
      question:
        'An agent can read Cases but should not see a sensitive custom field. Is hiding it on the page layout enough?',
      solution:
        'No. Restrict field-level access for that user. Layouts control presentation, while field-level security controls access to the field. Verify with a representative test user.',
    },
    lab: [
      'Write an access matrix for Agent and Manager: Case read/edit and a sensitive field.',
      'In a Playground, inspect the relevant permission sets and field permissions.',
      'Test the intended access with a non-admin user; do not infer it from an administrator session.',
    ],
    problems: [
      {
        id: 1,
        question: 'Which mechanism should protect a sensitive field?',
        options: [
          'Page layout only',
          'Field-level security',
          'A dashboard color',
          'A naming convention',
          'A help-text warning',
        ],
        correctIndex: 1,
        explanation:
          'Field-level security controls access. Removing a field from one layout is insufficient.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Field access',
      },
      {
        id: 2,
        question:
          'A user lacks object Read permission. Does sharing one record grant object Read?',
        options: [
          'Always',
          'Only on Mondays',
          'No',
          'Only for text fields',
          'Only if the record is old',
        ],
        correctIndex: 2,
        explanation:
          'Object permission and record access are separate requirements.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Access layers',
      },
      {
        id: 3,
        question: 'What should you use to verify an agent access design?',
        options: [
          'Only an admin login',
          'A representative non-admin test user',
          'A screenshot of the layout',
          'The number of records',
          'The org name',
        ],
        correctIndex: 1,
        explanation:
          'An administrator may have privileges the agent does not, so test as the intended persona.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Access testing',
      },
    ],
    source: {
      title: 'Trailhead: Data Security',
      url: 'https://trailhead.salesforce.com/content/learn/modules/data_security',
    },
  },
  {
    id: '1.3',
    title: 'Route cases with Flow',
    summary: 'Translate a written routing policy into a decision you can test.',
    group: 'foundation',
    minutes: 20,
    objectives: [
      'Write explicit entry conditions and decision outcomes.',
      'Choose the appropriate timing for a record-triggered flow.',
    ],
    blocks: [
      {
        title: 'Write the policy',
        body: 'In this project, a High-priority Case OR a VIP customer goes to Escalations. Everything else goes to Standard Support. Write a truth table before building the automation.',
      },
      {
        title: 'Choose timing',
        body: 'A before-save record-triggered flow is appropriate for fast updates to fields on the triggering record. After-save automation is used when the work requires related records or actions unavailable before save. Check existing assignment rules and automation before introducing competing ownership updates.',
      },
      {
        title: 'Plan failures and changes',
        body: 'Specify whether routing runs at creation, when qualifying fields change, or both. Test re-entry behavior. Use fault paths where supported and document what the team should do when an action fails. Resolve queues by configuration rather than copying IDs between orgs.',
      },
    ],
    example: {
      question:
        'A normal-priority Case belongs to a VIP customer. Which queue should receive it under this policy?',
      solution:
        'Escalations: the VIP condition is true, and the policy uses OR. If you accidentally used AND, this case would route incorrectly.',
    },
    lab: [
      'Use the route simulator to test all four combinations of High/not High and VIP/not VIP.',
      'In a Playground, create a flow draft with matching decisions. Use Debug with rollback where supported.',
      'Document interactions with existing case assignment rules before activating anything.',
    ],
    problems: [
      {
        id: 1,
        question:
          'High priority is false and VIP is true. For High OR VIP, which route applies?',
        options: [
          'Standard Support',
          'Escalations',
          'Delete the case',
          'No route',
          'Random assignment',
        ],
        correctIndex: 1,
        explanation: 'False OR true is true, so the escalation route applies.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Flow decisions',
      },
      {
        id: 2,
        question:
          'You need only to update a field on the triggering record. Which timing is usually appropriate?',
        options: [
          'Before-save',
          'A nightly export',
          'A dashboard refresh',
          'Only Apex',
          'An email template',
        ],
        correctIndex: 0,
        explanation:
          'Before-save flows support efficient same-record field updates. Check action requirements for other work.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Flow timing',
      },
      {
        id: 3,
        question:
          'Before adding ownership automation, what should you inspect?',
        options: [
          'Only the logo',
          'Existing flows and assignment rules',
          'Only record count',
          'Only user names',
          'The company website',
        ],
        correctIndex: 1,
        explanation:
          'Multiple automation mechanisms can update ownership; understand their interactions first.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Automation design',
      },
    ],
    simulator: 'salesforce',
    source: {
      title: 'Trailhead: Flow Basics',
      url: 'https://trailhead.salesforce.com/content/learn/modules/flow-basics',
    },
  },
  {
    id: '1.4',
    title: 'Reports that answer operational questions',
    summary:
      'Choose the records and grouping needed for a useful support report.',
    group: 'foundation',
    minutes: 20,
    objectives: [
      'Define a report question and its record population.',
      'Explain how report types, filters, and access affect results.',
    ],
    blocks: [
      {
        title: 'Define the measure',
        body: 'Start with a precise question, such as: how many open Cases does each queue own now? Define open, identify the owner field, and decide whether all Cases or a subset belong in the report.',
      },
      {
        title: 'Choose a report type',
        body: 'A report type controls the objects and relationships available. Relationship choices can exclude records without children. Filters further narrow the population; grouping summarizes it.',
      },
      {
        title: 'Validate the result',
        body: 'Compare a small set of known records against the report. Check date filters, closed-status filters, and access. Dashboard visibility depends on its running-user configuration, so verify who sees which data.',
      },
    ],
    example: {
      question:
        'A report shows fewer open Cases than expected. What should you check first?',
      solution:
        'Check the report type and filters, then the viewer’s record access. Use a few known Cases to isolate which condition excludes them. Do not assume the data is missing.',
    },
    lab: [
      'Create a Cases report in a Playground and filter to open records.',
      'Group by owner and add a record count.',
      'Close one test Case and confirm that the report count changes as expected after refresh.',
    ],
    problems: [
      {
        id: 1,
        question:
          'What determines the objects and relationships available in a report?',
        options: [
          'Report type',
          'Dashboard color',
          'User photo',
          'Browser zoom',
          'Email signature',
        ],
        correctIndex: 0,
        explanation: 'The report type defines the reporting data structure.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Reporting',
      },
      {
        id: 2,
        question:
          'What is a good first check when records are absent from a report?',
        options: [
          'Delete and re-create them',
          'Filters, report type, and access',
          'Change the company logo',
          'Export all data immediately',
          'Disable security',
        ],
        correctIndex: 1,
        explanation:
          'Each of these can legitimately restrict which records appear.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Report validation',
      },
      {
        id: 3,
        question: 'For open Case workload by owner, which summary is useful?',
        options: [
          'Record count grouped by owner',
          'Sum of Contact names',
          'Average Case ID',
          'Maximum password length',
          'A random sample only',
        ],
        correctIndex: 0,
        explanation:
          'Counts by owner describe the distribution of open workload.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Operational metrics',
      },
    ],
    source: {
      title: 'Trailhead: Reports and Dashboards',
      url: 'https://trailhead.salesforce.com/content/learn/modules/lex_implementation_reports_dashboards',
    },
  },
  {
    id: '1.5',
    title: 'Developer & integration foundations',
    summary:
      'Understand when to use queries, code, and APIs in a support workflow.',
    group: 'foundation',
    minutes: 20,
    objectives: [
      'Read a simple SOQL query.',
      'Explain bulk processing and duplicate-safe integrations.',
    ],
    blocks: [
      {
        title: 'Query intentionally',
        body: 'SOQL retrieves Salesforce records and selected fields. Example: SELECT Id, Subject, Status FROM Case WHERE IsClosed = false LIMIT 20. Choose only necessary fields and respect the access requirements of the execution context.',
      },
      {
        title: 'Think in collections',
        body: 'Salesforce code runs within transaction limits. Avoid SOQL or DML inside a loop over records; collect identifiers, query related data once where practical, and perform bulk operations. Tests should include multiple records and failures.',
      },
      {
        title: 'Design for retries',
        body: 'An integration can receive the same event twice. A stable external identifier and an upsert strategy can prevent duplicate records. Authentication, permissions, error responses, retry policy, and auditability are part of the integration design.',
      },
    ],
    example: {
      question:
        'An external system retries creation of the same Case after a timeout. How can you avoid duplicates?',
      solution:
        'Store a stable external ticket identifier in an appropriately configured external ID field and design an upsert flow around it. Confirm uniqueness and handle conflicts; do not use the subject text as the identity.',
    },
    lab: [
      'In a Playground query tool, run the sample SOQL query against fictional Cases.',
      'Sketch how a batch of 200 incoming tickets would be processed without a query per ticket.',
      'Write a retry scenario and identify the field that gives each external ticket a stable identity.',
    ],
    problems: [
      {
        id: 1,
        question: 'Which query selects open Cases?',
        options: [
          'SELECT Id FROM Case WHERE IsClosed = false',
          'SELECT ALL CASES',
          'GET Case OPEN',
          'SELECT Password FROM Case',
          'DELETE FROM Case',
        ],
        correctIndex: 0,
        explanation:
          'The SOQL query selects Case identifiers and filters on the boolean IsClosed field.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'SOQL',
      },
      {
        id: 2,
        question: 'Which design reduces repeated SOQL work?',
        options: [
          'Query once per record in a loop',
          'Collect IDs and query related records in bulk',
          'Query every object',
          'Ignore transaction limits',
          'Retry forever',
        ],
        correctIndex: 1,
        explanation:
          'Bulk processing works on collections and avoids unnecessary per-record database operations.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Bulk processing',
      },
      {
        id: 3,
        question:
          'What helps a retried integration avoid creating duplicate tickets?',
        options: [
          'Random names',
          'Stable external identifier and upsert',
          'A longer subject',
          'A new user each time',
          'A dashboard',
        ],
        correctIndex: 1,
        explanation:
          'The integration needs a durable identity to recognize a previously processed ticket.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Integration design',
      },
    ],
    source: {
      title: 'Salesforce developer documentation',
      url: 'https://developer.salesforce.com/docs',
    },
  },
  {
    id: '1.6',
    title: 'Capstone: a support intake workflow',
    summary: 'Bring the data model, security, routing, and reporting together.',
    group: 'foundation',
    minutes: 20,
    objectives: [
      'Build an end-to-end workflow in a practice org.',
      'Define acceptance checks before activating automation.',
    ],
    blocks: [
      {
        title: 'The brief',
        body: 'Build a fictional support workspace with Accounts, Contacts, and Cases. Each Case needs a subject, priority, owner, and status. Add a customer-tier field only if your model needs it, and document where it belongs.',
      },
      {
        title: 'Acceptance checks',
        body: 'A High-priority or VIP Case routes to Escalations. Other Cases route to Standard Support. An agent sees the intended records and fields. The open workload report groups Cases by owner and excludes closed Cases.',
      },
      {
        title: 'Release thoughtfully',
        body: 'Use a Playground or sandbox and fictional records. Keep a change inventory. Test creation, updates, bulk input, and failure paths. A completed checklist documents your own practice; it is not automated verification of a connected Salesforce org.',
      },
    ],
    example: {
      question:
        'Routing passes for new Cases, but changing an existing Case to High does nothing. Is the project complete?',
      solution:
        'Only if the agreed policy applies solely at creation. If updates should reroute, the entry conditions and update behavior need adjustment and another test. Requirements determine correctness.',
    },
    lab: [
      'Create one test Case for each routing combination and record expected vs observed owners.',
      'Verify sensitive-field access as the agent persona.',
      'Verify the open workload report before and after closing a Case.',
      'Write a short handoff: configuration changed, tests run, known limitations, and rollback steps.',
    ],
    problems: [
      {
        id: 1,
        question: 'What determines whether a Case update should reroute it?',
        options: [
          'The agreed routing requirements',
          'The page color',
          'The Case number alone',
          'The current month',
          'The number of admins',
        ],
        correctIndex: 0,
        explanation:
          'Creation and update behavior must follow an explicit business requirement.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Acceptance criteria',
      },
      {
        id: 2,
        question: 'Where should you complete this practice project?',
        options: [
          'A production org with real customer data',
          'A Playground or sandbox with fictional data',
          'An unapproved public dataset of customer records',
          'An email inbox only',
          'A spreadsheet of passwords',
        ],
        correctIndex: 1,
        explanation:
          'An isolated practice environment supports learning and repeatable tests.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Practice environment',
      },
      {
        id: 3,
        question: 'Which handoff is most useful?',
        options: [
          'It works',
          'Configuration changes, test results, limitations, and rollback steps',
          'A screenshot only',
          'A list of colors',
          'Only the author’s name',
        ],
        correctIndex: 2,
        explanation:
          'A useful handoff helps another person understand, validate, and maintain the solution.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Project handoff',
      },
    ],
    simulator: 'salesforce',
  },
];
