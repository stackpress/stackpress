# Model: Auth

- Recommended Icon: lock
- Singular Label: "Auth"
- Plural Label: "null"
- Per Row Display Format: `{{token}}`
- Primary IDs: `id`
- Unique value properties: `token`
- Active toggle property: `active`
- Timestamp property: `updated`
- Sortable properties: `consumed`, `created`, `updated`
- Filterable properties: `profileId`, `type`, `verified`, `active`

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

### Type

Type of authentication method (username, email, phone).

- Property name: `type`
- Property label: "Type"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: No
- Default value: `"username"`
- Max characters: 255
- Assertions: Must be a string; Type is required
- Example: `username`

### Token

The actual username, email, or phone (depending on type)

- Property name: `token`
- Property label: "Token"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: Yes
- Max characters: 255
- Assertions: Must be a string; Token is required; Must be at least 5 characters; Should be a unique value
- Example: `john@doe.com`

### Secret

Password used to verify.

- Property name: `secret`
- Property label: "Secret"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: Yes
- Max characters: 255
- Assertions: Must be a string; Secret is required
- Example: `s3cr3t P@ssw0rd`

### Verified

Indicates if the type has been verified (email, phone, etc.).

- Property name: `verified`
- Property label: "Verified"
- Property type: `boolean`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: No
- Assertions: Must be a boolean; Verified is required
- Example: `true`

### Last Used

Timestamp when this auth was last used.

- Property name: `consumed`
- Property label: "Last Used"
- Property type: `datetime`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: No
- Default value: *(current datetime)*
- Assertions: Must be a valid date; Value is required
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
  - An Auth must have one Profile
  - A Profile can have many null
- Results namespace: `profile`