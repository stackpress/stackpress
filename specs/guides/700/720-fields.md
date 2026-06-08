# 720 Fields

Learn how planned Studio field editing should connect product rules to idea source and generated behavior. Fields carry much of a model's meaning, so a visual editor has to make field metadata easier to inspect without hiding the source that owns it.

**Previously:** The previous course, `Schema Explorer`, introduced Studio as a planned source-backed inspection surface. This page narrows that idea to fields, which are one of the first places a developer feels the cost of dense idea files.

## 720.1. Why Fields Need A Parent Page

Fields describe more than storage. A field can define type, label, default value, validation, display format, list format, search behavior, sort behavior, and generated form behavior.

That amount of meaning deserves a slower entry point. Before editing validation, the reader should understand that a field is both product data and generator input.

## 720.2. The Planned Field Table

The Studio wireframes describe compact field rows in the model Fields tab. Each row should summarize the field name, keyword, type, validation, format, indexing/search/filter hints, and copy/remove controls.

```txt
drag | title | String | required, searchable | list.string, view.string | copy | remove
```

This example shows the planned row shape as a readable summary. The point is not to replace source; the point is to help a developer scan field meaning before opening a focused editor.

## 720.3. The Planned Field Editor

Clicking a field should push a focused field editor in the right task drawer. The planned editor includes Label, Keyword, Type, Add Attribute rows, Validation, List Format, Detail Format, Default, and index/search/filter toggles when those controls apply.

The same editor should be used for adding and updating a field. That keeps the editing model consistent: a new field starts empty, and an existing field starts with current source-backed values.

## 720.4. Attribute Options

Studio should not hard-code field options from prose documentation alone. The plan says built-in resource, column, assertion, field component, view component, list, filter, and span definitions should come from `packages/stackpress-schema/src/config/attributes.ts`.

This matters because field controls can drift if the UI invents its own option list. A visual editor should reflect the same attribute families that Stackpress generation understands.

## 720.5. How To Verify Field Work

A field change should be checked in source and in at least one output surface. For validation work, that means checking the rule declaration and the generated or runtime behavior that accepts or rejects values.

If the output surprises you, do not patch the generated file first. Return to the field definition and metadata because that is where the intended rule should live.

**Learning checkpoint:** Before moving on, make sure you can explain fields as both product data and generator input. You should also know why Studio field controls should come from Stackpress attribute definitions instead of a hand-authored UI list.

**Next course:** Continue with `Field Validation`. That course explains one planned field-editing subtopic in more detail.
