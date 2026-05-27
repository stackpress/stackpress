# Template Store Skill Evaluation

## 1. Summary

This sample was intentionally used as an experiment for the StackPress and
ChrisAI skill families while implementing a decoupled plugin composition flow
inside `templates/store`.

The final sample proved that the architecture can work, but it also exposed
where the current skill families are incomplete or too easy to apply
incorrectly.

## 2. Test Case

The implementation target was:

- keep `plugins/store` infrastructure-only
- keep `plugins/app` focused on shared app concerns
- split `product`, `cart`, `checkout`, and `order` into separate plugins
- weave a minimal end-to-end flow through routes, plugin boundaries, and
  generated data access
- keep the public UX minimal but understandable

## 3. StackPress Skill Family Findings

### 3.1 `stackpress-app-coordinator`

What worked:

- the phase model was correct for this task
- it matched the right order: discovery, scaffold, schema, generate,
  implementation routing, verification, optional polish
- it was useful as a checkpoint lens once the user pushed the work back into
  that sequence explicitly

What did not work well:

- it was too easy to proceed informally without explicitly honoring the
  coordinator skill
- it did not by itself prevent an early wrong assumption about
  `templates/store` being a commerce-oriented template instead of a storage-led
  sample
- it did not force enough artifact-specific handoff language during planning

Improvement needed:

- make the coordinator stricter about restating the current phase and next
  artifact before implementation starts
- add a stronger warning that template names may be misleading and must be
  validated against local repo context first
- add an explicit reminder that implementation plans should cite which narrower
  StackPress skill owns each step

### 3.2 `stackpress-idea-authoring`

What worked:

- this was the key corrective skill for the schema phase
- it reframed `schema.idea` as an admin-aware contract rather than just a set
  of tables
- it helped surface the need for intentional `@field.*`, `@filter.*`,
  `@span.*`, `@list.*`, and `@view.*` decisions

What did not work well:

- the initial plan underused it and therefore under-specified generated admin
  behavior
- runtime validation still had to expose some schema issues later, especially
  around the attempted profile-linked flow

Improvement needed:

- make the schema review gate harder to skip before running `generate`
- add a checklist for intentionally omitted admin metadata so omissions are
  explicit rather than accidental

### 3.3 `stackpress-plugin-scaffold` and plugin-shape guidance

What worked:

- the sample benefited from splitting feature ownership across separate plugin
  folders
- plugin-first thinking kept feature routes from collapsing into `app` or
  `store`

What did not work well:

- scaffold guidance should more strongly warn that plugin registration must
  happen only after a real `plugin.ts` exists
- it did not proactively emphasize the difference between app infrastructure
  and feature ownership in this sample

Improvement needed:

- add a hard note about blank `plugin.ts` placeholders before
  `package.json.plugins` changes
- add examples where `app` is shared infrastructure rather than a feature host

### 3.4 `stackpress-plugin-views`

What worked:

- it aligned well with the need for handwritten route views
- the sample validated the `Page` plus `Body` pattern with `LayoutPanel`

What did not work well:

- SSR response usage was easy to get wrong until the page structure matched
  the local pattern more closely

Improvement needed:

- add a more explicit example that shows `useResponse()` inside a `Body`
  component wrapped by `Page`

## 4. ChrisAI Skill Family Findings

### 4.1 `chrisai-usage`

What worked:

- it correctly frames itself as a router, not an implementation skill
- it is useful late in the workflow when the deliverable clearly becomes
  TS/TSX polish or QA

What did not work well:

- it did not help with StackPress-specific architectural corrections
- it was not the right first tool for schema and plugin-boundary decisions

Improvement needed:

- document more clearly that StackPress-specialist skills should own the build
  until the task reaches code-style, docs, or QA refinement

### 4.2 `chrisai-coding-ts`

What worked:

- useful as a second-pass cleanup for route handlers and plugin files
- improved readability through short JSDoc blocks and flow comments without
  changing behavior

What did not work well:

- if applied too early, it risks encouraging style work before the StackPress
  phase gates are actually stable

Improvement needed:

- explicitly reinforce that it is a polish skill when architecture is still in
  flux

### 4.3 `chrisai-coding-ts-react`

What worked:

- useful for the late TSX pass on handwritten views
- it matched the need for light structural cleanup and guided comment density

What did not work well:

- it does not know StackPress-specific page composition patterns by itself

Improvement needed:

- add an example note for SSR-style page wrappers when used in non-standard
  React stacks like StackPress views

## 5. Concrete Lessons

1. The StackPress family should own the architecture, schema, generation, and
   plugin-boundary decisions.
2. The ChrisAI family is more effective as a late documentation, code-style,
   or QA layer once the StackPress path is already correct.
3. `templates/store` was a good experiment because its name invites the wrong
   assumption, which exposed whether the skills force local-context validation.
4. Verification against real generation, push, populate, and route behavior was
   necessary to separate good-looking plans from working output.

## 6. Recommended Skill Updates

1. Strengthen `stackpress-app-coordinator` so it requires an explicit phase map
   in the plan or first implementation response.
2. Strengthen `stackpress-idea-authoring` with an admin-surface checklist for
   every non-relational column.
3. Strengthen `stackpress-plugin-scaffold` with a hard warning about plugin
   registration order.
4. Clarify in `chrisai-usage` that StackPress-specialist skills should own
   StackPress build work until the task becomes polish, documentation, or QA.
5. Add StackPress-flavored examples to `chrisai-coding-ts-react` for SSR page
   wrappers and response-backed views.
