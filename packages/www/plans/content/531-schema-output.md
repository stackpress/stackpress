# 531 Schema Output

Trace a model field from `schema.idea` into generated schema output. Use that purpose as the anchor for the local example or check.

**Previously:** The previous lesson, `527 Relations`, gave you the setup this page builds on. Here, the focus shifts to `Schema Output` so you can place the next Stackpress surface in the course path.

## 531.1. What You Are Looking For

Schema output is the first generated proof that Stackpress understood your idea file. Inspecting it helps you confirm model, field, enum, type, and relation meaning before looking at higher-level output.

## 531.2. Where Schema Output Lives

Run:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
```

Find the generated model or schema output in `client_source`, then compare a field such as:

```idea
title String @label("Title") @is.required("Title is required")
```

to the generated field metadata. The same idea shows up through inspectable project surfaces.

## 531.3. Inspect Classes

The idea parser and schema layer turned text declarations into structured schema data that generators can use. Keep the idea tied to the concrete project surface in this section.

## 531.4. Expected Evidence

This part of the Schema Output workflow is easier to follow when the smaller pieces are compared together. The subsections cover Schema Meaning, Column Metadata, Traceability, so the reader can see how each piece changes the local decision.

### 531.4.1. Schema Meaning

Schema meaning is the interpreted model and field metadata, not just the raw text. The example gives the decision enough context to evaluate it.

### 531.4.2. Column Metadata

Field attributes become column metadata used by validation, SQL, generated forms, and generated views. Use the check to make the idea visible before moving to the next topic.

### 531.4.3. Traceability

Every generated schema detail should trace back to idea input or Stackpress built-ins. The same idea shows up through inspectable project surfaces.

## 531.5. Fix The Source

This part of the Schema Output workflow is easier to follow when the smaller pieces are compared together. The subsections cover Check A Missing Field, Check Validation Metadata, and Check Display Metadata, so the reader can see how each piece changes the local decision.

### 531.5.1. Check A Missing Field

Verify the field exists in `schema.idea`, then inspect generated schema output after regeneration. Keep that role in mind as the lesson moves into the concrete shape.

### 531.5.2. Check Validation Metadata

Look for the generated representation of `@is.*` attributes. The nearby example or check shows the project detail affected by this idea.

### 531.5.3. Check Display Metadata

Look for labels, display templates, icons, and component metadata. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 531.6. Next Step

The important checkpoint is knowing where Schema Output belongs in the Stackpress workflow. The local example shows why that choice matters in an app.

Read `532 SQL Output` to see how schema meaning becomes store and action behavior. Read it as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `532 SQL Output`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
