---
name: stackpress-app-verification
description: Use when an agent needs to verify that a Stackpress app phase is actually complete by checking scaffold files, schema readiness, generated output, plugin wiring, and reachable runtime behavior before advancing the workflow.
---

# Stackpress App Verification

Verify Stackpress app progress with explicit phase evidence.

This skill is a gatekeeper. It decides whether the current phase is real enough
to advance. It does not replace the scaffold, schema, routing, or plugin
implementation skills.

## Overview

Evidence before advancement.

This skill exists to stop Stackpress workflows from moving forward on plausible
structure, stale assumptions, or unverified output.

## Use This Skill For

- checking whether a Stackpress workflow phase is complete
- verifying scaffold output before moving to schema work
- verifying schema readiness before or after generation
- verifying generated output, plugin wiring, and reachable runtime behavior
- preventing the coordinator from moving forward on weak assumptions

## Do Not Use This Skill For

- authoring `schema.idea`
- deciding the product requirements
- inventing plugin architecture from scratch
- replacing broad test suites with superficial file checks

## Primary Rule

Require the smallest convincing evidence that the phase is real.

Do not demand full end-to-end QA at every step. Do not accept hand-wavy
"probably works" either.

## The Iron Law

```text
NO PHASE ADVANCEMENT WITHOUT FRESH PHASE EVIDENCE
```

If the relevant evidence was not checked in the current workflow state, the
phase is not verified.

## Verification Order

Check the current phase in this order:

1. scaffold evidence
2. schema evidence
3. generation evidence
4. plugin wiring evidence
5. runtime reachability evidence

Only verify the phases that are supposed to exist already.

## Output Format

For each verification pass, report:

1. phase being verified
2. evidence checked
3. pass or fail
4. blocking gaps
5. exact next action if it failed

If verification is partial, say that explicitly instead of implying completion.

## Verification Gate

Before passing any phase:

1. identify what evidence proves the phase
2. check that evidence directly
3. confirm the evidence matches the intended artifact or behavior
4. fail the phase if the evidence is missing, stale, or ambiguous
5. only then allow the workflow to advance

Skip any step and the phase is still unverified.

## 1. Scaffold Verification

When verifying scaffold output, confirm that the expected baseline files exist
and the required substitutions were applied.

Minimum evidence:

- project root contains `package.json`
- project root contains `schema.idea`
- project root contains `tsconfig.json`
- project root contains `uno.config.ts`
- `config/` exists with expected baseline files
- `plugins/` exists with the expected baseline plugin folders
- scaffold placeholders are no longer present where replacements were expected

Fail scaffold verification when:

- expected baseline files are missing
- placeholder tokens remain unreplaced
- the app was scaffolded into a non-empty directory in a way that created
  ambiguity

Do not move to schema work until the baseline project shape is real.

## 2. Schema Verification

When verifying schema readiness, confirm that `schema.idea` is coherent enough
for meaningful generation.

Minimum evidence:

- the intended top-level models are present
- the critical fields and relations implied by the requirements are present
- the schema is intentional rather than still a generic placeholder
- important display or validation metadata is present where it materially
  affects generated output

Good schema verification questions:

- does this schema cover the main product nouns?
- does it support the critical user flows?
- are the important relations explicit?
- is generated admin or view behavior likely to be useful from this schema?

Fail schema verification when:

- important domain models are still missing
- the schema is still mostly the scaffold default
- major relations or validations are absent
- the intended generated behavior clearly cannot emerge from the current schema

## 3. Generation Verification

When verifying generation, confirm that Stackpress actually produced output in
the expected destination.

Minimum evidence:

- the generation command completed successfully
- generated files appeared in the configured client or build output
- generated package surfaces such as `index.ts`, package exports, or registries
  reflect the intended change when applicable
- output location matches the app's config rather than an ad hoc path

Fail generation verification when:

- generation did not run successfully
- output is missing or written to the wrong place
- expected generated artifacts were not emitted
- generated output still reflects stale schema assumptions

Do not route downstream plugin work off a failed or stale generation pass.

## 4. Plugin Wiring Verification

When verifying plugin work, confirm that the plugin exists and is actually
wired into the Stackpress app.

Minimum evidence:

- the plugin files exist in the expected `plugins/` location
- `package.json.plugins` includes the plugin entry when required
- the plugin uses the correct lifecycle hook for its role
- generation plugins register `idea` properly
- runtime plugins place behavior in `config`, `listen`, or `route` correctly
- browser-facing files avoid obvious server-only coupling

Fail plugin verification when:

- the plugin exists on disk but is not registered
- the plugin uses the wrong hook for the behavior
- generation logic was incorrectly placed in runtime hooks
- runtime logic was incorrectly pushed into transform code

## 5. Runtime Reachability Verification

When verifying runtime behavior, confirm that the app can actually reach the
behavior that was implemented.

Examples of acceptable minimum evidence:

- a route is registered and reachable
- a view is bound to the intended route
- an event listener is registered and can be resolved
- a generated runtime artifact is importable through the expected client path

Prefer the smallest proof that demonstrates the feature is live.

Fail runtime verification when:

- files exist but nothing exposes them
- a route handler exists without route registration
- a view exists without route-to-view binding
- generated artifacts exist but runtime cannot consume them

## Verification by Feature Type

### Schema-heavy feature

Focus on:

- model coverage
- relation correctness
- generation readiness

### Runtime integration feature

Focus on:

- plugin registration
- correct hook placement
- minimal reachable behavior

### Route/view feature

Focus on:

- route registration
- page handler presence
- view binding
- minimal page reachability

### Generation plugin feature

Focus on:

- `idea` hook registration
- transform presence
- generated file output
- runtime reconnection when applicable

## Failure Handling

If verification fails:

1. name the failed phase
2. name the missing evidence
3. route back to the skill that should fix it
4. re-verify only the affected downstream phases

Examples:

- missing models or relations -> `stackpress-idea-authoring`
- wrong implementation lane -> `stackpress-plugin-router`
- missing plugin shell or wrong hook -> `stackpress-plugin-scaffold`
- missing transform output -> `stackpress-plugin-idea-generator`

Do not continue layering work on top of a failed gate.

## When to Stop

Stop verification and return the workflow to the responsible skill when:

- command-backed evidence was never actually produced
- the output exists but does not match the intended phase result
- the current implementation lane appears to be wrong
- downstream work depends on a phase that is still ambiguous

Do not soften a failed gate into a partial success just to keep momentum.

## Anti-Rationalization Checks

Before passing a phase, ask:

- do I have evidence, or just plausible code?
- was the relevant command actually run when command evidence matters?
- is the behavior reachable, not merely present on disk?
- is this enough proof for this phase, without pretending the whole app is done?

If the answer is unclear, the phase is not verified yet.

## Common Mistakes

- treating file existence as full verification
- skipping schema checks because generation succeeds syntactically
- accepting generated output without checking the destination and surface
- forgetting `package.json.plugins`
- declaring route work complete without route-to-view binding
- moving the coordinator forward based on assumptions instead of evidence
