# `stackpress/session`

`stackpress/session` exposes the session-aware matching helpers, session runtime class, and auth-adjacent action helpers that are publicly available through Stackpress.

## Import

```ts
import { Session, actions, matchRoute, matchEvent } from 'stackpress/session';
```

## When To Use It

Use this path when you need direct session or auth helper access in app code rather than only using the session plugin indirectly.

## Export Inventory

| Export | Kind | Purpose |
| --- | --- | --- |
| `Session` | class | Main session runtime class |
| `actions` | helper namespace/object | Session and auth-oriented helper actions |
| `matchAnyEvent`, `matchAnyRoute`, `matchEvent`, `matchRoute` | functions | Match session rules against routes or events |
| `isRegExp` | function | Utility used when matching route or event expressions |

## Detailed Exports

### `Session`

- Kind: class
- Use it when you need the public session runtime object directly.
- Common responsibilities:
  - session authorization
  - reading session state
  - applying permission-aware checks

```ts
import { Session } from 'stackpress/session';
```

### `actions`

- Kind: helper namespace/object
- Use it when you need the public session action helpers exposed by Stackpress.

```ts
import { actions } from 'stackpress/session';
```

### `matchAnyEvent` and `matchEvent`

- Kind: functions
- Use them to test whether an event expression matches the current event name.
- **Returns** a boolean match result.

```ts
import { matchAnyEvent, matchEvent } from 'stackpress/session';
```

### `matchAnyRoute` and `matchRoute`

- Kind: functions
- Use them to test whether a route expression matches the current route.
- **Returns** a boolean match result.

```ts
import { matchAnyRoute, matchRoute } from 'stackpress/session';
```

### `isRegExp`

- Kind: function
- Use it when you need to distinguish between string and regular-expression match input.

```ts
import { isRegExp } from 'stackpress/session';
```

## Related

 - [Session Detail Pages](./session/README.md)
 - [Session Class](./session/Session.md)
 - [Language](./language.md)
 - [Plugin](./plugin.md)
