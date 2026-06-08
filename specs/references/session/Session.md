# `Session`

`Session` is the session-token helper used by `stackpress/session`. It can
create signed tokens, load token data, authorize permissions, and save session
state back to the response.

## Import

```ts
import { Session } from 'stackpress/session';
```

## Instantiation

Most code uses static helpers such as `Session.load(...)` or the registered
session plugin instead of calling the constructor directly.

```ts
const session = Session.load(req);
const data = await session.data();
```

This example reads the session token from the request and loads its decoded
session data.

## Static Properties

| Property | Type | Description |
| --- | --- | --- |
| `access` | `SessionPermissionList` | Configured role permission map. |
| `seed` | `string` | Token seed. |
| `key` | `string` | Session cookie key. |
| `expires` | `number` | Token expiration setter. |

## Static Methods

### `configure(key, seed, access)`

Configures the session key, seed, and permission map.

**Returns** the `Session` class.

### `create(data)`

Creates a session token from session data.

**Returns** a promise resolving to the token string.

### `token(req)`

Reads the token from a request.

**Returns** the token string, or `null` when no token is available.

### `load(tokenOrRequest)`

Loads a session from a token string or request object.

**Returns** a `Session` instance.

### `authorize(req, res, permits?)`

Checks whether a request is allowed by the configured access rules.

**Returns** a promise resolving to `true` when the request is allowed.

## Instance Properties

| Property | Type | Description |
| --- | --- | --- |
| `token` | `string` | Token string represented by this instance. |

## Instance Methods

### `data()`

Loads decoded session data.

**Returns** a promise resolving to session data, or `null`.

### `authorization()`

Loads session data plus token and permissions.

**Returns** a promise resolving to authorization data with `token`, `permits`,
`id`, `name`, `image`, and `roles`.

### `guest()`

Checks whether the session is a guest session.

**Returns** a promise resolving to a boolean.

### `can(...permits)`

Checks whether the session can access one or more permissions.

**Returns** a promise resolving to a boolean.

### `permits()`

Loads the permissions available to the session.

**Returns** a promise resolving to a permission array.

### `save(res)`

Writes the session token to the response.

**Returns** the session instance.

## Related

 - [Session Module](../session.md)
 - [Config Reference](../config-reference.md)
