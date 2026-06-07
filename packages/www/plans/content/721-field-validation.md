# 721 Field Validation

Add a validator and verify the generated form or action behavior that should come from it. The local example shows why that choice matters in an app.

**Previously:** The previous lesson, `710 Schema Explorer`, gave you the setup this page builds on. Here, the focus shifts to `Field Validation` so you can place the next Stackpress surface in the course path.

## 721.1. Modeling Goal

Validation is how a field explains what values it accepts. Whether the check appears in Studio, generated forms, or route actions, the source rule should stay clear.

This page is future-facing for Studio, but the schema workflow exists today. Validators are idea attributes under the `@is.*` family.

## 721.2. Validation Example

Add validation:

```idea
email String
      @label("Email")
      @field.email
      @is.required("Email is required")
      @is.email("Must be a valid email")
```

Run:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
```

Inspect generated form or action output. Compare the concrete details to see the practical meaning.

## 721.3. Generated Effect

The validator became schema metadata that generated actions or forms can use. The nearby example or check shows the project detail affected by this idea.

## 721.4. Authoring Rules

This part of the Field Validation workflow is easier to follow when the smaller pieces are compared together. The subsections cover Validator, Field Editor, Generated Behavior, so the reader can see how each piece changes the local decision.

### 721.4.1. Validator

A validator checks whether a value is acceptable before writing or processing it. Use that purpose as the anchor for the local example or check.

### 721.4.2. Field Editor

A Studio field editor should expose common validators without hiding the source. The same idea shows up through inspectable project surfaces.

### 721.4.3. Generated Behavior

The real proof is generated output and runtime validation, not only a visual control. Keep the idea tied to the concrete project surface in this section.

## 721.5. Inspect Output

This part of the Field Validation workflow is easier to follow when the smaller pieces are compared together. The subsections cover Add Required Validation, Add Format Validation, Inspect Diagnostics, so the reader can see how each piece changes the local decision.

### 721.5.1. Add Required Validation

Use `@is.required(...)` when a value must exist. The example gives the decision enough context to evaluate it.

### 721.5.2. Add Format Validation

Use validators such as `@is.email(...)`, `@is.url(...)`, or `@is.slug(...)` for conventional formats. Use the check to make the idea visible before moving to the next topic.

### 721.5.3. Inspect Diagnostics

Check source diagnostics if a validator does not parse or generate as expected. The examples stay practical by tying the idea to something you can run, change, or verify.

## 721.6. Next Step

Before moving on, connect Field Validation to the files, commands, generated output, or runtime behavior around it. That context prepares the reader for the more specific form that follows.

Read `526 Attributes` for the non-Studio attribute model. Read it as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `730 Relations`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
