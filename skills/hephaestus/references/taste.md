# Taste-derived frontend guidance

Source: [Leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill), commit `6010f91a9935f1c167dfc500fb1a475681892e6b`, version `2.1.4`. Adapted for Hephaestus; [attribution and license](../THIRD_PARTY_NOTICES.md).

This frontend module now includes the usable upstream implementation in `../vendor/taste/`, rather than only extracted guidance. It applies to Frontend Fixer; Backend Fixer uses its own workflow. The Hephaestus policy, project constraints and explicit owner decisions take precedence over upstream house rules and generated direction sheets.

## Bundled tools

Resolve `<taste>` to the installed skill's `vendor/taste` directory. No separate Taste installation is required. Keep direction sheets, history and reports inside the ignored project-local `.hephaestus/` directory:

```sh
TASTE_SKILL_HISTORY=.hephaestus/taste/history.json node "<taste>/scripts/draw.mjs" --sector dev-tool --brief "the actual product" --keep palette,type --options 3 --out .hephaestus/taste
TASTE_SKILL_HISTORY=.hephaestus/taste/history.json node "<taste>/scripts/draw.mjs" --app --kind analytics --brief "the actual app task" --keep palette,type --options 3 --out .hephaestus/taste
node "<taste>/scripts/lint.mjs" src --json
node "<taste>/scripts/inspect.mjs" http://127.0.0.1:3000 --out .hephaestus/taste/after --json
```

Use the matching sector/kind and only the target's authorized source paths and actual dev-server URL. For a full sheet, remove `--options 3`, select the direction/style suited to the real brief, and retain its seed and reasoning. A narrow repair can use existing tokens without drawing a new direction. Before changing typography or layout, read the relevant bundled [app-screen](../vendor/taste/references/app-screens.md), [copy](../vendor/taste/references/copy.md), [type](../vendor/taste/references/type.md), [colour](../vendor/taste/references/colour.md) or [layout](../vendor/taste/references/layout.md) guidance. Read [critique](../vendor/taste/references/critique.md) when reviewing captures; adapt its image/motion quotas to the actual task rather than treating them as requirements.

The inspector needs Node 22+ and an installed Chrome/Edge/Chromium. It captures 1440, 768 and 390 pixels. Hephaestus disables the upstream photograph/video/motion quotas by default and rejects filesystem targets; use an existing public dev-server URL so no private source directory is exposed. The scene capture helper has the same URL-only boundary. No scene catalogue, scene implementations or demos exist in this snapshot, so do not promise a complete scene system.

Direction sheets can propose white surfaces, corner radii or colours that conflict with FF rules or the owner's brand. Keep approved tokens and adapt the candidate; do not apply upstream “adopt everything” instructions over Hephaestus. An explicit brand exception may use `--allow <rule>` for that specific Taste diagnostic, recorded with its actual reason. The preserved [upstream instructions](../vendor/taste/UPSTREAM.md) are provenance and reference material, not an override of this integration.

Taste emits its own diagnostic IDs, not FF/BF IDs. Retain raw results, then establish context before mapping a concern into a Hephaestus finding. The source linter skips lines longer than 2,000 characters and files of 4 MB or more; an empty result is not complete inspection. Passing source lint or browser measurements does not prove design quality, runtime actions or backend correctness.

Optional `scripts/assets.mjs` searches external collections and records credits; run it only when external media research/downloads are authorized, without private content in queries. Photos and font URLs in the data are suggestions, not bundled or pre-cleared media. Verify each asset's actual license and credit. Page/app direction draws and source lint require no network; browser targets can make their own requests.

## Begin with the actual job

Identify the audience, primary action, real content and assets, existing stack, and approved visual identity. A marketing page and a working interface need different decisions. A review produces findings; a repair changes the requested behavior; a redesign may change composition. Do not turn a narrow repair into a redesign.

For an existing site, record the current behavior and rendered state before editing. Locate the components, routes, forms and data connections that must survive. Reuse the project's conventions instead of migrating frameworks or adding a visual library for convenience.

## Make deliberate choices

Tie important design decisions to this product's subject, content and user task. If the same proposed identity could describe any competitor, make the reasoning more specific. Keep a short record of the chosen hierarchy, typography, palette, layout and assets; do not invent a separate design system when existing tokens suffice.

When alternatives would help, use a small set that fits the brief and assets. A randomized library can supply candidates; it does not decide whether a candidate suits the user. Preserve approved brand choices. Record why an exception or change is needed.

Content must support what the page claims. Do not invent customers, testimonials, statistics or proof. Clearly identify sample content and simulated behavior. Match labels and feedback to real actions. A success message needs an actual successful operation behind it.

## Inspect what people will use

Run the existing project checks and inspect the rendered interface at relevant narrow and wide widths. Examine text fit, hierarchy, contrast, overflow, media loading, focus and keyboard behavior. Exercise applicable loading, empty, error and success states. Read the resulting screenshots; source inspection alone does not establish a good render.

For app screens, favor the information and action needed for the job. Check tables, units, numeric alignment, data meaning, filters and navigation. Do not apply marketing-page hero and imagery rules to a working dashboard.

Compare before and after under the same conditions. Retry the links, forms, menus and API-backed actions affected by the change. Report observed results and untested paths separately. A screenshot cannot prove persistence, authorization or backend correctness.

## Keep policy separate from evidence

Record each concern with its location, observation, consequence and smallest useful change. Separate functional/accessibility failures from content concerns and aesthetic judgments. A brand color, font, divider or card is not defective merely because a heuristic flags it.

Apply the owner's strict default policy and document explicitly approved brand exceptions. Do not conceal overflow, remove useful labels or change required content just to satisfy a checker. Do not impose Taste's minimum numbers of animations, photographs or decorative sections. Motion should help the interaction, respect reduced-motion settings, and leave content usable without it.

Prioritize the few changes that matter most, inspect again after material changes, and stop when the requested outcome is verified. Report a blocker when it prevents a check; never manufacture a passing record or inflate a subjective score into proof.

## Assets and tooling

Prefer the project's own assets. When outside media serves the work, verify the source, usage terms and required credit; never present a found image as the client's actual product or team. Keep code, credentials and private project artifacts out of external searches.

Use browser and test tools already available in the host. The original Taste inspector is an optional helper, not a requirement that every host must install. Keep its history, temporary profiles and reports in explicitly chosen locations when evaluating it. If serving local files, select a safe public root; do not expose private project files. Report missing tools honestly.

## Evidence required before claiming improved design quality

Exercise an existing branded site, an app screen and a review-only request. Verify brand and scope preservation; inspect real narrow/wide renders; test affected actions; show that review-only work did not mutate files. A comparison against the same host without this module is needed for any claim of improved design quality. A passing report parser alone establishes no visual improvement.
