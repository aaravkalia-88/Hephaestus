# Frontend skill implementation

The owner's [ARC](arc.md) and [product specification](pro.md) are preserved as supplied. Their 30-rule frontend policy is implemented in `skills/hephaestus/policy/frontend-policy.json`. The user's direct request selects an **installable agent skill**, so the hosted app architecture is not part of this release.

| Supplied app concept | Skill implementation |
| --- | --- |
| Project intake UI | Agent inspects the user's selected local checkout and task scope |
| Audit and findings workspace | Source/browser evidence, findings report and user discussion |
| Remediation planner | Agent proposes a concrete file-scoped repair plan |
| Patch worker | Host agent edits an isolated checkout within the agreed scope |
| Validation and preview | Existing project commands, host browser tools, captures and report checker |
| Export | Reviewable Git diff or patch; publication only when authorized |
| FastAPI, job database, React dashboard, upload/clone service | Deferred; no server or hosted UI is installed |

The skill delegates source understanding and repairs to the host model and tools. It does not pretend that a regex script automatically detects all 30 standards. Each registry entry contains the detection guidance and required behavior for the agent. React and Next.js are the primary workflows; source-level review of other frameworks uses the same policy without claiming identical runtime coverage.

The only executable shipped in the skill is a local JSON report consistency checker, built with Node's standard library. It prevents obvious status, alias and file-scope contradictions. It cannot attest that screenshots, check results or approvals are authentic. No model API, accounts, telemetry, database, new frontend framework or custom installer is needed.

## Taste contribution

The [Taste-derived reference](../skills/hephaestus/references/taste.md) retains the subject-specific design rationale, page/app distinction and real-render critique loop from Leonxlnx/taste-skill at `6010f91a9935f1c167dfc500fb1a475681892e6b`. Its MIT notice is bundled. Hephaestus uses the owner's stricter policy, rather than Taste's full house-style engine or mandatory motion/image quotas. No upstream media, font files, scene library or generator runtime is vendored.

## Verification scope

Parser tests establish metadata invariants, not aesthetic outcomes. Behavioral eval prompts cover scope, business facts, async state handling, backend handoff and unavailable browsers. Use real project checks and screenshots for an actual repair. Do not describe this release as a standalone autonomous scanner or as a production-readiness certification.
