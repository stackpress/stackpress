# 845 Idea Authoring Skill

Use `stackpress-idea-authoring` to model a domain and validate Stackpress idea patterns. The nearby check shows the project-level consequence.

**Previously:** The previous lesson, `844 Scaffold Skill`, gave you the setup this page builds on. Here, the focus shifts to `Idea Authoring Skill` so you can place the next Stackpress surface in the course path.

## 845.1. Skill Purpose

Idea authoring is where the product model becomes Stackpress schema. The skill focuses on useful generated behavior, not generic parser tricks.

## 845.2. Use It When

Use the skill to author:

 - models
 - fields
 - enums
 - types
 - relations
 - validation
 - generated UI metadata

Then run generation and inspect output. The example gives the idea a concrete file, command, or code shape.

## 845.3. Inputs

The product brief became schema input that Stackpress can generate from. The examples stay practical by tying the idea to something you can run, change, or verify.

## 845.4. What It Produces

This part of the Idea Authoring Skill workflow is easier to follow when the smaller pieces are compared together. The subsections cover Schema Contract, Generated UI Metadata, Review Mode, so the reader can see how each piece changes the local decision.

### 845.4.1. Schema Contract

The schema contract describes app data and generated behavior expectations. Use that purpose as the anchor for the local example or check.

### 845.4.2. Generated UI Metadata

Attributes such as `@field.*`, `@list.*`, and `@view.*` affect generated admin and view output. The same idea shows up through inspectable project surfaces.

### 845.4.3. Review Mode

Review mode checks whether the schema is clear, supported, and likely to generate useful output. Keep the idea tied to the concrete project surface in this section.

## 845.5. Handoff

This part of the Idea Authoring Skill workflow is easier to follow when the smaller pieces are compared together. The subsections cover Add Model Metadata, Add Validation, Add Relations, so the reader can see how each piece changes the local decision.

### 845.5.1. Add Model Metadata

Use `@labels(...)`, `@icon(...)`, and `@display(...)` for generated admin quality. The example gives the decision enough context to evaluate it.

### 845.5.2. Add Validation

Use `@is.*` attributes for required fields and format rules. Use the check to make the idea visible before moving to the next topic.

### 845.5.3. Add Relations

Model relationships intentionally so generated queries and forms can use them. The examples below turn the concept into concrete Stackpress project surfaces.

## 845.6. Verification

What changed in this lesson is your map: Idea Authoring Skill now has a place in the Stackpress system. That context prepares the reader for the more specific form that follows.

**Next step:** Read `846 Plugin Skills` when behavior does not belong in schema. Read it as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `846 Plugin Skills`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
