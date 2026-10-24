#!/usr/bin/env node
// Checks report consistency, not whether a human or agent told the truth about a check.
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const policy = JSON.parse(readFileSync(new URL('../policy/frontend-policy.json', import.meta.url), 'utf8'));
const rules = new Map(policy.rules.map(rule => [rule.id, rule]));
const text = value => typeof value === 'string' && value.trim().length > 0;
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const path = value => text(value) && !/^(?:[/\\]|[a-z]:)/i.test(value) && !value.split(/[/\\]/).some(part => part === '..' || part === '' || part === '.');
const identifier = value => text(value) && /^[a-z0-9_-]{1,64}$/i.test(value);

export function validateReport(report) {
  const errors = [];
  const counts = {};
  const result = ready => ({ valid: errors.length === 0, ready: ready && errors.length === 0, counts, errors });
  if (!object(report)) { errors.push('Report must be an object.'); return result(false); }
  if (report.schema_version !== 1 || !['audit', 'repair'].includes(report.mode) || !text(report.baseline)) errors.push('Supply schema_version 1, audit/repair mode and a baseline revision or snapshot.');
  for (const field of ['findings', 'checks', 'approved_files', 'changed_files', 'required_checks']) {
    if (!Array.isArray(report[field])) errors.push(`${field} must be an array.`);
  }
  if (errors.length) return result(false);
  for (const file of [...report.approved_files, ...report.changed_files]) if (!path(file)) errors.push('File scopes must contain safe project-relative paths.');
  if (report.changed_files.some(file => !report.approved_files.includes(file))) errors.push('Changed files exceed the approved file scope.');
  if (report.mode === 'audit' && report.changed_files.length) errors.push('Audit-only work must not change project files.');

  const checks = new Map();
  for (const check of report.checks) {
    if (!object(check) || !identifier(check.id) || !text(check.kind) || !['pass', 'fail', 'skipped', 'needs_review'].includes(check.status) || !text(check.evidence)) {
      errors.push('Each check needs an identifier, kind, explicit status and an evidence observation.'); continue;
    }
    if (checks.has(check.id)) errors.push('Check identifiers must be unique.');
    checks.set(check.id, check);
  }
  for (const id of report.required_checks) if (!checks.has(id)) errors.push('A required check has no result.');

  const seen = new Map();
  const ids = new Set();
  for (const finding of report.findings) {
    if (!object(finding)) { errors.push('Each finding must be an object.'); continue; }
    const rule = rules.get(finding.rule_id);
    if (!rule) { errors.push('Unknown rule identifier.'); continue; }
    if (!identifier(finding.id) || ids.has(finding.id)) errors.push('Finding identifiers must be unique identifiers.');
    ids.add(finding.id);
    if (!['blocker', 'high', 'medium', 'low'].includes(finding.severity) || !['high', 'medium', 'low'].includes(finding.confidence) || !['open', 'planned', 'fixed_unverified', 'verified', 'waived', 'needs_review'].includes(finding.status)) errors.push('Invalid finding severity, confidence or status.');
    if (finding.file != null && !path(finding.file)) errors.push('Finding files must be project-relative.');
    if (finding.route != null && (!text(finding.route) || !finding.route.startsWith('/'))) errors.push('Finding routes must start with /.');
    if (finding.lines != null && (!object(finding.lines) || !Number.isInteger(finding.lines.start) || finding.lines.start < 1 || !Number.isInteger(finding.lines.end) || finding.lines.end < finding.lines.start)) errors.push('Invalid source line range.');
    if (!Array.isArray(finding.evidence) || !finding.evidence.length || finding.evidence.some(e => !object(e) || !['source', 'browser', 'screenshot', 'owner'].includes(e.kind) || !text(e.summary))) errors.push('A finding needs source, browser, screenshot or owner evidence.');
    for (const field of ['why_it_matters', 'proposed_change', 'regression_risk']) if (!text(finding[field])) errors.push(`Finding is missing ${field}.`);
    if (!Array.isArray(finding.verification_checks)) { errors.push('Finding verification_checks must be an array.'); continue; }

    const canonical = rule.alias_of || rule.id;
    const location = JSON.stringify([canonical, finding.file ?? null, finding.route ?? null, finding.lines ?? finding.evidence]);
    if (seen.has(location)) {
      if (seen.get(location) !== finding.status) errors.push('Duplicate or alias findings disagree on status.');
    } else { counts[canonical] = (counts[canonical] || 0) + 1; seen.set(location, finding.status); }

    if (finding.status === 'waived' && (!object(finding.approval) || finding.approval.by !== 'owner' || !text(finding.approval.reason))) errors.push('A waiver requires explicit owner approval and a reason.');
    if (finding.status === 'verified') {
      const refs = finding.verification_checks.map(id => checks.get(id));
      if (!refs.length || refs.some(check => !check || check.status !== 'pass')) errors.push('Verified findings require passing referenced checks.');
      if (!text(finding.route) || [390, 768, 1440].some(width => !refs.some(check => check?.kind === 'browser' && check.status === 'pass' && check.width === width && check.route === finding.route))) errors.push('Verified frontend findings require passing browser evidence at 390, 768 and 1440 for their route.');
    }
  }
  for (const file of report.changed_files) if (!report.findings.some(finding => finding?.file === file && finding.status !== 'waived')) errors.push('Every changed file must map to an active finding.');
  const ready = report.mode === 'repair' && report.required_checks.length > 0 && report.required_checks.every(id => checks.get(id)?.status === 'pass') && !report.checks.some(check => check?.status === 'fail') && report.findings.every(finding => ['verified', 'waived'].includes(finding?.status));
  return result(ready);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const file = args[0];
  if (!file || file.startsWith('--') || args.slice(1).some(arg => arg !== '--require-verified') || args.length > 2) {
    console.error('Usage: node check-report.mjs report.json [--require-verified]');
    process.exitCode = 2;
  } else {
    try {
      if (statSync(file).size > 1048576) throw new Error('Report exceeds 1 MiB.');
      const result = validateReport(JSON.parse(readFileSync(file, 'utf8')));
      console.log(JSON.stringify(result, null, 2));
      process.exitCode = !result.valid ? 2 : args.includes('--require-verified') && !result.ready ? 1 : 0;
    } catch {
      console.error('Could not read a JSON report of at most 1 MiB.');
      process.exitCode = 2;
    }
  }
}
