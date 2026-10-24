import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = new URL('../skills/hephaestus/scripts/check-report.mjs', import.meta.url);
const load = () => import(script.href);
const check = (id, kind, extra = {}) => ({ id, kind, status: 'pass', evidence: 'Observed fixture output', ...extra });
const finding = (extra = {}) => ({
  id: 'f1', rule_id: 'FF-021', severity: 'high', confidence: 'high', status: 'verified',
  route: '/dashboard', file: 'src/Dashboard.tsx', lines: { start: 12, end: 18 },
  evidence: [{ kind: 'source', summary: 'Pending request rendered no feedback.' }],
  why_it_matters: 'People could not tell whether data was loading.',
  proposed_change: 'Show pending, error, empty and success states.',
  regression_risk: 'Preserve the request and response contract.',
  verification_checks: ['build', 'flow', 'b390', 'b768', 'b1440'], ...extra,
});
const report = () => ({
  schema_version: 1, mode: 'repair', baseline: 'fixture-snapshot-1',
  approved_files: ['src/Dashboard.tsx'], changed_files: ['src/Dashboard.tsx'],
  required_checks: ['build', 'flow', 'b390', 'b768', 'b1440'],
  checks: [check('build', 'build'), check('flow', 'interaction'),
    ...[390, 768, 1440].map(width => check(`b${width}`, 'browser', { width, route: '/dashboard' }))],
  findings: [finding()],
});

test('a repaired route needs passing checks and all three browser widths', async () => {
  const { validateReport } = await load();
  assert.equal(validateReport(report()).ready, true);
  const missing = report();
  missing.checks = missing.checks.filter(c => c.id !== 'b768');
  assert.equal(validateReport(missing).valid, false);
  const skipped = report();
  skipped.checks.find(c => c.id === 'b390').status = 'skipped';
  assert.equal(validateReport(skipped).valid, false);
  const widths = report();
  widths.checks.find(c => c.id === 'b768').width = 400;
  assert.equal(validateReport(widths).valid, false);
});

test('fixed_unverified and a failed build never pass the release gate', async () => {
  const { validateReport } = await load();
  const unverified = report();
  unverified.findings[0].status = 'fixed_unverified';
  unverified.checks[0].status = 'fail';
  const result = validateReport(unverified);
  assert.equal(result.valid, true);
  assert.equal(result.ready, false);
  assert.equal(validateReport({ ...report(), findings: [finding({ verification_checks: [] })] }).valid, false);
});

test('unknown claims require review and waived issues require an owner reason', async () => {
  const { validateReport } = await load();
  const r = report();
  r.findings = [finding({ rule_id: 'FF-012', status: 'needs_review', verification_checks: [] })];
  assert.equal(validateReport(r).valid, true);
  assert.equal(validateReport(r).ready, false);
  r.findings[0].status = 'waived';
  assert.equal(validateReport(r).valid, false);
  r.findings[0].approval = { by: 'owner', reason: 'Owner supplied provenance and requests preservation.' };
  assert.equal(validateReport(r).ready, true);
});

test('sparkle alias counts once and conflicting alias states are rejected', async () => {
  const { validateReport } = await load();
  const r = report();
  r.findings = [finding({ rule_id: 'FF-024' }), finding({ id: 'f2', rule_id: 'FF-026' })];
  assert.equal(validateReport(r).counts['FF-024'], 1);
  r.findings[1].status = 'open';
  assert.equal(validateReport(r).valid, false);
});

test('audit-only reports cannot hide changes, unsafe paths or edits outside the plan', async () => {
  const { validateReport } = await load();
  assert.equal(validateReport({ ...report(), mode: 'audit' }).valid, false);
  for (const path of ['server/accounts.py', '../secret', '/etc/passwd', 'C:\\private\\file']) {
    assert.equal(validateReport({ ...report(), changed_files: [path] }).valid, false);
  }
});

test('malformed evidence, unknown rules and duplicate check identifiers are rejected', async () => {
  const { validateReport } = await load();
  for (const value of [null, [], {}, { ...report(), findings: 'wrong' }]) assert.equal(validateReport(value).valid, false);
  for (const extra of [{ rule_id: 'FF-999' }, { evidence: [] }, { severity: 'perfect' },
    { lines: { start: 18, end: 12 } }, { status: 'done' }, { why_it_matters: '' }]) {
    assert.equal(validateReport({ ...report(), findings: [finding(extra)] }).valid, false);
  }
  const duplicate = report(); duplicate.checks.push(duplicate.checks[0]);
  assert.equal(validateReport(duplicate).valid, false);
});

test('all 30 supplied standards exist and FF-026 is the sole alias', () => {
  const policy = JSON.parse(readFileSync(new URL('../skills/hephaestus/policy/frontend-policy.json', import.meta.url)));
  assert.deepEqual(policy.rules.map(r => r.id), Array.from({ length: 30 }, (_, i) => `FF-${String(i + 1).padStart(3, '0')}`));
  assert.deepEqual(policy.rules.filter(r => r.alias_of).map(r => [r.id, r.alias_of]), [['FF-026', 'FF-024']]);
  assert.equal(policy.rules.find(r => r.id === 'FF-012').action, 'owner_review');
  assert.equal(policy.rules.find(r => r.id === 'FF-017').action, 'preserve_business_truth');
  assert.equal(policy.rules.find(r => r.id === 'FF-027').action, 'owner_review_blocker_if_applicable');
});

test('CLI distinguishes valid partial reports, complete repairs and invalid input', async () => {
  await load();
  const dir = mkdtempSync(join(tmpdir(), 'hephaestus-report-'));
  const file = join(dir, 'report.json');
  const run = args => spawnSync(process.execPath, [fileURLToPath(script), ...args], { encoding: 'utf8' });
  try {
    writeFileSync(file, JSON.stringify(report()));
    assert.equal(run([file, '--require-verified']).status, 0);
    const partial = report(); partial.findings[0].status = 'fixed_unverified';
    writeFileSync(file, JSON.stringify(partial));
    assert.equal(run([file]).status, 0);
    assert.equal(run([file, '--require-verified']).status, 1);
    writeFileSync(file, '{broken'); assert.equal(run([file]).status, 2);
    assert.equal(run([]).status, 2);
    assert.equal(run([file, '--execute']).status, 2);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
