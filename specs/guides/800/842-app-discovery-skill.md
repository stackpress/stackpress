# 842 App Discovery Skill

Use `stackpress-app-discovery` to turn a vague product request into a buildable app brief. This skill matters because a Stackpress app cannot be modeled, scaffolded, or routed safely until the main product nouns, users, flows, and open questions are visible.

**Previously:** The previous course, `Skill Workflow`, showed the full skill sequence. This course focuses on the first step, where the app idea becomes clear enough for implementation planning.

## 842.1. What Discovery Decides

Discovery identifies the app concept, audience, entities, flows, auth shape, admin needs, custom runtime behavior, app surfaces, scaffold values, and project shape. It does not write `schema.idea`, create files, or implement plugins.

That boundary is important for junior developers. A discovery brief is a map of what should be built, while scaffold and schema work are later steps that use the map.

## 842.2. Start From A Vague Request

A useful discovery pass can start from a plain request:

```text
I want a simple event booking app for workshops.
```

This example is intentionally incomplete. Discovery should not pretend it knows the audience, roles, booking rules, admin needs, or payment requirements just because the product category sounds familiar.

The skill should turn that request into a clearer brief:

```text
Audience: organizers and attendees
Entities: Workshop, Booking, Attendee
Flows: browse workshops, reserve a spot, manage bookings
Auth: needs confirmation for guest versus signed-in attendees
Admin: organizers likely need workshop and booking management
Custom behavior: capacity checks may need runtime logic
Open questions: payment, cancellations, and waitlists are not confirmed
```

This brief gives the next phase something real to inspect. It also keeps unclear decisions open instead of hiding them inside confident implementation details.

## 842.3. When To Ask Questions

Discovery should ask only questions that block a buildable brief. If the missing answer changes the schema, auth model, core flow, or integration plan, the question is worth asking.

For example, payment support changes more than copy text. It may affect entities, runtime integration, admin views, verification, and deployment configuration, so discovery should mark it clearly instead of guessing.

## 842.4. Handoff Criteria

Discovery is ready to hand off when the coordinator can identify the next phase without inventing product requirements. The brief should name the core entities, the main flows, the auth/admin shape, and any custom behavior that probably belongs outside generated CRUD.

If those pieces are still vague, discovery should remain open. Moving to scaffold or schema too early usually creates rework because the later files encode assumptions that were never confirmed.

## 842.5. Mistakes To Avoid

Discovery mistakes usually happen when the phase either does too much or hides
too much. The output should be a buildable brief, not source files and not a
polished guess.

### 842.5.1. Use Discovery As Implementation

```text
Discovery output: Entities are Workshop, Booking, Attendee.
Not discovery output: created schema.idea and custom booking plugin.
```

This example keeps discovery as a planning phase. The brief can name likely
implementation work, but file edits belong to later scaffold, idea, or plugin
phases.

### 842.5.2. Ask Questions That Do Not Change The Build

```text
Useful question: Do attendees need to pay online?
Weak question: Should the dashboard say "Workshops" or "Classes"?
```

Payment can change entities, integrations, verification, and deployment. The
label question can usually wait because it does not block a buildable brief.

### 842.5.3. Hide Open Questions

```text
Unknown: payment provider is not chosen yet.
Risk: checkout entities and plugin work may change later.
```

A brief with honest unknowns is safer than a polished brief that silently
invents payment providers, roles, or admin behavior. The coordinator can plan
around known gaps, but it cannot plan around hidden guesses.

**Learning checkpoint:** Before moving on, make sure you can explain what a buildable app brief contains. You should also be able to identify which unknowns block schema, auth, admin, or plugin planning.

**Next course:** Continue with `App Coordinator Skill`. That course shows how the brief becomes a sequenced Stackpress build plan.
