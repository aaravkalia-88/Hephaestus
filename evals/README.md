# Behavioral evaluations

The JSON cases are realistic requests for a host agent using the installed skill. `audit-scope` ships a source-only fixture; `async-repair` ships a runnable native-web fixture. The other four cases need a selected project with the stated behavior and remain unrun.

Run a case in an isolated copy. Give a fresh agent the prompt, the skill and the raw project artifacts without the expected result. Keep the original source hashes, actual diff, report, check logs and captures. Judge the outcome against `verify`; report partial and unrun checks truthfully.

For `audit-scope`, copy `fixtures/source-review` into a temporary folder and preserve all three files. Reports belong outside that source folder. It is deliberately not runnable, so neither a dependency installation nor invented browser evidence is appropriate.

`npm test` tests the report helper and policy contract. It does not run these model/agent evaluations and does not establish improved aesthetic quality.

One independent `audit-scope` run is [recorded here](results/audit-scope/README.md). It produced a valid partial source audit and preserved the fixture; all runtime checks remained skipped for that non-runnable input.

For the runnable repair experiment, see [the actual result and instructions](results/runnable-repair/README.md). Run `npm run demo`, open `/before/` or `/after/` on `http://127.0.0.1:4173`, and invoke the shared browser check from that page's developer console:

```js
await (await import('/browser-check.mjs')).runChecks()
```

Repeat at viewport widths 390, 768 and 1440. This exercises the same assertions against both versions; it deliberately reports failures on the retained input. The check changes only ephemeral fixture state and uses the local simulated endpoint. It is not installed into the skill or run by `npm test`.
