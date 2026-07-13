# Stackpress KB Maintenance Workflow

Use this workflow when Stackpress source, dependencies, generated contracts,
product language, governance decisions, or contributor workflows may change
accepted truth in `.agents/context/` or its linked detailed Reference Files.

## Read First

1. [Stackpress Context Index](../context/index.md)
2. [Compatibility And Maintenance](../context/compatibility-and-maintenance.md)
3. [Agent File Creation Workflow](agent-file-creation.md)
4. [Spec Driven Development Workflow](spec-driven-development.md) when the
   change introduces a Gap, Proof, or promotion decision

## Trigger Test

Run a KB review when a change can alter at least one of:

- technical identity, principles, vocabulary, or non-claims;
- package/library ownership or composition;
- Idea syntax, metadata semantics, transform order, or generated shape;
- lifecycle, event, config, command, data, or transaction behavior;
- page, API, MCP, CLI, desktop, SSR, hydration, UI, or security boundaries;
- adapter implementation, test evidence, or support wording;
- package exports, versions, scaffold, skills, or contributor routing;
- compatibility diagnostics, current guarantees, or known absences;
- the context taxonomy or router.

Do not rewrite the KB for an internal refactor that preserves every promoted
contract. Record the review result only when a durable audit trail is needed.

## Source Trigger Map

| Changed source | Review first | Typical verification |
| --- | --- | --- |
| sibling foundation repo | ecosystem, architecture, compatibility | native tests plus Stackpress intersection |
| `packages/*/src/plugin.ts` | architecture, runtime, interfaces, contribution | lifecycle registration and aggregate behavior |
| schema/Idea helpers or `.idea` files | modeling, runtime, compatibility | parse, generate, normalized schema |
| `*/src/transform/` | modeling, interfaces, compatibility | clean/repeat generation and generated import |
| SQL scripts/helpers/adapters | runtime, ecosystem, compatibility | dialect queries and operational workflow |
| view/admin/session/API/AI/desktop | interfaces plus owning domain | surface auth/render/transport proof |
| package manifests/exports/versions | ecosystem, compatibility | build, pack, export/import checks |
| template config/plugins | runtime, interfaces, contribution | active template workflow |
| `bin/` or `skills/` | ecosystem, contribution, compatibility | installer/scaffold/workflow acceptance |
| public docs or founder decision | identity and affected domain | source cross-check and language review |
| context/reference taxonomy | index, context, and inbound reference links | all six artifact tests plus document parity |

## Authority Rules

Use authority according to the claim:

1. Explicit user/founder decisions own product category, promise priority, and
   approved public language.
2. Current local source, manifests, tests, and observed behavior own exact
   checkout behavior.
3. Complete sibling repositories own current ecosystem design intent.
4. Installed dependency versions own behavior consumed by this checkout.
5. Generated output owns evidence for one generation environment and moment.
6. Deployed runtime/database state requires direct target evidence.
7. Public docs own published framing only when they do not conflict with stronger
   technical or founder authority.

Existing context and the project-knowledge references it links remain the agent
source of truth until a conflict is reviewed. Every reference needs an inbound
Agent File link; a project-knowledge reference additionally needs an inbound
Context Link to be authoritative KB content. Workspace-rule references may be
owned by AGENTS or a workflow instead.
Do not silently follow conflicting source and leave context stale.

## Maintenance Procedure

### 1. Classify The Change

Record the changed contract, callers, semantic owner, generated producer/runtime
consumer, lifecycle phase, adapter, affected Context Files, and detailed
Reference Files.

### 2. Inspect Current Evidence

Read the narrow owning source and tests first. Expand to generated output,
templates, sibling repositories, or runtime proof only where the contract chain
requires it.

### 3. Classify Each Claim

- `unchanged`: promoted truth still holds;
- `update`: accepted truth changed and evidence is sufficient;
- `boundary-change`: truth remains but confidence/support wording changed;
- `conflict`: authorities disagree and require a Gap or user decision;
- `demote`: existing context is stale, contradicted, or no longer reusable;
- `proposal`: future design or governance, kept outside context.

### 4. Update Or Route

- Revise Context Files for accepted reusable mental models and routing.
- Revise linked Reference Files for accepted signatures, catalogs, examples,
  defaults, boundaries, and concise source anchors.
- Update the context router when ownership or load guidance changes.
- Preserve at least one task-informative inbound Context Link for every detailed
  project-knowledge Reference File; remove or reroute orphaned references.
- Route unresolved questions, proofs, release work, and proposals to a spec.
- Preserve useful demoted material in a spec or reference; ask if its destination
  is unclear.
- Keep raw evidence and lengthy provenance outside context.

### 5. Verify The Contract

Run the smallest convincing evidence from
[Extension And Contribution](../context/extension-and-contribution.md). Expand to
cross-package or template tests when shared behavior changed.

### 6. Run Retrieval Regression

Select affected artifact tests:

| Context domain | Artifact regressions |
| --- | --- |
| identity/principles | article, teaching, marketing |
| architecture/composition | docs, article, diagram, contributor |
| modeling/generation | docs, diagram, teaching, contributor |
| runtime/operations | docs, diagram, teaching, contributor |
| interfaces/experience | docs, article, diagram, marketing |
| ecosystem/portability | diagram, marketing, contributor |
| extension/contribution | teaching, contributor |
| compatibility/maintenance | docs, marketing, contributor |

Run all six tests after taxonomy/router changes, broad architectural changes, or
when more than two context domains materially change.

For a changed public API, config area, command, Idea construct, adapter, or
generated contract, also regenerate the affected structured record from the
Phase 8 coverage matrix using only Context Files and linked references. Produce
a full prose sample when the change alters signatures, examples, lifecycle, or
security/portability boundaries. Consult public docs only after generation, then
classify differences as a KB gap, routing gap, stale benchmark, or source
conflict.

### 7. Validate

Run:

```bash
python3 .agents/scripts/validate-agent-workspace.py
```

Fix hard failures. Review warnings and keep each Agent File below 200 lines when
practical and always below 500 lines.

## Closeout Record

Report:

- trigger and changed contracts;
- sources and versions checked;
- Context Files updated, unchanged, or demoted;
- detailed Reference Files and inbound Context Links updated or unchanged;
- conflicts, Gaps, proposals, and user decisions;
- contract proof, artifact regressions, and affected document-parity records run;
- deterministic validation result;
- remaining risk and recommended next step.
