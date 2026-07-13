# TOP-001: Capability-Centered Operating Model

## Finding

The framework's primary reusable unit at runtime is a named server capability,
usually implemented as an Ingest event. Models, configuration, plugins, and
generated code cooperate to install these capabilities. CLI, web, API, MCP, and
desktop integrations adapt them for different callers.

## Why Capability Is The Center

1. `StackpressTerminal.bootstrap()` resolves `config`, `listen`, and `route`.
2. `StackpressTerminal.run()` emits the parsed command through the server.
3. Generated model `listen()` functions register model operation events.
4. Page handlers resolve the same model or application events.
5. API and MCP handlers translate external requests into event data.
6. Desktop menu dispatch returns to `ctx.resolve(event)`.

The event is not the whole capability. A capability also includes its input
shape, listeners, status/response behavior, access policy, generated dependencies,
and operational side effects.

## Inputs To Capability Formation

| Input | Contribution |
| --- | --- |
| Idea model | domain names, fields, relations, validation and surface metadata |
| Config | adapters, enabled features, routes, exposure, environment policy |
| Package plugin | lifecycle listeners and mechanisms |
| Generated client | model-specific stores, actions, listeners, routes, tools |
| Local plugin | application-specific rules and orchestration |

## Surface Rule

An access surface should adapt a capability rather than recreate it. Adaptation
can include authentication, authorization, protocol validation, request mapping,
response mapping, rendering, and caller-specific observability.

This rule explains reuse without claiming all surfaces behave identically.

## Boundary Cases

- A view-only event may be a presentation capability rather than a domain action.
- Infrastructure events such as `build`, `push`, and `mcp-stdio` are operational
  capabilities even when they are not model-derived.
- Plugin contribution events such as `idea`, `desktop:config`, and
  `desktop:menu` coordinate extension rather than perform business operations.
- Lifecycle events install behavior; they are not ordinary end-user operations.

## Canonical Explanation

Stackpress assembles server capabilities from declarations, configuration,
plugins, and generated code. Interfaces remain replaceable because they call
those capabilities through the server instead of owning separate business logic.

## Business And Teaching Implications

- Product breadth comes from adding adapters over a shared capability layer.
- Teams can expose the same operation to people, systems, and AI with different
  controls rather than rebuilding the operation.
- Developers should begin feature design by naming the server capability and its
  policy, then choose the required surfaces.
- Marketing should describe coordinated interfaces, not imply zero-code or
  automatic equivalence between them.

## Evidence Anchors

- `packages/stackpress-server/src/Terminal.ts`
- `packages/stackpress-sql/src/transform/events/index.ts`
- `packages/stackpress-session/src/session/pages/`
- `packages/stackpress-api/src/plugin.ts`
- `packages/stackpress-ai/src/plugin.ts`
- `packages/stackpress-desktop/src/plugin.ts`

## Resolution

Evidence strength: strong. The capability-centered model is accepted as the
technical synthesis for subsequent research. Public positioning remains subject
to founder review.

