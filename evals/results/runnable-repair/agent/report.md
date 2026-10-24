# Isolated frontend repair

Source repair is implemented. **Verification is partial; runtime_unavailable.** Browser and network access were prohibited in this pass. Every repaired finding remains `fixed_unverified`; no production-readiness or full accessibility claim is made.

## Scope and preserved contract

Changed only `index.html`, `app.mjs` and `styles.css` in the temporary project. All original hashes matched the supplied baseline manifest before editing. `BRIEF.md`, the title, project-list purpose, all seven native response choices and their labels, violet `#7c3aed`, and `GET /api/projects?scenario=<selection>` were preserved. No backend, dependency or external asset was added.

## Changes

- Added local loading, real success counts, empty feedback, HTTP/data/connection errors and Retry. Controls remain available while reads are pending. Retry repeats the failed scenario and moves focus to the visible Load projects control before hiding itself.
- Checked HTTP success and validated the whole response as an array of strings. Returned names remain literal text, including markup and empty strings. No fake success or fallback records.
- Aborted replaced reads and guarded all stale responses so old completion/failure cannot overwrite the latest request.
- Replaced fixed content-box width with fluid sizing, stacked narrow-screen controls, long-name wrapping, 44px minimum controls and visible focus. Replaced the white canvas, large shadow, Inter default and 32px radius with neutral surfaces, a system stack and 4px radius.

The approved violet is an explicit owner constraint and is retained despite the optional Taste house rule. This is a scoped app-screen repair, not a redesign.

## Findings

| Finding | Policy | Severity | State |
|---|---|---|---|
| request-states | FF-021 | high | fixed_unverified |
| response-validation | FF-030 | high | fixed_unverified |
| superseded-requests | FF-030 | medium | fixed_unverified |
| status-and-retry-access | FF-030 | medium | fixed_unverified |
| narrow-screen-layout | FF-030 | high | fixed_unverified |
| white-canvas | FF-003 | low | fixed_unverified |
| large-shadow | FF-006 | low | fixed_unverified |
| default-font | FF-010 | low | fixed_unverified |
| oversized-main-radius | FF-019 | low | fixed_unverified |

Full source evidence, consequences, remedies and regression risks are in `report.json`. There are no testimonial, pricing or personal-data collection flows in the supplied screen; none were invented. Existing footer copy is preserved.

## Actual checks

| Check | Result | Evidence |
|---|---|---|
| Baseline and file scope | Pass | Four SHA-256 matches before editing; BRIEF unchanged; only three authorized source files changed |
| JavaScript syntax | Pass | `node --check app.mjs`, exit 0, Node v24.19.0 |
| Behavioral RED/GREEN | Pass after repair | Same 16 simulated DOM/fetch tests: baseline 1 pass / 15 fail; repaired 16 pass / 0 fail |
| Source security and accessibility | Pass within source scope | `node source-checks.mjs`, preserved label/options/IDs; safe text sinks; declared-color math; focus CSS |
| Full diff review | Pass | Reviewed original copies against all three repaired files; patch saved |
| Build / typecheck / lint | Skipped | No supplied package manifest, runner or corresponding configuration |
| Coverage | Unavailable | Attempted Node coverage run passed 16 tests but reported no instrumented files. Its empty 100% aggregate is not app coverage |
| Live API | Skipped | Network prohibited; loopback service supplied separately by evaluator |
| Browser 390 / 768 / 1440 | Skipped | Browser prohibited; no screenshots or runtime observations collected |

Declared contrast calculations are text 15.38:1, muted text 7.31:1, brand text 5.43:1, white primary-button text 5.70:1 and control border 3.99:1 against the declared surfaces. A source check caught the first repaired control border at 1.71:1; it was corrected and the same check passed. These numbers are color arithmetic, not computed browser styles.

## TDD evidence and remaining limits

Journeys were derived from BRIEF.md: load the chosen response, understand waiting/success/empty/failure, recover safely, preserve remote names as data and continue choosing responses during a wait. `repair.test.mjs` tests those behaviors without libraries or a server. RED was executed against the untouched source before implementation; all 15 failures were intended behavior failures, with the existing encoded GET check passing. GREEN ran the same suite after the repair. Logs: `red-checks.tap`, `green-checks.tap`.

No browser captures, real keyboard traversal, accessibility-tree or screen-reader observations, computed layout/overflow, console/network review, or real-service response checks were performed. Independent verification must exercise all seven scenarios plus retry and competing requests at 390, 768 and 1440, including long literal text, before any finding can be called verified. Privacy, deployment and backend correctness are not established by these local checks.

## Review and rollback

Review `changes.patch` and the full machine report. Original source copies are retained in `before/`; restoring each corresponding frontend file from there reverses this pass. No Git commits, publication or deployment occurred.

The report consistency helper passed structurally: `valid:true`, `ready:false`, no errors, exit 0. `--require-verified` exited 1 as expected for this partial result. The outputs are `report-check.json` and `report-verified-check.json`. A structurally valid report is not evidence of a verified repair.
