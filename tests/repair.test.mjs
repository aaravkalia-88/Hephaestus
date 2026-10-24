import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const app = new URL('../evals/fixtures/repair-after/app.mjs', import.meta.url);
const source = readFileSync(app, 'utf8');
const settle = () => new Promise(resolve => setImmediate(resolve));
const response = (names, ok = true) => ({ ok, json: async () => names });
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};

function boot(fetchResponse) {
  const nodes = new Map();
  let document;
  class Element {
    constructor() {
      this.textContent = '';
      this.children = [];
      this.attributes = new Map();
      this.listeners = new Map();
      this.dataset = {};
      this.hidden = false;
      this.disabled = false;
    }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    replaceChildren(...children) { this.children = children; }
    append(...children) { this.children.push(...children); }
    addEventListener(type, listener) { this.listeners.set(type, listener); }
    querySelector(selector) { return nodes.get(selector); }
    focus() { document.activeElement = this; }
    dispatch(type) {
      const event = { prevented: false, preventDefault() { this.prevented = true; } };
      this.listeners.get(type)?.(event);
      return event;
    }
  }
  for (const id of ['controls', 'scenario', 'status', 'projects', 'retry', 'load-button']) {
    nodes.set(`#${id}`, new Element());
  }
  nodes.set('button[type="submit"]', nodes.get('#load-button'));
  nodes.get('#scenario').value = 'success';
  nodes.get('#retry').hidden = true;
  document = { querySelector: selector => nodes.get(selector), createElement: () => new Element() };
  const requests = [];
  vm.runInNewContext(source, {
    document,
    AbortController,
    fetch(url, options) {
      requests.push({ url, options });
      return fetchResponse(url, options, requests.length);
    },
  }, { filename: app.href });
  return {
    nodes, document, requests,
    status: nodes.get('#status'), list: nodes.get('#projects'), retry: nodes.get('#retry'),
    scenario: nodes.get('#scenario'), load: nodes.get('#load-button'),
    submit: () => nodes.get('#controls').dispatch('submit'),
    names: () => nodes.get('#projects').children.map(item => item.textContent),
  };
}

test('pending request announces loading without disabling the selected screen', () => {
  const ui = boot(() => new Promise(() => {}));
  assert.match(ui.status.textContent, /loading projects/i);
  assert.equal(ui.list.getAttribute('aria-busy'), 'true');
  assert.equal(ui.scenario.disabled, false);
  assert.equal(ui.load.disabled, false);
  assert.equal(ui.retry.hidden, true);
});

test('success renders returned strings literally and announces a real count', async () => {
  const names = ['Harbor', '<img src=x onerror=alert(1)>', ''];
  const ui = boot(async () => response(names));
  await settle();
  assert.deepEqual(ui.names(), names);
  assert.equal(ui.list.children[1].children.length, 0);
  assert.match(ui.status.textContent, /3 projects loaded/i);
  assert.equal(ui.list.getAttribute('aria-busy'), 'false');
  assert.equal(ui.retry.hidden, true);
});

test('empty success is distinct from loading and failure', async () => {
  const ui = boot(async () => response([]));
  await settle();
  assert.deepEqual(ui.names(), []);
  assert.match(ui.status.textContent, /no projects/i);
  assert.equal(ui.retry.hidden, true);
  assert.equal(ui.list.getAttribute('aria-busy'), 'false');
});

