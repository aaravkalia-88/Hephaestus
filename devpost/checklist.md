---
doc: checklist
status: draft
---

# Build Checklist

Implementation authorized by the learner's request to apply the proposed improvements, update the README for Build With AI: Basics, and make meaningful commits. These new documents await their review; this is not a claim of completed course sign-offs.

Build mode: not explicitly chosen. Technical work proceeds under the current authorization; learner activities remain pending.

## Slices

- [ ] **1. A repeatable frontend repair can be tried locally**
  Becomes usable: A local before/after fixture with controlled request outcomes and a repeatable browser check.
  Why now: Tests the actual skill behavior beyond the existing report parser.
  PRD ref: `prd.md > Observable repair outcome`, `prd.md > Honest evidence`
  Spec ref: `spec.md > Components`, `spec.md > Important Failure Modes`
  Build: Define server and browser guarantees first; retain broken input; ask a fresh agent to repair an isolated copy using Hephaestus; independently verify and retain the output.
  Verify (mechanical): Node server tests; a failing browser check against the input; the same check against the repair at 390/768/1440; screenshots and affected native controls.
  Learner check: Run `npm run demo`, compare before and after, change the response mode, and try failure recovery. Report what worked or felt wrong.
  Commit: `test: define runnable repair evaluation (RED)` then `feat: add verified frontend repair fixture (GREEN)`

- [ ] **2. Someone can understand and reproduce the proof**
  Becomes usable: README, actual evidence, clear learning state and offline code map.
  Why now: Documentation follows the observed implementation rather than promising untested behavior.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Honest evidence`
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`, `spec.md > Decisions and Open Issues`
  Build: Explain Build With AI: Basics, link the planning documents and fixture, record actual results and remaining learner work, and audit the repository read-only.
  Verify (mechanical): Relevant tests, metadata, safe asset serving, local links, evidence hashes, secret-pattern scan and complete diff review.
  Learner check: Follow the README from installation to the fixture and identify any unclear step.
  Commit: `docs: document Devpost learning workflow and repair evidence`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — runnable fixture ready for learner feedback
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — learner feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — learner participation or recap actually completed
- [ ] Optional edit and transfer reflection addressed
- [ ] `devpost/app-map.html` generated, checked and shown

Activity and evidence: agent technical checks will be recorded with the evaluation; learner activity is pending.
Route and stops: reference-only route through the skill, fixture request handler and report checker; not a completed guided tour.
Edit outcome: no learner edit requested or performed.
Reflection: not yet offered; no answer invented.
Activity mode: technical implementation now; learner walkthrough pending.

## Revisions
