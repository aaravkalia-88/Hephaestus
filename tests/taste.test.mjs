import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const vendor = fileURLToPath(new URL('../skills/hephaestus/vendor/taste/', import.meta.url));
function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), 'hephaestus-taste-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return { dir, run: (script, args) => spawnSync(process.execPath, [join(vendor, 'scripts', script), ...args], { cwd: dir, encoding: 'utf8', timeout: 15000, env: { ...process.env, TASTE_SKILL_HISTORY: join(dir, 'history.json') } }) };
}

test('bundled Taste draws page and app directions without a global installation', t => {
  const { dir, run } = fixture(t);
  for (const [name, args] of [['page', ['--sector', 'dev-tool', '--sections', 'features,footer']], ['app', ['--app', '--kind', 'analytics']]]) {
    const out = join(dir, name);
    const result = run('draw.mjs', [...args, '--brief', 'Review queue for release evidence', '--keep', 'palette,type', '--seed', '42', '--out', out]);
    assert.equal(result.status, 0, result.stderr);
    const sheet = JSON.parse(readFileSync(join(out, 'direction.json')));
    assert.deepEqual(sheet.input.keep, ['palette', 'type']);
    assert.equal(sheet.input.brief, 'Review queue for release evidence');
    if (name === 'app') assert.equal(sheet.kind, 'app');
  }
});

test('bundled source lint detects a gradient and preserves real code typography', t => {
  const { dir, run } = fixture(t);
  const source = join(dir, 'styles.css');
  writeFileSync(source, '.hero { background: linear-gradient(red, blue); }\n');
  const bad = run('lint.mjs', [source, '--json']);
  assert.equal(bad.status, 1);
  assert.ok(JSON.parse(bad.stdout).findings.some(finding => finding.id === 'gradient'));
  writeFileSync(source, 'pre { font-family: monospace; }\n');
  const code = run('lint.mjs', [source, '--json']);
  assert.equal(code.status, 0, code.stderr);
  assert.equal(JSON.parse(code.stdout).findings.some(finding => finding.id === 'mono'), false);
});

test('bundled inspector rejects filesystem targets before opening a browser or serving private files', t => {
  const { dir, run } = fixture(t);
  const file = join(dir, 'index.html');
  writeFileSync(file, '<h1>Private source fixture</h1>');
  const result = run('inspect.mjs', [file, '--json']);
  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /HTTP|URL/i);
  assert.equal(existsSync(join(dir, '.taste-skill/inspect')), false);
});
