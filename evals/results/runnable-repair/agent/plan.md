# File-scoped repair plan

Baseline: the four SHA-256 entries in `../baseline.json` matched the input before edits. Original frontend files are retained in `before/`. BRIEF.md is preserved.

- `app.mjs`: FF-021 and FF-030. Add local loading, success, empty and recoverable error states; validate HTTP success and an array containing only strings; keep literal text rendering; cancel obsolete reads and ignore stale completions; wire the existing Retry control.
- `index.html`: FF-030. Keep the native labeled selector and all seven options, add a stable submit-control ID for retry focus recovery, and make status changes atomic and the list's busy state explicit.
- `styles.css`: FF-003, FF-006, FF-010, FF-019 and FF-030. Use fluid border-box sizing, a narrow-screen control layout, safe long-name wrapping and visible keyboard focus. Replace the white canvas, unprovided Inter stack, large shadow and 32px main radius with a restrained neutral surface and system font. Preserve approved #7c3aed.

Required checks chosen before implementation: `baseline-scope`, `syntax`, `behavior`, `source-security`, `source-accessibility`, `diff-review`, `browser-390`, `browser-768`, `browser-1440`. Browser checks are prohibited in this isolated pass and will be recorded as skipped. The DOM/fetch harness is a local simulation and cannot replace those checks. No dependency, network, backend or Git operations are planned.

TDD RED: `node --test ../output/repair.test.mjs` against original app.mjs executed 16 checks: 1 pass, 15 fail. Failures expose missing states/validation/retry/race protection rather than missing dependencies or setup errors. See `red-checks.tap`.
