# In-chat welcome evidence — 2026-10-25

The user requested that invoking Hephaestus show its image, about information and README in the LLM chat. The skill now directs the first explicit invocation to render a bundled short welcome README with the original logo, followed by mode selection if the user has not chosen a target. About/README requests can show it again. Hosts without inline local-image support receive text and an image link. The full technical project README remains linked.

## TDD evidence

| Checkpoint | Command and observed result |
| --- | --- |
| `f192fd1` — RED | `node --test tests/package.test.mjs`: 1 failed; the standalone installed skill had no README. |
| `1c4b5d8` — GREEN | Same command: 1 passed. Welcome-image and host-icon paths resolve inside a standalone copy and byte-match the existing logo. |

The test checks package resources, not generated response wording. Both checkpoints belong to this task on `main`.

## Verification

- `npm run test:coverage`: 41 passed, 0 failed; 98.26% instrumented lines, 94.01% branches, 93.55% functions. README and host behavior are outside this denominator.
- `npm run check`: PASS. No application build, type-checker or linter is configured; none was added for this packaging change.
- Ruby `YAML.safe_load` parsed the frontmatter and OpenAI metadata and verified invocation and icon references. The Python validator's missing PyYAML dependency was already established in the previous task; the safe YAML fallback was reused without installing packages.
- `git diff --check 51ffeac`: PASS. The original logo was inspected and copied unchanged. No authentication, API, report-gate or application logic changed.
- The previous installation's hash matched its lock before refresh. All 13 updated installed files byte-match source; the local lock hash matches the source directory. A temporary rollback copy of the prior installation and lock was retained.

This verifies packaging and instructions, not automatic response compliance across models or image rendering in every chat host. No external-host session, deployment or GitHub push was performed.
