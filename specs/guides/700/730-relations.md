# 730 Relations

Understand how a planned Studio relation editor should visualize model relationships while preserving idea-file source mapping. Relations connect models, so the UI has to make the local field, foreign field, and optional relation name easy to inspect.

**Previously:** The previous course, `Field Validation`, explained how planned field controls should become source-backed attributes. Relations use the same rule: a visual edit must map back to idea relation metadata.

## 730.1. Current Status

The Studio plans and v2 wireframes include a Relations tab for model drawers. They describe relation rows using idea semantics rather than copying Cradle's older cardinality model literally.

That status keeps this page future-facing. The current code-first workflow still uses `schema.idea` relation declarations, so this page focuses on how a planned visual row should point back to source instead of repeating the full `327 Relations` lesson.

## 730.2. The Planned Relation Row

The admin UI plan says relation rows should stay on one line and use local model/column to foreign model/column plus an optional relation name. If the drawer is too narrow, the row should scroll horizontally instead of wrapping into a tall block.

```txt
Local Model . Local Column -> Foreign Model . Foreign Column : Relation Name
```

This example is the planned Studio row format. It gives a junior developer a quick way to see which local value points to which foreign value.

## 730.3. Source Mapping

The visual row still needs to map to idea source. A relation editor should help the user choose the current model, related model, local field, foreign field, and optional relation name, then show the source preview or patch that will be saved.

```idea
profileId String
profile   Profile @relation({ local "profileId" foreign "id" })
```

This example shows the kind of source relationship the UI must preserve. `profileId` stores the local value, while the `profile` relation names the target model and maps local `profileId` to foreign `id`.

## 730.4. What Studio Should Not Do

Studio should not create a separate schema database for relations. It should edit or preview the idea source and rely on Stackpress generation to produce the downstream schema, query, admin, view, and client effects.

It should also avoid importing Cradle's old relation assumptions blindly. Cradle is a UX reference here, while Stackpress idea semantics decide what relation data means.

## 730.5. How To Verify A Relation Change

After a relation change, inspect the source first. Then run generation and check the output surfaces that should reflect the relationship, such as generated schema classes, query behavior, admin forms, view display, or client types.

If Studio later supports relation editing, it should show diagnostics when a local field, foreign field, or target model cannot be resolved. Until then, use the idea source and generated output as the stable verification path.

**Learning checkpoint:** Before moving on, make sure you can explain the planned relation row as local model/column to foreign model/column. You should also know that Studio relation editing must preserve idea source rather than inventing a separate relationship model.

**Next course:** Continue with `Generated Admin`. That course explains how Studio-adjacent thinking connects to generated admin output without promising a Studio admin replacement.
