'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { CourseId, Lesson } from '@/lib/learning/types';
import { courses, lessonHref } from '@/content/catalog';
import CourseShell from './CourseShell';
import PracticeProblems from '@/components/PracticeProblems';
import EmailCaseLab from './EmailCaseLab';
import { deductibleLab, emailCaseLab, responseLab } from '@/content/activities';
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
  aiEnabled,
}: {
  course: CourseId;
  lesson: Lesson;
  aiEnabled: boolean;
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
      <Link href={`/courses/${course}`} className="text-[#203ead] text-sm">
        ← Course roadmap
      </Link>
      <p className="mt-7 text-sm text-[#203ead]">
        LESSON {lesson.id} · ABOUT {lesson.minutes} MINUTES
      </p>
      <h1 className="text-3xl md:text-4xl font-bold mt-2">{lesson.title}</h1>
      <p className="text-lg text-slate-600 mt-4 max-w-3xl">{lesson.summary}</p>
      {course === 'exam-p' && ['6.1', '6.3'].includes(lesson.id) && (
        <Link href={deductibleLab.path} className="mt-4 inline-block text-[#203ead] underline">Try the deductible lab →</Link>
      )}
      {course === 'salesforce' && lesson.id === '1.6' && (
        <Link href={responseLab.path} className="mt-4 inline-block text-[#203ead] underline">Review AI replies in the case queue →</Link>
      )}
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
            className={`rounded-lg px-5 py-3 capitalize ${tab === t ? 'bg-[#2548cc] text-white' : 'bg-slate-100'}`}
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
            <section className="rounded-xl border border-indigo-200 bg-indigo-100 p-6">
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
                className="bg-white border border-slate-300 rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold mb-3">{b.title}</h2>
                <p className="leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {b.body}
                </p>
              </section>
            ))}
            {lesson.snippets && lesson.snippets.length > 0 && (
              <section className="space-y-3" aria-label="Copyable code and AI prompt examples">
                <h2 className="text-xl font-semibold">Implementation examples</h2>
                <p className="text-sm text-slate-600">These are educational examples, not commands executed against your Salesforce org. Review and adapt them before use.</p>
                {lesson.snippets.map((snippet) => (
                  <details
                    key={snippet.title}
                    className="rounded-xl border border-slate-300 bg-slate-100 open:border-indigo-300"
                  >
                    <summary className="cursor-pointer px-5 py-4 font-semibold text-[#203ead]">
                      {snippet.title} <span className="text-xs text-slate-600 font-normal">({snippet.language})</span>
                    </summary>
                    <pre className="overflow-x-auto border-t border-slate-300 p-5 text-sm text-slate-800 whitespace-pre"><code>{snippet.code}</code></pre>
                  </details>
                ))}
              </section>
            )}
            {lesson.formula && (
              <p className="p-5 rounded-xl bg-slate-100 font-mono overflow-x-auto">
                {lesson.formula}
              </p>
            )}
            <section className="border border-blue-300 rounded-xl p-6 bg-blue-100">
              <h2 className="text-xl font-semibold mb-3">Worked example</h2>
              <p className="mb-4">{lesson.example.question}</p>
              <p className="leading-relaxed text-blue-900">
                {lesson.example.solution}
              </p>
            </section>
            {lesson.source && (
              <p className="text-sm text-slate-600">
                Continue with the official resource:{' '}
                <a
                  className="text-[#203ead] underline"
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
              className="rounded-lg bg-[#2548cc] text-white px-5 py-3 font-semibold"
            >
              Try it yourself →
            </button>
          </div>
        )}
        {tab === 'explore' && (
          <div className="space-y-6">
            {Simulator && <Simulator />}
            {course === 'salesforce' && lesson.id === '2.1' && <section className="space-y-4">
              <h2 className="text-2xl font-semibold">{emailCaseLab.title}</h2>
              <Link href={emailCaseLab.path} className="inline-block text-sm text-[#203ead] underline">Open the standalone lab</Link>
              <EmailCaseLab aiEnabled={aiEnabled} />
            </section>}
            <section className="rounded-xl border border-slate-300 p-6 bg-white">
              <h2 className="text-xl font-semibold">Your activity</h2>
              <ol className="list-decimal pl-6 mt-4 space-y-3 text-slate-700">
                {lesson.lab.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ol>
            </section>
            <button
              onClick={() => setTab('practice')}
              className="rounded-lg bg-[#2548cc] text-white px-5 py-3 font-semibold"
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
        <div className="border-t border-slate-300 mt-10 pt-6">
          <Link className="text-[#203ead]" href={lessonHref(course, next.id)}>
            Next lesson: {next.title} →
          </Link>
        </div>
      )}
    </CourseShell>
  );
}
