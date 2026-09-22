'use client';
import { useMemo, useSyncExternalStore } from 'react';
import type { CourseId } from './types';
export interface Attempt {
  selected: number | null;
  correct: boolean | null;
  tries: number;
  misses: number;
  lastAt: number;
}
export interface ExamSession {
  keys: string[];
  answers: Record<string, number>;
  startedAt: number;
  deadline: number;
  submittedAt?: number;
}
export interface Progress {
  version: 1;
  completed: string[];
  attempts: Record<string, Attempt>;
  positions: Record<string, number>;
  scratch: Record<string, string>;
  lastLesson?: string;
  exam?: ExamSession;
  storageWarning?: boolean;
}
const EMPTY: Progress = {
  version: 1,
  completed: [],
  attempts: {},
  positions: {},
  scratch: {},
};
const EMPTY_RAW = JSON.stringify(EMPTY);
const memory = new Map<string, string>();
const failedStorage = new Set<CourseId>();
const eventName = 'frontierminds-progress';
function key(course: CourseId) {
  return `frontierminds:progress:v1:${course}`;
}
function readRaw(course: CourseId): string {
  if (typeof window === 'undefined') return EMPTY_RAW;
  if (failedStorage.has(course)) return memory.get(course) ?? EMPTY_RAW;
  try {
    return (
      window.localStorage.getItem(key(course)) ??
      memory.get(course) ??
      EMPTY_RAW
    );
  } catch {
    return memory.get(course) ?? EMPTY_RAW;
  }
}
export function parseProgress(raw: string): Progress {
  try {
    const p = JSON.parse(raw);
    if (
      p.version !== 1 ||
      !Array.isArray(p.completed) ||
      !p.attempts ||
      !p.positions ||
      !p.scratch
    )
      return { ...EMPTY };
    const attempts: Progress['attempts'] = {};
    for (const [id, value] of Object.entries(p.attempts)) {
      const a = value as Attempt;
      if (
        a &&
        (a.selected === null || Number.isInteger(a.selected)) &&
        (a.correct === null || typeof a.correct === 'boolean') &&
        Number.isFinite(a.tries) &&
        Number.isFinite(a.misses)
      )
        attempts[id] = a;
    }
    const exam = p.exam;
    const validExam =
      exam &&
      Array.isArray(exam.keys) &&
      exam.keys.length === 30 &&
      exam.keys.every((k: unknown) => typeof k === 'string') &&
      new Set(exam.keys).size === 30 &&
      exam.answers &&
      Number.isFinite(exam.startedAt) &&
      Number.isFinite(exam.deadline);
    return {
      ...EMPTY,
      completed: p.completed.filter((x: unknown) => typeof x === 'string'),
      attempts,
      positions: p.positions,
      scratch: p.scratch,
      lastLesson: typeof p.lastLesson === 'string' ? p.lastLesson : undefined,
      exam: validExam ? exam : undefined,
      storageWarning: p.storageWarning === true,
    };
  } catch {
    return { ...EMPTY };
  }
}
export function updateProgress(
  course: CourseId,
  update: (p: Progress) => Progress,
) {
  let next = update(parseProgress(readRaw(course)));
  next = { ...next, version: 1, storageWarning: false };
  let raw = JSON.stringify(next);
  try {
    window.localStorage.setItem(key(course), raw);
    failedStorage.delete(course);
  } catch {
    failedStorage.add(course);
    next = { ...next, storageWarning: true };
    raw = JSON.stringify(next);
    // In-memory fallback preserves work during this visit if storage is unavailable.
    try {
      window.localStorage.removeItem(key(course));
    } catch {
      /* unavailable */
    }
  }
  memory.set(course, raw);
  window.dispatchEvent(new Event(eventName));
}
function subscribe(callback: () => void) {
  window.addEventListener(eventName, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(eventName, callback);
    window.removeEventListener('storage', callback);
  };
}
export function useProgress(course: CourseId) {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(course),
    () => EMPTY_RAW,
  );
  return useMemo(() => parseProgress(raw), [raw]);
}
export function recordAnswer(
  course: CourseId,
  questionKey: string,
  selected: number,
  correct: boolean,
) {
  updateProgress(course, (p) => {
    const old = p.attempts[questionKey];
    return {
      ...p,
      attempts: {
        ...p.attempts,
        [questionKey]: {
          selected,
          correct,
          tries: (old?.tries ?? 0) + 1,
          misses: (old?.misses ?? 0) + (correct ? 0 : 1),
          lastAt: Date.now(),
        },
      },
    };
  });
}

export function saveExamAnswer(questionKey: string, selected: number) {
  updateProgress('exam-p', (p) => {
    if (
      !p.exam ||
      p.exam.submittedAt ||
      Date.now() >= p.exam.deadline ||
      !p.exam.keys.includes(questionKey)
    )
      return p;
    return {
      ...p,
      exam: {
        ...p.exam,
        answers: { ...p.exam.answers, [questionKey]: selected },
      },
    };
  });
}
