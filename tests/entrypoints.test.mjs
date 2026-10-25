import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

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
