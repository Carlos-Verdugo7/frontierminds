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
      <Link href={`/courses/${course}`} className="text-[#203ead]">
        ← Course roadmap
      </Link>
      <p className="text-sm text-[#203ead] mt-8">
        CHAPTER {chapter.id} · {chapter.lessons.length} LESSONS · {count}{' '}
        QUESTIONS
      </p>
      <h1 className="text-4xl font-bold mt-2">{chapter.title}</h1>
      <p className="mt-4 text-slate-600">{chapter.description}</p>
      <div className="space-y-4 mt-8">
        {chapter.lessons.map((l) => (
          <Link
            key={l.id}
            href={lessonHref(course, l.id)}
            className="block p-6 bg-white border border-slate-300 rounded-xl hover:border-indigo-600"
          >
            {l.id} · {l.title} →
            {l.enrichment && (
              <p className="text-sm text-amber-900 mt-2">{l.enrichment}</p>
            )}
          </Link>
        ))}
      </div>
    </CourseShell>
  );
}
