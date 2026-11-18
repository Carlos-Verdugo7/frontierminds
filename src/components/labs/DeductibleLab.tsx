'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { auditFinding, dollars, predictHeldOut, priceContract, sampleContracts, startingContract, type AuditFinding } from '@/lib/learning/loss-lab';
import { ArrowRight, RotateCcw } from 'lucide-react';
import LossChart from './LossChart';
import styles from './lab.module.css';

const findings: { id: AuditFinding; label: string }[] = [
  { id: 'matches', label: 'It gives the same mean' },
  { id: 'overstates', label: 'It overstates the mean' },
  { id: 'undefined', label: 'There are no positive payments to average' },
];

export default function DeductibleLab({ initialDeductible }: { initialDeductible: number }) {
  const [deductible, setDeductible] = useState(initialDeductible);
  const [cap, setCap] = useState(startingContract.cap);
  const [size, setSize] = useState(1000);
  const [seed, setSeed] = useState<number | null>(null);
  const [answer, setAnswer] = useState<AuditFinding | null>(null);
  const [testLoss, setTestLoss] = useState(3000);
  const [fitted, setFitted] = useState(false);
  const contract = priceContract(deductible, cap);
  const reference = priceContract(0, cap);
  const sample = useMemo(() => seed === null ? null : sampleContracts(deductible, cap, size, seed), [deductible, cap, size, seed]);
  const expected = auditFinding(contract);
  const testRow = contract.rows.find(row => row.loss === testLoss)!;
  const prediction = predictHeldOut(contract, testLoss);
  const percent = Math.round(contract.paidProbability * 100);
  const reasoning = contract.meanWhenPaid === null
    ? 'Every loss pays $0. The per-loss mean is $0, and the positive-payment mean has no observations.'
    : expected === 'matches'
      ? 'Every loss produces a payment under this contract. Both averages use the same losses and equal ' + dollars(contract.mean) + '.'
      : 'Only ' + percent + '% of losses pay. Multiply the unrounded positive-payment mean (' + dollars(contract.meanWhenPaid) + ' rounded) by ' + percent + '% to get ' + dollars(contract.mean) + ' per loss.';
  return <div className={styles.labStack}>
    <section className={styles.panel} aria-labelledby="contract-title">
      <h2 id="contract-title">Change the contract</h2>
      <p className={styles.lede}>These four loss sizes make up a fictional portfolio. Each payment starts above the ordinary deductible and stops at the payment cap.</p>
      <div className={styles.contractGrid}>
        <div className={styles.controls}>
          <label htmlFor="deductible">Ordinary deductible <output htmlFor="deductible">{dollars(deductible)}</output></label>
          <input id="deductible" type="range" min="0" max="3000" step="250" value={deductible} aria-valuetext={dollars(deductible)} onChange={e => { setDeductible(Number(e.target.value)); setAnswer(null); }} />
          <div className={styles.extents}><span>$0</span><span>$3,000</span></div>
          <label htmlFor="payment-cap">Maximum payment per loss</label>
          <select id="payment-cap" value={cap} onChange={e => { setCap(Number(e.target.value)); setAnswer(null); }}>
            {[500, 1500, 3000].map(value => <option key={value} value={value}>{dollars(value)}</option>)}
          </select>
          <p className={styles.formula}>Y = min(max(X − d, 0), L)</p>
          <p className={styles.small}>X is the loss, d the deductible, and L the payment cap.</p>
        </div>
        <div className={styles.chartPanel}><LossChart contract={contract} /></div>
      </div>
      <dl className={styles.metrics} aria-live="polite">
        <div><dt>Expected payment per loss</dt><dd>{dollars(contract.mean)}</dd></div>
        <div><dt>Losses with a payment</dt><dd>{percent}%</dd></div>
        <div><dt>Mean if a payment occurs</dt><dd>{contract.meanWhenPaid === null ? 'Undefined' : dollars(contract.meanWhenPaid)}</dd></div>
      </dl>
      <details className={styles.details}><summary>See the weighted calculation</summary><p>{contract.rows.map(row => dollars(row.paid) + ' × ' + Math.round(100 * row.probability) + '%').join(' + ')} = <strong>{dollars(contract.mean)}</strong> per loss.</p></details>
    </section>

    <section className={styles.panel} aria-labelledby="simulation-title">
      <h2 id="simulation-title">Run a paired simulation</h2>
      <p className={styles.lede}>Apply both contracts to the same random losses. The comparison contract has a $0 deductible and the same payment cap. Change the deductible after a run to reuse your sample.</p>
      <div className={styles.actionRow}><label htmlFor="sample-size">Sample size<select id="sample-size" value={size} onChange={e => setSize(Number(e.target.value))}>
        {[100, 1000, 10000].map(n => <option key={n} value={n}>{n.toLocaleString('en-US')} losses</option>)}
      </select></label>
      <button type="button" className={styles.primary} onClick={() => setSeed(old => old === null ? 19 : old + 1)}>
        {sample ? <RotateCcw size={16} aria-hidden="true" /> : null}{sample ? 'Draw another sample' : 'Run simulation'}</button></div>
      {sample && <div className={styles.result} role="status">
        <h3>Average payment across {size.toLocaleString('en-US')} simulated losses</h3>
        <dl className={styles.sampleStats}><div><dt>$0 deductible</dt><dd>{dollars(sample.baselineMean)}</dd></div><div><dt>Selected contract</dt><dd>{dollars(sample.mean)}</dd></div><div><dt>Reduction per loss</dt><dd>{dollars(sample.reduction)}</dd></div></dl>
        <p>The exact expected reduction is {dollars(reference.mean - contract.mean)} per loss. Random samples can differ from the exact value.</p>
      </div>}
    </section>

    <section className={styles.panel} aria-labelledby="model-title">
      <h2 id="model-title">Train a payout model</h2>
      <p className={styles.lede}>Set one loss aside. Fit a straight line to the three other loss sizes, giving each one equal weight. Then check its prediction for the unseen loss against the actual contract.</p>
      <div className={styles.actionRow}><label htmlFor="held-out">Loss to hold out<select id="held-out" value={testLoss} onChange={e => { setTestLoss(Number(e.target.value)); setFitted(false); }}>
        {contract.rows.map(row => <option key={row.loss} value={row.loss}>{dollars(row.loss)}</option>)}
      </select></label><button type="button" className={styles.primary} onClick={() => setFitted(true)}>Fit and test the model</button></div>
      {fitted && <div className={styles.result} role="status"><h3>Held-out test for a {dollars(testLoss)} loss</h3>
        <dl className={styles.sampleStats}><div><dt>Model prediction</dt><dd>{dollars(prediction)}</dd></div><div><dt>Contract payment</dt><dd>{dollars(testRow.paid)}</dd></div><div><dt>Absolute error</dt><dd>{dollars(Math.abs(prediction - testRow.paid))}</dd></div></dl>
        <p>{prediction > cap + 0.005 ? 'The line predicts more than the maximum payment. The fitted model never learned the cap.' : prediction < -0.005 ? 'The line predicts a negative payment. The contract has a floor at zero.' : Math.abs(prediction - testRow.paid) < 0.005 ? 'The prediction matches this held-out payment to the cent. Try holding out another loss size.' : 'The deductible and cap can bend the payment curve. A straight line can miss those changes.'}</p>
      </div>}
    </section>

    <section className={styles.auditPanel} aria-labelledby="audit-title">
      <div className={styles.auditIntro}><p className={styles.overline}>Worked AI example</p><h2 id="audit-title">Audit the denominator</h2>
        <blockquote>“To estimate the average payment across all recorded losses, I’ll average just the losses with a positive payment.”</blockquote></div>
      <div className={styles.auditAnswers}><fieldset><legend>Under your current contract, what does that calculation do?</legend>
        {findings.map(finding => <label key={finding.id} className={styles.option}><input type="radio" name="audit" checked={answer === finding.id} onChange={() => setAnswer(finding.id)} />{finding.label}</label>)}
      </fieldset>
      {answer && <p className={styles.feedback} role="status"><strong>{answer === expected ? 'Correct. ' : 'Look at the zero-payment rows. '}</strong>{reasoning}</p>}</div>
    </section>
    <p className={styles.source}>Continue with <Link href="/courses/exam-p/chapter/6/section/3">payment moments and risk</Link> or the <a href="https://www.soa.org/education/exam-req/edu-exam-p-detail/study/">SOA Exam P study materials <ArrowRight size={13} aria-hidden="true" /></a>.</p>
  </div>;
}
