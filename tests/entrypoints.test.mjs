import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

for (const target of ['frontend', 'backend']) {
  test(`${target} has a distinct, standalone installable skill`, async t => {
    const name = `hephaestus-${target}`;
    const source = new URL(`../skills/${name}/`, import.meta.url);
    const dir = mkdtempSync(join(tmpdir(), 'hephaestus-entrypoint-'));
    t.after(() => rmSync(dir, { recursive: true, force: true }));
    const installed = join(dir, name);
    cpSync(source, installed, { recursive: true });
    const skill = readFileSync(join(installed, 'SKILL.md'), 'utf8');
    assert.equal(skill.match(/^name: (.+)$/m)?.[1], name);
    const metadata = readFileSync(join(installed, 'agents/openai.yaml'), 'utf8');
    assert.ok(metadata.includes(`$${name}`), 'Picker prompt must invoke the selected entry point.');
    const { validateReport } = await import(pathToFileURL(join(installed, 'scripts/check-report.mjs')));
    const checks = target === 'backend' ? Array.from({ length: 7 }, (_, i) => ({ id: `BF-${String(i + 1).padStart(3, '0')}`, kind: 'security', status: 'skipped', evidence: 'Synthetic installation check only.' })) : [];
    const result = validateReport({ schema_version: 1, mode: 'audit', target, baseline: 'synthetic-installation-check', approved_files: [], changed_files: [], required_checks: checks.map(check => check.id), checks, findings: [] });
    assert.equal(result.valid, true, result.errors.join('\n'));
    assert.equal(result.ready, false);
    assert.ok(readFileSync(join(installed, 'assets/hephaestus-logo.png')).length > 0);
  });
}

test('standalone packages can be regenerated in isolation without drift', t => {
  const dir = mkdtempSync(join(tmpdir(), 'hephaestus-materialize-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  cpSync(new URL('../skills/hephaestus/', import.meta.url), join(dir, 'skills/hephaestus'), { recursive: true });
  cpSync(new URL('../scripts/', import.meta.url), join(dir, 'scripts'), { recursive: true });
  const digest = base => {
    const hash = createHash('sha256');
    for (const path of readdirSync(base, { recursive: true }).sort()) {
      if (statSync(join(base, path)).isFile()) { hash.update(path); hash.update(readFileSync(join(base, path))); }
    }
    return hash.digest('hex');
  };
  for (let repeat = 0; repeat < 2; repeat++) {
    const result = spawnSync(process.execPath, [join(dir, 'scripts/package-skills.mjs')], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    for (const target of ['frontend', 'backend']) {
      const name = `hephaestus-${target}`;
      assert.equal(digest(join(dir, 'skills', name)), digest(fileURLToPath(new URL(`../skills/${name}/`, import.meta.url))));
    }
  }
});
