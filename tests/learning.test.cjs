/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS loader compiles TS modules for node:test. */
// Run TypeScript data/logic through the project's existing TypeScript compiler.
// No browser or extra test dependency is required for these regression checks.
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  return originalResolve.call(
    this,
    request.startsWith('@/')
      ? path.join(__dirname, '../src', request.slice(2))
      : request,
    parent,
    ...rest,
  );
};
require.extensions['.ts'] = function (module, filename) {
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  module._compile(code, filename);
};
const test = require('node:test');
const assert = require('node:assert/strict');
const { jointStats, payment, moments } = require('../src/lib/learning/math.ts');
const {
  allQuestions,
  createExam,
  courses,
  questionBank,
  shuffle,
} = require('../src/content/catalog.ts');
const {
  parseProgress,
  updateProgress,
  recordAnswer,
  saveExamAnswer,
} = require('../src/lib/learning/progress.ts');
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);

test('joint table calculates marginals, dependence, and undefined boundary cases', () => {
  const s = jointStats([1, 2, 3, 4]);
  close(s.rows[1], 0.7);
  close(s.cols[1], 0.6);
  close(s.covariance, -0.02);
  close(s.p[2] / s.cols[0], 0.75);
  assert.equal(s.independent, false);
  assert.equal(jointStats([1, 1, 1, 1]).independent, true);
  close(jointStats([1, 0, 0, 1]).correlation, 1);
  close(jointStats([0, 1, 1, 0]).correlation, -1);
  assert.equal(jointStats([0, 0, 0, 0]), null);
  assert.equal(jointStats([1, -1, 1, 1]), null);
  assert.equal(jointStats([1, 1, 0, 0]).correlation, null);
});
test('policy applies inflation, deductible, participation, then PAYMENT cap', () => {
  close(payment(1000, 100, 0.8, 700, 0.1), 700);
  close(payment(1000, 100, 0.8, 2000, 0.1), 800);
  close(payment(80, 100, 1, 1000, 0), 0);
  close(payment(1000, 100, 0, 1000, 0), 0);
  close(payment(1000, 100, 1, 0, 0), 0);
  const s = moments([0, 0, 200], [0.5, 0.3, 0.2]);
  close(s.mean, 40);
  close(s.variance, 6400);
  close(s.sd, 80);
});
test('question identities, answer choices, and every lesson practice set are valid', () => {
  for (const course of ['exam-p', 'salesforce']) {
    const bank = allQuestions(course);
    assert.equal(new Set(bank.map((q) => q.key)).size, bank.length);
    for (const q of bank) {
      assert.equal(q.options.length, 5, q.key);
      assert.ok(
        Number.isInteger(q.correctIndex) &&
          q.correctIndex >= 0 &&
          q.correctIndex < 5,
        q.key,
      );
      assert.ok(q.question && q.explanation && q.hint, q.key);
    }
    for (const chapter of courses[course].chapters)
      for (const lesson of chapter.lessons)
        assert.ok(questionBank[course][lesson.id]?.length, lesson.id);
  }
});
test('timed exams always contain 30 unique core questions with 8/14/8 balance', () => {
  let seed = 42;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let run = 0; run < 100; run++) {
    const exam = createExam(random);
    assert.equal(exam.length, 30);
    assert.equal(new Set(exam.map((q) => q.key)).size, 30);
    assert.ok(exam.every((q) => !q.enrichment));
    assert.deepEqual(
      ['general', 'univariate', 'multivariate'].map(
        (g) => exam.filter((q) => q.group === g).length,
      ),
      [8, 14, 8],
    );
  }
  const a = [1, 2, 3];
  shuffle(a, random);
  assert.deepEqual(a, [1, 2, 3]);
});
test('corrupt or obsolete storage is discarded safely', () => {
  assert.deepEqual(parseProgress('not json').completed, []);
  assert.deepEqual(parseProgress('{"version":0}').attempts, {});
  const p = parseProgress(
    JSON.stringify({
      version: 1,
      completed: [3, '4.1'],
      attempts: {
        bad: { selected: 'x' },
        good: { selected: 2, correct: true, tries: 1, misses: 0, lastAt: 1 },
      },
      positions: {},
      scratch: {},
      exam: { keys: ['a'], deadline: 3 },
    }),
  );
  assert.deepEqual(p.completed, ['4.1']);
  assert.deepEqual(Object.keys(p.attempts), ['good']);
  assert.equal(p.exam, undefined);
});
test('progress persists across reads, isolates courses, and rejects late exam answers', () => {
  const data = new Map();
  global.window = new EventTarget();
  window.localStorage = {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => data.set(k, v),
    removeItem: (k) => data.delete(k),
  };
  const read = (course) =>
    parseProgress(data.get(`frontierminds:progress:v1:${course}`));
  recordAnswer('exam-p', '4.1:1', 0, false);
  recordAnswer('salesforce', '1.1:1', 2, true);
  recordAnswer('exam-p', '4.1:1', 2, true);
  assert.equal(read('exam-p').attempts['4.1:1'].tries, 2);
  assert.equal(read('exam-p').attempts['4.1:1'].misses, 1);
  assert.equal(read('salesforce').attempts['4.1:1'], undefined);
  const keys = createExam().map((q) => q.key);
  updateProgress('exam-p', (p) => ({
    ...p,
    exam: {
      keys,
      answers: {},
      startedAt: Date.now(),
      deadline: Date.now() + 10000,
    },
  }));
  saveExamAnswer(keys[0], 2);
  assert.equal(read('exam-p').exam.answers[keys[0]], 2);
  updateProgress('exam-p', (p) => ({
    ...p,
    exam: { ...p.exam, deadline: Date.now() - 1 },
  }));
  saveExamAnswer(keys[0], 4);
  assert.equal(read('exam-p').exam.answers[keys[0]], 2);
  updateProgress('exam-p', (p) => ({
    ...p,
    exam: { ...p.exam, deadline: Date.now() + 10000, submittedAt: Date.now() },
  }));
  saveExamAnswer(keys[0], 1);
  assert.equal(read('exam-p').exam.answers[keys[0]], 2);
});
