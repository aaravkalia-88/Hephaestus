# Hephaestus

An installable skill for auditing and repairing existing frontends inside a coding agent. It combines the owner's 30-rule anti-slop policy with source evidence, scoped edits, real browser review, and honest verification statuses.

This release is **frontend-only**. It preserves behavior, approved branding and business facts. Backend failures are reported for follow-up; backend repair is deferred.

## Install

From the project you want to improve:

```sh
npx skills add aaravkalia-88/Hephaestus --skill hephaestus
```

Choose your agent when prompted. For specific agents:

```sh
npx skills add aaravkalia-88/Hephaestus --skill hephaestus --agent codex claude-code
```

Add `-g` if you want a user-level installation across projects. The installer needs Node 22.20+; the optional report helper needs Node 22+. Manual installation is also possible: copy the **entire** `skills/hephaestus` folder into your agent's skills directory. Keep the policy, references, helper and license files together.

The package uses the [Agent Skills format](https://agentskills.io/specification). The [skills CLI](https://github.com/vercel-labs/skills) handles agent-specific locations. Codex and Claude Code project-local package installation is tested. Cursor and other compatible agents can read the format; their complete workflows have not been exercised here. A plain chat model can read the instructions but needs filesystem, execution and browser tools to perform repairs.

## Use

In Codex, invoke `$hephaestus`. In Claude Code, invoke `/hephaestus`. For example:

```text
Use Hephaestus to audit this frontend first. Preserve our approved brand and real
pricing. Show source and browser evidence, then propose a scoped repair plan.
```

Audit-only requests do not change target source. For repairs, the agent works in an isolated checkout or branch, preserves working routes and API contracts, and presents a reviewable diff. Existing authorization covers ordinary safe edits; changes to business claims, pricing, privacy facts or approved brand choices need an actual owner decision.

## What is included

| File | Purpose |
| --- | --- |
| [SKILL.md](skills/hephaestus/SKILL.md) | Portable audit, repair and verification workflow |
| [Frontend policy](skills/hephaestus/policy/frontend-policy.json) | All 30 supplied standards; FF-026 aliases FF-024 |
| [Report contract](skills/hephaestus/references/report.md) | Evidence, checks, owner exceptions and truthful issue statuses |
| [Taste-derived reference](skills/hephaestus/references/taste.md) | Product-specific composition and visual critique |
| [Report checker](skills/hephaestus/scripts/check-report.mjs) | Local, dependency-free JSON consistency checks |
| [Evaluation cases](evals/evals.json) | Scope, brand, async states, backend handoff and runtime-unavailable scenarios |
| [Architecture](docs/arc.md) / [product specification](docs/pro.md) | Owner-supplied source documents, preserved as provided |

The skill guides the host agent through all policy entries. It is **not** a standalone scanner with 30 automated detectors, a hosted repair dashboard, or a new model. Syntax-aware inspection, edits and browser testing use the host's available tools and the target project's stack. No extra model API or service account is required.

The [implementation mapping](docs/frontend-skill.md) explains how the app-shaped source specifications were translated into a skill. FastAPI, PostgreSQL, a React control panel, upload services, and backend fixes are deferred.

## Verification

For the skill's report helper:

```sh
npm test
npm run test:coverage
npm run check
```

For a target-project report, resolve the installed skill folder:

```sh
node "<skill>/scripts/check-report.mjs" .hephaestus/report.json
node "<skill>/scripts/check-report.mjs" .hephaestus/report.json --require-verified
```

The default command accepts a valid partial audit. `--require-verified` rejects an unfinished repair. Exit `2` indicates invalid input. The helper checks report structure, source-file scope, alias counts and verification consistency. It does **not** execute the stated checks, authenticate owner approval, inspect artifacts or prove that evidence is true.

Actual frontend repairs still require the target's relevant build/tests, interactive and accessibility checks, and real captures at 390, 768 and 1440 pixels. A missing browser is a skipped check. An edited issue without evidence is `fixed_unverified`. Unknown testimonial, demo or privacy facts remain owner review items. No parser result establishes legal compliance, complete accessibility, security or production readiness.

See [TDD evidence](docs/frontend-skill.tdd.md) for observed checks and limits. Evaluation fixtures are synthetic source snippets, not a demo product or fabricated customer evidence.

## Attribution

Hephaestus is [MIT licensed](LICENSE). Its frontend reference adapts workflow ideas from [Leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) at commit `6010f91a9935f1c167dfc500fb1a475681892e6b`. [Notices and the upstream MIT license](skills/hephaestus/THIRD_PARTY_NOTICES.md) are included. No upstream media or font assets are bundled.
