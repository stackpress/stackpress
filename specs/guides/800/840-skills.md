# 840 Skills

Learn Stackpress skills as portable agent workflows for building apps in phases. A skill gives an agent a smaller job, a source boundary, and a handoff expectation, which is safer than asking one broad prompt to discover, scaffold, model, implement, and verify an app all at once.

**Previously:** The previous course, `Transform Hooks`, covered source-backed AI generation behavior. This course moves from package internals to the local Stackpress skills that guide AI-assisted app work.

## 840.1. Why Skills Exist

A Stackpress app build has different kinds of decisions. Product discovery is not the same as writing `schema.idea`, scaffolding an app is not the same as implementing a plugin, and verification is not the same as planning the next feature.

Skills keep those decisions from collapsing into one messy instruction. Each skill narrows the work, names the evidence it needs, and leaves a concrete artifact or decision for the next phase.

## 840.2. One Request Moving Through Skills

Imagine a developer asks an agent to build a small membership app. The safe path starts with `stackpress-app-discovery`, which turns the vague request into a brief with audience, entities, flows, auth, admin needs, custom behavior, and open questions.

The next skill is `stackpress-app-coordinator`, which sequences the work into phases. From there, `stackpress-app-scaffold` creates the baseline project, `stackpress-idea-authoring` drafts the schema contract, plugin skills route handwritten behavior, and `stackpress-app-verification` checks evidence before each phase is treated as complete.

## 840.3. What This Group Covers

`841 Skill Workflow` explains the overall order and handoff model. `842 App Discovery Skill`, `843 App Coordinator Skill`, `844 Scaffold Skill`, and `845 Idea Authoring Skill` cover the early build phases from product idea to schema-ready app.

`846 Plugin Skills` explains how feature work is routed across schema, runtime plugins, page/view code, and generation transforms. `847 Verification Skill` closes the group by showing how to prove a phase is real before the next skill builds on it.

## 840.4. How To Use Skills Responsibly

Use the narrowest skill that matches the current phase. A focused skill is easier to review because it has a smaller source set and a clearer output contract.

After the skill runs, inspect what changed or what decision was made. A skill handoff is useful only when the next developer or agent can point to the brief, file, command result, generated output, or verification note it produced.

**Learning checkpoint:** Before moving on, make sure you can explain skills as phased workflows rather than magic commands. You should also know why each handoff needs an inspectable artifact or evidence note.

**Next course:** Continue with `Skill Workflow`. That course shows the normal order for moving from a product request to verified Stackpress app work.
