# Model: Profile

- Recommended Icon: user
- Singular Label: "Profile"
- Plural Label: "Profiles"
- Per Row Display Format: `{{name}}`
- Primary IDs: `id`
- Active toggle property: `active`
- Timestamp property: `updated`
- Sortable properties: `created`, `updated`
- Filterable properties: `type`, `active`, `created` (range), `updated` (range)

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
- Example: `pjfdz7tg8bcf7e2lig3iuej3`

### Image

Profile image URL.

- Property name: `image`
- Property label: "Image"
- Property type: `string?`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: No
- Max characters: 255
- Assertions: Must be a string
- Example: `https://example.com/image.jpg`

### Name

Full name (first middle last).

- Property name: `name`
- Property label: "Name"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: Yes
- Max characters: 255
- Assertions: Must be a string; Name is required
- Example: `John Doe`

### Type

Type of profile (ie. person, company, etc.).

- Property name: `type`
- Property label: "Type"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: No
- Default value: `"person"`
- Max characters: 255
- Assertions: Must be a string; Type is required
- Example: `person`

### Roles

Roles held by the profile. This is used with sessions to determine access levels of the app.

- Property name: `roles`
- Property label: "Roles"
- Property type: `string[]`
- Type description: Primitive
- As multiple values (array): Yes
- Required on creation: No
- Default value: `["GUEST"]`
- Max characters: 255
- Assertions: Should be an array
- Example: `["admin","user","guest"]`

### Tags

Abritrary tags for general use.

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