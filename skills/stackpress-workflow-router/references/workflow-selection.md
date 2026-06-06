# Workflow Selection

Use this selector after the preflight context check confirms that the task
involves concurrent or coordinated multi-plugin Stackpress work.

If the task is single-plugin or single-layer work, do not force this selector.
Route directly to the narrower specialist skill.

## Preflight Considerations

Before comparing workflows, check:

- existing plugin registration in `package.json`
- current `schema.idea` models, relations, and attributes
- generated client package/folder settings in `config/*.ts`
- whether generated output exists and appears current enough to trust
- existing plugin roles, lifecycle hooks, routes, events, views, and transforms
- shared config/access/populate data that multiple plugins may touch
- plugin-local tests under `plugins/*/tests` or commands that can verify
  plugin boundaries
- likely collision files if multiple lanes work in parallel

## Fast Selector

| Task signal | Prefer workflow | Next skill |
| --- | --- | --- |
| Vague multi-plugin app idea | Linear App Build | `stackpress-app-discovery` |
| New app expected to contain multiple coordinated plugins | Linear App Build | `stackpress-app-scaffold` |
| Shared models, fields, relations, admin metadata affect multiple plugins | Schema-First Change | `stackpress-idea-authoring` |
| Multiple feature plugins can be built separately | Contract-First Parallel Plugin Build | `stackpress-app-coordinator` |
| One demonstrable cross-plugin user journey matters most | Vertical Slice Build | `stackpress-app-coordinator` |
| Repeated multi-plugin output should come from schema metadata | Generator-First Build | `stackpress-plugin-idea-generator` |
| Request-time routes, events, or integrations cross plugin boundaries | Runtime Plugin Extension | `stackpress-plugin-router` |
| Multiple plugins expose handwritten page UI | Route/View Workflow | `stackpress-plugin-views` |
| Existing multi-plugin app behavior is broken or uncertain | Verification / Repair Workflow | `stackpress-app-verification` |
| Main goal is teaching plugin architecture boundaries | Architecture Sample Workflow | `stackpress-app-coordinator` |
| Existing multi-plugin app needs incremental change | Existing App Change Workflow | `stackpress-plugin-router` |

## Ambiguity Rules

Present options to the user only when the task has genuinely different valid
execution shapes.

Ask the user to choose when:

- vertical-slice speed conflicts with contract-first parallelism
- architecture demonstration conflicts with app delivery
- runtime implementation conflicts with generator investment
- generated admin behavior conflicts with custom handwritten views
- the blast radius is large and local context does not settle the priority

Do not ask when:

- the task is a schema-only change that does not affect plugin contracts
- the task targets a named plugin and no other plugin contract is affected
- plugin-local tests or local files already prove the intended workflow
- the request is a repair and verification must happen first

## Selection Gates

Before selecting a workflow, answer:

1. What is the user's visible goal?
2. What Stackpress layer is the source of truth?
3. Are generated artifacts involved?
4. Are plugin boundaries part of the requirement?
5. Can work happen in parallel without contract drift?
6. What evidence proves the next phase is safe?

If any answer is unknown and affects implementation safety, inspect local files
or present workflow options before proceeding.
