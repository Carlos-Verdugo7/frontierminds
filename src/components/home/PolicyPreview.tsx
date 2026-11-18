'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import LossChart from '@/components/labs/LossChart';
import { deductibleLab } from '@/content/activities';
import { dollars, priceContract, startingContract } from '@/lib/learning/loss-lab';
import styles from './home.module.css';

export default function PolicyPreview() {
  const [deductible, setDeductible] = useState(startingContract.deductible);
  const contract = priceContract(deductible, startingContract.cap);
  const href = deductible === startingContract.deductible ? deductibleLab.path : deductibleLab.path + '?deductible=' + deductible;
  return <section className={styles.preview} aria-label="Try the insurance model">
    <header className={styles.previewHead}><span>Insurance model</span><span>Payment cap {dollars(startingContract.cap)}</span></header>
    <div className={styles.instrument}>
      <div className={styles.reading} aria-live="polite"><span>Expected payment per loss</span><strong>{dollars(contract.mean)}</strong></div>
      <div className={styles.testChart}><LossChart contract={contract} /></div>
    </div>
    <div className={styles.adjust}><fieldset><legend>Try a deductible</legend><div>{[0, 500, 1000].map(value => <button key={value} type="button" aria-pressed={deductible === value} onClick={() => setDeductible(value)}>{dollars(value)}</button>)}</div></fieldset>
      <Link href={href}>Open lab <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
  </section>;
}
