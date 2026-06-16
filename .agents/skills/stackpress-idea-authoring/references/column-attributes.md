# Column Attributes

Use this reference for general field-level attributes that are not part of the
`@is.*` validator family or the generated component families.

## `@active`

- Kind: flag
- Purpose: mark the field used for active or soft-delete behavior
- Example:

```idea
active Boolean @active
```

## `@default(...)`

- Kind: method
- Purpose: supply a default value for create flows
- Args:
  - required string, number, or boolean value
- Example:

```idea
active Boolean @default(true)
```

## `@description(...)`

- Kind: method
- Purpose: store internal documentation for the field
- Args:
  - required description string

## `@examples(...)`

- Kind: method
- Purpose: store one or more example values
- Args:
  - one or more example values

## `@encrypted`

- Kind: flag
- Purpose: mark the field as reversibly encrypted

## `@generated`

- Kind: flag
- Purpose: mark the field as generated so validation can be bypassed for user
  input

## `@hashed`

- Kind: flag
- Purpose: mark the field as one-way hashed

## `@id`

- Kind: flag
- Purpose: mark the identifier field for the model
- Note: multiple `@id` fields imply composite identity

## `@searchable`

- Kind: flag
- Purpose: mark the field as participating in search behavior

## `@sortable`

- Kind: flag
- Purpose: mark the field as participating in sort behavior

## `@label(...)`

- Kind: method
- Purpose: provide a display label different from the raw field name
- Args:
  - required label string

## `@min(...)`

- Kind: method
- Purpose: define the minimum accepted numeric value
- Args:
  - required number

## `@max(...)`

- Kind: method
- Purpose: define the maximum accepted numeric value
- Args:
  - required number

## `@step(...)`

- Kind: method
- Purpose: define the numeric increment amount
- Args:
  - required number

## `@relation(...)`

- Kind: method
- Purpose: map a local column to a related model column
- Args:
  - required relation object with:
    - `local`
    - `foreign`
    - optional `name`
- Example:

```idea
profile Profile @relation({ local "profileId" foreign "id" })
```

## `@timestamp`

- Kind: flag
- Purpose: update the field automatically whenever a row changes

## `@unique`

- Kind: flag
- Purpose: prevent duplicate values for the field

## Canonical Use

- use `@id`, `@default(...)`, `@active`, `@timestamp`, and `@unique` when the
  model behavior truly needs them
- use `@relation(...)` on relation object fields for structural relation wiring
- use `@label(...)`, `@description(...)`, and `@examples(...)` to improve the
  schema contract and generated display metadata
