# 730 Relations

Create or inspect a relation visually while preserving the idea-file source mapping. The nearby example or check shows the project detail affected by this idea.

**Previously:** The previous lesson, `721 Field Validation`, gave you the setup this page builds on. Here, the focus shifts to `Relations` so you can place the next Stackpress surface in the course path.

## 730.1. Modeling Goal

A visual relation editor has to write the same truth a code-first schema would write. This page connects the visual idea of related models back to source-owned relation metadata.

This page is future-facing for Studio. The current source workflow still uses `schema.idea` relation declarations.

## 730.2. Relation Example

A relation editor should make this mapping clear:

```idea
profileId String
profile   Profile @relation({ local "profileId" foreign "id" })
```

It should show:

 - current model
 - related model
 - local field
 - foreign field
 - display or search metadata

## 730.3. Generated Effect

The visual relation is still a source-level relation. Studio should help edit the mapping, not create a separate schema database.

## 730.4. Authoring Rules

This part of the Relations workflow is easier to follow when the smaller pieces are compared together. The subsections cover Local Field, Foreign Field, Relation Summary, so the reader can see how each piece changes the local decision.

### 730.4.1. Local Field

The field on the current model that stores the related value. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 730.4.2. Foreign Field

The field on the target model that the local value points to. The local example shows why that choice matters in an app.

### 730.4.3. Relation Summary

A good relation UI shows the relationship in one scannable line. Compare the concrete details to see the practical meaning.

## 730.5. Inspect Output

This part of the Relations workflow is easier to follow when the smaller pieces are compared together. The subsections cover Inspect Relation Impact, Add A Reverse Relation, Keep Source Visible, so the reader can see how each piece changes the local decision.

### 730.5.1. Inspect Relation Impact

Check generated query, form, and view output after changing relation metadata. The examples below turn the concept into concrete Stackpress project surfaces.

### 730.5.2. Add A Reverse Relation

Use reverse list relations when the related model should show many child records. That is why this detail appears in the lesson before reference material.

### 730.5.3. Keep Source Visible

Use source preview to confirm the visual edit produced the expected `.idea` change. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 730.6. Next Step

This gives you the first mental handle for Relations; later pages can add more detail without starting from zero. The same idea shows up through inspectable project surfaces.

Read `527 Relations` for the code-first relation workflow. Read it as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `741 Admin Pages`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
