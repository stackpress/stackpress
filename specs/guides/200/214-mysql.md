# 214 MySQL

MySQL is another production database path for Stackpress apps. The app can keep
the same route, event, and generated action structure, while the connection
helper points to a MySQL server through the MySQL2 driver.

**Previously:** `PostgreSQL` showed how a server database changes the
connection helper while preserving the app-facing database surface. Here, the
focus shifts to the MySQL-specific version of that decision.

## 214.1. The Decision

Choose MySQL when the app's deployment target, existing infrastructure, or team
standard uses MySQL. Do not change generated stores or views first; change and
verify the database connection boundary.

The main difference from PostgreSQL is dialect behavior. MySQL keeps `?`
placeholders, uses backticks for identifiers, maps generic JSON to `JSON`, and
tracks inserted IDs through `lastId` when the driver exposes it.

## 214.2. When MySQL Fits

Use the MySQL public path when you need MySQL-specific connection or dialect
behavior:

```ts
import { Mysql, Mysql2Connection, connect } from 'stackpress/mysql';
```

The public path exposes the MySQL dialect, MySQL2 connection wrapper, and the
shared SQL builder surface. App routes and generated actions should still use
the registered `database` plugin instead of depending on the dialect directly.

The lower-level connection shape uses a native `mysql2/promise` connection:

```ts
import mysql from 'mysql2/promise';
import { connect } from 'stackpress/mysql';

const resource = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'app'
});

const connection = connect(resource);
```

The native `resource` talks to MySQL. `connect(resource)` wraps it so
Stackpress database code can use the same engine-style methods as the earlier
data lessons.

## 214.3. Connection Config

Register the wrapped connection during the `config` lifecycle:

```ts
server.on('config', async _ => {
  const connection = await connectMysql();
  server.register('database', connection);
});
```

This keeps the app-facing surface stable. The helper owns the MySQL driver
setup, and the rest of the app resolves the same `database` plugin name.

Read sensitive connection settings from environment variables or deployment
secrets:

```ts
const resource = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});
```

This example shows the shape of the configuration boundary. It is not a
confirmed scaffold file in this repo, so keep project-specific defaults in your
own app config.

## 214.4. Migration Or Push Flow

Once MySQL is registered, use the same Stackpress database commands:

```bash
stackpress push --b config -v
stackpress populate --b config -v
stackpress query "SELECT * FROM article" --b config -v
```

The command flow stays familiar because Stackpress still works through the
registered database surface. The SQL emitted underneath follows MySQL dialect
rules.

Raw SQL needs extra attention when moving from PostgreSQL-style databases to
MySQL. Generated builders and actions handle more dialect differences for you,
but handwritten SQL is your responsibility.

## 214.5. Tradeoffs

MySQL can be a good fit when the hosting environment already provides it or the
team has operational experience with it. The tradeoff is that local PGlite is
not a perfect MySQL rehearsal, so test MySQL-specific behavior before release.

Inserted IDs are one example of a database-specific detail. The generated
insert action handles driver differences by using returned rows when available
or `connection.lastId` when the connection exposes it.

```ts
if (this.engine.connection.lastId) {
  const eq = { id: this.engine.connection.lastId };
  return (await this.find({ eq })) || input;
}
```

This is why the connection wrapper matters. It gives generated actions a common
place to inspect database-specific return behavior.

## 214.6. Verify

A MySQL setup is not proven by imports alone. Verify that Stackpress can reach
the configured MySQL database, apply schema changes, run generated events, and
inspect rows with `stackpress query`.

This repo does not currently include a confirmed end-to-end MySQL Stackpress
scaffold. Treat this lesson as the source-backed connection shape and testing
path, not as a complete production checklist.

**Learning checkpoint:** Before moving on, make sure you can explain why
`connect(resource)` needs a native MySQL2 resource and why raw SQL needs
dialect-specific verification.

**Next course:** Continue with `Engine`. That course returns to the shared
database surface used by all supported connection paths.
