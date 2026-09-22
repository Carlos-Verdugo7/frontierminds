import type {
  Chapter,
  CourseId,
  TopicGroup,
  Lesson,
} from '@/lib/learning/types';
import { problems as originalProblems, type Problem } from './exam-p/problems';
import { lessons as examLessons } from './exam-p/lessons';
import { lessons as salesforceLessons } from './salesforce/lessons';

export const syllabus = {
  label: 'November 2026 SOA syllabus',
  url: 'https://www.soa.org/globalassets/assets/files/edu/2026/fall/syllabi/2026-11-exam-p-syllabus.pdf',
};
export const topicGroups = [
  { id: 'general', title: 'General Probability', weight: '23–30%' },
  { id: 'univariate', title: 'Univariate Random Variables', weight: '44–50%' },
  {
    id: 'multivariate',
    title: 'Multivariate Random Variables',
    weight: '23–30%',
  },
];
const existing = [
  [
    'Probability Fundamentals',
    'Build a language for uncertainty.',
    [
      'Properties of Probability',
      'Methods of Enumeration',
      'Conditional Probability',
      'Independent Events',
      'Bayes’ Theorem',
    ],
  ],
  [
    'Discrete Distributions',
    'Model counts, outcomes, and waiting times.',
    [
      'Discrete Random Variables',
      'Mathematical Expectation',
      'Variance & Moments',
      'Binomial Distribution',
      'Geometric & Negative Binomial',
      'Poisson Distribution',
    ],
  ],
  [
    'Continuous Distributions',
    'Connect density, area, and probability.',
    [
      'Continuous Random Variables',
      'Exponential & Gamma',
      'Normal Distribution',
      'Beta & Additional Models',
    ],
  ],
] as const;
export const examChapters: Chapter[] = existing.map(
  ([title, description, names], i) => ({
    id: i + 1,
    title,
    description,
    lessons: names.map((name, j) => ({
      id: `${i + 1}.${j + 1}`,
      title: name,
      enrichment:
        i === 2 && j === 3
          ? 'Beta is core; Weibull and Pareto are optional enrichment.'
          : i === 2 && j === 1
            ? 'Chi-square is optional enrichment.'
            : i === 1 && [2, 3, 5].includes(j)
              ? 'MGF techniques are optional enrichment.'
              : undefined,
    })),
  }),
);
for (const [id, title, description] of [
  [
    4,
    'Multivariate Distributions',
    'Joint tables, conditional distributions, and dependence.',
  ],
  [5, 'Sums, Order Statistics & CLT', 'Combine risks and explore samples.'],
  [6, 'Insurance Applications', 'Turn losses into policy payments.'],
] as const)
  examChapters.push({
    id,
    title,
    description,
    lessons: examLessons
      .filter((l) => l.id.startsWith(`${id}.`))
      .map((l) => ({ id: l.id, title: l.title })),
  });

export const courses: Record<
  CourseId,
  { title: string; description: string; chapters: Chapter[]; lessons: Lesson[] }
> = {
  'exam-p': {
    title: 'Actuarial Exam P',
    description:
      'Build probability intuition, explore simulations, and practice for Exam P.',
    chapters: examChapters,
    lessons: examLessons,
  },
  salesforce: {
    title: 'Salesforce Foundations',
    description:
      'Build a customer-support workflow, from data model to automation and reporting.',
    chapters: [
      {
        id: 1,
        title: 'Build a Support Workspace',
        description: 'Six applied lessons and a practice-org capstone.',
        lessons: salesforceLessons.map((l) => ({ id: l.id, title: l.title })),
      },
    ],
    lessons: salesforceLessons,
  },
};
export function isCourse(value: string): value is CourseId {
  return value === 'exam-p' || value === 'salesforce';
}
export function lessonHref(course: CourseId, id: string) {
  const [chapter, section] = id.split('.');
  return `/courses/${course}/chapter/${chapter}/section/${section}`;
}
export function lessonTitle(course: CourseId, id: string) {
  return (
    courses[course].lessons.find((l) => l.id === id)?.title ??
    courses[course].chapters.flatMap((c) => c.lessons).find((l) => l.id === id)
      ?.title ??
    id
  );
}
export function groupFor(id: string): TopicGroup {
  const chapter = Number(id.split('.')[0]);
  return chapter === 0
    ? 'foundation'
    : chapter === 1
      ? 'general'
      : chapter === 4 || chapter === 5
        ? 'multivariate'
        : 'univariate';
}
export const questionBank: Record<CourseId, Record<string, Problem[]>> = {
  'exam-p': {
    ...Object.fromEntries(
      Object.entries(originalProblems).map(([id, items]) => [
        id,
        items.map((p) => ({
          ...p,
          enrichment:
            /\bMGF\b|moment.generating|chi.square|weibull|pareto|hazard rate/i.test(
              `${p.question} ${p.topic} ${p.explanation}`,
            ),
        })),
      ]),
    ),
    ...Object.fromEntries(examLessons.map((l) => [l.id, l.problems])),
  },
  salesforce: Object.fromEntries(
    salesforceLessons.map((l) => [l.id, l.problems]),
  ),
};
export type BankQuestion = Problem & {
  section: string;
  key: string;
  group: TopicGroup;
};
export function allQuestions(course: CourseId): BankQuestion[] {
  return Object.entries(questionBank[course]).flatMap(([section, qs]) =>
    qs.map((q) => ({
      ...q,
      section,
      key: `${section}:${q.id}`,
      group: course === 'exam-p' ? groupFor(section) : 'foundation',
    })),
  );
}
export function shuffle<T>(items: T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
// 8/14/8 questions: 26.7% general, 46.7% univariate, 26.7% multivariate.
export function createExam(random = Math.random): BankQuestion[] {
  const bank = allQuestions('exam-p').filter((q) => !q.enrichment);
  const selected = (['general', 'univariate', 'multivariate'] as const).flatMap(
    (group, i) => {
      const count = [8, 14, 8][i];
      const pool = bank.filter((q) => q.group === group);
      if (pool.length < count)
        throw new Error(`Insufficient ${group} questions`);
      return shuffle(pool, random).slice(0, count);
    },
  );
  return shuffle(selected, random);
}
