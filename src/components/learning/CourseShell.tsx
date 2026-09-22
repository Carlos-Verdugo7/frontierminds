import Link from 'next/link';
import FrontierMindsLogo from '@/components/FrontierMindsLogo';
import type { CourseId } from '@/lib/learning/types';
import { courses } from '@/content/catalog';
export default function CourseShell({
  course,
  children,
}: {
  course: CourseId;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/95">
        <div className="max-w-6xl mx-auto p-5 flex flex-wrap justify-between gap-4 items-center">
          <Link href="/" aria-label="FrontierMinds home">
            <FrontierMindsLogo size="sm" />
          </Link>
          <nav
            aria-label="Course navigation"
            className="flex flex-wrap gap-4 text-sm text-slate-300"
          >
            <Link href={`/courses/${course}`}>{courses[course].title}</Link>
            <Link href={`/courses/${course}/study`}>My study desk</Link>
            {course === 'exam-p' && (
              <>
                <Link href="/courses/exam-p/practice">Practice & exams</Link>
                <Link href="/courses/exam-p/reference">Formula reference</Link>
              </>
            )}
            <Link href="/">All paths</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-5 py-10">{children}</main>
    </div>
  );
}
