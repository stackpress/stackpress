# Model: Application

- Recommended Icon: laptop
- Singular Label: "App"
- Plural Label: "Apps"
- Per Row Display Format: `{{name}}`
- Primary IDs: `id`
- Active toggle property: `active`
- Timestamp property: `updated`
- Sortable properties: `expires`, `created`, `updated`
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
- Example: `tg8bcf7e2lig3iuej3dz7pjf`

### Profile

The profile author of this application.

- Property name: `profileId`
- Property label: "Profile"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: Yes
- Max characters: 255
- Assertions: Must be a string; Profile is required
- Example: `pjfdz7tg8bcf7e2lig3iuej3`

### Name

Arbitrary name of the application. Used in 3-legged OAuth flows.

- Property name: `name`
- Property label: "Name"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: Yes
- Max characters: 255
- Assertions: Must be a string; Name is required
- Example: `My Awesome App`

### Image

Logo image URL of the application. Used in 3-legged OAuth flows.

- Property name: `logo`
- Property label: "Image"
- Property type: `string?`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: No
- Max characters: 255
- Assertions: Must be a string
- Example: `https://example.com/logo.png`

### Website

Arbitrary website URL of the application. Used in 3-legged OAuth flows.

- Property name: `website`
- Property label: "Website"
- Property type: `string?`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: No
- Max characters: 255
- Assertions: Must be a string

### Secret

Generated unique hash needed to perform write operations (POST, PUT, DELETE, etc.)

- Property name: `secret`
- Property label: "Secret"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: No
- Default value: `cuid()`
- Max characters: 255
- Assertions: Must be a string; Value is required
- Example: `bcf7e2lig3iuej3tg8dz7pjf`

### Scopes

API scopes that this application can request. This is mapped with endpoints.

- Property name: `scopes`
- Property label: "Scopes"
- Property type: `string[]`
- Type description: Primitive
- As multiple values (array): Yes
- Required on creation: No
- Default value: `[]`
- Max characters: 255
- Assertions: Should be an array
- Example: `["commerce","location","account"]`

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

### Expires

Expiration date of the application. After this date, the application will not be able to perform any operations.

- Property name: `expires`
- Property label: "Expires"
- Property type: `datetime`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: Yes
- Assertions: Must be a valid date; Expires is required
- Example: `2025-12-31T23:59:59Z`

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
  - An App must have one Profile
  - A Profile can have many Apps
- Results namespace: `profile`