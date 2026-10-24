# HEPHAESTUS
## PRO.md | Frontend Fixer Product Specification

**Status:** Build specification  
**Feature:** Frontend Fixer  
**Product:** Hephaestus  
**Mission:** Turn inconsistent, fragile, AI-generated frontends into distinctive, accessible, professional websites and applications that work in production.

## 1. Product definition

Hephaestus does not exist to generate another generic website. Its Frontend Fixer takes an **existing codebase**, diagnoses its design and user-experience failures, repairs the underlying implementation, and proves that the repairs work.

**Product promise:** From vibe-coded to professionally engineered.

**One job:** Find and fix frontend defects that make a real product look or behave like an AI-generated template.

Hephaestus must improve both **appearance** and **behavior**. A polished screenshot with nonfunctional buttons, fabricated social proof, broken mobile layouts, or unsafe forms is not a successful result.

### In scope

- Audit existing React, Next.js, Vue, Svelte, and HTML/CSS projects, starting with React and Next.js in the MVP.
- Detect repetitive AI-design patterns, weak content, missing user states, accessibility issues, responsive defects, and frontend integration failures.
- Fix structure, styles, components, routing, empty/loading/error states, and safe frontend integration code.
- Preserve real product data, user-defined business logic, brand assets, and functional behavior.
- Run a build, automated checks, browser tests, and visual reviews after editing.
- Present every meaningful edit as a reviewable diff with before/after evidence.

### Out of scope for this feature

- Generating an entire unrelated product from a one-line prompt.
- Inventing company claims, customers, reviews, pricing, benchmarks, or product demo footage.
- Replacing backend architecture or altering database schemas without the Backend Fixer.
- Declaring a website legally compliant or secure solely because an automated audit passed.

## 2. Who uses it

**Primary:** Solo builders and small teams who use AI tools to ship websites and applications but want them to look credible and operate reliably.

**Secondary:** Agencies, hackathon teams, founders, and frontend developers cleaning up generated code.

**Main user story:**

> I connect my project. Hephaestus finds why it feels templated or broken, explains the evidence, repairs the frontend without destroying its identity, and shows me the working result before I merge it.

## 3. The 30 frontend standards

All 30 entries below are included in the default **Professional Quality Policy**. "Avoid" means do not introduce the pattern and actively remediate existing occurrences when doing so is safe. Some entries describe **missing necessities**, so their remedy is to add the missing functionality, not remove it.

| # | Anti-pattern or failure | Required behavior |
|---|---|---|
| 01 | Harsh gradients | Remove conspicuous multi-stop gradients. Use material, texture, borders, images, or restrained flat surfaces with intentional contrast. |
| 02 | Lucide icons | Do not add Lucide or use `lucide-react` as a default icon shortcut. Replace generic decorative instances with purposeful custom SVG, licensed iconography, or meaningful text. |
| 03 | Pure white backgrounds | Avoid full-page `#FFFFFF` / `rgb(255 255 255)` backgrounds. Use considered off-white or tinted neutral surfaces; preserve necessary contrast. |
| 04 | Rainbow coloring | Avoid using many unrelated accent hues. Build a curated, intentional palette. |
| 05 | Purple or dark gradients | Do not use generic purple glows or dark gradient hero backgrounds. |
| 06 | Drop shadows | Remove template-style large, soft, floating shadows. Establish depth through spacing, borders, layered surfaces, and hierarchy. |
| 07 | Three feature cards in a row | Do not default to the predictable three-across feature section. Use product-led layouts, editorial sections, real screenshots, or purposeful asymmetry. |
| 08 | Liquid glass | Avoid frosted acrylic, glassmorphism, oversized backdrop blurs, and translucent glass panels as a theme. |
| 09 | Em dashes | Do not generate em dashes (`—`) in visible interface or marketing copy. Rewrite sentences naturally using a period, colon, or comma. |
| 10 | Inter / Geist / Space Grotesk | Do not choose these as the automatic typography stack. Select a distinctive, suitable, licensed font or a considered system stack. |
| 11 | Colored left stripe | Avoid generic colorful left-border callout cards. Use stronger information structure and restrained emphasis. |
| 12 | Fake testimonials | Never invent quotes, reviewers, company logos, numbers, or implied endorsements. Keep only verifiable, approved social proof. |
| 13 | Bento grids | Do not default to generic bento-grid feature layouts. Design for content and tasks instead. |
| 14 | Terminal windows | Avoid faux command-line panels as decorative proof of technical sophistication. Only show an actual functioning technical interface when relevant. |
| 15 | “It's not X, it's Y” | Remove this stock rhetorical structure from generated copy. Explain concrete value instead. |
| 16 | Checkmark bullets | Avoid repetitive green-check marketing lists. Use concise copy, actual product evidence, and conventional list styling where needed. |
| 17 | Three pricing tiers | Never generate three arbitrary pricing plans to fill a template. Preserve genuine business-configured plans, whatever their number. |
| 18 | No real product demos | Product marketing must show a real captured UI, working preview, or verified demonstration when a demo is claimed. Never fabricate the UI or footage. |
| 19 | Soft corner radius | Avoid universally oversized rounded cards, buttons, and inputs. Use a controlled shape scale with generally sharper, practical corners. |
| 20 | Purple and black | Avoid the clichéd purple-on-black AI-site aesthetic. Respect the product's actual branding instead. |
| 21 | No skeleton loader | **Add appropriate loading states** for meaningful asynchronous regions. Use content-shaped skeletons when a real wait is expected, not decorative loading everywhere. |
| 22 | Radial orbs | Remove glowing decorative orbs, blurred radial color blobs, and empty atmospheric effects. |
| 23 | Dot grids | Avoid background dot grids as generic tech decoration. |
| 24 | Sparkle icons | Remove decorative sparkles and magic-wand cues unless a genuinely necessary product action requires a specific symbol. |
| 25 | Animated arrows | Do not use perpetual arrow bounce, nudge, or hover gimmicks as a substitute for navigation clarity. |
| 26 | Sparkle icons (repeated) | Same policy as #24. Tracked for input completeness, implemented as one shared rule. |
| 27 | No privacy policy | **Require an accessible, accurate privacy policy** for products collecting or processing personal data. Flag missing or unverifiable details for owner review. |
| 28 | Neon colors | Avoid fluorescent accents and glowing outlines as a general design system. |
| 29 | Basic single-color palettes | Avoid lazy monochrome defaults. Use a coherent neutral foundation and a small set of complementary, purposeful accents, without turning it into a rainbow. |
| 30 | Unprofessional overall result | Enforce coherent design, real content, working interactions, responsiveness, accessibility, performance, and visual consistency. |

