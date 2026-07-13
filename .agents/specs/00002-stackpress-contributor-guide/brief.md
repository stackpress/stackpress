# Brief

## User Goal

Create a comprehensive guide for contributing to the Stackpress library. It
must teach agents and human contributors the exact locations where code belongs,
the considerations that govern implementation, and the specific patterns shared
across package sources.

The work must begin with research, clarification, and derived understanding.
Do not assume the existing KB already answers the questions correctly, and do
not add conclusions to the KB before they have been researched and accepted.

## Initial Failure Evidence

Agents tested in separate chat sessions did not provide satisfactory answers
about:

- adding or updating code generators;
- build-time versus runtime behavior;
- the importance and rules of source-package `transform` folders;
- what `packages/stackpress` is and when it must be updated.

These are initial examples of retrieval and understanding gaps. They do not
limit the research scope.

## Primary Research Question

Given a proposed Stackpress change, how should a contributor determine the
correct package, source location, lifecycle phase, implementation pattern,
generated/runtime contract, exports, tests, aggregate-package impact, and
documentation or example updates?

## In Scope

- Every root-configured active `packages/*` workspace and its `src/`, tests,
  manifest, exports, build output, and package plugin where present.
- Repeated source patterns such as plugins, events, scripts, pages, views,
  transforms, helpers, types, constants, schemas, and entrypoints.
- Exact code-placement rules and the reasoning behind them.
- Build, generation, bootstrap, lifecycle, request, and runtime boundaries.
- Semantic package ownership and cross-package contract chains.
- Generator discovery, transform entrypoints, ordering, repeatability, cleanup,
  generated exports, and runtime consumption.
- The aggregate `packages/stackpress` package: composition, exports, ordering,
  default versus optional packages, and update criteria.
- Public versus internal entrypoints, server/browser boundaries, dependency
  direction, configuration, error/status patterns, and compatibility concerns.
- Verification expectations by change class, including package tests, generated
  output, templates, browser behavior, build, pack, and import checks.
- When a source change also requires template, skill, CLI, scaffold, KB, or
  public documentation updates.
- Counterexamples, inconsistencies, and historical shapes that should not be
  promoted as contributor rules.
- Fresh-session agent tests that evaluate whether the resulting guide supports
  correct contribution decisions without hidden conversation context.

## Supporting Sources

- Root `AGENTS.md`, `package.json`, workspace scripts, and `bin/`.
- Current `.agents/context/` and linked references as claims to verify.
- `packages/*/package.json`, `packages/*/src/`, and package tests.
- Primary templates, especially `templates/blog`, for integration evidence.
- Repository `skills/` where they express contributor workflows.
- Generated `esm/`, `cjs/`, declaration, and client outputs as observed evidence,
  never as the durable implementation owner.
- Complete sibling foundation repositories only where Stackpress inherits a
  contract that cannot be understood from this checkout alone.

## Non-Goals

- Do not write the final contributor guide during spec setup.
- Do not promote provisional findings into `.agents/context/`.
- Do not treat folder frequency alone as proof that a pattern is required.
- Do not turn package-specific implementation details into monorepo-wide rules
  without comparison evidence.
- Do not redesign package architecture or introduce new governance policy as
  part of research.
- Do not edit generated build output as the source of a fix.
- Do not reopen or rewrite the frozen KB-population spec.

## Intended Deliverable Capability

The accepted guide should let a fresh agent or contributor:

1. classify a requested change;
2. select its semantic owner and exact source location;
3. identify every producer, generated artifact, runtime consumer, entrypoint,
   and access surface affected;
4. follow the repository's implementation conventions;
5. know when `packages/stackpress` or another composition surface changes;
6. select convincing verification proportional to the contract and blast radius;
7. recognize when source evidence is ambiguous and request maintainer intent.

The final knowledge shape must emerge from research. Likely outputs are compact
context routing plus one or more detailed references with placement matrices,
package anatomy, recipes, counterexamples, and verification checklists.
