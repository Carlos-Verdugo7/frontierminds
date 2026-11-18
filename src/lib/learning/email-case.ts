export type LabRules = {
  recipient: 'contact' | 'fallback';
  flow: 'all' | 'unhandled';
  automated: 'include' | 'skip';
};

export const initialLabRules: LabRules = { recipient: 'contact', flow: 'all', automated: 'include' };

export function validLabRules(value: unknown): value is LabRules {
  if (!value || typeof value !== 'object') return false;
  const r = value as Record<string, unknown>;
  return Object.keys(r).length === 3 && (r.recipient === 'contact' || r.recipient === 'fallback')
    && (r.flow === 'all' || r.flow === 'unhandled') && (r.automated === 'include' || r.automated === 'skip');
}

export const labCases = [
  { id: 'member', label: 'Member request', subject: 'Can you update my mailing address?', account: true, contact: 'alex@example.test', sender: 'alex@example.test', automated: false, expected: ['alex@example.test'], hint: 'The member rule already sent a reply before the Flow started. Which Flow entry condition would keep Alex from getting a second one?' },
  { id: 'inquiry', label: 'General inquiry', subject: 'How can I become a member?', account: false, contact: '', sender: 'sam@example.test', automated: false, expected: ['sam@example.test'], hint: 'Sam has no linked Contact. Which field still contains the address that came in with the email?' },
  { id: 'notice', label: 'Automated notification', subject: 'Automatic delivery notice', account: false, contact: '', sender: 'notices@example.test', automated: true, expected: [], hint: 'Look at the type of sender. Which rule would deliberately skip this message even if it had a usable reply address?' },
];

// An existing member auto-response runs before the proposed Flow in this exercise.
export function runEmailCases(rules: LabRules) {
  return labCases.map(record => {
    const recipients: string[] = [];
    const trace: string[] = [];
    if (record.account) {
      recipients.push(record.contact);
      trace.push('The existing member rule sent an acknowledgment to Contact.Email.');
    }
    if (rules.automated === 'skip' && record.automated) {
      trace.push('The Flow skipped this automated sender.');
    } else if (rules.flow === 'unhandled' && recipients.length > 0) {
      trace.push('The Flow skipped this case because the member rule already replied.');
    } else {
      if (record.automated) trace.push('The Flow treated an automated notification like a person.');
      const recipient = record.contact || (rules.recipient === 'fallback' ? record.sender : '');
      if (recipient) {
        recipients.push(recipient);
        trace.push('The Flow sent a reply using ' + (record.contact ? 'Contact.Email.' : 'Case.SuppliedEmail.'));
      } else {
        trace.push('Contact.Email was empty. The Flow had no recipient and sent no reply.');
      }
    }
    // A missing address can mask an incorrect sender rule. Check the required skip as well.
    const passed = recipients.length === record.expected.length
      && recipients.every((address, i) => address === record.expected[i])
      && (!record.automated || rules.automated === 'skip');
    return { id: record.id, label: record.label, recipients, expected: record.expected, trace, passed, hint: record.hint };
  });
}
