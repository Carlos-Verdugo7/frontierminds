'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { CourseId, Lesson } from '@/lib/learning/types';
import { courses, lessonHref } from '@/content/catalog';
import CourseShell from './CourseShell';
import PracticeProblems from '@/components/PracticeProblems';
import {
  JointExplorer,
  SamplingExplorer,
  InsuranceExplorer,
  SalesforceExplorer,
} from './Simulators';
const tabs = ['learn', 'explore', 'practice'] as const;
export default function LessonPage({
  course,
  lesson,
}: {
  course: CourseId;
  lesson: Lesson;
}) {
  const [tab, setTab] = useState<(typeof tabs)[number]>('learn');
  const list = courses[course].chapters.flatMap((c) => c.lessons);
  const index = list.findIndex((l) => l.id === lesson.id);
  const next = list[index + 1];
  const Simulator =
    lesson.simulator === 'joint'
      ? JointExplorer
      : lesson.simulator === 'sampling'
        ? SamplingExplorer
        : lesson.simulator === 'insurance'
          ? InsuranceExplorer
          : lesson.simulator === 'salesforce'
            ? SalesforceExplorer
            : null;
  return (
    <CourseShell course={course}>
      <Link href={`/courses/${course}`} className="text-teal-300 text-sm">
        ← Course roadmap
      </Link>
      <p className="mt-7 text-sm text-teal-300">
        LESSON {lesson.id} · ABOUT {lesson.minutes} MINUTES
      </p>
      <h1 className="text-3xl md:text-4xl font-bold mt-2">{lesson.title}</h1>
      <p className="text-lg text-slate-400 mt-4 max-w-3xl">{lesson.summary}</p>
      <div
        role="tablist"
        aria-label="Lesson activities"
        className="flex flex-wrap gap-2 my-8"
      >
        {tabs.map((t) => (
          <button
            role="tab"
            aria-selected={tab === t}
            id={`tab-${t}`}
            aria-controls={`panel-${t}`}
            onClick={() => setTab(t)}
            className={`rounded-lg px-5 py-3 capitalize ${tab === t ? 'bg-teal-300 text-slate-950' : 'bg-slate-800'}`}
            key={t}
          >
            {t === 'explore'
              ? Simulator
                ? 'Simulate & apply'
                : 'Hands-on lab'
              : t}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'learn' && (
          <div className="max-w-4xl space-y-6">
            <section className="rounded-xl border border-teal-800 bg-teal-950/40 p-6">
              <h2 className="text-lg font-semibold">
                By the end of this lesson
              </h2>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                {lesson.objectives.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </section>
            {lesson.blocks.map((b) => (
              <section
                key={b.title}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold mb-3">{b.title}</h2>
                <p className="leading-relaxed text-slate-300 whitespace-pre-wrap">
                  {b.body}
                </p>
              </section>
            ))}
            {lesson.formula && (
              <p className="p-5 rounded-xl bg-slate-800 font-mono overflow-x-auto">
                {lesson.formula}
              </p>
            )}
            <section className="border border-blue-800 rounded-xl p-6 bg-blue-950/30">
              <h2 className="text-xl font-semibold mb-3">Worked example</h2>
              <p className="mb-4">{lesson.example.question}</p>
              <p className="leading-relaxed text-blue-100">
                {lesson.example.solution}
              </p>
            </section>
            {lesson.source && (
              <p className="text-sm text-slate-400">
                Continue with the official resource:{' '}
                <a
                  className="text-teal-300 underline"
                  href={lesson.source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {lesson.source.title}
                </a>
              </p>
            )}
            <button
              onClick={() => setTab('explore')}
              className="rounded-lg bg-teal-300 text-slate-950 px-5 py-3 font-semibold"
            >
              Try it yourself →
            </button>
          </div>
        )}
        {tab === 'explore' && (
          <div className="space-y-6">
            {Simulator && <Simulator />}
            <section className="rounded-xl border border-slate-700 p-6 bg-slate-900">
              <h2 className="text-xl font-semibold">Your activity</h2>
              <ol className="list-decimal pl-6 mt-4 space-y-3 text-slate-300">
                {lesson.lab.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ol>
            </section>
            <button
              onClick={() => setTab('practice')}
              className="rounded-lg bg-teal-300 text-slate-950 px-5 py-3 font-semibold"
            >
              Check your understanding →
            </button>
          </div>
        )}
        {tab === 'practice' && (
          <PracticeProblems course={course} section={lesson.id} />
        )}
      </div>
      {next && (
        <div className="border-t border-slate-800 mt-10 pt-6">
          <Link className="text-teal-300" href={lessonHref(course, next.id)}>
            Next lesson: {next.title} →
          </Link>
        </div>
      )}
    </CourseShell>
  );
}
