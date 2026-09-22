import Link from 'next/link';
import type { CourseId, Chapter } from '@/lib/learning/types';
import { lessonHref, questionBank } from '@/content/catalog';
import CourseShell from './CourseShell';
export default function ChapterOverview({
  course,
  chapter,
}: {
  course: CourseId;
  chapter: Chapter;
}) {
  const count = chapter.lessons.reduce(
    (n, l) => n + (questionBank[course][l.id]?.length ?? 0),
    0,
  );
  return (
    <CourseShell course={course}>
      <Link href={`/courses/${course}`} className="text-teal-300">
        ← Course roadmap
      </Link>
      <p className="text-sm text-teal-300 mt-8">
        CHAPTER {chapter.id} · {chapter.lessons.length} LESSONS · {count}{' '}
        QUESTIONS
      </p>
      <h1 className="text-4xl font-bold mt-2">{chapter.title}</h1>
      <p className="mt-4 text-slate-400">{chapter.description}</p>
      <div className="space-y-4 mt-8">
        {chapter.lessons.map((l) => (
          <Link
            key={l.id}
            href={lessonHref(course, l.id)}
            className="block p-6 bg-slate-900 border border-slate-700 rounded-xl hover:border-teal-300"
          >
            {l.id} · {l.title} →
            {l.enrichment && (
              <p className="text-sm text-amber-200/80 mt-2">{l.enrichment}</p>
            )}
          </Link>
        ))}
      </div>
    </CourseShell>
  );
}
