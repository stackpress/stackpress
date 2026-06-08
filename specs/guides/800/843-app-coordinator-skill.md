# 843 App Coordinator Skill

Use `stackpress-app-coordinator` to sequence a Stackpress app build after discovery. The coordinator matters because even a clear app brief can fail if scaffold, schema, generation, plugin work, and verification happen in the wrong order.

**Previously:** The previous course, `App Discovery Skill`, produced a buildable brief. This course explains how that brief becomes a phase-by-phase plan with handoffs and evidence gates.

## 843.1. What The Coordinator Owns

The coordinator delegates downward instead of implementing every detail itself. It decides the next phase, chooses the right narrower skill, and refuses to advance when the current phase lacks evidence.

The normal phase order is discovery, scaffold, schema, generation, implementation routing, verification, and optional polish. The coordinator can revisit earlier phases when evidence shows the app is not ready for the next step.

## 843.2. A Sequenced Plan

Given a discovery brief for a membership portal, the coordinator might produce a plan like this:

```text
Phase 1: Scaffold the app with confirmed package, brand, and port values.
Phase 2: Draft schema.idea for Member, Plan, and Subscription.
Phase 3: Run generation and inspect generated client output.
Phase 4: Route subscription status behavior through plugin routing.
Phase 5: Verify scaffold, schema, generation, plugin wiring, and runtime reachability.
```

This plan is useful because each phase has a different owner and proof. It avoids treating generation, runtime plugin work, and verification as one blended task.

## 843.3. Phase Gates

A phase gate is the evidence needed before advancing. Scaffold needs baseline files, schema needs intentional models and relations, generation needs emitted output, and runtime work needs reachable routes, events, or imports.

The coordinator should not move forward on weak claims. If generation output is missing, the next action is not plugin polish; the next action is to fix generation or source input and verify again.

## 843.4. Delegation Examples

If the app folder does not exist yet, the coordinator hands off to `stackpress-app-scaffold`. If the product model is unclear, it returns to discovery or sends the brief to `stackpress-idea-authoring` only after the core nouns and flows are stable.

If a feature might belong in schema, runtime code, views, or generation, the coordinator uses `stackpress-plugin-router`. That router decision prevents a feature from landing in the nearest file instead of the correct Stackpress layer.

## 843.5. Mistakes To Avoid

Coordinator mistakes usually come from collapsing the workflow into one broad
implementation pass. The coordinator should sequence, delegate, and require
evidence; narrower skills should own detailed source work.

### 843.5.1. Let The Coordinator Implement Every Phase

```text
Coordinator decision: hand schema work to stackpress-idea-authoring.
Coordinator mistake: personally rewrite schema.idea without source-specific review.
```

This example shows the boundary. The coordinator can choose the next skill and
define the evidence gate, but the narrower skill should own the detailed file
work.

### 843.5.2. Advance On Plausibility

```text
Weak evidence: schema looks okay.
Better evidence: generation ran and the expected model output exists.
```

This example makes the phase gate concrete. Looking plausible is not the same
as producing output that the next phase can inspect.

### 843.5.3. Mix Polish Into Core Phases

```text
Core phase: generate model output and verify route reachability.
Polish phase: refine button copy and dashboard spacing.
```

Polish should come after scaffold, schema, generation, plugin wiring, and
runtime behavior are proven enough to build on. Otherwise the workflow can
spend time refining surfaces that may still need structural changes.

**Learning checkpoint:** Before moving on, make sure you can explain the coordinator as the phase sequencer. You should also be able to name what evidence would let it move from scaffold to schema, or from generation to plugin work.

**Next course:** Continue with `Scaffold Skill`. That course covers the first file-producing phase in a Stackpress app build.
