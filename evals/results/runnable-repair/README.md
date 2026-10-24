# Observed runnable repair

On 2026-10-24, a fresh agent used the existing Hephaestus skill on an isolated copy of [the original fixture](../../fixtures/repair-before/BRIEF.md). It received the raw source and brief, without the root reviewer's expected results, tests or conclusions. Browser and network access were excluded from its pass; the root subsequently verified its actual patch in a real browser.

The resulting [frontend](../../fixtures/repair-after/app.mjs) preserves the title, approved violet, seven response choices, read-only endpoint and successful project names. It adds loading, empty and recoverable failure states, validates data, renders remote names as text, prevents obsolete requests from winning, and fits the recorded viewport widths. The skill instructions needed no rewrite to achieve this result.

## Actual results

| Check | Retained input | Fresh-agent output |
| --- | --- | --- |
| Shared browser assertions, 390px | 6/15 pass; horizontal overflow | 15/15 pass; no overflow |
| Shared browser assertions, 768px | 6/15 pass; horizontal overflow | 15/15 pass; no overflow |
| Shared browser assertions, 1440px | 7/15 pass | 15/15 pass |
| Agent's DOM/fetch tests | 1/16 pass | 16/16 pass |
| Full root Node suite | Not a fixture-only comparison | 29/29 pass |

The Node suite includes 9 report-helper tests, 4 fixture-server tests and 16 frontend controller tests. Its 97.18% line coverage applies to Node-instrumented files: report helper 97.75%, server 92.16%, controller 100%. It does not measure HTML, CSS or the separately executed browser checker.

All seven [captures](captures/) were visually inspected. At 1440px, actual Tab/Enter input exercised Load and Retry and confirmed visible focus and focus recovery. Computed contrast was 5.43:1 for the heading, 15.38:1 for body text, 5.70:1 for primary-button text and 3.99:1 for the select boundary. These are scoped observations, not a full accessibility certification.

The [console](console.txt) contained expected simulated HTTP 500 and connection-failure resource messages, with no listed uncaught application exception. All 42 recorded [requests](network.txt) stayed on the loopback fixture origin; canceled old reads were observable.

## Evidence and reproduction

- [Before browser observations](before-browser.json) and [after browser observations](after-browser.json): the same 15 assertions at each width.
- [Manual browser observations](manual-browser.json): keyboard, computed styles, contrast and capture review.
- [Original input hashes](baseline.json): independently checked against the retained input. The final copied output also byte-matched the agent's three repaired source files.
- [Source-only agent report](agent/report.json) and [plan](agent/plan.md): original findings remain `fixed_unverified`, with browser checks skipped.
- [Agent RED](agent/red-checks.tap) and [GREEN](agent/green-checks.tap) observations. The reusable harness is now [tests/repair.test.mjs](../../../tests/repair.test.mjs), with only its source-path and coverage filename normalized.
- [Root verification report](verified-report.json): a separate record of the later passing browser, source and Node checks. The consistency helper accepts it with `--require-verified`.

Selected original artifacts are retained; original commands and auxiliary artifact names in the agent report describe its isolated working directory. Machine-specific temporary paths were normalized. The complete current reproduction is `npm test`, `npm run demo`, and the shared browser check described in [the evaluation guide](../../README.md). No reported check was manufactured to make the parser pass.

The initial skill snapshot used by the agent was the existing package at `ec198ef`; its instructions were retained. The experiment tests one native-web repair, not a React/Next.js runtime or another host. The four other behavioral cases, live backend, screen reader, physical touch devices and a controlled comparison of aesthetic quality remain unverified. It does not prove that every website will improve.

## Captures

| Width | Original | Repaired |
| --- | --- | --- |
| 390 | [Before](captures/before-390.jpg) | [After](captures/after-390.jpg) |
| 768 | [Before](captures/before-768.jpg) | [After](captures/after-768.jpg) |
| 1440 | [Before](captures/before-1440.jpg) | [After](captures/after-1440.jpg) |

[Repaired HTTP failure at 390px](captures/after-error-390.jpg) shows the actual error and Retry control. All data and responses are explicitly synthetic; the fixture is not a product website or a repaired live backend.
