'use client';

import { useRef, useState } from 'react';
import { CheckCircle2, CircleAlert, Play, Sparkles } from 'lucide-react';
import AITutor from '@/components/AITutor';
import { initialLabRules, labCases, runEmailCases, type LabRules } from '@/lib/learning/email-case';
import { trackActivity } from '@/lib/site-analytics';

const selectStyle = 'mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 p-3 text-base text-slate-100';

export default function EmailCaseLab({ aiEnabled }: { aiEnabled: boolean }) {
  const [rules, setRules] = useState<LabRules>(initialLabRules);
  const [run, setRun] = useState<ReturnType<typeof runEmailCases> | null>(null);
  const [coach, setCoach] = useState(false);
  const started = useRef(false);
  const passed = useRef(false);

  function start() {
    if (!started.current) {
      started.current = true;
      trackActivity('salesforce_lab_start');
    }
  }
  function edit<K extends keyof LabRules>(field: K, value: LabRules[K]) {
    start();
    setRules(previous => ({ ...previous, [field]: value }));
    setRun(null);
    setCoach(false);
  }
  function runCases() {
    start();
    const result = runEmailCases(rules);
    setRun(result);
    setCoach(false);
    if (result.every(test => test.passed) && !passed.current) {
      passed.current = true;
      trackActivity('salesforce_lab_pass');
    }
  }

  return <div className="space-y-6">
    <section className="rounded-xl border border-slate-700 bg-slate-900 p-5 sm:p-6" aria-labelledby="lab-inbox">
      <h2 id="lab-inbox" className="text-xl font-semibold">Three incoming emails</h2>
      <p className="mt-2 max-w-3xl leading-relaxed text-slate-300">One existing auto-response rule already acknowledges members. Set up the Flow so each person gets one reply and automated notifications are skipped. Everything runs on fictional records.</p>
      <ul className="mt-4 divide-y divide-slate-700">{labCases.map(item => <li key={item.id} className="py-3">
        <strong className="text-teal-200">{item.label}</strong>
        <p>{item.subject}</p>
        <span className="break-words text-sm text-slate-400">{item.account ? 'Linked Account and Contact' : 'No Account or Contact'} · Sender {item.sender}</span>
      </li>)}</ul>
    </section>
    <section className="rounded-xl border border-slate-700 bg-slate-900 p-5 sm:p-6" aria-labelledby="lab-rules">
      <h2 id="lab-rules" className="text-xl font-semibold">Choose the Flow rules</h2>
      <div className="my-5 grid gap-4 md:grid-cols-3">
        <label>Recipient when Contact.Email is blank
          <select className={selectStyle} value={rules.recipient} onChange={event => edit('recipient', event.target.value as LabRules['recipient'])}>
            <option value="contact">Leave the recipient empty</option><option value="fallback">Use Case.SuppliedEmail</option>
          </select>
        </label>
        <label>Cases the Flow acknowledges
          <select className={selectStyle} value={rules.flow} onChange={event => edit('flow', event.target.value as LabRules['flow'])}>
            <option value="all">All eligible cases</option><option value="unhandled">Only cases without a prior reply</option>
          </select>
        </label>
        <label>Automated senders
          <select className={selectStyle} value={rules.automated} onChange={event => edit('automated', event.target.value as LabRules['automated'])}>
            <option value="include">Process like a person</option><option value="skip">Skip automated notifications</option>
          </select>
        </label>
      </div>
      <button type="button" onClick={runCases} className="inline-flex items-center gap-2 rounded-lg bg-teal-300 px-5 py-3 font-semibold text-slate-950 hover:bg-teal-200"><Play size={17} /> Run the three cases</button>
    </section>
    <div aria-live="polite" className="text-xl font-semibold text-teal-200">{run && `${run.filter(row => row.passed).length} of 3 cases passed`}</div>
    {run && <>
      <section aria-label="Test results" className="grid gap-3">
        {run.map(row => <article key={row.id} className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h3 className="flex flex-wrap items-center gap-2 font-semibold">
            {row.passed ? <CheckCircle2 size={19} className="text-teal-300" /> : <CircleAlert size={19} className="text-amber-300" />}
            {row.label} · {row.passed ? 'Pass' : 'Needs a fix'}
          </h3>
          <p className="mt-2 text-sm text-slate-300">Expected {row.expected.length} {row.expected.length === 1 ? 'reply to ' + row.expected[0] : 'replies and an explicit skip'}. Actual <strong>{row.recipients.length} {row.recipients.length === 1 ? 'reply' : 'replies'}</strong>.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">{row.trace.map(line => <li key={line}>{line}</li>)}</ul>
          {!row.passed && <details className="mt-3 rounded-lg bg-slate-950 p-3">
            <summary className="cursor-pointer font-semibold text-teal-200">Hint for this case</summary>
            <p className="mt-2 text-slate-200">{row.hint}</p>
          </details>}
        </article>)}
      </section>
      <section aria-labelledby="lab-coach" className="rounded-xl border border-teal-800 bg-teal-950/45 p-5">
        <h2 id="lab-coach" className="flex items-center gap-2 text-xl font-semibold"><Sparkles size={19} /> Lab coach</h2>
        <p className="my-3 text-slate-200">{run.every(row => row.passed)
          ? 'All three cases meet the policy. What would you test if both email fields were empty?'
          : 'Pick a case that needs a fix. Which field or rule would you check next?'}</p>
        {aiEnabled && (coach ? <div className="h-[32rem] max-h-[78vh] overflow-hidden rounded-lg">
          <AITutor course="salesforce" labRules={rules} isOpen onToggle={() => setCoach(false)} />
        </div> : <button type="button" onClick={() => setCoach(true)} className="rounded-lg border border-teal-500 px-4 py-2 font-semibold text-teal-200">Ask the AI lab coach</button>)}
      </section>
    </>}
  </div>;
}
