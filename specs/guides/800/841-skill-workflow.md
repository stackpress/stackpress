# 841 Skill Workflow

Map a product request to the next Stackpress skill in the recommended workflow. The goal is to keep AI-assisted app work sequenced, so a developer can tell what phase the project is in and what evidence is needed before moving forward.

**Previously:** The previous course, `Skills`, introduced skills as phased workflows. This course turns that idea into a practical order that agents and junior developers can follow.

## 841.1. The Normal Order

The normal workflow starts with product understanding and ends with evidence. It should feel like building a house from a plan, foundation, framing, wiring, inspection, and only then finishing touches.

```text
1. stackpress-app-discovery
2. stackpress-app-coordinator
3. stackpress-app-scaffold
4. stackpress-idea-authoring
5. generation commands
6. stackpress-plugin-router
7. plugin implementation skills
8. stackpress-app-verification
```

This order prevents the common mistake of writing runtime code before the app shape is understood. It also gives each phase a clear handoff, which makes the next step easier to verify.

## 841.2. Inputs And Outputs

Each phase should receive a clear input and produce a clear output. Discovery receives a vague product request and produces a buildable brief, while scaffold receives project naming choices and produces baseline files.

Idea authoring receives the brief and produces a schema contract. Plugin routing receives a feature need and produces a lane decision, while verification receives the current phase claim and produces pass/fail evidence.

## 841.3. A Concrete Handoff

Start with a request like this:

```text
Build a membership portal where admins manage plans and members can update their profile.
```

This request is not ready for scaffolding because it does not yet say which entities, roles, flows, generated admin surfaces, or custom behavior matter. Discovery should turn it into a brief before the coordinator decides whether the next phase is scaffold, schema, or more clarification.

Now imagine discovery produces this handoff:

```text
Audience: admins and members
Entities: Member, Plan, Subscription
Flows: sign up, sign in, manage profile, assign plan
Auth: required for members, admin role for plan management
Custom behavior: subscription status changes may need runtime logic
Open questions: billing provider is not selected yet
```

This handoff gives the coordinator enough context to sequence the build. It also protects later skills from inventing a billing integration before the source requirement exists.

## 841.4. Verification Between Phases

The workflow should pause at phase gates. A scaffold phase is not complete until the expected files exist, and a generation phase is not complete until the command ran and emitted output in the configured location.

This is why `stackpress-app-verification` is part of the workflow instead of a final afterthought. It stops later work from depending on stale assumptions, missing files, or generated output that was never inspected.

## 841.5. Mistakes To Avoid

Skill workflow mistakes usually come from skipping the handoff evidence between
phases. Each skill should leave the next skill enough context to act without
inventing missing product or source details.

### 841.5.1. Skip Discovery

```text
Request: Build a booking app.
Hidden decisions: guest checkout, capacity rules, cancellation policy, admin roles
```

This request sounds small, but the hidden decisions can change models,
relations, auth, and custom runtime behavior. Discovery should surface those
unknowns before scaffold or schema work starts.

### 841.5.2. Use Plugin Skills Before Routing

```text
Wrong order: implement subscription status in a page handler first
Better order: route the feature, then decide schema, generation, or runtime lane
```

This example shows why routing comes before implementation. The same product
need might be a schema field, a generated admin behavior, or a runtime rule,
depending on what the source should own.

### 841.5.3. Accept A Phase Without Evidence

```text
Claim: generation is done.
Evidence needed: command ran and expected client-source files exist.
```

The workflow is only reliable when each phase leaves evidence that the next
phase can inspect. A completion statement is not a substitute for files,
commands, output, or runtime behavior.

**Learning checkpoint:** Before moving on, make sure you can name the normal skill order and describe what each phase hands to the next one. You should also be able to explain why verification appears between phases, not only at the end.

**Next course:** Continue with `App Discovery Skill`. That course covers the first handoff: turning a vague app request into a buildable brief.
