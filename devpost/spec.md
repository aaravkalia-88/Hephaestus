---
doc: spec
status: draft
---

# Hephaestus — Technical Spec

## How This Works, In Plain Language
The host agent reads the skill and policy, inspects the selected frontend, proposes a scoped change and verifies the result. A small local test site supplies repeatable failures so we can check the repair in a browser.

## The Core Journey Through the System
PRD ref: [The Core Journey](prd.md).
Install → load `skills/hephaestus/SKILL.md` → inspect the target → edit an isolated copy → run its checks → review the diff and evidence. The optional Node helper checks the report's consistency.

## Stack
- Skill: Markdown, JSON policy and YAML host metadata; existing Agent Skills format.
- Helper and tests: Node 22+ standard library, `node:test`; no production dependencies.
- Runnable fixture: native HTML/CSS/JavaScript modules and a loopback-only Node response server. This keeps the first repair experiment independent of a build framework; it does not establish React/Next.js runtime coverage.
- Browser verification: the installed browser tooling. Record actual tools and results with the evaluation.

The fixture stack is an agent implementation choice within the authorized proof, not a learner-selected framework or a new Hephaestus product stack.

## Where It Runs and How Someone Tries It
Install from the repository using the README's skills command. Run helper tests with `npm test`. Run the local evaluation with `npm run demo`; open `http://127.0.0.1:4173/before/` and `/after/`.

The fixture server exposes only named test assets and simulated read-only responses. It has no credentials, persistent storage, account system or external service. A short learner-recorded demo and public repository are curriculum deliverables; the video and submission are still pending.

## Look and Feel
Carry forward [PRD: Look and Feel](prd.md). The fixture is a modest project-list screen. Improve only what its brief authorizes; preserve approved violet, data and purpose. Native labels, visible focus and readable failure states matter more than decorative elements.

## Components
- `skills/hephaestus/`: installed product instructions, policy and report checker.
- `evals/fixtures/repair-before/`: retained, intentionally flawed input.
- `evals/fixtures/repair-after/`: actual fresh-agent output, separately verified.
- `evals/serve.mjs`: explicit asset allowlist and deterministic response modes.
- `evals/browser-check.mjs`: repeatable browser assertions, served only as a test helper.
- `evals/results/`: actual evidence and limitations; no private data.

## Data Model
Synthetic project-name strings and a selected response scenario live only in memory. The frontend must distinguish pending, success, empty and failure and reject incompatible responses. No data survives a server restart or page refresh.

## Important Failure Modes
- HTTP error, network rejection or malformed data → honest error feedback and safe retry.
- Late response from an older selection → must not overwrite the latest request.
- Missing browser → skip visual claims; keep source and parser checks separate.

## What Was Simplified and Why
One disposable native-web fixture tests the skill's core loop without introducing a framework build system. Deterministic response simulation makes failures reproducible; it is not a real backend and must be labeled everywhere it matters.

## Decisions and Open Issues
The real uncertainty raised by the learner was whether the Devpost workflow would improve the current skill. This investigation tests a narrower proposition: whether a fresh agent can perform a complete repair under the existing policy. A successful single run cannot establish broad design improvement or universal host compatibility.

The initial package already exists. These documents clarify and extend it; no retrospective planning, learner review or learning achievement is fabricated.
