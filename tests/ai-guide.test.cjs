/* eslint-disable @typescript-eslint/no-require-imports -- Compile TSX for dependency-free node:test rendering checks. */
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const test = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

// CSS Modules affect presentation, not the links checked by server rendering.
require.extensions['.css'] = function (module) {
  module.exports = { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
};

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

test('both activities have direct homepage links, distinct previews and standalone entry points', () => {
  const home = render(require('../src/app/page.tsx').default);
  const school = require('../src/app/comunidad/practicar-llamada-escuela/page.tsx');
  const lab = require('../src/app/courses/salesforce/labs/email-to-case/page.tsx');
  const activities = require('../src/content/activities.ts');
  for (const [page, activity] of [[school, activities.schoolCall], [lab, activities.emailCaseLab]]) {
    assert.ok(home.includes('href="' + activity.path + '"'));
    assert.ok(render(page.default).includes(activity.title));
    assert.equal(page.metadata.openGraph.url, 'https://www.frontierminds.io' + activity.path);
    assert.equal(page.metadata.twitter.images[0], page.metadata.openGraph.url + '/opengraph-image');
  }
  assert.notEqual(school.metadata.openGraph.title, lab.metadata.openGraph.title);
});

test('the community preparation form names the available source', () => {
  const hub = require('../src/components/community/CommunityHub.tsx').default;
  assert.ok(render(hub, { aiEnabled: true }).includes('Preparar con IA'));
  const guideOnly = render(hub, { aiEnabled: false });
  assert.ok(guideOnly.includes('Preparar con la guía'));
  assert.ok(!guideOnly.includes('Preparar con IA'));
});

test('new labs are reachable from home and each course without a provider', async () => {
  const home = render(require('../src/app/page.tsx').default);
  const overview = require('../src/components/learning/CourseOverview.tsx').default;
  const actuarial = require('../src/app/courses/exam-p/labs/deductible/page.tsx');
  const review = require('../src/app/courses/salesforce/labs/response-review/page.tsx');
  const { deductibleLab, responseLab } = require('../src/content/activities.ts');
  for (const [course, lab, page] of [['exam-p', deductibleLab, actuarial], ['salesforce', responseLab, review]]) {
    assert.ok(home.includes('href="' + lab.path + '"'));
    assert.ok(render(overview, { course }).includes('href="' + lab.path + '"'));
    assert.equal(page.metadata.openGraph.url, 'https://www.frontierminds.io' + lab.path);
  }
  const custom = renderToStaticMarkup(await actuarial.default({ searchParams: Promise.resolve({ deductible: '1000' }) }));
  assert.match(custom, /id="deductible"[^>]*value="1000"/);
  assert.ok(render(review.default).includes('Document receipt'));
  const practice = require('../src/components/PracticeProblems.tsx').default;
  const settings = require('../src/components/learning/TutorAvailability.tsx').TutorSettings;
  const quiz = React.createElement(practice, { section: '6.1', course: 'exam-p' });
  const noKey = renderToStaticMarkup(React.createElement(settings, { enabled: false }, quiz));
  assert.ok(noKey.includes('Show hint') && !noKey.includes('Ask AI tutor'));
  assert.ok(renderToStaticMarkup(React.createElement(settings, { enabled: true }, quiz)).includes('Ask AI tutor'));
});

test('guide is discoverable from home and Exam P without changing Salesforce resources', () => {
  const Home = require('../src/app/page.tsx').default;
  const Overview = require('../src/components/learning/CourseOverview.tsx').default;
  const href = 'href="/guides/ai-probability-actuarial-science"';
  assert.ok(render(Home).includes(href));
  assert.ok(render(Overview, { course: 'exam-p' }).includes(href));
  assert.ok(!render(Overview, { course: 'salesforce' }).includes(href));
});