**Interpretation safeguards:** These are Hephaestus' **default design policy**, not permission to overwrite a real brand or delete genuine product facts. A business with three legitimate plans keeps its three plans. A verified testimonial stays if the owner wants it. Brand exceptions require explicit user approval and are recorded in the report.

## 4. Frontend Fixer experience

### Step 1: Connect

The user selects a repository, local folder, or uploaded project. The app detects the framework, design system, entry points, routes, package manager, available tests, and assets. Original files remain untouched until the user opts to apply edits.

### Step 2: Analyze

Hephaestus scans the source and, when runnable, opens the product in a real browser. It inspects implementation and appearance at mobile, tablet, and desktop sizes. Every finding must have a reason and source location, screenshot, or observable behavior.

### Step 3: Explain

The audit shows:

- **Design pattern violations:** The specific standard, affected component or route, and suggested remedy.
- **Functional failures:** Broken navigation, dead CTAs, invalid form states, runtime errors, or faulty loading behavior.
- **Accessibility and responsiveness:** Contrast, keyboard operation, focus visibility, overflow, and reading order.
- **Trust and credibility gaps:** Fake or unverifiable social proof, missing privacy information, and demo claims unsupported by a real demo.

### Step 4: Fix

The user chooses **Fix All Safe Issues** or selects findings. Hephaestus proposes a repair plan, then edits existing files on a dedicated branch or copy. It must favor minimal, comprehensible changes over a complete redesign.

### Step 5: Validate

The app builds, tests, opens the pages, checks interactive states, and compares before/after screenshots. A fix is only labeled **verified** when its relevant checks actually pass.

### Step 6: Review and export

The user sees a route-by-route preview, changed files, explanation of each change, outstanding warnings, and a patch/PR option. Nothing merges or deploys without explicit approval.

## 5. Product interface

The Frontend Fixer screen should itself demonstrate the standard it enforces.

**Primary layout:** A task-oriented workspace with a project header, findings panel, central live preview, and a contextual fix/diff inspector. It must not resemble a generic AI landing page or chat-only app.

**Core views:**

1. **Project intake:** Repo or folder source, framework detection, ability to choose branch and audit scope.
2. **Audit workspace:** Severity, affected route, screenshot, exact code evidence, and rule reference.
3. **Fix preview:** Side-by-side before/after views, diff summary, working interactions, and rollback.
4. **Validation:** Build and test results, screenshot changes, unresolved limitations, and owner approvals.

**Visual guidance for Hephaestus itself:** Restrained neutral surfaces, readable information hierarchy, bespoke product-appropriate visual language, sharp-to-moderate radii, no automatic purple or glass aesthetics, no floating card-shadow forest, and no ornamental icon overload. Use real snapshots of projects in the interface.

## 6. Audit result and repair contract

Every finding must include:

