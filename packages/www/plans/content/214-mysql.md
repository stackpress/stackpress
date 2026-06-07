# 214 MySQL

Configure MySQL-specific connection behavior when your app needs to run against a MySQL database. The same idea shows up through inspectable project surfaces.

**Previously:** The previous lesson, `213 PostgreSQL`, gave you the setup this page builds on. Here, the focus shifts to `MySQL` so you can place the next Stackpress surface in the course path.

## 214.1. The Decision

MySQL can run the same product ideas, but the SQL family is different. This lesson helps you separate the parts of the app that stay Stackpress-shaped from the parts that depend on a MySQL connection.

## 214.2. When MySQL Fits

Use the MySQL public path:

```ts
import { connect } from 'stackpress/mysql';
```

Register the connection during config:

```ts
server.on('config', async () => {
  const connection = await connect();
  server.register('database', connection);
});
```

Then run the normal database commands:

```bash
stackpress push --b config -v
stackpress populate --b config -v
```

This is the smallest useful version of the idea. Once you can name the moving parts here, the larger version is easier to inspect and debug.

## 214.3. Connection Config

You changed the connector Stackpress uses to talk to the database. Routes, generated stores, events, and views should continue to use the app-facing Stackpress workflow.

## 214.4. Migration Or Push Flow

This part of the MySQL workflow is easier to follow when the smaller pieces are compared together. The subsections cover MySQL Dialect, Connection Options, Raw SQL Caution, so the reader can see how each piece changes the local decision.

### 214.4.1. MySQL Dialect

The MySQL dialect handles SQL differences that matter when Stackpress builds or executes statements for MySQL. Keep that role in mind as the lesson moves into the concrete shape.

### 214.4.2. Connection Options

MySQL needs the correct host, port, user, password, and database settings. Keep those settings outside committed source when they contain secrets.

### 214.4.3. Raw SQL Caution

Raw SQL is more dialect-sensitive than generated events or builders. Recheck raw SQL when moving between database families.

## 214.5. Tradeoffs

This part of the MySQL workflow is easier to follow when the smaller pieces are compared together. The subsections cover Configure Secrets, Verify Generated Queries, Keep Local Development Predictable, so the reader can see how each piece changes the local decision.

### 214.5.1. Configure Secrets

Read MySQL connection settings from environment variables in your connection helper. The nearby example or check shows the project detail affected by this idea.

### 214.5.2. Verify Generated Queries

Run the app's search and create events after switching connections, then inspect database state with `query`. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 214.5.3. Keep Local Development Predictable

If the team develops locally with PGlite but deploys to MySQL, document the difference and test MySQL before release. The local example shows why that choice matters in an app.

## 214.6. Verify

The important checkpoint is knowing where MySQL belongs in the Stackpress workflow. Compare the concrete details to see the practical meaning.

**Next step:** Read `231 Raw SQL` before writing database-specific statements. For exact MySQL exports, use [MySQL Reference](/reference/mysql). It should feel like the next course step, not a separate reference detour.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `221 Select`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
