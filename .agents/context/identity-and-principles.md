# Stackpress Identity And Principles

## Technical Identity

Stackpress is a server-capability composition framework. It combines Idea
declarations, executable TypeScript configuration, lifecycle plugins, generated
code, and local application code into reusable server capabilities. Pages,
admin, APIs, MCP tools, CLI commands, desktop actions, and plugins adapt those
capabilities for different callers.

Stackpress publicly describes itself as server-side-first, event-driven,
pluggable, and content-management-oriented. Its implementation supports broader
application composition, but that is a technical observation rather than an
approved change in public product category.

## Server-Side First

Server-side-first means capability authority begins on the server:

- domain operations are server events;
- routing, sessions, authorization, data access, and operational policy remain
  server concerns;
- React SSR and hydration enhance server-selected pages;
- APIs, MCP, CLI, and desktop are adapters to server capabilities.

It does not mean browser interactivity, React applications, or client-side state
are prohibited.

## What Forms An Application

No single model generates the whole application:

- Idea supplies reusable domain declarations and open metadata;
- configuration selects application and environment policy;
- framework and local plugins implement mechanisms and custom behavior;
- package-owned transforms emit model-derived runtime contracts;
- the generated client returns those contracts to server bootstrap;
- access surfaces expose selected capabilities under caller-specific policy.

## Ecosystem Principles

### Keep Cores Narrow

Foundation libraries own focused mechanisms and deliberately leave higher-level
policy to Stackpress or the application host. Stackpress composes them rather
than duplicating their responsibilities.

### Preserve Inspectable Intent

Idea schemas, SQL builders, Reactus documents/manifests, generated source, typed
configuration, and named events expose intermediate forms that can be inspected
before or during execution.

### Adapt At Boundaries

Host, database, rendering, AI, and desktop differences belong in explicit
adapters. Native resources remain available where advanced behavior requires
them.

### Let Ownership Follow Responsibility

Packages should own the lifecycle behavior and generated output required by
their runtime contracts. Applications should own their domain policy and custom
workflows.

### Reuse Capabilities Across Controlled Surfaces

Named server capabilities can serve people, systems, automation, and AI without
duplicating the underlying operation. Each surface still owns authentication,
authorization, validation, and protocol mapping.

## Technical Vocabulary

Use these phrases for technical explanation:

- server-capability composition framework
- server-side-first capability authority
- executable generated client package
- package-owned generation
- lifecycle-owned registration
- event capability bus
- executable operational policy
- host-routed React
- serialized server snapshot
- schema-history reconciliation
- explicit adapter portability
- contract-chain compatibility
- ownership-first contribution

These are technical descriptions, not approved public taglines.

## Important Non-Claims

Do not claim that Stackpress:

- is zero-code;
- generates the entire application from one schema;
- automatically exposes every model through every interface;
- secures all event callers through one universal policy;
- tracks database deployment state merely because revisions exist;
- runs unchanged on every host or database combination;
- guarantees compatibility between generated and runtime packages without
  current evidence.

Avoid "one model, many interfaces," "product contract," and "operations
console" as canonical language because they omit important causal layers or
mischaracterize configuration.

