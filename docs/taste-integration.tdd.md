# Selectable fixers and Taste integration — 2026-10-25

The owner requested incorporation of the explicitly supplied `design-taste-frontend` skill into GitHub and reported that frontend/backend choices were not visible. Inspection confirmed that the previous package shipped only `skills/hephaestus/SKILL.md`; its modes were text instructions, not separate picker entries.

## Source investigation and implementation

The installed Taste source matches Leonxlnx/taste-skill at `6010f91a9935f1c167dfc500fb1a475681892e6b`, version 2.1.4. A bounded read-only analysis independently traced its scripts, libraries, references, assets and license. REA's supplied instructions explicitly route complete source repositories to ordinary source analysis, so no decompiler, provider setup or client reconfiguration was needed.

The bundled implementation includes the direction drawer, separate page/app libraries, source linter, Chromium inspector, optional media search, references and CSS/JS foundations. Upstream instructions are preserved as `UPSTREAM.md`, avoiding an unintended fourth skill registration. The MIT license and third-party notices are retained. Actual photographs and font files are not bundled.

Two contextual changes are recorded in the notices: browser/scene helpers reject filesystem targets instead of serving the working directory, and browser inspection does not require fixed counts of images, video or moving elements. Existing dev-server URLs remain supported. Generated style sheets and Taste diagnostic IDs do not override Hephaestus FF rules, approved brands or the report schema. Missing scene implementations/catalogue/demos remain unsupported; source lint still skips lines over 2,000 characters and files of 4 MB or more.

The repository now ships real `hephaestus-frontend` and `hephaestus-backend` entries alongside the router. Each installs independently with its own metadata, logo, policies and helper. Frontend-capable entries include Taste; Backend Fixer omits its runtime. `scripts/package-skills.mjs` materializes the direct entries from the maintained canonical package. A regeneration test checks deterministic output without modifying the checkout. Install all three names; a prior router-only installation does not acquire the other entries automatically.

## TDD and checks

| Checkpoint / guarantee | Actual check | Result |
| --- | --- | --- |
| `56b625d` RED: standalone entries and bundled tools missing | `node --test tests/entrypoints.test.mjs tests/taste.test.mjs` | 5 failed for missing implementation |
| `4d50f91` GREEN: entries, draws, lint and safe inspector boundary supplied | Same target | 5 passed |
| Direct entries work from isolated copies without the router | `tests/entrypoints.test.mjs` | PASS |
| Regenerating twice preserves committed standalone contents | Same | PASS |
| Page/app draws preserve requested palette/type and real brief | `tests/taste.test.mjs` | PASS |
| Lint reports a gradient and preserves code monospace | Same | PASS |
| Both browser helpers reject local files before browser/server setup | Same, extended follow-up regression | PASS |
| Existing frontend/backend report gates and fixture behavior | Full suite | PASS |

Final `npm run test:coverage`: **47 passed, 0 failed**. Instrumented owned-code totals: **98.26% lines, 94.01% branches, 93.55% functions**. The canonical report helper remains 100% lines. Third-party vendor sources and test files are excluded. Isolated copied/generated scripts are exercised by behavior checks but are not claimed in this source coverage denominator.

All 28 shipped/generated JavaScript modules parse. All three skill frontmatters and OpenAI metadata safely parse as YAML; names, prompts, description lengths and icon references pass. There is no configured application build, type compiler or linter; those phases are not invented.

## Actual discovery, installation and browser evidence

Skills CLI 1.7.4 `add . --list` discovers exactly `hephaestus`, `hephaestus-frontend` and `hephaestus-backend`. The CLI installed all three into an isolated project for Codex and Claude Code with `--copy`: **50 / 50 / 12 files**, respectively, all byte-matching source in both agent projections. This verifies discovery/projection, not a live picker session in every host. The user's workspace installation is refreshed separately from the published GitHub source.

The adapted inspector ran against the existing synthetic loopback app at 1440, 768 and 390. Its page route emitted **2 FAIL / 4 WARN**, demonstrating that failures are retained; its appropriate `--app` route emitted **0 FAIL / 2 WARN**. Six captures were created per route, and the page-route captures were inspected. The remaining app warnings concern desktop whitespace and the phone title size. No image/video/motion-quota finding was emitted. Raw reports/captures remain local under ignored `.hephaestus/taste-smoke*` directories. No target UI repair or improved-aesthetics claim follows from this packaging smoke test.

## Limits

No independent real-application repair comparison, external media search/download, full scene implementation or live backend security evaluation was performed. Upstream study statistics are preserved as attributed source material, not independently reproduced findings. Browser execution and package checks do not establish production readiness or universal model compliance. No private source, raw logs or screenshots were uploaded as part of the investigation.
