import assert from 'node:assert/strict';
import { test } from 'node:test';
import { get } from 'node:http';

async function withServer(run) {
  const { createFixtureServer } = await import('../evals/serve.mjs');
  const server = createFixtureServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise(resolve => server.close(resolve)); }
}

test('the fixture serves only explicit public assets and rejects private paths', () => withServer(async base => {
  const page = await fetch(`${base}/before/`);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /Project desk/);
  assert.match(page.headers.get('content-security-policy'), /default-src 'self'/);
  for (const path of ['/README.md', '/.env', '/.git/config', '/skills/hephaestus/SKILL.md', '/%2e%2e/.env', '/before/%2e%2e%2f.env']) {
    assert.equal((await fetch(base + path)).status, 404, path);
  }
  assert.equal((await fetch(`${base}/before/`, { method: 'POST' })).status, 405);
}));

test('response scenarios have deterministic contracts and reject unknown inputs', () => withServer(async base => {
  const get = scenario => fetch(`${base}/api/projects?scenario=${scenario}`);
  const success = await get('success');
  assert.equal(success.status, 200);
  assert.deepEqual(await success.json(), ['Export report', 'Invite reviewer', 'Fix mobile menu']);
  assert.deepEqual(await (await get('empty')).json(), []);
  assert.equal((await get('error')).status, 500);
  assert.deepEqual(await (await get('malformed')).json(), { unexpected: true });
  assert.deepEqual(await (await get('markup')).json(), ['<b>Release review</b>']);
  assert.equal((await get('unknown')).status, 400);
  await assert.rejects(get('network'));
}));

test('a slow response is genuinely delayed so overlapping requests can be exercised', () => withServer(async base => {
  const started = performance.now();
  const slow = fetch(`${base}/api/projects?scenario=slow`);
  const fast = await fetch(`${base}/api/projects?scenario=empty`);
  assert.deepEqual(await fast.json(), []);
  assert.ok(performance.now() - started < 2000);
  assert.equal((await slow).status, 200);
  assert.ok(performance.now() - started >= 2000);
}));

test('malformed request targets return 400 instead of crashing the local server', () => withServer(async base => {
  const status = await new Promise((resolve, reject) => {
    const request = get(`${base}/`, { path: '//[' }, response => { response.resume(); resolve(response.statusCode); }).on('error', reject);
    request.setTimeout(1000, () => request.destroy(new Error('Fixture server did not answer.')));
  });
  assert.equal(status, 400);
  assert.equal((await fetch(`${base}/before/`)).status, 200);
}));
