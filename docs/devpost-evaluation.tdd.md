# Devpost-guided evaluation evidence

This follow-up applies the [Devpost planning documents](../devpost/scope.md) to the existing skill. Implementation was authorized by the learner's request; the documents remain draft until learner review. Earlier implementation is not presented as having followed the full course.

## Test-first checkpoints

| Commit | Observed evidence |
| --- | --- |
| `e820cbf` | Scope, PRD, technical spec and checklist saved before this improvement's implementation |
| `392c125` | RED: three fixture-server contract tests executed and failed for the missing implementation |
| `5b277ca` | GREEN: all three contracts passed with loopback access; named assets only, deterministic responses and controlled delay |
| `102614c` | RED: real browser observations failed 26 of 45 assertions across three widths; malformed request-target regression failed with `Invalid URL` |
| `a250106` | GREEN for the server regression: malformed targets return 400 and the four server tests pass |
| `6435a03` | GREEN for the repair: 29 Node tests and all 45 real-browser assertions pass; actual sources, captures and separate verification stages retained |

The independent repair agent separately wrote and ran 16 DOM/fetch tests before editing the fixture: 15 failed, 1 passed. The same suite passed 16/16 after its patch. The root retained that harness under `tests/repair.test.mjs`, changing only source-path and coverage-filename resolution, and independently confirmed its final files matched the tested copy.

## Verified guarantees

| Behavior | Check | Result |
| --- | --- | --- |
| Private files stay outside the fixture's served assets | `tests/fixture.test.mjs` | PASS |
| Malformed HTTP targets do not crash the server | `tests/fixture.test.mjs` | PASS |
| Loading, empty, failure, retry, validation, literal text and latest-request behavior | `tests/repair.test.mjs` plus the real shared browser check | PASS |
| Layout and preserved identity at 390/768/1440 | `evals/browser-check.mjs` and inspected captures | 45/45 assertions PASS |
| Native control activation and retry focus | Actual Tab/Enter at 1440px | PASS within recorded scope |
| Report status, alias and file-scope consistency | `tests/report.test.mjs` and actual report helper runs | PASS |

`npm run test:coverage`: 29 tests passed, 0 failed; 97.18% lines, 91.01% branches, 92.86% functions across Node-instrumented files. The controller is 100% lines; server 92.16%; report helper 97.75%. The browser checker, HTML and CSS are outside that coverage denominator and were checked separately in the browser. `npm run check` passed for all four shipped executable modules in its script.

There is no build pipeline, TypeScript compiler or linter configured for this dependency-free package. Those phases are not applicable; no nonexistent command is reported as passed. An initial sandbox run could not bind loopback and was rerun successfully with the required execution permission; the permission error is not a product RED result.

See the [actual evaluation](../evals/results/runnable-repair/README.md) for retained observations, captures and reports. The agent's source-only report remains partial. The separate root report records later verification and passes the consistency gate for this fixture; the parser itself authenticates nothing.

## Limits and learner state

The source-only audit and this native-web repair are the two observed behavioral cases. Four others, React/Next.js runtime repairs, other agent hosts, live backend behavior, screen-reader testing and a controlled aesthetic comparison remain unrun. Backend implementation is deferred. No full accessibility, security or production-readiness certification is claimed.

The offline app map is generated and browser-rendered with zero scripts or network dependencies. Document review, hands-on feedback, learning participation, demo video and Devpost submission remain learner activities. No learner reflection, approval or course completion was invented.
