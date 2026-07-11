# PostgreSQL Adapter

`stackpress/pgsql` adapts a checked-out `pg` client to Stackpress's SQL
connection contract. It exports `PGConnection`, a connector, PostgreSQL-facing
types, and the associated facade.

```ts
import { Client } from 'pg'
import { connect } from 'stackpress/pgsql'

const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

const connection = connect(client)
const rows = await connection.query(
  'SELECT * FROM users WHERE email = ?',
  ['person@example.com']
)
```

The adapter validates and rewrites question-mark placeholders to PostgreSQL's
numbered `$1`, `$2`, and subsequent forms before execution. Query results expose
normalized rows while retaining a path to the driver's raw result when native
metadata is required.

## Transactions

Transactions issue `BEGIN`, then run the callback against the same connection,
followed by `COMMIT` or `ROLLBACK`. When the application starts from a pool, it
must acquire one client and retain that client for the full transaction. Running
transaction statements through arbitrary pool queries can move work across
different connections and break atomicity.

PostgreSQL does not provide a portable connection-level last-insert identifier.
Use `INSERT ... RETURNING` when the inserted key is required. The generic
`lastId` contract is therefore undefined for this adapter.

The adapter owns placeholder conversion, native query calls, raw result access,
and transaction statements. SQL construction remains the dialect and builder's
responsibility; connection lifecycle and client release remain the caller's or
pool owner's responsibility.

