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

The only executable shipped in the skill is a local JSON report consistency checker, built with Node's standard library. It prevents obvious status, alias and file-scope contradictions and enforces target-specific completion evidence. It cannot attest that screenshots, check results or approvals are authentic. No model API, accounts, telemetry, database, new frontend framework or custom installer is needed.

## Implemented architecture

```mermaid
flowchart TD
    User[User selects project and scope] --> Host[Host coding agent]
    Skill[Hephaestus mode selection] --> Host
    Skill --> Frontend[Frontend Fixer: 30 FF rules]
    Skill --> Backend[Backend Fixer: seven BF security guardrails]
    Frontend --> Host
    Backend --> Host
    Host --> Target[Isolated target project]
    Target --> Browser[Local browser and project checks]
    Browser --> Evidence[Local evidence, report and diff]
    Evidence --> Checker[Optional Node report consistency check]
    Checker --> Review[User reviews observed result]
    Before[Retained synthetic input] --> Experiment[Independent repair evaluation]
    Experiment --> After[Retained repaired fixture]
    Server[Loopback fixture server: named assets and simulated GET responses] --> Before
    Server --> After
    After --> Browser
```

The host agent is the execution boundary: Hephaestus does not supply a separate model or service. Source, browser data and reports remain local unless publication is explicitly authorized. The report helper reads JSON only. The optional evaluation server binds to `127.0.0.1`, serves an explicit asset list and synthetic read-only responses, and has no persistence, credentials or external API. It remains frontend test infrastructure. The new [Backend Fixer workflow](../skills/hephaestus/references/backend.md) operates on real server code in the selected project; no hosted product API is installed.

Frontend and backend reports use separate `target` values and policy namespaces. Missing `target` retains the old frontend behavior. Frontend verification still requires route-matched 390/768/1440 browser observations. Backend verification requires seven named security gates and behavior tests; skipped gates block completion. The checker cannot establish whether reported observations are authentic or protect a running application by itself.

## Taste contribution

The [Taste-derived reference](../skills/hephaestus/references/taste.md) retains the subject-specific design rationale, page/app distinction and real-render critique loop from Leonxlnx/taste-skill at `6010f91a9935f1c167dfc500fb1a475681892e6b`. Its MIT notice is bundled. Hephaestus uses the owner's stricter policy, rather than Taste's full house-style engine or mandatory motion/image quotas. No upstream media, font files, scene library or generator runtime is vendored.

## Verification scope

Parser tests establish metadata invariants, not aesthetic outcomes. Behavioral eval prompts cover scope, business facts, async state handling, backend handoff and unavailable browsers. Use real project checks and screenshots for an actual repair. Do not describe this release as a standalone autonomous scanner or as a production-readiness certification.

The [runnable evaluation](../evals/results/runnable-repair/README.md) now records one independently repaired native-web fixture, 45 passing browser assertions and their limits. Broader framework and host support remains unverified.
