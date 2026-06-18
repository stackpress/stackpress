# `stackpress/sql`

`stackpress/sql` exposes the Stackpress SQL layer: builder classes from the query engine, dialect classes, SQL helper functions, and Stackpress-specific store/action interfaces.

## Import

```ts
import {
  Engine,
  Select,
  Insert,
  Update,
  Delete,
  ActionsInterface,
  StoreInterface
} from 'stackpress/sql';
```

## When To Use It

Use this path when you need direct access to SQL builders, dialect-aware helpers, or the Stackpress store/action SQL layer.

## Export Inventory

| Export | Kind | Purpose |
| --- | --- | --- |
| `Alter`, `Create`, `Delete`, `Insert`, `Select`, `Update` | classes | Build SQL statements |
| `Mysql`, `Pgsql`, `Sqlite`, `Engine` | classes | SQL dialect and engine classes |
| `joinTypes`, `isIndex`, escaping helpers | functions/constants | Lower-level query utility helpers |
| `toSqlString`, `toSqlBoolean`, `toSqlDate`, `toSqlInteger`, `toSqlFloat` | functions | Normalize values into SQL-safe forms |
| `getAlias`, `storePathToAlias`, `storeSelectorToSqlSelector` | functions | Map store/query structures into SQL structures |
| `events`, `scripts` | namespaces | Grouped SQL event and script surfaces |
| `ActionsInterface`, `StoreInterface` | classes/types | Stackpress-specific runtime interfaces |

## Detailed Exports

### Builder Classes

#### `Select`, `Insert`, `Update`, `Delete`, `Create`, `Alter`

- Kind: classes
- Use them to build query operations directly.
- **Returns** builder instances that represent a SQL operation before execution.
- These classes are most useful in low-level tooling or advanced integrations. Most app developers meet them indirectly through generated events and store code.

```ts
import { Select, Insert } from 'stackpress/sql';
```

### `Engine`

- Kind: class
- Use it as the main SQL engine entrypoint.
- **Returns** an engine that coordinates dialect-aware query generation and execution.

```ts
import { Engine } from 'stackpress/sql';
```

### Dialect Classes

#### `Mysql`, `Pgsql`, `Sqlite`

- Kind: classes
- Use them when you need to reason about or customize dialect-specific SQL behavior.

```ts
import { Mysql, Pgsql, Sqlite } from 'stackpress/sql';
```

### Value Conversion Helpers

#### `toSqlString`

- Kind: function
- Use it to serialize string-like values safely for SQL usage.
- **Returns** an SQL-ready string value.

```ts
import { toSqlString } from 'stackpress/sql';
```

#### `toSqlBoolean`

- Kind: function
- Use it to normalize booleans into the SQL representation expected by the dialect layer.

```ts
import { toSqlBoolean } from 'stackpress/sql';
```

#### `toSqlDate`, `toSqlInteger`, `toSqlFloat`

- Kind: functions
- Use them to normalize date and numeric values before query generation.

```ts
import { toSqlDate, toSqlInteger, toSqlFloat } from 'stackpress/sql';
```

### Store Mapping Helpers

#### `getAlias`

- Kind: function
- Use it to derive SQL-safe aliases for generated selectors or joins.

```ts
import { getAlias } from 'stackpress/sql';
```

#### `storePathToAlias`

- Kind: function
- Use it to convert a relation path into an SQL alias string.

```ts
import { storePathToAlias } from 'stackpress/sql';
```

#### `storeSelectorToSqlSelector`

- Kind: function
- Use it to convert a Stackpress store selector into an SQL selector shape.

```ts
import { storeSelectorToSqlSelector } from 'stackpress/sql';
```

### `ActionsInterface` and `StoreInterface`

- Kind: classes/types
- Use them when integrating generated action/store behavior with custom runtime logic.
- `ActionsInterface` represents the action-facing SQL layer.
- `StoreInterface` represents the model/store-facing SQL layer.

```ts
import { ActionsInterface, StoreInterface } from 'stackpress/sql';
```

## Integration Example

```ts
import { Select, storeSelectorToSqlSelector } from 'stackpress/sql';
```

## Related

 - [SQL Detail Pages](./sql/README.md)
 - [Engine](./sql/Engine.md)
 - [Builder Classes](./sql/builders.md)
 - [Connection Adapters](./sql/connections.md)
 - [MySQL](./mysql.md)
 - [PostgreSQL](./pgsql.md)
 - [PGlite](./pglite.md)
 - [SQLite](./sqlite.md)
 - [Idea Reference](./idea-reference.md)
