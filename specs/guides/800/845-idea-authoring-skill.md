# 845 Idea Authoring Skill

Use `stackpress-idea-authoring` to turn a product brief into a Stackpress `schema.idea` contract. This skill matters because Stackpress uses idea files as more than database shape; they also influence generated schema, SQL, admin, and view behavior.

**Previously:** The previous course, `Scaffold Skill`, created the baseline app files. This course explains how the product model becomes source input that generation can understand.

## 845.1. What Idea Authoring Owns

Idea authoring owns schema meaning, not generic parser tricks. The skill prefers canonical Stackpress patterns, built-in attributes, explicit relations, useful assertions, and generated UI metadata that materially improves downstream output.

That distinction is important because a parser-valid idea file is not automatically a good Stackpress schema. The question is whether Stackpress processes the construct by default and whether the generated app surfaces benefit from it.

## 845.2. A Small Modeling Pass

Start from a brief that names the app nouns:

```text
Entities: Member, Plan, Subscription
Flows: admins manage plans, members keep a profile, subscriptions connect members to plans
```

This brief tells the skill which models and relations probably matter. It does not yet decide every field, validation, or generated admin surface, so the skill should draft the schema in practical layers.

The first pass might identify the contract like this:

```text
Models: Member, Plan, Subscription
Scalar fields: names, statuses, timestamps, plan details
Relations: Subscription connects one Member to one Plan
Generated UI metadata: labels, display fields, list/filter/view choices
Validation: required fields and uniqueness where the product requires it
```

This is not a complete syntax example because the exact model syntax should come from the idea reference and confirmed Stackpress patterns. The important lesson here is the authoring order: model the domain first, then add supported metadata intentionally.

## 845.3. Generated UI Metadata

The skill reviews non-relation fields for generated admin surfaces. It considers field, filter, span, list, and view metadata, while leaving out metadata that does not serve the generated experience.

For example, a system-managed timestamp may be useful in a list or view, but it usually should not become an editable form field. That decision belongs in idea authoring because generated admin output depends on the schema contract.

## 845.4. Pre-Generate Review

Before handing schema to generation, summarize the main models, critical relations, editable fields, filterable or searchable fields, and intentionally hidden fields. This review catches accidental metadata before it spreads into generated output.

If the schema is still mostly scaffold default content, generation can run but produce misleading evidence. The skill should make the schema intentional enough that generated output reflects the product rather than a placeholder.

## 845.5. Mistakes To Avoid

Idea-authoring mistakes are usually source-contract mistakes. `schema.idea`
does not only describe storage; it can affect schema classes, SQL behavior,
admin surfaces, and generated views.

### 845.5.1. Treat Idea As Only Database Schema

```idea
title String
      @label("Title")
      @field.string
      @list.string
      @view.string
```

This field affects more than storage. It gives generated admin and view output
a label, input behavior, list display, and detail display.

### 845.5.2. Invent Attributes

```idea
title String
      @field.magicText
```

This example should not be taught as normal Stackpress authoring unless source
confirms `@field.magicText` exists. A parser-looking shape is not the same as a
supported generator feature.

### 845.5.3. Debug Runtime Before Schema

```text
Symptom: generated admin field renders wrong.
First check: schema.idea field type, label, field/list/view metadata, validators.
```

If generated admin or view behavior is wrong, the source contract may be
missing labels, relations, assertions, or supported UI metadata. Inspect the
schema before changing runtime code.

**Learning checkpoint:** Before moving on, make sure you can explain why `schema.idea` is a Stackpress contract, not just a storage description. You should also know what to review before handing schema to generation.

**Next course:** Continue with `Plugin Skills`. That course explains what to do when a feature does not belong purely in the schema contract.
