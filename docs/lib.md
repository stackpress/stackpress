# `stackpress/lib`

`stackpress/lib` is the low-level primitive shelf. It exposes Stackpress-compatible data structures, file and queue helpers, event emitters, request and response primitives, parsing helpers, and selected cross-runtime utilities.

## Import

```ts
import { Nest, Request, Response, Router, Exception } from 'stackpress/lib';
```

## When To Use It

Use this path when you need low-level Stackpress-compatible primitives without importing sibling libraries directly.

## Export Inventory

| Export | Kind | Purpose |
| --- | --- | --- |
| `Nest`, `ReadonlyNest`, path/query/form data primitives | classes/helpers | Work with nested or structured data |
| `FileLoader`, `NodeFS` | classes | File-system and file-loading helpers |
| `ItemQueue`, `TaskQueue` | classes | Queue-based processing helpers |
| `EventEmitter`, `ExpressEmitter`, `RouteEmitter` | classes | Event routing and emission helpers |
| `Request`, `Response`, `Router`, `Terminal`, `Exception`, `Status` | classes | Core runtime primitives |
| parsing/object helpers | functions | Convert input into Stackpress-friendly object structures |

## Detailed Exports

### `Nest`

- Kind: class
- Use it to hold and traverse nested data structures in a Stackpress-compatible way.

```ts
import { Nest } from 'stackpress/lib';

const data = new Nest();
```

### `Request`, `Response`, `Router`

- Kind: classes
- Use them when you want low-level runtime primitives without going through the higher-level server module.

```ts
import { Request, Response, Router } from 'stackpress/lib';
```

### `Terminal`

- Kind: class
- Use it to build or inspect terminal behavior at the primitive layer.

```ts
import { Terminal } from 'stackpress/lib';

const terminal = new Terminal();
```

### `Exception` and `Status`

- Kind: classes
- Use `Exception` for framework-style runtime errors.
- Use `Status` for response/status code helpers.

```ts
import { Exception, Status } from 'stackpress/lib';
```

### Parsing Helpers

- `formDataToObject`
- `objectFromArgs`
- `objectFromJson`
- `objectFromQuery`
- `objectFromFormData`
- `withUnknownHost`

Use these when you need to normalize incoming arguments or transport data into the shapes Stackpress expects.

```ts
import { objectFromArgs, objectFromQuery } from 'stackpress/lib';
```

## Related

 - [Runtime Class Details](./runtime/README.md)
 - [Request](./runtime/Request.md)
 - [Response](./runtime/Response.md)
 - [Router](./runtime/Router.md)
 - [Server](./server.md)
 - [Types](./types.md)
