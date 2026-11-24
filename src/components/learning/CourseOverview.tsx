'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import type { CourseId } from '@/lib/learning/types';
import { allQuestions, courses, lessonHref, lessonTitle, syllabus, topicGroups } from '@/content/catalog';
import { deductibleLab, emailCaseLab, responseLab, medallionLab } from '@/content/activities';
import { useProgress } from '@/lib/learning/progress';
import CourseShell from './CourseShell';
import styles from './course-guide.module.css';

export default function CourseOverview({ course }: { course: CourseId }) {
  const data = courses[course];
  const progress = useProgress(course);
  const exam = course === 'exam-p';
  const lessons = data.chapters.flatMap(chapter => chapter.lessons);
  const done = lessons.filter(lesson => progress.completed.includes(lesson.id)).length;
  const last = lessons.some(lesson => lesson.id === progress.lastLesson) || (exam && progress.lastLesson === '0.1') ? progress.lastLesson : undefined;
  const lab = exam ? deductibleLab : course === 'data-engineering' ? medallionLab : responseLab;
  return <CourseShell course={course}>
    <header className={styles.cover}>
      <div><p className={styles.kicker}>{exam ? 'Probability & insurance' : course === 'data-engineering' ? 'Data systems & AI' : 'Development & service'}</p>
        <h1>{data.title}</h1><p className={styles.description}>{data.description}</p>
        <div className={styles.actions}><Link className="field-action" href={lessonHref(course, last ?? lessons[0].id)}>{last ? 'Continue learning' : 'Start the first lesson'}<ArrowRight size={16} aria-hidden="true" /></Link><a href="#chapters">Browse chapters</a></div>
        {last && <p className={styles.last}>Last visited · {lessonTitle(course, last)}</p>}
      </div>
      {course === 'data-engineering' ? <div className={styles.dataIllustration} role="img" aria-label="Ingestion flows into Bronze, Silver, Gold and verified reporting">
        <span>THE DATA PRODUCT</span><strong>From source to insight.</strong>
        <div><i>INGEST</i><i>BRONZE</i><i>SILVER</i><i>GOLD</i></div><small>Ingest · Validate · Model · Report</small>
      </div> : <Image src={'/field-guides/' + (exam ? 'actuarial' : 'salesforce') + '.webp'} alt="" width={960} height={640} sizes="(max-width: 650px) 100vw, 40vw" loading="eager" />}
    </header>
    <div className={styles.layout}>
      <section id="chapters" className={styles.contents}>
        <h2>Chapters</h2>
        {data.chapters.map(chapter => <article key={chapter.id} className={styles.chapter}>
          <p className={styles.kicker}>Chapter {chapter.id}</p>
          <h3><Link href={'/courses/' + course + '/chapter/' + chapter.id}>{chapter.title}<ArrowUpRight size={19} aria-hidden="true" /></Link></h3>
          <p>{chapter.description}</p>
          <ol>{chapter.lessons.map(lesson => <li key={lesson.id}><Link href={lessonHref(course, lesson.id)}><span className={styles.number}>{lesson.id}</span><div>{lesson.title}{lesson.enrichment && <small>{lesson.enrichment}</small>}</div>{progress.completed.includes(lesson.id) ? <span className={styles.completed}><Check size={17} aria-label="Completed" /></span> : <ArrowRight size={16} aria-hidden="true" />}</Link></li>)}</ol>
        </article>)}
      </section>
      <aside className={styles.sidebar}>
        <section className={styles.progress}><h2>Your study desk</h2><p><strong>{done} / {lessons.length}</strong> lessons complete</p>
          <progress aria-label="Completed lessons" value={done} max={lessons.length} /><small>{progress.storageWarning ? 'Progress lasts for this visit.' : 'Progress is saved in this browser.'}</small>
          <Link href={'/courses/' + course + '/study'}>Open study desk <ArrowRight size={16} /></Link>
        </section>
        <section className={styles.supplement}><h2>Practice & resources</h2><p>{allQuestions(course).length} practice questions{exam ? ', including refresher and enrichment topics.' : ' across ' + data.chapters.length + ' hands-on chapters.'}</p>
          <Link href={lab.path}>{lab.title}<ArrowRight size={15} /></Link>
          {exam ? <><Link href={lessonHref(course, '0.1')}>Calculus readiness<ArrowRight size={15} /></Link><Link href="/courses/exam-p/practice">Practice & exams<ArrowRight size={15} /></Link><Link href="/courses/exam-p/reference">Formula reference<ArrowRight size={15} /></Link><Link href="/guides/ai-probability-actuarial-science">AI & probability<ArrowRight size={15} /></Link></> : course === 'data-engineering' ? <><p>The browser lab, sample CSV and all lessons are free with no account or AI key.</p><p>Fivetran, Snowflake and commercial AI tools are optional and may have limits or charges.</p></> : <><Link href={emailCaseLab.path}>Email-to-Case lab<ArrowRight size={15} /></Link><p>Use a Trailhead Playground or authorized sandbox for the manual exercises.</p></>}
        </section>
        {exam && <section className={styles.supplement}><h2>Exam P topic weights</h2><dl>{topicGroups.map(group => <div key={group.id}><dt>{group.title}</dt><dd>{group.weight}</dd></div>)}</dl><a href={syllabus.url} target="_blank" rel="noreferrer">{syllabus.label}<ArrowUpRight size={15} /></a></section>}
      </aside>
    </div>
  </CourseShell>;
}
