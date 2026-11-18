'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { updateProgress, useProgress } from '@/lib/learning/progress';
import { courses, isCourse } from '@/content/catalog';
import type { CourseId } from '@/lib/learning/types';
function Tracker({ course, id }: { course: CourseId; id: string }) {
  const scope = courses[course].chapters
    .flatMap((c) => c.lessons)
    .find((l) => l.id === id)?.enrichment;
  const p = useProgress(course);
  const done = p.completed.includes(id);
  useEffect(() => {
    updateProgress(course, (old) => ({ ...old, lastLesson: id }));
  }, [course, id]);
  return (
    <div className="lesson-progress">
      <div className="max-w-6xl mx-auto px-5 py-3 flex flex-wrap gap-3 justify-between items-center text-sm">
        <span>
          {p.storageWarning
            ? 'Saving is unavailable. Progress will last only for this visit.'
            : 'Your progress is saved in this browser.'}
        </span>
        {scope && <span className="text-amber-900 text-sm">{scope}</span>}
        <button
          className="site-small-button"
          aria-pressed={done}
          onClick={() =>
            updateProgress(course, (old) => ({
              ...old,
              completed: done
                ? old.completed.filter((x) => x !== id)
                : [...new Set([...old.completed, id])],
            }))
          }
        >
          {done ? '✓ Lesson completed · undo' : 'Mark lesson complete'}
        </button>
      </div>
    </div>
  );
}
export default function ProgressTracker() {
  const path = usePathname();
  const match = path?.match(
    /^\/courses\/([^/]+)\/chapter\/(\d+)\/section\/(\d+)$/,
  );
  if (!match || !isCourse(match[1])) return null;
  return (
    <Tracker key={path} course={match[1]} id={`${match[2]}.${match[3]}`} />
  );
}
