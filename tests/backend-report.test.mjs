import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validateReport } from '../skills/hephaestus/scripts/check-report.mjs';

const ruleIds = Array.from({ length: 7 }, (_, i) => `BF-${String(i + 1).padStart(3, '0')}`);
const report = () => ({
  schema_version: 1, target: 'backend', mode: 'repair', baseline: 'synthetic-security-test',
  approved_files: ['server/projects.mjs'], changed_files: ['server/projects.mjs'],
  required_checks: [...ruleIds, 'api-tests'],
  checks: [
    ...ruleIds.map(id => ({ id, kind: 'security', status: 'pass', evidence: 'Synthetic test observation; not a real project scan.' })),
    { id: 'api-tests', kind: 'tests', status: 'pass', evidence: 'Synthetic cross-user denial and allowed-owner request tests.' },
  ],
  findings: [{
    id: 'ownership', rule_id: 'BF-004', severity: 'high', confidence: 'high',
    route: '/api/projects', file: 'server/projects.mjs', status: 'verified',
    evidence: [{ kind: 'test', summary: 'Synthetic user B request for user A project returned 403.' }],
    why_it_matters: 'Records must be restricted to their owner.',
    proposed_change: 'Scope lookups to the verified principal.',
    regression_risk: 'Preserve permitted owner access and the response contract.',
    verification_checks: ['BF-004', 'api-tests'],
  }],
});

test('backend repairs use security and behavior evidence without frontend screenshots', () => {
  const result = validateReport(report());
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.equal(result.ready, true);
  assert.deepEqual(result.counts, { 'BF-004': 1 });
});

test('all seven backend security gates are mandatory even if omitted from required_checks', () => {
  for (const id of ruleIds) {
    const r = report();
    r.required_checks = r.required_checks.filter(value => value !== id);
    r.checks = r.checks.filter(check => check.id !== id);
    assert.equal(validateReport(r).valid, false, id);
  }
  const r = report();
  r.checks[0].kind = 'build';
  assert.equal(validateReport(r).valid, false);
});

test('failed, skipped or unresolved security checks block completion even with owner waivers', () => {
  for (const id of ruleIds) {
    for (const status of ['fail', 'skipped', 'needs_review']) {
      const r = report();
      r.checks.find(check => check.id === id).status = status;
      r.findings[0].status = 'waived';
      r.findings[0].approval = { by: 'owner', reason: 'Synthetic waiver for a finding, not a security-gate override.' };
      r.changed_files = [];
      assert.equal(validateReport(r).valid, true);
      assert.equal(validateReport(r).ready, false, `${id}: ${status}`);
    }
  }
});

test('a source-only backend audit remains a valid partial report', () => {
  const r = report();
  r.mode = 'audit';
  r.changed_files = [];
  r.findings[0].status = 'open';
  r.findings[0].verification_checks = [];
  r.checks.forEach(check => { check.status = 'skipped'; check.evidence = 'Runtime and scanners unavailable.'; });
  assert.equal(validateReport(r).valid, true);
  assert.equal(validateReport(r).ready, false);
  r.changed_files = ['server/projects.mjs'];
  assert.equal(validateReport(r).valid, false);
});

test('only absent authentication, database or rate-limit surfaces can be inapplicable with a reason', () => {
  for (const id of ['BF-002', 'BF-004', 'BF-006']) {
    const r = report();
    r.findings = [];
    r.changed_files = [];
    const check = r.checks.find(check => check.id === id);
    check.status = 'not_applicable';
    assert.equal(validateReport(r).valid, false);
    check.reason = 'Synthetic fixture has no corresponding surface; inventory reviewed.';
    assert.equal(validateReport(r).valid, true);
    assert.equal(validateReport(r).ready, true);
    check.evidence = '';
    assert.equal(validateReport(r).valid, false);
  }
  for (const id of ['BF-001', 'BF-003', 'BF-005', 'BF-007', 'api-tests']) {
    const r = report();
    Object.assign(r.checks.find(check => check.id === id), { status: 'not_applicable', reason: 'Skip it.' });
    assert.equal(validateReport(r).valid, false, id);
  }
});

