/* eslint-disable @typescript-eslint/no-require-imports -- Exercise the route with a mocked provider; no network or credentials. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function compile(relativePath) {
  const source = fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
  let output;
  try {
    const ts = require('typescript');
    output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
    output = require('node:module').stripTypeScriptTypes(source);
  }
  return output.replace(/^import .*?;\s*$/gm, '').replace(/\bexport (?=(?:async )?(?:function|const|let))/g, '');
}

const content = {};
vm.runInNewContext(`${compile('src/content/community.ts')}\nObject.assign(output, {communityGuides,communityTasks});`, { output: content });

function route({ configured = true, fail = false } = {}) {
  const calls = [];
  const context = {
    ...content, Uint8Array, TextDecoder, Date,
    process: { env: configured ? { OPENAI_API_KEY: 'test-only-placeholder' } : {} },
    NextResponse: { json: (body, options) => Response.json(body, options) },
    OpenAI: class {
      constructor() {
        this.chat = { completions: { create: async (request) => {
          calls.push(request);
          if (fail) throw new Error('Provider unavailable');
          return { choices: [{ message: { content: 'Orientación de prueba.' } }] };
        } } };
      }
    },
    output: {},
  };
  vm.runInNewContext(`${compile('src/app/api/community-help/route.ts')}\noutput.POST = POST;`, context);
  return { post: context.output.POST, calls };
}

function request(body, overrides = {}) {
  const req = new Request('https://frontierminds.io/api/community-help', {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...overrides },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
  req.nextUrl = new URL(req.url);
  return req;
}

test('AI accepts only curated tasks and never forwards extra visitor fields', async () => {
  const { post, calls } = route();
  for (const bad of [null, [], { topic: 'unknown', task: 'pasos' }, { topic: 'luz', task: '__proto__' }, { topic: 'luz', task: 'pasos', email: 'private@example.com' }, { topic: 'luz', task: 'pasos', message: 'private text' }]) {
    const response = await post(request(bad));
    assert.equal(response.status, 400);
  }
  assert.equal(calls.length, 0);
  assert.equal((await post(request('{broken'))).status, 400);
  assert.equal((await post(request({ topic: 'luz', task: 'pasos' }, { Origin: 'https://other.example' }))).status, 403);
  assert.equal((await post(request({ topic: 'luz', task: 'pasos' }, { 'Content-Type': 'text/plain' }))).status, 415);
  assert.equal((await post(request('x'.repeat(1025)))).status, 413);
});

test('each topic and task uses only the selected guide and disables completion storage', async () => {
  const { post, calls } = route();
  for (const guide of content.communityGuides) {
    for (const task of Object.keys(content.communityTasks)) {
      const response = await post(request({ topic: guide.id, task }));
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.equal((await response.json()).reply, 'Orientación de prueba.');
      const sent = calls.at(-1);
      assert.equal(sent.store, false);
      assert.equal(sent.messages.length, 2);
      assert.ok(sent.messages[1].content.includes(JSON.stringify(guide)));
      assert.ok(sent.messages[1].content.startsWith(content.communityTasks[task]));
    }
  }
});

test('missing configuration, provider failure, and the request cap produce recoverable responses', async () => {
  const unavailable = route({ configured: false });
  assert.equal((await unavailable.post(request({ topic: 'luz', task: 'pasos' }))).status, 503);
  assert.equal(unavailable.calls.length, 0);
  const failing = route({ fail: true });
  assert.equal((await failing.post(request({ topic: 'luz', task: 'pasos' }))).status, 502);
  const limited = route();
  for (let i = 0; i < 20; i++) assert.equal((await limited.post(request({ topic: 'luz', task: 'lista' }))).status, 200);
  const response = await limited.post(request({ topic: 'luz', task: 'lista' }));
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '60');
  assert.equal(limited.calls.length, 20);
});
