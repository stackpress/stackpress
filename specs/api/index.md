# `stackpress`

The root `stackpress` package is the broadest public import path. It re-exports framework APIs from server, schema, SQL, view, session, language, and utility layers through one module.

## Import

```ts
import { server, Schema, Engine, CLIENT_TEMPLATE } from 'stackpress';
```

## When To Use It

Use the root package when you want a small number of common Stackpress exports from one import path. Prefer narrower imports such as `stackpress/http`, `stackpress/view`, or `stackpress/schema` when you want clearer module boundaries.

## Export Inventory

| Export | Kind | Purpose |
| --- | --- | --- |
| `server`, `router`, `action`, `gateway`, `handler` | functions | Server bootstrap and routing helpers |
| `Schema`, `Model`, `Column`, `dictionary` | classes/helpers | Schema interpretation and generation helpers |
| `Engine`, `Select`, `Insert`, `Update`, `Delete` | classes | SQL builders and runtime query layer |
| `CLIENT_TEMPLATE`, `DOCUMENT_TEMPLATE`, `PAGE_TEMPLATE` | constants | View template entrypoints |
| `Session`, `Language` | classes | Session and translation runtime helpers |
| `events`, `scripts` | namespaces | Grouped generated or framework task surfaces |

## Detailed Exports

### `server`

- Kind: function
- Source family: `stackpress/server`
- Use it to create a Stackpress server instance from the root package when you do not want a narrower subpath import.
- **Returns** a server instance that can accept config, plugins, routes, and lifecycle listeners.

```ts
import { server } from 'stackpress';

const app = server();
```

### `Schema`

- Kind: class
- Source family: `stackpress/schema`
- Use it to work with the interpreted Stackpress schema layer after `schema.idea` has been parsed into framework-aware objects.
- **Returns** a schema object that can expose models, columns, definitions, and generation-facing metadata.

```ts
import { Schema } from 'stackpress';

const schema = new Schema();
```

### `Engine`

- Kind: class
- Source family: `stackpress/sql`
- Use it to build or execute SQL operations through the Stackpress SQL layer.
- **Returns** an SQL engine instance that coordinates dialect-aware builders and execution helpers.

```ts
import { Engine, Select } from 'stackpress';

const engine = new Engine();
```

### `CLIENT_TEMPLATE`, `DOCUMENT_TEMPLATE`, `PAGE_TEMPLATE`

- Kind: constants
- Source family: `stackpress/view`
- Use them as prebuilt template inputs for view config and build/develop bootstraps.

```ts
import { CLIENT_TEMPLATE, DOCUMENT_TEMPLATE } from 'stackpress';
```

## Related

 - [Plugin](./plugin.md)
 - [Server](./server.md)
 - [Schema](./schema.md)
 - [SQL](./sql.md)
 - [View](./view.md)
