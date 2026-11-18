import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import FrontierMindsLogo from '@/components/FrontierMindsLogo';
import { deductibleLab, responseLab } from '@/content/activities';
import styles from './lab.module.css';

export default function WorkshopShell({ course, children }: { course: 'exam-p' | 'salesforce'; children: React.ReactNode }) {
  const actuarial = course === 'exam-p';
  const activity = actuarial ? deductibleLab : responseLab;
  const other = actuarial ? responseLab : deductibleLab;
  const name = actuarial ? 'Actuarial Exam P' : 'Salesforce & AI';
  return <div className={styles.workshop}>
    <a className={styles.skip} href="#workbench">Skip to the activity</a>
    <header className={styles.mast}><div className={styles.mastInner}>
      <Link href="/" className={styles.brand}><FrontierMindsLogo size="sm" showText={false} />FrontierMinds</Link>
      <nav aria-label="Learning navigation"><Link href={'/courses/' + course}>{name}</Link><Link href={'/courses/' + course + '/study'}>Study desk</Link></nav>
    </div></header>
    <main id="workbench" className={styles.sheet}>
      <Link className={styles.back} href={'/courses/' + course}><ArrowLeft size={15} aria-hidden="true" />{name}</Link>
      <div className={styles.title}><h1>{activity.title}</h1><p>{activity.description}</p></div>
      {children}
      <footer className={styles.foot}><Link href={other.path}>{other.title} <ArrowRight size={16} aria-hidden="true" /></Link><Link href="/">All learning paths</Link></footer>
    </main>
  </div>;
}
