'use client';
import Link from 'next/link';
import type { CourseId } from '@/lib/learning/types';
import {
  allQuestions,
  courses,
  lessonHref,
  lessonTitle,
  syllabus,
  topicGroups,
} from '@/content/catalog';
import { useProgress } from '@/lib/learning/progress';
import CourseShell from './CourseShell';
export default function CourseOverview({ course }: { course: CourseId }) {
  const data = courses[course],
    p = useProgress(course);
  const lessons = data.chapters.flatMap((c) => c.lessons);
  const done = lessons.filter((l) => p.completed.includes(l.id)).length;
  const last =
    lessons.some((l) => l.id === p.lastLesson) || p.lastLesson === '0.1'
      ? p.lastLesson
      : undefined;
  return (
    <CourseShell course={course}>
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 items-start">
        <div>
          <p className="text-teal-300 text-sm font-semibold tracking-widest">
            {course === 'exam-p'
              ? 'PROBABILITY, MADE TANGIBLE'
              : 'YOUR NEXT LEARNING PATH'}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mt-3">{data.title}</h1>
          <p className="text-lg text-slate-400 mt-5 max-w-2xl">
            {data.description}
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link
              className="rounded-lg bg-teal-300 text-slate-950 px-5 py-3 font-semibold"
              href={lessonHref(course, last ?? lessons[0].id)}
            >
              {last ? 'Continue learning' : 'Start the path'} →
            </Link>
            <Link
              className="rounded-lg border border-slate-600 px-5 py-3"
              href={`/courses/${course}/study`}
            >
              My study desk
            </Link>
          </div>
          {last && (
            <p className="text-sm text-slate-400 mt-3">
              Last visited: {lessonTitle(course, last)}
            </p>
          )}
        </div>
        <aside className="rounded-2xl bg-slate-900 border border-slate-700 p-6">
          <h2 className="text-lg font-semibold">Your progress</h2>
          <p className="text-3xl text-teal-200 mt-3">
            {done} / {lessons.length} lessons
          </p>
          <progress
            aria-label="Completed lessons"
            className="w-full mt-4 accent-teal-300"
            value={done}
            max={lessons.length}
          />
          <p className="text-sm text-slate-400 mt-3">
            {p.storageWarning
              ? 'Progress cannot be saved beyond this visit.'
              : 'Saved in this browser. Completion is separate from practice accuracy.'}
          </p>
          <div className="grid grid-cols-2 gap-4 mt-5 border-t border-slate-700 pt-4">
            <div>
              <strong>{data.chapters.length}</strong>
              <p className="text-sm text-slate-400">Chapters</p>
            </div>
            <div>
              <strong>{allQuestions(course).length}</strong>
              <p className="text-sm text-slate-400">
                Practice questions
                {course === 'exam-p' ? ' incl. refresher & enrichment' : ''}
              </p>
            </div>
          </div>
        </aside>
      </div>
      {course === 'exam-p' ? (
        <>
          <section className="mt-10">
            <div className="flex flex-wrap justify-between gap-3">
              <h2 className="text-xl font-semibold">Official topic groups</h2>
              <a
                href={syllabus.url}
                className="text-sm text-teal-300 underline"
                target="_blank"
                rel="noreferrer"
              >
                {syllabus.label} ↗
              </a>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              {topicGroups.map((g) => (
                <div
                  key={g.id}
                  className="rounded-xl bg-slate-900 border border-slate-800 p-5"
                >
                  <p className="text-2xl text-teal-200">{g.weight}</p>
                  <p className="mt-2">{g.title}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400 mt-3">
              These ranges describe SOA topic groups, not individual chapters.
              Learning activities and practice results are not a prediction of
              your exam score.
            </p>
          </section>
          <div className="my-8 grid sm:grid-cols-3 gap-4">
            {[
              [
                'Calculus readiness',
                'Optional diagnostic and refresher',
                lessonHref(course, '0.1'),
              ],
              [
                'Practice & exams',
                'Mixed sets and a three-hour exam',
                '/courses/exam-p/practice',
              ],
              [
                'Formula reference',
                'Key formulas linked to lessons',
                '/courses/exam-p/reference',
              ],
            ].map(([title, desc, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-xl border border-slate-700 p-5 hover:border-teal-400"
              >
                <h3 className="font-semibold">{title} →</h3>
                <p className="text-sm text-slate-400 mt-2">{desc}</p>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-8 rounded-xl border border-blue-800 bg-blue-950/30 p-5 text-blue-100">
          A practical foundations path, with six lessons and a support-workflow
          capstone. Complete the labs in a Trailhead Playground or sandbox.
          Developer specialization and certification-specific preparation can
          follow this foundation.
        </p>
      )}
      <section className="mt-10 space-y-5">
        <h2 className="text-2xl font-semibold">Your learning roadmap</h2>
        {data.chapters.map((ch) => (
          <article
            key={ch.id}
            className="bg-slate-900 rounded-xl border border-slate-800 p-6"
          >
            <p className="text-sm text-teal-300">CHAPTER {ch.id}</p>
            <h3 className="text-2xl font-semibold mt-2">{ch.title}</h3>
            <p className="text-slate-400 mt-2 mb-5">{ch.description}</p>
            <div className="divide-y divide-slate-800">
              {ch.lessons.map((l) => (
                <Link
                  key={l.id}
                  href={lessonHref(course, l.id)}
                  className="flex justify-between gap-4 py-4 hover:text-teal-200"
                >
                  <div>
                    <span className="text-slate-500 mr-3">{l.id}</span>
                    {l.title}
                    {'enrichment' in l && l.enrichment && (
                      <p className="text-xs text-amber-200/80 mt-2">
                        {l.enrichment}
                      </p>
                    )}
                  </div>
                  <span className="text-sm shrink-0 text-teal-300">
                    {p.completed.includes(l.id) ? '✓ Completed' : 'Start →'}
                  </span>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
    </CourseShell>
  );
}