test('HTTP failure never renders even a plausible success body', async () => {
  const ui = boot(async () => response(['Not a success'], false));
  await settle();
  assert.deepEqual(ui.names(), []);
  assert.match(ui.status.textContent, /could not|couldn't|failed|unable/i);
  assert.equal(ui.retry.hidden, false);
  assert.equal(ui.list.getAttribute('aria-busy'), 'false');
});

for (const [label, data] of [
  ['object', { projects: ['Harbor'] }],
  ['string', 'Harbor'],
  ['mixed array', ['Harbor', 42]],
  ['null', null],
]) {
  test(`malformed ${label} is rejected without partial rows`, async () => {
    const ui = boot(async () => response(data));
    await settle();
    assert.deepEqual(ui.names(), []);
    assert.match(ui.status.textContent, /invalid|unexpected|malformed/i);
    assert.equal(ui.retry.hidden, false);
    assert.equal(ui.list.getAttribute('aria-busy'), 'false');
  });
}

test('invalid JSON has a recoverable error state', async () => {
  const ui = boot(async () => ({ ok: true, json: async () => { throw new SyntaxError('Invalid JSON'); } }));
  await settle();
  assert.match(ui.status.textContent, /invalid|unexpected|malformed/i);
  assert.equal(ui.retry.hidden, false);
  assert.equal(ui.list.getAttribute('aria-busy'), 'false');
});

test('connection failure announces recovery without inventing projects', async () => {
  const ui = boot(async () => { throw new TypeError('private transport detail'); });
  await settle();
  assert.deepEqual(ui.names(), []);
  assert.match(ui.status.textContent, /connect|connection/i);
  assert.doesNotMatch(ui.status.textContent, /private transport detail/);
  assert.equal(ui.retry.hidden, false);
  assert.equal(ui.list.getAttribute('aria-busy'), 'false');
});

test('retry repeats the failed read and recovers, leaving focus on a visible control', async () => {
  const ui = boot(async (_url, _options, count) => {
    if (count === 1) throw new TypeError('Disconnected');
    return response(['Recovered']);
  });
  await settle();
  ui.retry.focus();
  ui.retry.dispatch('click');
  await settle();
  assert.equal(ui.requests.length, 2);
  assert.equal(ui.requests[1].url, ui.requests[0].url);
  assert.deepEqual(ui.names(), ['Recovered']);
  assert.equal(ui.retry.hidden, true);
  assert.equal(ui.document.activeElement, ui.load);
});

test('submitting another choice preserves the encoded GET contract', async () => {
  const ui = boot(async () => response(['Harbor']));
  await settle();
  ui.scenario.value = 'slow & extra=bad';
  assert.equal(ui.submit().prevented, true);
  await settle();
  assert.equal(ui.requests[1].url, '/api/projects?scenario=slow%20%26%20extra%3Dbad');
  assert.equal(ui.requests[1].options?.method ?? 'GET', 'GET');
});

test('an older completion cannot replace the latest result, even if cancellation is ignored', async () => {
  const older = deferred();
  const newer = deferred();
  const ui = boot((_url, _options, count) => count === 1 ? older.promise : newer.promise);
  ui.scenario.value = 'slow';
  ui.submit();
  newer.resolve(response(['Latest']));
  await settle();
  older.resolve(response(['Outdated']));
  await settle();
  assert.deepEqual(ui.names(), ['Latest']);
  assert.match(ui.status.textContent, /1 project loaded/i);
  assert.equal(ui.retry.hidden, true);
});

test('obsolete failure cannot overwrite a newer loading state', async () => {
  const older = deferred();
  const newer = deferred();
  const ui = boot((_url, _options, count) => count === 1 ? older.promise : newer.promise);
  ui.submit();
  older.reject(new TypeError('Old failure'));
  await settle();
  assert.match(ui.status.textContent, /loading projects/i);
  assert.equal(ui.retry.hidden, true);
  assert.equal(ui.list.getAttribute('aria-busy'), 'true');
  newer.resolve(response(['Latest']));
  await settle();
  assert.deepEqual(ui.names(), ['Latest']);
});

test('a replacement request cancels the obsolete request', () => {
  const ui = boot(() => new Promise(() => {}));
  ui.submit();
  assert.equal(ui.requests[0].options?.signal.aborted, true);
  assert.equal(ui.requests[1].options?.signal.aborted, false);
});

test('a failed refresh clears previous rows rather than presenting stale success', async () => {
  const ui = boot(async (_url, _options, count) => count === 1 ? response(['Old result']) : response(['Wrong'], false));
  await settle();
  assert.deepEqual(ui.names(), ['Old result']);
  ui.submit();
  await settle();
  assert.deepEqual(ui.names(), []);
  assert.equal(ui.retry.hidden, false);
});
