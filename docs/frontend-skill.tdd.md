# Frontend skill verification

Observed on 2026-10-24 with Node v24.19.0. These results establish report-helper behavior, package installation and one source-only agent evaluation. They do not establish successful live frontend repairs or improved aesthetic quality.

## Test-first implementation

| Commit | Observation |
| --- | --- |
| `010b819` | RED: eight executable contract tests failed because the report helper and policy did not exist |
| `787c8bd` | GREEN: the helper and policy passed all eight tests |
| `81ac193` | RED: a ninth test exposed acceptance of changed files without an active finding; eight passed and one failed |
| `000199b` | GREEN: every changed file must map to an active finding; all nine tests passed |

The [tests](../tests/report.test.mjs) exercise evidence and width requirements, incomplete repairs, failures, owner waivers, alias counting, file scope, malformed input, policy completeness and CLI exit statuses. They use synthetic reports; their passing evidence strings are test data, not observed browser checks.

## Package checks

- `npm run check`: PASS, Node syntax check of the shipped helper.
- `npm run test:coverage`: PASS, 9 tests, 9 passed, 0 failed. Helper coverage: 97.75% lines, 90.00% branches, 100% functions.
- Skill frontmatter and OpenAI metadata: safely parsed as YAML; name, description and `$hephaestus` invocation checked.
- All 30 policy IDs present; FF-026 is the only alias and resolves to FF-024.
- Owner [ARC](arc.md) and [product specification](pro.md) byte-match the supplied documents. Original Markdown line-break spaces are preserved.
- No application build or TypeScript/lint configuration is shipped. Those phases are not applicable to the dependency-free JavaScript helper; the synthetic TSX fixture is deliberately non-runnable.

## Installation check

The standard skills CLI v1.7.4 installed the local package into an isolated temporary project for **Codex** and **Claude Code**, using `--copy`. Every installed skill file byte-matched its source. Both installed helpers accepted a valid partial audit and returned `ready: false`.

This verifies discovery, file projection and helper execution. It does not establish a live Claude Code session, other host behavior, global installation or remote installation. The [installation note](install-check.txt) records this scope.

## Independent forward evaluation

A separate fresh agent received the skill, the raw [source-review fixture](../evals/fixtures/source-review/BRIEF.md) and the audit-only prompt, without the expected outcomes. It used an isolated copy and wrote reports outside the source folder. See the [retained result](../evals/results/audit-scope/README.md).

Observed: 13 findings, with 10 open and 3 needing owner review; none claimed fixed or verified. Approved violet and all three genuine pricing plans were preserved. Unknown testimonial provenance was not called fraud. FF-026 did not duplicate FF-024. All three source hashes and the file inventory remained unchanged.

The root reviewer independently checked source hashes and ran the current report checker on the actual output: valid partial audit, `ready: false`. Browser checks at 390/768/1440, application build, types, lint and runtime journeys were explicitly skipped because the fixture has no runnable application. No dependencies were installed to manufacture a runtime.

The other five behavioral cases have not been run. Real repairs, before/after captures, accessibility journeys, backend handoff behavior and a controlled design-quality comparison remain unverified. Backend implementation is deferred by the user's scope.

## Security and publication review

The helper reads local JSON and the bundled policy; it does not execute report text, write target source or contact a service. It rejects unsafe scope paths, malformed reports, unsupported flags and files over 1 MiB. Approval and evidence strings remain untrusted claims; their authenticity requires actual human/agent review.

Only the skill, supplied specifications, synthetic fixtures, sanitized evaluation artifacts and project documentation are included. Local credentials, agent configuration, private project data and the upstream research checkout are excluded. Credential-pattern scanning found no matches; local Markdown links and retained fixture hashes passed. Staged diff review and whitespace checks passed with original document line-break spaces preserved. These checks are not a comprehensive security certification.
