'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  allQuestions,
  courses,
  lessonHref,
  lessonTitle,
} from '@/content/catalog';
import { useProgress } from '@/lib/learning/progress';
import type { CourseId } from '@/lib/learning/types';
import CourseShell from './CourseShell';
import PracticeProblems from '@/components/PracticeProblems';
export default function StudyDesk({ course }: { course: CourseId }) {
  const p = useProgress(course),
    bank = allQuestions(course);
  const attempted = bank.filter((q) => p.attempts[q.key]?.selected != null);
  const missed = bank.filter(
    (q) =>
      (p.attempts[q.key]?.misses ?? 0) > 0 &&
      p.attempts[q.key]?.correct !== true,
  );
  const [review, setReview] = useState<{
    section: string;
    ids: number[];
  } | null>(null);
  const sections = [...new Set(bank.map((q) => q.section))];
  const rows = sections
    .map((section) => {
      const qs = attempted.filter((q) => q.section === section);
      return {
        section,
        count: qs.length,
        correct: qs.filter((q) => p.attempts[q.key]?.correct).length,
      };
    })
    .filter((r) => r.count > 0)
    .sort((a, b) => a.correct / a.count - b.correct / b.count);
  const next = courses[course].chapters
    .flatMap((c) => c.lessons)
    .find((l) => !p.completed.includes(l.id));
  return (
    <CourseShell course={course}>
      <p className="text-teal-300 text-sm tracking-widest">
        SMALL STEPS, VISIBLE PROGRESS
      </p>
      <h1 className="text-4xl font-bold mt-3">My study desk</h1>
      <p className="text-slate-400 mt-4">
        {p.storageWarning
          ? 'Saving is unavailable; progress is temporary for this visit.'
          : 'Your answers, scratch work, and lesson completion save in this browser. They do not sync across devices.'}
      </p>
      <div className="grid sm:grid-cols-3 gap-4 my-8">
        {[
          ['Questions answered', attempted.length],
          [
            'Latest answers correct',
            attempted.filter((q) => p.attempts[q.key]?.correct).length,
          ],
          ['Questions to revisit', missed.length],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-slate-900 border border-slate-700 rounded-xl p-6"
          >
            <p className="text-3xl text-teal-200">{value}</p>
            <p className="text-sm text-slate-400 mt-2">{label}</p>
          </div>
        ))}
      </div>
      {next && (
        <Link
          href={lessonHref(course, next.id)}
          className="block rounded-xl border border-teal-700 bg-teal-950/30 p-5 mb-8"
        >
          Next unfinished lesson: {next.title} →
        </Link>
      )}
      <section>
        <h2 className="text-2xl font-semibold">Topics to strengthen</h2>
        <p className="text-sm text-slate-400 my-3">
          Sorted by accuracy on your latest graded answers. Small samples are a
          starting point, not a mastery score.
        </p>
        {!rows.length ? (
          <p className="rounded-xl border border-slate-700 p-6">
            Answer a few practice questions to see your topic breakdown.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-slate-400 text-sm">
                <tr>
                  <th scope="col" className="py-3">
                    Lesson
                  </th>
                  <th scope="col">Correct / answered</th>
                  <th scope="col">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.section} className="border-t border-slate-800">
                    <th scope="row" className="py-4 font-normal">
                      <Link
                        className="text-teal-300"
                        href={lessonHref(course, r.section)}
                      >
                        {lessonTitle(course, r.section)}
                      </Link>
                    </th>
                    <td>
                      {r.correct} / {r.count}
                    </td>
                    <td>{Math.round((r.correct / r.count) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Review mistakes</h2>
        <p className="text-slate-400 mt-3">
          Retry missed questions after revisiting the explanation. A correct
          retry removes the question from this list.
        </p>
        {missed.length ? (
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            {[...new Set(missed.map((q) => q.section))].map((section) => (
              <button
                key={section}
                className="text-left rounded-xl border border-slate-700 p-5 hover:border-teal-300"
                onClick={() =>
                  setReview({
                    section,
                    ids: missed
                      .filter((q) => q.section === section)
                      .map((q) => q.id),
                  })
                }
              >
                {lessonTitle(course, section)}{' '}
                <span className="text-amber-300">
                  · {missed.filter((q) => q.section === section).length} to
                  revisit →
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-5 p-5 rounded-xl bg-slate-900">
            No missed questions to revisit yet.
          </p>
        )}
      </section>
      {review && (
        <section className="mt-8 border-t border-slate-700 pt-6">
          <div className="flex justify-between gap-3 mb-5">
            <h2 className="text-xl">
              Review: {lessonTitle(course, review.section)}
            </h2>
            <button className="text-teal-300" onClick={() => setReview(null)}>
              Close review
            </button>
          </div>
          <PracticeProblems
            key={`${review.section}:${review.ids.join(',')}`}
            course={course}
            section={review.section}
            onlyIds={review.ids}
          />
        </section>
      )}
    </CourseShell>
  );
}
