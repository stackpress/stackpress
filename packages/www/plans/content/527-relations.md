# 527 Relations

Relate two models from the app modeling perspective, then inspect generated query and view behavior. The following example gives the idea a concrete project shape.

**Previously:** The previous lesson, `526 Attributes`, gave you the setup this page builds on. Here, the focus shifts to `Relations` so you can place the next Stackpress surface in the course path.

## 527.1. Modeling Goal

Most useful apps are connected: articles have authors, orders have products, comments belong somewhere. Relations describe those connections so generated output can understand more than isolated rows.

## 527.2. Relation Example

Add a relation field:

```idea
profileId String
          @label("Profile")
          @field.relation({
            id "id"
            search "/admin/profile/search?json&q={{query}}"
            template "{{name}}"
          })
          @view.template({ template "{{profile.name}}" })

profile Profile @relation({ local "profileId" foreign "id" })
```

In this example, the useful part is the value being passed, returned, or configured. That is usually the first thing a developer changes when adapting the pattern.

## 527.3. Generated Effect

`profileId` stores the local identifier. `profile` describes the related model connection. Generated form and view metadata tells UI layers how to search and display the related profile.

## 527.4. Authoring Rules

This part of the Relations workflow is easier to follow when the smaller pieces are compared together. The subsections cover Local Field, Foreign Field, Relation Metadata, so the reader can see how each piece changes the local decision.

### 527.4.1. Local Field

The local field stores the value on the current model. The examples stay practical by tying the idea to something you can run, change, or verify.

### 527.4.2. Foreign Field

The foreign field is the field on the related model that the local field points to. Keep that role in mind as the lesson moves into the concrete shape.

### 527.4.3. Relation Metadata

Relation metadata helps generated stores, queries, forms, and views understand the connection. The nearby example or check shows the project detail affected by this idea.

## 527.5. Inspect Output

This part of the Relations workflow is easier to follow when the smaller pieces are compared together. The subsections cover Add A Many-To-One Relation, Add A Reverse List, Inspect Generated Query Behavior, so the reader can see how each piece changes the local decision.

### 527.5.1. Add A Many-To-One Relation

Use a local ID field plus a relation field that maps local to foreign. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 527.5.2. Add A Reverse List

Use an array relation such as `articles Article[]` when a model should expose related records in the other direction. The local example shows why that choice matters in an app.

### 527.5.3. Inspect Generated Query Behavior

Use `@query(...)` when default relation loading should include related fields intentionally. Compare the concrete details to see the practical meaning.

## 527.6. Next Step

The checkpoint is simple: you can point to where Relations shows up and explain why it matters. The examples below turn the concept into concrete Stackpress project surfaces.

Read `531 Schema Output` and `532 SQL Output` to trace relations into generated artifacts. It should feel like the next course step, not a separate reference detour.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `531 Schema Output`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
