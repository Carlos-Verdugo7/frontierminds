'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, FileText } from 'lucide-react';
import { checkReview, reviewActions, reviewCases } from '@/content/agent-review';
import RecordSearch from './RecordSearch';
import styles from './lab.module.css';

type Decision = { action: string; record: string; checked: boolean };
const blank: Decision = { action: '', record: '', checked: false };

export default function ResponseReview() {
  const [active, setActive] = useState(0);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const caseHeading = useRef<HTMLHeadingElement>(null);
  const scenario = reviewCases[active];
  const decision = decisions[scenario.id] ?? blank;
  const result = checkReview(scenario, decision.action, decision.record);
  function passed(index: number) {
    const item = reviewCases[index];
    const attempt = decisions[item.id];
    return Boolean(attempt?.checked && checkReview(item, attempt.action, attempt.record).passed);
  }
  const completed = reviewCases.filter((_, index) => passed(index)).length;
  function update(change: Partial<Decision>) {
    setDecisions(current => ({ ...current, [scenario.id]: { ...blank, ...current[scenario.id], ...change } }));
  }
  function openCase(index: number) {
    setActive(index);
    requestAnimationFrame(() => caseHeading.current?.focus());
  }
  return <div className={styles.reviewGrid}>
    <aside className={styles.inbox}>
      <h2>Case queue</h2>
      <p aria-live="polite">{completed} of {reviewCases.length} reviewed correctly</p>
      <nav aria-label="Review cases">{reviewCases.map((item, i) => <button type="button" key={item.id}
        aria-current={i === active ? 'step' : undefined} onClick={() => openCase(i)}>
        <span>Case {item.id}</span><strong>{item.title}</strong>{passed(i) && <span className={styles.done}><Check size={14} aria-hidden="true" /> Reviewed</span>}
      </button>)}</nav>
      <p className={styles.inboxNote}>These sample replies and records are fictional. Your decisions stay in this exercise.</p>
    </aside>

    <div className={styles.labStack}>
      <section className={styles.panel} aria-labelledby="case-title">
        <p className={styles.overline}>Case {scenario.id}</p><h2 ref={caseHeading} id="case-title" tabIndex={-1}>{scenario.title}</h2>
        <div className={styles.exchange}><div><h3>Customer message</h3><p>{scenario.request}</p></div>
          <div className={styles.draft}><h3>Sample AI draft</h3><p>{scenario.draft}</p></div></div>
        <h3 className={styles.subhead}>Available records</h3>
        <ul className={styles.records}>{scenario.evidence.map(item => <li key={item.id}><FileText size={18} aria-hidden="true" /><div><strong>{item.id} · {item.source}</strong><p>{item.body}</p></div></li>)}</ul>
        <RecordSearch key={scenario.id} scenario={scenario} />
      </section>

      <form className={styles.panel} onSubmit={event => { event.preventDefault(); update({ checked: true }); }}>
        <h2>Make the call</h2>
        <fieldset className={styles.decisionSet}><legend>What should the service rep do?</legend>
          {reviewActions.map(action => <label key={action.id} className={styles.option}><input type="radio" name="review-action" value={action.id} checked={decision.action === action.id} onChange={() => update({ action: action.id, checked: false })} />{action.label}</label>)}
        </fieldset>
        <label className={styles.recordSelect} htmlFor="record">Which record supports that action?</label>
        <select id="record" value={decision.record} onChange={e => update({ record: e.target.value, checked: false })}>
          <option value="">Choose a record</option>{scenario.evidence.map(item => <option key={item.id} value={item.id}>{item.id} · {item.source}</option>)}
        </select>
        <div className={styles.actionRow}><button type="submit" className={styles.primary} disabled={!decision.action || !decision.record}>Check my review <ArrowRight size={16} aria-hidden="true" /></button></div>
        {decision.checked && <div role="status" className={styles.result}>
          <h3>{result.passed ? 'Review complete' : 'Take another look'}</h3>
          <p><strong>Action</strong> · {result.actionCorrect ? 'Correct.' : 'Compare the draft’s promise with what the rep can verify or do.'}</p>
          <p><strong>Evidence</strong> · {result.evidenceCorrect ? 'Correct record.' : 'Look for the record that directly confirms the claim or defines the required action.'}</p>
          {result.passed && <><p>{scenario.rationale}</p><div className={styles.revised}><strong>Supported reply</strong><p>{scenario.response}</p></div></>}
        </div>}
        {decision.checked && result.passed && completed < reviewCases.length && <button type="button" className={styles.textButton} onClick={() => openCase(reviewCases.findIndex((_, index) => !passed(index)))}>Next unreviewed case <ArrowRight size={15} aria-hidden="true" /></button>}
      </form>
      {completed === reviewCases.length && <section className={styles.finished} aria-label="Review summary"><h2>All three cases reviewed</h2><p>You checked a factual reply, challenged a delivery promise, and identified a decision that needs a specialist.</p><button type="button" className={styles.textButton} onClick={() => { setDecisions({}); openCase(0); }}>Restart the review</button></section>}
      <p className={styles.source}>Practice Flow rules in the <Link href="/courses/salesforce/labs/email-to-case">Email-to-Case lab</Link> or study <a href="https://trailhead.salesforce.com/content/learn/modules/agentforce-agent-testing/view-test-results">Agentforce test results on Trailhead</a>.</p>
    </div>
  </div>;
}
