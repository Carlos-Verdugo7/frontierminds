'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import styles from './home.module.css';

const probability = (flips: number) => (1 - Math.pow(0.5, flips)) * 100;
const chartPoint = (flips: number) => ({ x: 38 + (flips - 1) * 49, y: 110 - probability(flips) * 0.9 });

export default function ProbabilityPreview() {
  const [flips, setFlips] = useState(2);
  const chance = probability(flips);
  const point = chartPoint(flips);
  const points = Array.from({ length: 6 }, (_, i) => { const p = chartPoint(i + 1); return `${p.x},${p.y}`; }).join(' ');

  return <div className={styles.demo}>
    <div className={styles.demoTop}><span><span className={styles.dot} /> PROBABILITY EXPLORER</span><SlidersHorizontal size={17} aria-hidden="true" /></div>
    <h2>Fair-coin explorer</h2>
    <p>What&apos;s the chance of getting at least one head if you flip a coin more than once?</p>
    <div className={styles.demoResult} aria-live="polite"><output htmlFor="coin-flips">{Number(chance.toFixed(2))}%</output><span>chance of at least one head<br />in {flips} independent {flips === 1 ? 'flip' : 'flips'}</span></div>
    <svg className={styles.chart} viewBox="0 0 320 135" role="img" aria-label={`With a fair coin, the chance of at least one head rises from 50 percent for one flip to 98.44 percent for six flips. Currently ${Number(chance.toFixed(2))} percent for ${flips} flips.`}>
      <defs><linearGradient id="home-probability-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9bad7e" stopOpacity=".27" /><stop offset="100%" stopColor="#9bad7e" stopOpacity="0" /></linearGradient></defs>
      <line x1="38" y1="20" x2="294" y2="20" stroke="#d8deca" strokeDasharray="3 4" /><line x1="38" y1="65" x2="294" y2="65" stroke="#d8deca" strokeDasharray="3 4" />
      <text x="0" y="24">100%</text><text x="7" y="69">50%</text>
      <polygon points={`38,113 ${points} 283,113`} fill="url(#home-probability-fill)" />
      <polyline points={points} fill="none" stroke="#658263" strokeWidth="2.5" strokeLinejoin="round" />
      {Array.from({ length: 6 }, (_, i) => { const p = chartPoint(i + 1); return <g key={i}><circle cx={p.x} cy={p.y} r={3} fill="#658263" /><text x={p.x} y="130" textAnchor="middle">{i + 1}</text></g>; })}
      <circle cx={point.x} cy={point.y} r="7" fill="#b54b26" stroke="#fffdf7" strokeWidth="3" />
    </svg>
    <div className={styles.sliderLabel}><label htmlFor="coin-flips">Number of flips</label><span>{flips} / 6</span></div>
    <input id="coin-flips" className={styles.slider} type="range" min="1" max="6" step="1" value={flips} onChange={event => setFlips(Number(event.target.value))} aria-valuetext={`${flips} ${flips === 1 ? 'flip' : 'flips'}, ${Number(chance.toFixed(2))} percent chance of at least one head`} />
    <div className={styles.demoBottom}><span>Explore probability in the Exam P course.</span><Link href="/courses/exam-p" aria-label="Explore probability in the Actuarial Exam P course"><ArrowUpRight size={19} aria-hidden="true" /></Link></div>
  </div>;
}
