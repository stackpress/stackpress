# 325 Props

Props let an Idea file name a reusable metadata object and pass it into an
attribute. They are useful when several fields need the same component settings,
but each field should still show its label, validation, and generated surfaces.

**Previously:** `Types` showed how reusable value shapes become fieldsets.
This course stays in the same reuse mindset, but it focuses on component and
attribute metadata instead of stored value structure.

## 325.1. Why Props Exist

Repeated component settings are easy to copy, but copied settings can drift.
One field might keep an old placeholder, input type, class, or validation hint
after another field has already been updated.

Props solve the repeatable-settings part of that problem. Think of a prop as a
named bag of options that an attribute can receive, while the field itself
still declares what the value means in the model.

## 325.2. Define A Prop

Start by defining the reusable metadata before a field tries to use it. The
name becomes the reference you pass into an attribute later.

```idea
prop EmailField {
  type "email"
  placeholder "name@example.com"
}

prop RequiredText {
  required true
  placeholder "Required value"
}
```

These two props do different jobs. `EmailField` describes reusable input
settings, while `RequiredText` collects settings that can be reused by required
text-like inputs.

## 325.3. Pass A Prop Into A Field Attribute

After a prop exists, pass it into an attribute by name. The prop name goes
inside the attribute parentheses, so the field keeps its own behavior while
borrowing the reusable settings.

```idea
title String
      @label("Title")
      @searchable
      @field.input(EmailField)
      @is.required("Title is required")
      @list.string
      @view.string
```

This example shows the actual use site. `title` is still a `String`, the label
still says how generated UI should name it, `@searchable` still marks it for
search, and `@field.input(EmailField)` passes the reusable prop into the input
component configuration.

The list and view attributes remain explicit:

```idea
@list.string
@view.string
```

Keeping these attributes visible matters because the prop only configures the
field input. It does not automatically tell the list or detail view how to
render the value, so those generated surfaces should still be easy to see.

## 325.4. Reuse A Different Prop For Another Field

Different fields can use different props depending on what they need to reuse.
The field should still carry its own label and validation message, because
those are often specific to the product language.

```idea
email String
      @label("Email")
      @field.email(RequiredText)
      @is.required("Email is required")
```

This example uses `RequiredText` with an email-oriented field attribute. The
prop can carry shared component settings, while `@is.required("Email is
required")` keeps the validation message close to the field that uses it.

This is the balance to aim for:

```idea
@field.email(RequiredText)
@is.required("Email is required")
```

The first line reuses component configuration. The second line keeps the
business-facing validation message explicit, so a reader does not need to jump
to the prop definition to understand why the field is required.

## 325.5. When Reuse Helps

Reuse helps when the repeated metadata is stable and the prop name makes the
field easier to read. A name like `RequiredText` or `EmailField` should tell the
next developer why the settings are grouped.

Reuse hurts when the prop hides the important part of the field. If a reader
has to open a prop definition to understand whether a field is editable,
searchable, listable, viewable, or required, the prop is doing too much.

## 325.6. Mistakes To Avoid

Prop mistakes usually come from using reuse before the explicit field shape is
clear. Define the reusable settings, use them at the attribute site, and keep
field-specific behavior close to the field.

### 325.6.1. Define A Prop Without Using It

```idea
prop EmailField {
  type "email"
  placeholder "name@example.com"
}

email String
      @label("Email")
      @field.email
```

This prop exists, but the field never references it. If the field should use
those reusable settings, pass the prop into the attribute with
`@field.email(EmailField)` or another attribute that expects that prop shape.

### 325.6.2. Reference A Prop That Does Not Exist

```idea
email String
      @label("Email")
      @field.input(UnknownProp)
```

The Idea parser treats named prop references as real references. If
`UnknownProp` has not been declared, the schema cannot safely compile because
Stackpress does not know which reusable settings the field is asking for.

### 325.6.3. Hide Field-Specific Meaning In A Prop

```idea
prop RequiredEmail {
  required true
  label "Email"
}

email String
      @field.email(RequiredEmail)
```

This makes the field shorter, but it hides the label and required behavior away
from the field. Prefer keeping field-specific meaning visible with
`@label("Email")` and `@is.required("Email is required")`, then use props for
repeated component settings.

### 325.6.4. Use Props For One-Off Settings

```idea
prop OneArticleTitleField {
  placeholder "Title for this article only"
}

title String
      @field.input(OneArticleTitleField)
```

This adds indirection without removing real duplication. If only one field uses
the setting, write the attribute settings directly or wait until a repeated
pattern appears.

**Learning checkpoint:** Before moving on, make sure you can define a prop,
pass it into an attribute such as `@field.input(EmailField)`, and explain which
parts should stay explicit on the field.

**Next course:** Continue with `Attributes`. That course covers the confirmed
metadata families that Stackpress gives built-in meaning to.