test('verified backend findings need their passing security gate and a passing behavior test', () => {
  for (const refs of [[], ['BF-004'], ['api-tests'], ['BF-004', 'missing']]) {
    const r = report();
    r.findings[0].verification_checks = refs;
    assert.equal(validateReport(r).valid, false, refs.join(','));
  }
  for (const status of ['fail', 'skipped', 'needs_review']) {
    const r = report();
    r.checks.at(-1).status = status;
    assert.equal(validateReport(r).valid, false);
  }
  const r = report();
  r.checks.at(-1).kind = 'build';
  assert.equal(validateReport(r).valid, false);
  Object.assign(r.checks.find(check => check.id === 'BF-004'), { status: 'not_applicable', reason: 'No database.' });
  assert.equal(validateReport(r).valid, false);
});

test('backend completion always requires a required passing behavior suite', () => {
  const r = report();
  r.findings = [];
  r.changed_files = [];
  r.required_checks = [...ruleIds];
  assert.equal(validateReport(r).ready, false);
  r.required_checks.push('api-tests');
  r.checks.at(-1).status = 'skipped';
  assert.equal(validateReport(r).ready, false);
  r.checks.at(-1).status = 'pass';
  assert.equal(validateReport(r).ready, true);
});

test('target selection cannot mix backend policy with frontend rules or bypass browser checks', () => {
  for (const target of ['frontend', 'fullstack', '', null, 42]) {
    assert.equal(validateReport({ ...report(), target }).valid, false, String(target));
  }
  const legacy = report();
  delete legacy.target;
  assert.equal(validateReport(legacy).valid, false);
  const backend = report();
  backend.findings[0].rule_id = 'FF-021';
  assert.equal(validateReport(backend).valid, false);
});

test('backend scope, evidence and duplicate check protections remain enforced', () => {
  for (const file of ['../credentials', '/etc/passwd', 'server/unapproved.mjs']) {
    assert.equal(validateReport({ ...report(), changed_files: [file] }).valid, false);
  }
  const r = report();
  r.checks.push(r.checks[0]);
  assert.equal(validateReport(r).valid, false);
  r.checks.pop();
  r.findings[0].evidence = [{ kind: 'runtime', summary: 'Observed local request denial.' }];
  assert.equal(validateReport(r).valid, true);
  r.findings[0].evidence[0].summary = '';
  assert.equal(validateReport(r).valid, false);
});

test('backend CLI rejects incomplete security evidence with the strict flag', () => {
  const dir = mkdtempSync(join(tmpdir(), 'hephaestus-backend-'));
  const file = join(dir, 'report.json');
  const script = fileURLToPath(new URL('../skills/hephaestus/scripts/check-report.mjs', import.meta.url));
  const run = args => spawnSync(process.execPath, [script, file, ...args], { encoding: 'utf8' });
  try {
    writeFileSync(file, JSON.stringify(report()));
    assert.equal(run(['--require-verified']).status, 0);
    const partial = report();
    partial.checks[0].status = 'skipped';
    writeFileSync(file, JSON.stringify(partial));
    assert.equal(run([]).status, 0);
    assert.equal(run(['--require-verified']).status, 1);
    partial.required_checks.shift();
    writeFileSync(file, JSON.stringify(partial));
    assert.equal(run([]).status, 2);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('the bundled backend policy defines exactly the seven security gates', () => {
  const policy = JSON.parse(readFileSync(new URL('../skills/hephaestus/policy/backend-policy.json', import.meta.url)));
  assert.deepEqual(policy.rules.map(rule => rule.id), ruleIds);
  assert.deepEqual(policy.rules.filter(rule => rule.allow_not_applicable).map(rule => rule.id), ['BF-002', 'BF-004', 'BF-006']);
  for (const rule of policy.rules) {
    assert.ok(rule.guardrails.length > 0);
    assert.ok(rule.verification.length > 0);
  }
});
