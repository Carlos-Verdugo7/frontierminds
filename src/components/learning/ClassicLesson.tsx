import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, FlaskConical, Pencil } from 'lucide-react';
import { examChapters, lessonHref } from '@/content/catalog';
import CourseShell from './CourseShell';
import styles from './classic-lesson.module.css';

type Mode = 'learn' | 'simulate' | 'practice';
const modes = [{ key: 'learn', label: 'Learn', Icon: BookOpen }, { key: 'simulate', label: 'Simulate', Icon: FlaskConical }, { key: 'practice', label: 'Practice', Icon: Pencil }] as const;

export default function ClassicLesson({ id, title, description, mode, onChange, children }: {
  id: string; title: string; description: string; mode: Mode; onChange: (mode: Mode) => void; children: React.ReactNode;
}) {
  const chapter = examChapters[Number(id.split('.')[0]) - 1];
  const chapterPath = '/courses/exam-p/chapter/' + chapter.id;
  const index = chapter.lessons.findIndex(lesson => lesson.id === id);
  const previous = chapter.lessons[index - 1];
  const following = chapter.lessons[index + 1];
  return <CourseShell course="exam-p">
    <header className={styles.heading}><Link href={chapterPath}><ArrowLeft size={15} aria-hidden="true"/>Chapter {chapter.id} · {chapter.title}</Link>
      <p className={styles.id}>Lesson {id}</p><h1>{title}</h1><p className={styles.description}>{description}</p>
    </header>
    <div role="group" aria-label="Lesson activities" className={styles.modes}>{modes.map(({key,label,Icon}) => <button key={key} type="button" aria-pressed={mode === key} onClick={() => onChange(key)}><Icon size={16} aria-hidden="true" />{label}</button>)}</div>
    <section className={mode === 'learn' ? 'classic-reading' : 'classic-workspace'} aria-label={modes.find(item => item.key === mode)?.label}>
      {children}
    </section>
    <nav aria-label="Adjacent lessons" className={styles.adjacent}>
      <Link href={previous ? lessonHref('exam-p', previous.id) : chapterPath}><ArrowLeft size={16} />{previous ? previous.id + ' · ' + previous.title : 'Chapter overview'}</Link>
      <Link href={following ? lessonHref('exam-p', following.id) : chapterPath}>{following ? following.id + ' · ' + following.title : 'Return to chapter'}<ArrowRight size={16}/></Link>
    </nav>
  </CourseShell>;
}
