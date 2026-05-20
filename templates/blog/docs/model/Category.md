# Model: Category

- Recommended Icon: sitemap
- Singular Label: "Category"
- Plural Label: "Categories"
- Per Row Display Format: `{{name}}`
- Primary IDs: `id`
- Unique value properties: `slug`
- Active toggle property: `active`
- Timestamp property: `updated`
- Sortable properties: `created`, `updated`
- Filterable properties: `active`

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

### Name

Name of the category.

- Property name: `name`
- Property label: "Name"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: Yes
- Max characters: 255
- Assertions: Must be a string; Name is required
- Example: `Introduction to Stackpress`

### URL Slug

URL-friendly version of the category name.

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

### Description

Detailed description of the category.

- Property name: `description`
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