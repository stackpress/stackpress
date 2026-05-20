# Model: Article

- Recommended Icon: file
- Singular Label: "Article"
- Plural Label: "Articles"
- Per Row Display Format: `{{title}}`
- Primary IDs: `id`
- Unique value properties: `slug`
- Active toggle property: `active`
- Timestamp property: `updated`
- Sortable properties: `created`, `updated`
- Filterable properties: `profileId`, `active`

## Properties

The following properties are defined for this model.

### ID

Unique generated identifier.

- Property name: `id`
- Property label: "ID"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: No
- Default value: `cuid()`
- Max characters: 255
- Assertions: Must be a string; Value is required
- Example: `dz7tg8bcf7e2lig3iuej3pjf`

### Profile

Profile this auth belongs to.

- Property name: `profileId`
- Property label: "Profile"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: Yes
- Max characters: 255
- Assertions: Must be a string; Profile is required
- Example: `pjfdz7tg8bcf7e2lig3iuej3`

### Title

Title of the article.

- Property name: `title`
- Property label: "Title"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: Yes
- Max characters: 255
- Assertions: Must be a string; Title is required
- Example: `Introduction to Stackpress`

### URL Slug

URL-friendly version of the title.

- Property name: `slug`
- Property label: "URL Slug"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: Yes
- Max characters: 255
- Assertions: Must be a string; URL Slug is required; Should be a unique value
- Example: `introduction-to-stackpress`

### Banner

Banner image URL.

- Property name: `banner`
- Property label: "Banner"
- Property type: `string?`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: No
- Max characters: 255
- Assertions: Must be a string
- Example: `https://example.com/banner.jpg`

### Contents

Main contents of the article.

- Property name: `contents`
- Property label: "Contents"
- Property type: `text?`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: No
- Max characters: *(unlimited)*
- Assertions: Must be a string
- Example: `<p>This is an <strong>example</strong> article about Stackpress.</p>`

### Keywords

Keyphrases for SEO purposes.

- Property name: `keywords`
- Property label: "Keywords"
- Property type: `string[]`
- Type description: Primitive
- As multiple values (array): Yes
- Required on creation: No
- Default value: `[]`
- Max characters: 255
- Assertions: Should be an array
- Example: `["top buyer","verified","moderator"]`

### Tags

Arbitrary tags for general use.

- Property name: `tags`
- Property label: "Tags"
- Property type: `string[]`
- Type description: Primitive
- As multiple values (array): Yes
- Required on creation: No
- Default value: `[]`
- Max characters: 255
- Assertions: Should be an array
- Example: `["top buyer","verified","moderator"]`

### References

Arbitrary key/value references for general use.

- Property name: `references`
- Property label: "References"
- Property type: `object?`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: No
- Default value: `{}`
- Assertions: Must be an object
- Example: `{"fbid":"abc123"}`

### Status

Status of the article.

- Property name: `status`
- Property label: "Status"
- Property type: `PublishStatus`
- Type description: enum with possible values: "DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"
- As multiple values (array): No
- Required on creation: No
- Default value: `"DRAFT"`
- Assertions: Must be a valid option; Status is required
- Example: `DRAFT`

### Published Date

Date when the article was published.

- Property name: `published`
- Property label: "Published Date"
- Property type: `datetime?`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: No
- Assertions: Must be a valid date
- Example: `2025-10-01T12:00:00Z`

### Active

Special flag to indicate active rows. Inactive rows are not shown in the list view, but can be viewed in the detail view.

- Property name: `active`
- Property label: "Active"
- Property type: `boolean`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: No
- Default value: `true`
- Assertions: Must be a boolean; Value is required
- Example: `true`

### Created

Generated timestamp when row was created.

- Property name: `created`
- Property label: "Created"
- Property type: `datetime`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: No
- Default value: *(current datetime)*
- Assertions: Must be a valid date; Value is required
- Example: `2025-10-01T12:00:00Z`

### Updated

Generated timestamp that is updated whenever the row has changed.

- Property name: `updated`
- Property label: "Updated"
- Property type: `datetime`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: No
- Default value: *(current datetime)*
- Assertions: Must be a valid date; Value is required
- Example: `2025-10-01T12:00:00Z`

## Relationships

### profile

- Foreign model: `Profile`
- Foreign property: `id`
- Local property: `profileId`
- Cardinality: `N:1`
  - An Article must have one Profile
  - A Profile can have many Articles
- Results namespace: `profile`