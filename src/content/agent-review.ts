export const reviewActions = [
  { id: 'use', label: 'Use the draft' },
  { id: 'revise', label: 'Revise the draft' },
  { id: 'route', label: 'Hand off to a specialist' },
] as const;

type Action = typeof reviewActions[number]['id'];
type Evidence = { id: string; source: string; body: string };
type ReviewCase = {
  id: string; title: string; request: string; draft: string; evidence: Evidence[]; search: string;
  action: Action; source: string; rationale: string; response: string;
};

export const reviewCases: ReviewCase[] = [
  {
    id: '1042', title: 'Document receipt', search: 'form received',
    request: '“Did the form I uploaded reach your team?”',
    draft: 'We received your form. Your case is open with the document review team.',
    evidence: [
      { id: 'K-14', source: 'Knowledge article', body: 'Customers can upload PDF files through the service portal.' },
      { id: 'C-1042', source: 'Case history', body: 'Intake form received. Case is open. Owner queue is Document Review.' },
      { id: 'R-02', source: 'Routing rule', body: 'Route unreadable attachments to Intake Support.' },
    ],
    action: 'use', source: 'C-1042',
    rationale: 'The case history confirms receipt, status and queue. The draft makes each of those three claims and stops there.',
    response: 'We received your form. Your case is open with the document review team.',
  },
  {
    id: '1058', title: 'Replacement delivery', search: 'delivery date',
    request: '“Can you tell me when my replacement card will arrive?”',
    draft: 'Your replacement card will arrive tomorrow.',
    evidence: [
      { id: 'C-1058', source: 'Case history', body: 'Mailing address verified. Customer prefers an email reply.' },
      { id: 'R-05', source: 'Routing rule', body: 'Route requests to change an address to Account Services.' },
      { id: 'K-21', source: 'Published delivery policy', body: 'A delivery date can be quoted only after a carrier scan. Before then, offer to check tracking.' },
    ],
    action: 'revise', source: 'K-21',
    rationale: 'The policy requires a carrier scan before quoting a date. The evidence contains no scan. A service rep can still offer a tracking check.',
    response: 'I can check the tracking status for you. Once the carrier posts a scan, I can share its estimated delivery date.',
  },
  {
    id: '1073', title: 'Decision dispute', search: 'review specialist',
    request: '“I disagree with the decision on my case. I want someone to review it.”',
    draft: 'I reviewed the decision and reversed it for you.',
    evidence: [
      { id: 'R-11', source: 'Dispute routing rule', body: 'Send disputed decisions to the Review Specialist queue. Only its assigned specialist can change a decision.' },
      { id: 'K-07', source: 'Knowledge article', body: 'Customers can check the status of an open case in the service portal.' },
      { id: 'C-1073', source: 'Case history', body: 'Customer prefers a written update. Previous message acknowledged.' },
    ],
    action: 'route', source: 'R-11',
    rationale: 'The routing rule reserves the decision for a review specialist. A routine rewrite would leave the required handoff undone.',
    response: 'I’ll send your request to the Review Specialist queue and ask for a written update.',
  },
];

export function checkReview(scenario: ReviewCase, action: string, record: string) {
  const actionCorrect = scenario.action === action;
  const evidenceCorrect = scenario.source === record;
  return { actionCorrect, evidenceCorrect, passed: actionCorrect && evidenceCorrect };
}
