'use client';
import { useState } from 'react';
import { questionBank, lessonTitle } from '@/content/catalog';
import {
  recordAnswer,
  updateProgress,
  useProgress,
} from '@/lib/learning/progress';
import type { CourseId } from '@/lib/learning/types';
import AITutor from './AITutor';
import ExamCalculator from './ExamCalculator';
export default function PracticeProblems({
  section,
  course = 'exam-p',
  onlyIds,
}: {
  section: string;
  course?: CourseId;
  onlyIds?: number[];
}) {
  const progress = useProgress(course);
  const questions = (questionBank[course][section] ?? []).filter(
    (q) => !onlyIds || onlyIds.includes(q.id),
  );
  const positionKey = onlyIds ? `${section}:review` : section;
  const index = Math.max(
    0,
    Math.min(progress.positions[positionKey] ?? 0, questions.length - 1),
  );
  const problem = questions[index];
  const [hint, setHint] = useState(false);
  const [chat, setChat] = useState(false);
  const [calculator, setCalculator] = useState(false);
  if (!problem)
    return <p className="text-slate-300">No questions in this set yet.</p>;
  const key = `${section}:${problem.id}`;
  const attempt = progress.attempts[key];
  const answered =
    attempt?.selected !== null && attempt?.selected !== undefined;
  const graded = questions.filter(
    (q) => progress.attempts[`${section}:${q.id}`]?.selected != null,
  );
  const correct = graded.filter(
    (q) => progress.attempts[`${section}:${q.id}`]?.correct,
  ).length;
  const change = (n: number) => {
    setHint(false);
    setChat(false);
    updateProgress(course, (p) => ({
      ...p,
      positions: { ...p.positions, [positionKey]: n },
    }));
  };
  const retry = (keys: string[]) => {
    setHint(false);
    setChat(false);
    updateProgress(course, (p) => ({
      ...p,
      attempts: Object.fromEntries(
        Object.entries(p.attempts).map(([k, a]) => [
          k,
          keys.includes(k) ? { ...a, selected: null, correct: null } : a,
        ]),
      ),
    }));
  };
  return (
    <div className="space-y-5 text-slate-200">
      <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">
        <div className="flex flex-wrap justify-between gap-3 mb-4">
          <p>
            {graded.length}/{questions.length} answered · {correct} correct
          </p>
          <button
            onClick={() => retry(questions.map((q) => `${section}:${q.id}`))}
            className="text-teal-300"
          >
            Retry this set
          </button>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Questions">
          {questions.map((q, i) => {
            const a = progress.attempts[`${section}:${q.id}`];
            return (
              <button
                key={q.id}
                aria-label={`Question ${i + 1}${a?.correct === true ? ', correct' : a?.correct === false ? ', incorrect' : ''}`}
                aria-current={i === index ? 'step' : undefined}
                onClick={() => change(i)}
                className={`w-10 h-10 rounded-lg border ${i === index ? 'border-teal-300 bg-teal-900' : a?.correct === true ? 'border-green-600 bg-green-950' : a?.correct === false ? 'border-rose-600 bg-rose-950' : 'border-slate-600'}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div
          className={`${chat ? 'lg:col-span-2' : 'lg:col-span-3'} rounded-xl bg-slate-800 border border-slate-700 p-5 md:p-7 space-y-5`}
        >
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm text-teal-300">{problem.topic}</span>
            {problem.enrichment && (
              <span className="text-xs text-amber-300">
                Optional enrichment · excluded from timed exams
              </span>
            )}
          </div>
          <h3 className="whitespace-pre-wrap text-lg leading-relaxed">
            {problem.question}
          </h3>
          <div className="space-y-2">
            {problem.options.map((option, i) => (
              <button
                key={i}
                disabled={answered}
                onClick={() =>
                  recordAnswer(course, key, i, i === problem.correctIndex)
                }
                className={`w-full text-left p-4 rounded-lg border ${answered && i === problem.correctIndex ? 'border-green-400 bg-green-950' : answered && i === attempt.selected ? 'border-rose-400 bg-rose-950' : 'border-slate-600 hover:bg-slate-700'}`}
              >
                <span className="mr-3 font-semibold">
                  {String.fromCharCode(65 + i)}.
                </span>
                {option}
                {answered && i === problem.correctIndex
                  ? ' ✓ Correct answer'
                  : ''}
                {answered &&
                i === attempt.selected &&
                i !== problem.correctIndex
                  ? ' · Your answer'
                  : ''}
              </button>
            ))}
          </div>
          {answered ? (
            <div
              aria-live="polite"
              className="bg-slate-950 rounded-xl p-5 space-y-3"
            >
              <p
                className={
                  attempt.correct ? 'text-green-300' : 'text-amber-300'
                }
              >
                {attempt.correct
                  ? 'Correct.'
                  : 'Review the reasoning, then try again.'}
              </p>
              <p className="whitespace-pre-wrap leading-relaxed">
                {problem.explanation}
              </p>
              <button className="text-teal-300" onClick={() => retry([key])}>
                Retry this question
              </button>
            </div>
          ) : (
            <>
              <button className="text-amber-300" onClick={() => setHint(!hint)}>
                {hint ? 'Hide hint' : 'Show hint'}
              </button>
              {hint && (
                <p className="p-4 rounded bg-amber-950">{problem.hint}</p>
              )}
            </>
          )}
          <label className="block text-sm">
            Scratch work
            <textarea
              aria-label="Scratch work"
              value={progress.scratch[key] ?? ''}
              onChange={(e) =>
                updateProgress(course, (p) => ({
                  ...p,
                  scratch: { ...p.scratch, [key]: e.target.value },
                }))
              }
              className="mt-2 w-full min-h-28 rounded-lg bg-slate-950 p-4 border border-slate-600"
            />
          </label>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setChat(!chat)} className="text-purple-300">
              {chat ? 'Close tutor' : 'Ask AI tutor'}
            </button>
            {course === 'exam-p' && (
              <button
                onClick={() => setCalculator(!calculator)}
                className="text-teal-300"
              >
                Calculator
              </button>
            )}
            <button
              disabled={index === 0}
              onClick={() => change(index - 1)}
              className="disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={index === questions.length - 1}
              onClick={() => change(index + 1)}
              className="disabled:opacity-40"
            >
              Next
            </button>
          </div>
          {graded.length === questions.length && (
            <p className="border-t border-slate-600 pt-4">
              Set finished: {correct}/{questions.length} correct. Review missed
              questions before marking the lesson complete.
            </p>
          )}
        </div>
        {chat && (
          <div className="min-w-0 h-[650px]">
            <AITutor
              key={key}
              course={course}
              problemContext={{
                ...problem,
                userAnswer: answered ? attempt.selected : null,
                isCorrect: answered
                  ? (attempt.correct ?? undefined)
                  : undefined,
                topic: `${lessonTitle(course, section)}: ${problem.topic}`,
              }}
              isOpen
              onToggle={() => setChat(false)}
            />
          </div>
        )}
      </div>
      {calculator && (
        <ExamCalculator isOpen onToggle={() => setCalculator(false)} />
      )}
    </div>
  );
}
