# 721 Field Validation

Understand how planned Studio validation editing should expose source-backed assertion attributes. Validation is where a field explains which values are acceptable before generated actions, forms, or runtime code trust the data.

**Previously:** The previous course, `Fields`, explained the planned field table and field editor. This page focuses on validation as one field-editor section that must remain tied to idea attributes and diagnostics.

## 721.1. Current Status

Studio is not implemented yet, so this page is a planning lesson. The Studio plan says validation controls should come from the assertion definitions in `packages/stackpress-schema/src/config/attributes.ts`, and invalid combinations should produce diagnostics.

That means the page should not promise a working validation editor. It should teach the intended shape: choose a validator from source-backed definitions, expose the required arguments, save a source patch when safe, then parse and inspect the result.

## 721.2. Why Validation Needs Source Visibility

Validation rules are small, but they affect whether data can be written. A visual control that says "required" is only useful if the developer can see which idea attribute will be saved.

The plan keeps source as the canonical model for this reason. Studio can help choose and configure validators, but `schema.idea` still needs to show the rule in a form generation can understand.

## 721.3. Planned Validator Controls

The Studio plan lists assertion controls from the `assert` attribute family. It also says each definition's type and args should drive whether the control is a flag, method, or argument editor.

```txt
required
email
url
slug
gt
gte
lt
lte
regex
option
```

This example is a small subset of the planned validator options. The important lesson is that Studio should derive the picker from Stackpress attribute definitions, then show any required inputs for the selected validator.

## 721.4. Lead From Control To Source

A validation editor should lead the developer from a human choice to an idea attribute. For example, choosing a required validator should produce a source-backed required assertion, and choosing a format validator should produce the matching assertion with its message or arguments.

```idea
email String
      @label("Email")
      @field.email
      @is.required("Email is required")
      @is.email("Must be a valid email")
```

This example shows what the visual choice must eventually become in source. The editor can make the choice easier, but the source is still the artifact that generation reads.

## 721.5. Diagnostics And Verification

The plan says Studio diagnostics should catch invalid combinations, unknown field types, missing enum references, and default values that do not match enum options. Validation editing should use the same pattern: detect problems before the user trusts generated output.

After a validation change, the source should remain parseable, the resource list should refresh, and later generation should produce behavior consistent with the validator. Until Studio exists, the stable fallback is to edit the idea file directly and verify through generation and runtime checks.

**Learning checkpoint:** Before moving on, make sure you can explain validation as a source-backed field rule, not just a UI checkbox. You should also know that planned Studio validation controls should come from Stackpress assertion definitions.

**Next course:** Continue with `Relations`. That course applies the same source-backed planning approach to model relationships.
