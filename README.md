<p align="center">
  <img src="assets/hephaestus-logo.png" alt="Hephaestus logo: a bearded forge god inspired by the supplied face reference" width="180" height="180">
</p>

# Hephaestus

An installable skill with **Frontend Fixer** and **Backend Fixer** modes for auditing and repairing existing code inside a coding agent. It combines the owner's 30-rule frontend anti-slop policy with seven backend security guardrails, scoped edits and honest verification evidence.

Developed as a proof of concept for **Build With AI: Basics by Devpost**, using the [Devpost Learn Skill Pack](https://github.com/challengepost/learn-ai-basics) to structure planning, a runnable repair experiment, review and learning documentation.

Frontend Fixer preserves approved branding, business facts and server contracts. Backend Fixer repairs server behavior within its own scope and requires security checks for secrets, authentication, validation/permissions, database access, dependencies, rate limits and static analysis. Both modes work on real project code; demo fixtures remain separate test material.

## Build With AI: Basics

The skill package existed before the complete learning workflow was documented. The follow-up pass uses the curriculum to make the intended journey, acceptance criteria, technical choices and observed proof explicit. It does not retroactively claim that every course step happened before coding.

| Learning artifact | Purpose and current state |
| --- | --- |
| [Scope](devpost/scope.md) | Original frontend proof scope; draft for learner review, predates Backend Fixer |
| [PRD](devpost/prd.md) | Observable behavior and acceptance criteria; draft for learner review |
| [Technical spec](devpost/spec.md) | Stack, execution and failure modes; draft for learner review |
| [Build checklist](devpost/checklist.md) | Actual technical progress, with learner checkpoints tracked separately |
| [App map](devpost/app-map.html) | Offline reference to the real skill, fixture and checker code |

The learner profile is private and ignored by Git. The six curriculum skills guide development; they are not bundled as a dependency of Hephaestus. You can install them separately with `npx skills add challengepost/learn-ai-basics --all`.

Learner document review, hands-on feedback, the learning wrap-up, demo recording and Devpost submission remain pending. Agent tests do not complete those steps. This README is technical project documentation; submission and survey answers remain the learner's own writing.

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

In Codex, invoke `$hephaestus`. In Claude Code, invoke `/hephaestus`. On the first explicit invocation in a chat, the skill presents its logo and [short welcome README](skills/hephaestus/README.md), then offers **Hephaestus: Frontend Fixer** and **Hephaestus: Backend Fixer** if the target is unclear. The image and welcome are bundled with the installation. Inline image rendering depends on the host; text and a usable image link are the fallback. Ask for “Hephaestus about” or its README to see the welcome again. Choose directly with:

```text
$hephaestus frontend
$hephaestus backend
```

Claude Code uses `/hephaestus frontend` or `/hephaestus backend`. The phrases `hephaestus:frontend fixer` and `hephaestus:backend fixer` also select the named modes in a prompt; they are not separately registered slash commands. For example:

```text
Use Hephaestus to audit this frontend first. Preserve our approved brand and real
pricing. Show source and browser evidence, then propose a scoped repair plan.
```

Audit-only requests do not change target source. For repairs, the agent works in an isolated checkout or branch, preserves working routes and API contracts, and presents a reviewable diff. Existing authorization covers ordinary safe edits; changes to business claims, pricing, privacy facts or approved brand choices need an actual owner decision.

For backend work, request the actual project and desired audit/repair scope, without pasting credentials. Backend Fixer reuses established authentication providers/frameworks, enforces server-side identity and permissions, and uses RLS or equivalent access controls appropriate to the database architecture. It does not create a hosted backend for Hephaestus.

## What is included

| File | Purpose |
| --- | --- |
| [SKILL.md](skills/hephaestus/SKILL.md) | Portable audit, repair and verification workflow |
| [Welcome README](skills/hephaestus/README.md) | In-chat introduction, bundled logo and fixer choices |
| [Frontend policy](skills/hephaestus/policy/frontend-policy.json) | All 30 supplied standards; FF-026 aliases FF-024 |
| [Backend workflow](skills/hephaestus/references/backend.md) | Real server audit/repair procedure and security boundaries |
| [Backend policy](skills/hephaestus/policy/backend-policy.json) | BF-001 to BF-007: the seven mandatory security areas |
| [Report contract](skills/hephaestus/references/report.md) | Evidence, checks, owner exceptions and truthful issue statuses |
| [Taste-derived reference](skills/hephaestus/references/taste.md) | Product-specific composition and visual critique |
| [Report checker](skills/hephaestus/scripts/check-report.mjs) | Local, dependency-free JSON consistency checks |
| [Evaluation cases](evals/evals.json) | Scope, brand, async states, backend handoff and runtime-unavailable scenarios |
| [Architecture](docs/arc.md) / [product specification](docs/pro.md) | Owner-supplied source documents, preserved as provided |

The skill guides the host agent through all policy entries. It is **not** a standalone scanner with 30 automated detectors, a hosted repair dashboard, or a new model. Syntax-aware inspection, edits and browser testing use the host's available tools and the target project's stack. No extra model API or service account is required.

The [implementation mapping](docs/frontend-skill.md) explains how the app-shaped source specifications were translated into a skill. A hosted FastAPI/PostgreSQL service, React control panel and upload services remain deferred. Backend Fixer runs in the host agent against the user's existing stack.

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

The default command accepts a valid partial audit. `--require-verified` rejects an unfinished repair. Exit `2` indicates invalid input. Set report `target` to `frontend` or `backend`; legacy reports without it remain frontend reports. The helper checks report structure, source-file scope, policy IDs and verification consistency. It does **not** execute the stated checks, authenticate owner approval, inspect artifacts or prove that evidence is true.

Backend reports must list all seven BF security checks in `required_checks`. Completion requires passing checks and a passing required behavior suite. Missing/failed scans block completion. Only absent auth, database or exposed-request surfaces can be `not_applicable`, with a reason and evidence; owner waivers cannot bypass unresolved security gates. Verified backend findings need their matching security check and behavior-test evidence. These are hard-coded report gates, not runtime protection in the target application.

Actual frontend repairs still require the target's relevant build/tests, interactive and accessibility checks, and real captures at 390, 768 and 1440 pixels. A missing browser is a skipped check. An edited issue without evidence is `fixed_unverified`. Unknown testimonial, demo or privacy facts remain owner review items. No parser result establishes legal compliance, complete accessibility, security or production readiness.

See [TDD evidence](docs/frontend-skill.tdd.md) for observed checks and limits. All evaluation fixtures are synthetic test material, not a demo product or customer evidence.

See [Backend Fixer TDD evidence](docs/backend-fixer.tdd.md) for the new gate tests and verification limits. The backend workflow has not yet been independently exercised on a real application; report tests do not establish deployed security. Its implementation references include [OWASP authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) and [secrets management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

## Try the runnable repair fixture

From a checkout of this repository with Node 22+:

```sh
npm run demo
```

Open [before](http://127.0.0.1:4173/before/) and [after](http://127.0.0.1:4173/after/). Choose a test response and select **Load projects**. Compare delayed loading, empty lists, HTTP failures, malformed responses and retry. The server binds to your own computer and serves only named test assets. Stop it with Ctrl+C.

This screen and its response service are synthetic test material. No account, API key, database, external service or package installation is needed. The fixture is native HTML/CSS/JavaScript; it does not establish React/Next.js runtime coverage. See [the observed evaluation](evals/results/runnable-repair/README.md) for the actual patch, browser checks, captures and limitations.

## Attribution

Hephaestus is [MIT licensed](LICENSE). Its frontend reference adapts workflow ideas from [Leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) at commit `6010f91a9935f1c167dfc500fb1a475681892e6b`. [Notices and the upstream MIT license](skills/hephaestus/THIRD_PARTY_NOTICES.md) are included. No upstream media or font assets are bundled.
