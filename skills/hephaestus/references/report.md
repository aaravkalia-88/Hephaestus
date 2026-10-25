# Findings and verification report

Use `.hephaestus/report.json` as the machine-readable record and explain the useful results to the user. Ignore the directory before storing source excerpts or screenshots. Keep source and personal data local, sanitize browser captures, and retain only what the task needs. Do not overwrite existing reports or unrelated work.

## Contract

| Field | Meaning |
| --- | --- |
| `schema_version` | `1` |
| `target` | `frontend` or `backend`; omitted means `frontend` for older reports |
| `mode` | `audit` or `repair` |
| `baseline` | Actual Git revision or a recorded snapshot identifier |
| `approved_files` | Project-relative paths authorized for changes; no parent traversal or absolute paths |
| `changed_files` | Actual changed project files, each within the approved list and mapped to an active finding |
| `required_checks` | IDs of the checks relevant to the agreed work; determine these before editing |
| `checks` | Actual check observations with unique `id`, `kind`, `status` and `evidence` |
| `findings` | Evidence-backed issues using FF policy IDs for frontend, BF policy IDs for backend |

Check statuses are `pass`, `fail`, `skipped`, `needs_review`. State the reason when a check cannot run. Backend security checks BF-002, BF-004 and BF-006 additionally allow `not_applicable` with a nonempty `reason` and evidence that their auth, database or exposed-request surface is absent; missing tools are `skipped`. A `browser` check also needs its numeric `width` and matching `route`. Other kinds can be `build`, `types`, `lint`, `tests`, `integration`, `api`, `security`, `interaction`, `accessibility`, `async`, `privacy`, or `provenance` as appropriate. Include commands, observed results and artifact paths in the evidence observation. Never put a secret or an execution instruction in it.

Each finding has:

- A unique `id`, a policy `rule_id`, `severity` (`blocker`, `high`, `medium`, `low`) and `confidence` (`high`, `medium`, `low`). Severity is about the consequence; a style suspicion does not become a functional blocker.
- `route` and `file` when known, otherwise `null`. Optional `lines` use positive one-based `start` and `end` values. A global issue may have one finding per affected file or route.
- A nonempty `evidence` list: each entry has `kind` (`source`, `browser`, `screenshot`, `owner` for frontend; `source`, `test`, `runtime`, `owner` for backend) and an actual `summary`. Include the sanitized excerpt, observed event, artifact path or owner statement. Distinguish a subjective recommendation from measured behavior.
- `why_it_matters`, `proposed_change`, `regression_risk` and `status`.
- `verification_checks`: IDs of checks that establish this issue's outcome. An empty array is honest for an unresolved issue. For `verified`, every referenced check must pass. Frontend findings require browser observations at 390, 768 and 1440 for this finding's route. Backend findings require their own passing BF security check and at least one passing `tests`, `integration` or `api` check.
- For `waived`, `approval: {"by": "owner", "reason": "actual owner decision"}`. This records an approval already received; it never grants one.

Finding statuses:

| Status | Use |
| --- | --- |
| `open` | Observed; no agreed repair yet |
| `planned` | In the scoped repair plan |
| `fixed_unverified` | Edited; required evidence is missing or failing |
| `verified` | Relevant checks actually passed |
| `waived` | Owner explicitly approves keeping the exception |
| `needs_review` | A consequential fact or decision needs the owner |

Unknown endorsement or demonstration provenance remains `needs_review`. Privacy-link presence and owner-confirmed policy facts are separate observations. Record backend failures in the narrative or a separate handoff using the ARC fields; do not include private requests or auth data.

## Backend security gates

Every backend report must include seven checks, IDs BF-001 to BF-007, each `kind: "security"`, all listed in `required_checks`. They cover secrets, authentication, server validation/permissions, database access, dependencies, rate limits and security analysis, respectively. Set each actual observed status and sanitized evidence. An audit can be valid with skipped checks and no changes; it cannot be complete.

Backend completion needs every required check to pass (or a permitted, evidenced `not_applicable` security check), plus at least one passing required `tests`, `integration` or `api` suite. All findings must be verified or explicitly waived; no reported check may fail. A waiver does not bypass these security checks. A verified finding cannot use an inapplicable gate as proof. The checker cannot authenticate a reason, test result or scan: review them against the actual project.

FF-026 resolves to FF-024. Duplicates at the same location count once; conflicting statuses are invalid. Audit mode requires `changed_files: []`. Completion follows the target's check rules above, requires no reported failed check and requires all findings to be verified or explicitly waived. Otherwise present the truthful partial result.

## Minimal audit example

This is illustrative fixture data, not evidence from the user's project:

```json
{
  "schema_version": 1,
  "mode": "audit",
  "baseline": "record-the-actual-revision",
  "approved_files": [],
  "changed_files": [],
  "required_checks": ["runtime"],
  "checks": [
    {"id": "runtime", "kind": "browser", "status": "skipped", "evidence": "No runnable project was provided."}
  ],
  "findings": [
    {
      "id": "demo-link",
      "rule_id": "FF-018",
      "severity": "high",
      "confidence": "high",
      "route": "/",
      "file": "src/App.tsx",
      "lines": {"start": 8, "end": 8},
      "evidence": [{"kind": "source", "summary": "The Live demo link has href=\"#\"."}],
      "why_it_matters": "The claimed demo has no destination.",
      "proposed_change": "Ask for a working demo URL or accurately label an authentic preview.",
      "regression_risk": "Do not invent a working product or remove real content without agreement.",
      "status": "needs_review",
      "verification_checks": []
    }
  ]
}
```

## Helper limits

`scripts/check-report.mjs` is a dependency-free Node 22+ consistency check. Exit `0` means structurally valid; it does not mean the repair is complete. With `--require-verified`, exit `1` means a valid partial result is not ready. Exit `2` means invalid input/report. Reports over 1 MiB are rejected.

The helper reads a JSON file and the bundled policy. It never evaluates commands or edits the target. It does not check artifacts against reality, enforce an OS sandbox, choose which tests matter, verify owner identity, or replace source/browser review. Both a forged evidence string and a truthful observation are strings to the parser. The agent is responsible for collecting real evidence and describing limitations.
