'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  allQuestions,
  createExam,
  lessonHref,
  shuffle,
  topicGroups,
  type BankQuestion,
} from '@/content/catalog';
import {
  recordAnswer,
  saveExamAnswer,
  updateProgress,
  useProgress,
} from '@/lib/learning/progress';
import CourseShell from './CourseShell';
import ExamCalculator from '@/components/ExamCalculator';
const button = 'rounded-lg px-5 py-3 bg-teal-300 text-slate-950 font-semibold';
export default function ExamPractice() {
  const p = useProgress('exam-p'),
    exam = p.exam;
  const [now, setNow] = useState(() => Date.now()),
    [index, setIndex] = useState(0),
    [mixed, setMixed] = useState<BankQuestion[]>([]),
    [calculator, setCalculator] = useState(false);
  const bank = allQuestions('exam-p');
  const questions = exam
    ? exam.keys
        .map((key) => bank.find((q) => q.key === key))
        .filter((q): q is BankQuestion => !!q)
    : [];
  const remaining = exam
    ? Math.max(0, Math.ceil((exam.deadline - now) / 1000))
    : 0;
  const submit = useCallback(
    () =>
      updateProgress('exam-p', (old) => {
        if (!old.exam || old.exam.submittedAt) return old;
        const attempts = { ...old.attempts };
        const bank = allQuestions('exam-p');
        for (const key of old.exam.keys) {
          const q = bank.find((x) => x.key === key);
          if (!q) continue;
          const selected = old.exam.answers[key];
          const correct = selected === q.correctIndex;
          const previous = attempts[key];
          attempts[key] = {
            selected: selected ?? null,
            correct,
            tries: (previous?.tries ?? 0) + 1,
            misses: (previous?.misses ?? 0) + (correct ? 0 : 1),
            lastAt: Date.now(),
          };
        }
        return {
          ...old,
          attempts,
          exam: { ...old.exam, submittedAt: Date.now() },
        };
      }),
    [],
  );
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (exam && !exam.submittedAt && remaining === 0) submit();
  }, [exam, remaining, submit]);
  const start = () => {
    const keys = createExam().map((q) => q.key);
    const startedAt = Date.now();
    setIndex(0);
    setMixed([]);
    setNow(startedAt);
    updateProgress('exam-p', (old) => ({
      ...old,
      exam: {
        keys,
        answers: {},
        startedAt,
        deadline: startedAt + 3 * 60 * 60 * 1000,
      },
    }));
  };
  const current = questions[Math.min(index, questions.length - 1)];
  const answered = exam ? Object.keys(exam.answers).length : 0;
  const choose = (selected: number) => {
    if (current) saveExamAnswer(current.key, selected);
  };
  return (
    <CourseShell course="exam-p">
      <h1 className="text-4xl font-bold">Practice with purpose</h1>
      <p className="text-slate-400 mt-4 max-w-3xl">
        Build confidence with a mixed set, or practice pacing in a three-hour
        session. These are learning exercises using the FrontierMinds bank, not
        official SOA exams or pass predictions.
      </p>
      {!exam && (
        <div className="grid md:grid-cols-2 gap-5 my-8">
          <section className="p-6 rounded-xl bg-slate-900 border border-slate-700">
            <h2 className="text-2xl font-semibold">Mixed practice</h2>
            <p className="text-slate-400 my-4">
              10 questions across core topics. Review feedback after every
              answer.
            </p>
            <button
              className={button}
              onClick={() =>
                setMixed(
                  shuffle(
                    bank.filter(
                      (q) => !q.enrichment && q.group !== 'foundation',
                    ),
                  ).slice(0, 10),
                )
              }
            >
              Start a mixed set
            </button>
          </section>
          <section className="p-6 rounded-xl bg-slate-900 border border-teal-800">
            <h2 className="text-2xl font-semibold">Timed exam</h2>
            <p className="text-slate-400 my-4">
              30 questions · 3 hours · 8 general, 14 univariate, 8 multivariate.
              Answers are revealed after submission. The timer continues when
              you leave the page.
            </p>
            <button className={button} onClick={start}>
              Start timed exam
            </button>
          </section>
        </div>
      )}
      {exam && !exam.submittedAt && current && (
        <section className="mt-8 space-y-5">
          <div className="flex flex-wrap gap-4 justify-between items-center rounded-xl p-5 bg-slate-900 border border-slate-700">
            <p
              className="font-mono text-2xl"
              role="timer"
              aria-label="Time remaining"
            >
              {Math.floor(remaining / 3600)}:
              {String(Math.floor((remaining % 3600) / 60)).padStart(2, '0')}:
              {String(remaining % 60).padStart(2, '0')}
            </p>
            <p>{answered}/30 answered · saved in this browser</p>
            <button
              onClick={() => setCalculator(!calculator)}
              className="text-teal-300"
            >
              Calculator
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, i) => (
              <button
                key={q.key}
                aria-label={`Question ${i + 1}${exam.answers[q.key] !== undefined ? ', answered' : ''}`}
                aria-current={index === i ? 'step' : undefined}
                className={`w-10 h-10 rounded border ${index === i ? 'bg-teal-900 border-teal-300' : exam.answers[q.key] !== undefined ? 'bg-blue-950 border-blue-500' : 'border-slate-700'}`}
                onClick={() => setIndex(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="rounded-xl bg-slate-900 border border-slate-700 p-6">
            <h2 className="text-lg whitespace-pre-wrap mb-6">
              {index + 1}. {current.question}
            </h2>
            <div className="space-y-3">
              {current.options.map((o, i) => (
                <button
                  key={i}
                  aria-pressed={exam.answers[current.key] === i}
                  onClick={() => choose(i)}
                  className={`w-full text-left rounded-lg p-4 border ${exam.answers[current.key] === i ? 'border-teal-300 bg-teal-950' : 'border-slate-600'}`}
                >
                  {String.fromCharCode(65 + i)}. {o}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                disabled={index === 0}
                className="disabled:opacity-40"
                onClick={() => setIndex(index - 1)}
              >
                ← Previous
              </button>
              <button
                disabled={index === 29}
                className="disabled:opacity-40"
                onClick={() => setIndex(index + 1)}
              >
                Next →
              </button>
            </div>
          </div>
          <details className="border border-slate-700 rounded-xl p-5">
            <summary className="cursor-pointer">Finish and submit exam</summary>
            <p className="my-4">
              {30 - answered} unanswered questions will count as incorrect.
              Submission ends this session and reveals the solutions.
            </p>
            <button className={button} onClick={submit}>
              Submit answers
            </button>
          </details>
        </section>
      )}
      {exam?.submittedAt && (
        <section className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold">
            Exam review:{' '}
            {
              questions.filter((q) => exam.answers[q.key] === q.correctIndex)
                .length
            }
            /30 correct
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {topicGroups.map((g) => {
              const qs = questions.filter((q) => q.group === g.id);
              return (
                <div key={g.id} className="rounded-xl bg-slate-900 p-5">
                  <p className="text-sm text-slate-400">{g.title}</p>
                  <p className="text-2xl mt-2">
                    {
                      qs.filter((q) => exam.answers[q.key] === q.correctIndex)
                        .length
                    }
                    /{qs.length}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="text-slate-400">
            Missed and unanswered questions are available at your study desk.
            Your most recent exam remains here until you start another.
          </p>
          {questions.map((q, i) => (
            <details
              key={q.key}
              className="border border-slate-700 rounded-xl p-5"
            >
              <summary className="cursor-pointer">
                {i + 1}.{' '}
                {exam.answers[q.key] === q.correctIndex
                  ? '✓ Correct'
                  : 'Review'}{' '}
                · {q.topic}
              </summary>
              <p className="whitespace-pre-wrap my-4">{q.question}</p>
              <p className="text-slate-400">
                Your answer:{' '}
                {exam.answers[q.key] === undefined
                  ? 'Unanswered'
                  : q.options[exam.answers[q.key]]}
              </p>
              <p className="text-teal-300 my-2">
                Correct: {q.options[q.correctIndex]}
              </p>
              <p className="whitespace-pre-wrap text-slate-300">
                {q.explanation}
              </p>
              <Link
                className="inline-block mt-4 text-teal-300"
                href={lessonHref('exam-p', q.section)}
              >
                Review lesson →
              </Link>
            </details>
          ))}
          <button className={button} onClick={start}>
            Start another exam
          </button>
          <button
            className="ml-4 text-teal-300"
            onClick={() =>
              updateProgress('exam-p', (old) => ({ ...old, exam: undefined }))
            }
          >
            Return to practice choices
          </button>
        </section>
      )}
      {!exam && mixed.length > 0 && (
        <MixedSet key={mixed.map((q) => q.key).join(',')} questions={mixed} />
      )}
      {calculator && (
        <ExamCalculator isOpen onToggle={() => setCalculator(false)} />
      )}
    </CourseShell>
  );
}
function MixedSet({ questions }: { questions: BankQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [index, setIndex] = useState(0);
  const q = questions[index],
    answer = answers[q.key];
  const choose = (i: number) => {
    setAnswers((old) => ({ ...old, [q.key]: i }));
    recordAnswer('exam-p', q.key, i, i === q.correctIndex);
  };
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900 p-6 space-y-5">
      <h2 className="text-xl">
        Mixed set · Question {index + 1} of {questions.length}
      </h2>
      <p className="whitespace-pre-wrap">{q.question}</p>
      <div className="space-y-3">
        {q.options.map((o, i) => (
          <button
            className={`w-full text-left rounded-lg border p-4 ${answer !== undefined && i === q.correctIndex ? 'border-teal-400 bg-teal-950' : answer === i ? 'border-rose-400' : 'border-slate-600'}`}
            key={i}
            disabled={answer !== undefined}
            onClick={() => choose(i)}
          >
            {String.fromCharCode(65 + i)}. {o}
          </button>
        ))}
      </div>
      {answer !== undefined && (
        <p className="whitespace-pre-wrap text-slate-300">
          {answer === q.correctIndex ? 'Correct. ' : 'Review: '}
          {q.explanation}
        </p>
      )}
      <div className="flex gap-5">
        <button
          disabled={!index}
          className="disabled:opacity-40"
          onClick={() => setIndex(index - 1)}
        >
          Previous
        </button>
        <button
          disabled={index === questions.length - 1}
          className="disabled:opacity-40"
          onClick={() => setIndex(index + 1)}
        >
          Next
        </button>
      </div>
      {Object.keys(answers).length === questions.length && (
        <p className="text-teal-300">
          Set complete:{' '}
          {questions.filter((q) => answers[q.key] === q.correctIndex).length}/
          {questions.length} correct. Visit your study desk to review mistakes.
        </p>
      )}
    </section>
  );
}
