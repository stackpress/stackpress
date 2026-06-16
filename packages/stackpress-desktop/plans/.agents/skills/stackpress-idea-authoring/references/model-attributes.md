# Model Attributes

Use this reference for schema or model-level attributes.

## `@display(...)`

- Kind: method
- Purpose: define a human-readable template for a row using row variables
- Args:
  - required template string
- Example:

```idea
@display("{{first_name}} {{last_name}}")
```

## `@icon(...)`

- Kind: method
- Purpose: define the icon name for the model
- Args:
  - required icon string such as `user`, `cog`, or `database`
- Example:

```idea
@icon("user")
```

## `@labels(...)`

- Kind: method
- Purpose: define singular and plural labels for the model
- Args:
  - required singular label
  - required plural label
- Example:

```idea
@labels("Article", "Articles")
```

## `@query(...)`

- Kind: method
- Purpose: define default query selectors returned for the model
- Args:
  - one or more column or relation selector strings
- Example:

```idea
@query("*", "author.*")
```

## Canonical Use

- use `@labels(...)` when generated admin or display layers need good singular
  and plural names
- use `@display(...)` when the model needs a clear human-readable identity
- use `@icon(...)` when generated UI surfaces benefit from an icon
- use `@query(...)` only when richer default relation loading is intentional

## Recommended Admin Metadata

These model attributes are highly recommended because they improve generated
admin output:

```idea
@labels("Comment", "Comments")
@icon("comment")
@display("{{comment}}")
```

Treat this trio as a strong default recommendation for models unless there is a
good reason to omit one of them.
