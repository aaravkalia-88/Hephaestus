# Taste-derived frontend guidance

Source: [Leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill), commit `6010f91a9935f1c167dfc500fb1a475681892e6b`, version `2.1.4`. Adapted for Hephaestus; [attribution and license](../THIRD_PARTY_NOTICES.md).

This module supplies composition and critique guidance for Hephaestus. The bundled policy, the user's architecture and `pro.md`, project constraints and explicit owner decisions take precedence over these extracted recommendations. Backend work is deferred.

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
