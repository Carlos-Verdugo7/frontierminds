/* eslint-disable @typescript-eslint/no-require-imports -- Compile TSX for dependency-free node:test rendering checks. */
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const test = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  return originalResolve.call(this, request.startsWith('@/')
    ? path.join(__dirname, '../src', request.slice(2)) : request, parent, ...rest);
};
for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = function (module, filename) {
    const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    });
    module._compile(outputText, filename);
  };
}
const guide = require('../src/app/guides/ai-probability-actuarial-science/page.tsx');
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));
const html = render(guide.default);

test('AI guide renders accessible disclosures, working in-page anchors, and source links', () => {
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  assert.equal((html.match(/<details[ >]/g) || []).length, 2);
  assert.equal((html.match(/<summary[ >]/g) || []).length, 2);
  assert.equal((html.match(/<details[^>]* open/g) || []).length, 0);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.includes(anchor), `Missing anchor: ${anchor}`);
  }
  for (const source of ['nist.gov', 'soa.org']) assert.ok(html.includes(source));
  assert.match(html, /Do not use AI during Exam P/);
  assert.match(html, /not an Exam P syllabus section/);
  assert.match(guide.metadata.title, /AI, Probability/);
  assert.equal(guide.metadata.twitter.description, guide.metadata.description);
});

test('worked base-rate example has the correct independently calculated answer', () => {
  const population = 10000;
  const trueFlags = population * 0.01 * 0.9;
  const falseFlags = population * 0.99 * 0.05;
  assert.equal(trueFlags, 90);
  assert.equal(falseFlags, 495);
  assert.ok(html.includes(`${trueFlags} / (${trueFlags} + ${falseFlags})`));
  assert.ok(html.includes(`${(100 * trueFlags / (trueFlags + falseFlags)).toFixed(2)}%`));
});

test('guide is discoverable from home and Exam P without changing Salesforce resources', () => {
  const Home = require('../src/app/page.tsx').default;
  const Overview = require('../src/components/learning/CourseOverview.tsx').default;
  const href = 'href="/guides/ai-probability-actuarial-science"';
  assert.ok(render(Home).includes(href));
  assert.ok(render(Overview, { course: 'exam-p' }).includes(href));
  assert.ok(!render(Overview, { course: 'salesforce' }).includes(href));
});
