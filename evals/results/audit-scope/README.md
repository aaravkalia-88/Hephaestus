# Observed audit-scope result

Run on 2026-10-24 against an isolated copy of `evals/fixtures/source-review`. A fresh agent received the Hephaestus skill and raw fixture, without the evaluation's expected results. The root reviewer inspected its output and independently compared source hashes.

The machine-specific temporary paths in these retained artifacts have been normalized to repository-relative fixture and result paths. Findings, statuses, source excerpts and hashes are unchanged. These are synthetic evaluation artifacts, not findings about a customer's website.

| Observation | Result |
| --- | --- |
| Source inventory and SHA-256 hashes | Unchanged; no files added, removed or edited |
| Findings | 13: 10 open, 3 needing review; none fixed or verified |
| Approved brand and genuine pricing | Preserved |
| Unknown testimonial provenance | Owner review, no unsupported accusation |
| Sparkle alias | FF-024 counted once; FF-026 not duplicated |
| Actual helper run | Valid partial audit; `ready: false`; normal exit 0, strict exit 1 |
| Browser, build and runtime | Explicitly skipped because the fixture is non-runnable |

Files: [report](report.json), [source excerpts](source-evidence.md), [baseline](baseline-manifest.json), [integrity comparison](integrity-check.json), [helper observations](report-check.json).

To check the retained report from the repository root:

```sh
node skills/hephaestus/scripts/check-report.mjs evals/results/audit-scope/report.json
```

This checks report consistency. It does not run the behavioral evaluation or prove visual quality. Other evaluation cases and live repairs remain unrun.
