# Model: Comment

- Recommended Icon: comment
- Singular Label: "Comment"
- Plural Label: "Comments"
- Per Row Display Format: `{{comment}}`
- Primary IDs: `id`
- Active toggle property: `active`
- Timestamp property: `updated`
- Sortable properties: `created`, `updated`
- Filterable properties: `articleId`, `profileId`, `active`

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

### Article

Article this comment belongs to.

- Property name: `articleId`
- Property label: "Article"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: Yes
- Max characters: 255
- Assertions: Must be a string; Article is required
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

### Description

Detailed description of the category.

- Property name: `comment`
- Property label: "Description"
- Property type: `text?`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: No
- Max characters: *(unlimited)*
- Assertions: Must be a string
- Example: `This category includes articles about getting started with Stackpress.`

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

### article

- Foreign model: `Article`
- Foreign property: `id`
- Local property: `articleId`
- Cardinality: `N:1`
  - A Comment must have one Article
  - An Article can have many Comments
- Results namespace: `article`

### profile

- Foreign model: `Profile`
- Foreign property: `id`
- Local property: `profileId`
- Cardinality: `N:1`
  - A Comment must have one Profile
  - A Profile can have many Comments
- Results namespace: `profile`