'use client';

import { useState } from 'react';
import type { reviewCases } from '@/content/agent-review';
import { rankRecords } from '@/lib/learning/record-search';
import styles from './lab.module.css';

export default function RecordSearch({ scenario }: { scenario: (typeof reviewCases)[number] }) {
  const [query, setQuery] = useState(scenario.search);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const matches = submitted === null ? null : rankRecords(scenario.evidence, submitted);
  return <details className={styles.search}><summary>Search the case records</summary>
    <p>A local TF-IDF search ranks records by shared words, giving more weight to words that appear in fewer of this case’s records. Change the phrase and compare the ranking with the evidence.</p>
    <form onSubmit={event => { event.preventDefault(); setSubmitted(query.trim()); }}>
      <label htmlFor="record-query">Search terms</label>
      <div><input id="record-query" type="text" maxLength={180} value={query} onChange={event => { setQuery(event.target.value); setSubmitted(null); }} />
      <button type="submit" className={styles.primary} disabled={!query.trim()}>Rank records</button></div>
    </form>
    {matches && <div className={styles.result} role="status">{matches.length ? <><h3>Matches for “{submitted}”</h3><ol>{matches.map(hit => <li key={hit.id}><strong>{hit.id}</strong> · {hit.matches.join(', ')}</li>)}</ol></> : <p>No matching words. Try a term from the case or its records.</p>}</div>}
  </details>;
}
