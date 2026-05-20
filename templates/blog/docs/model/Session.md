# Model: Session

- Recommended Icon: coffee
- Singular Label: "Session"
- Plural Label: "Sessions"
- Per Row Display Format: `{{profile.name}}`
- Primary IDs: `id`
- Active toggle property: `active`
- Timestamp property: `updated`
- Sortable properties: `expires`, `created`, `updated`
- Filterable properties: `applicationId`, `profileId`, `active`

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
- Example: `7e2lig3iuej3bcftg8dz7pjf`

### App

Application this session belongs to.

- Property name: `applicationId`
- Property label: "App"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: Yes
- Max characters: 255
- Assertions: Must be a string; App is required
- Example: `tg8bcf7e2lig3iuej3dz7pjf`

### Profile

Profile this session belongs to.

- Property name: `profileId`
- Property label: "Profile"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: Yes
- Max characters: 255
- Assertions: Must be a string; Profile is required
- Example: `pjfdz7tg8bcf7e2lig3iuej3`

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
- Example: `lig3iuej37e2bcftg8dz7pjf`

### Scopes

API scopes that this session can request. This is mapped with endpoints.

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

Expiration date of the session. After this date, the session will not be able to perform any operations.

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

### application

- Foreign model: `Application`
- Foreign property: `id`
- Local property: `applicationId`
- Cardinality: `N:1`
  - A Session must have one App
  - An App can have many Sessions
- Results namespace: `application`

### profile

- Foreign model: `Profile`
- Foreign property: `id`
- Local property: `profileId`
- Cardinality: `N:1`
  - A Session must have one Profile
  - A Profile can have many Sessions
- Results namespace: `profile`