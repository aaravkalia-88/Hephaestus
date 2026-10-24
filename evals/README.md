# Behavioral evaluations

The JSON cases are realistic requests for a host agent using the installed skill. Only `audit-scope` ships a source fixture. The other cases require an actual selected project with the stated behavior; they are not automated results or claims of coverage.

Run a case in an isolated copy. Give a fresh agent the prompt, the skill and the raw project artifacts without the expected result. Keep the original source hashes, actual diff, report, check logs and captures. Judge the outcome against `verify`; report partial and unrun checks truthfully.

For `audit-scope`, copy `fixtures/source-review` into a temporary folder and preserve all three files. Reports belong outside that source folder. It is deliberately not runnable, so neither a dependency installation nor invented browser evidence is appropriate.

`npm test` tests the report helper and policy contract. It does not run these model/agent evaluations and does not establish improved aesthetic quality.

One independent `audit-scope` run is [recorded here](results/audit-scope/README.md). It produced a valid partial source audit and preserved the fixture; all runtime checks remained skipped. The other five cases are unrun.
