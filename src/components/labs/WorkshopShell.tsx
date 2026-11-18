import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CourseNav from '@/components/site/CourseNav';
import { deductibleLab, responseLab } from '@/content/activities';
import styles from './lab.module.css';

export default function WorkshopShell({ course, children }: { course: 'exam-p' | 'salesforce'; children: React.ReactNode }) {
  const actuarial = course === 'exam-p';
  const activity = actuarial ? deductibleLab : responseLab;
  const other = actuarial ? responseLab : deductibleLab;
  return <div className={styles.workshop}><CourseNav course={course} />
    <main id="workbench" className={styles.sheet}>
      <header className={styles.title}><div><p className={styles.context}>{actuarial ? 'Exam P' : 'Salesforce & AI'} / Practice lab</p><h1>{activity.title}</h1><p>{activity.description}</p></div>
        <Image src={'/field-guides/' + (actuarial ? 'actuarial' : 'salesforce') + '.webp'} alt="" width={960} height={640} sizes="(max-width: 560px) 0px, 24vw" />
      </header>
      {children}
      <nav aria-label="More learning activities" className={styles.foot}><Link href={other.path}>{other.title} <ArrowRight size={16} aria-hidden="true" /></Link><Link href="/#courses">All field guides</Link></nav>
    </main>
  </div>;
}