- Stable `rule_id`, e.g. `FF-021`.
- `severity`: `blocker`, `high`, `medium`, or `low`.
- `confidence`: `high`, `medium`, or `low`.
- `route`, `file`, and line range when known.
- `evidence`: actual code excerpt, computed-style result, screenshot, or reproduced browser event.
- `why_it_matters`: one useful sentence, not taste-only insults.
- `proposed_change` and possible `regression_risk`.
- `status`: `open`, `planned`, `fixed_unverified`, `verified`, `waived`, or `needs_review`.

**No fabricated findings:** If there is no runtime browser access, say that visual validation was not performed. If the app cannot verify whether a testimonial or demo is real, label it **needs owner verification**, not false.

## 7. Fixing priorities

**Priority A: Broken or misleading**  
Dead UI, failing build, inaccessible core flows, missing loading/error states, unsafe frontend handling, false claims, invented demos, and missing privacy disclosures where required.

**Priority B: Visibly templated**  
Generic gradients, decorative sparkles, bento layouts, three-across feature cards, repeated font defaults, glow effects, excessive rounding, and repetitive copy.

**Priority C: Refinement**  
Spacing rhythm, typography proportions, microcopy, intentional page structure, genuine product imagery, and motion restraint.

Do not prioritize cosmetic fixes over a broken checkout, login, form, or API interaction.

## 8. Acceptance criteria

A Frontend Fixer job is successful only if:

- The initial issues are tied to evidence, not unsupported subjective claims.
- All changed pages still compile and existing supported user flows pass.
- No banned pattern is newly introduced by a fix.
- High-confidence policy violations addressed by the repair are gone after rescan.
- Mobile, tablet, and desktop checks run on impacted routes when a browser is available.
- Keyboard support and WCAG 2.2 AA-related checks are reported, including manual-review limitations.
- Meaningful async regions have appropriate loading, empty, error, and success states.
- Claimed demos are based on the actual product. Marketing claims are not invented.
- Privacy-policy presence and factual verification are reported independently.
- The user can review every file change, revert it, and see failed or skipped checks.
- The final report does not call the product “production-ready” if critical checks are unrun or failing.

### Representative end-to-end scenarios

| Scenario | Expected output |
|---|---|
| AI-made SaaS page with purple gradient, glow orbs, and three floating cards | Real layout refactor with restrained brand-aligned palette and product-led sections. |
| Dashboard fetching data with blank screen | Data-shaped skeleton during material latency plus error, empty, and retry states. |
| Landing page with invented “trusted by” logos | Unverifiable logos flagged and removed only after owner confirmation; replace with real capabilities, not invented claims. |
| App has five verified pricing plans | Keep all five plans. Never force three tiers. |
| Site advertises an interactive demo with a static fake mockup | Replace with working preview or accurately label an authentic static screenshot; otherwise flag the missing demo. |
| Real brand uses a shade of purple | Preserve the brand if explicitly confirmed; target cliché layout/effects, not a blanket color ban. |
| App handles personal data but has no privacy disclosure | Block claim of completion until policy link and owner-verified content are in place. |

## 9. Minimum viable product

**MVP 1**

- React and Next.js audit with source-linked findings for the 30 rules.
- Playwright capture at 390, 768, and 1440 pixel viewport widths.
- Design-token inspection, text-pattern detection, component-structure checks, and real interaction smoke tests.
- Safe automated repairs for typography, decorative CSS, layout templates, loading states, and copy patterns.
- Approval-based patches with rollback, build/test checks, and screenshots.
- Accurate status for demo authenticity and privacy content, with human review where needed.

**MVP 2**

- More frameworks, multi-page journey coverage, optional approved brand references, deeper accessibility and performance diagnostics, and GitHub pull requests.

**MVP 3**

- Shared rules between Frontend Fixer and Backend Fixer for auth, API-state handling, forms, privacy flows, and production readiness.

## 10. Product success metrics

- **Verified remediation rate:** Share of accepted findings verified resolved after editing.
- **Regression rate:** Share of changed routes or tests that newly fail.
- **Time to reviewed patch:** Elapsed time from intake to a user-reviewable result.
- **Design-pattern recurrence:** How often the 30 anti-patterns reappear in fixed output.
- **Human acceptance rate:** Share of suggested changes accepted without major reversal.
- **Interaction coverage:** Share of targeted critical user flows actually browser-tested.

Never inflate these metrics. Report unavailable benchmarks as unavailable.

## 11. Definition of done

The Frontend Fixer is complete when a user can submit an imperfect real codebase, receive grounded findings, approve focused code improvements, inspect a functioning before/after experience, and export a verified patch with clear outstanding risks.

**Hephaestus standard:** Professional design must be earned through evidence, functioning software, and intentional decisions. It cannot be simulated with shiny effects.
