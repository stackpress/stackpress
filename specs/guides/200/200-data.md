# 200 Data

Data turns a Stackpress app from a page that can answer into a product that can
remember. Once the route and view loop is familiar, database work becomes the
next practical question: where do records live, how does app code read them,
and how do you verify that the right rows changed?

**Previously:** `Debugging And Inspection` closed the first runtime loop by
teaching where to look when something breaks. Here, the focus shifts to the
database layer that routes, events, generated stores, and admin pages can use.

## 200.1. Why Data Comes After Development

Database work is easier when you already know how a route answers a request.
Once the handler flow is familiar, selecting, inserting, updating, and deleting
records become steps inside a route or event rather than isolated SQL commands.

A scaffolded app gives this level a concrete anchor. Its store plugin creates
a PGlite-backed engine from `DATABASE_URL` or `./.build/database`, then
registers that engine as `database` during the `config` lifecycle.

## 200.2. What This Level Covers

This level covers `210` through `233`. It starts with connection choices,
because query code needs a real database target before operation examples can
mean anything.

After connections, the engine pages explain the query starting point. Then the
operation and querying pages cover select, insert, update, delete, raw SQL,
transactions, and JSON fields.

## 200.3. The Local Data Anchor

In `plugins/store/connect.ts`, the connection helper resolves the local
database path and creates the directory when needed:

```ts
const url = process.env.DATABASE_URL || './.build/database';
```

That value becomes the local database location unless the environment overrides
it. This gives the course a concrete place to point when it says to inspect or
reset local data.

## 200.4. Course Path

Read `210 Connections` before the operation pages. A beginner-friendly data
path starts with a known local database, then adds query behavior one operation
at a time.

 - `210 Connections` introduces database choices and the store plugin.
 - `220 Engine` explains the query starting point.
 - `230 Querying` previews raw SQL, template SQL, and transactions.
 - `233 JSON Fields` closes the level with flexible nested data queries.

## 200.5. What To Keep In Mind

Data pages should always connect back to a product action. A select loads
records for a page, an insert creates something from form input, an update
changes an existing row, and a delete needs extra care because it removes
information.

The course does not replace a full SQL reference. It teaches the
Stackpress-facing workflow so you know where database code belongs and how to
verify that it changed the right records.

**Learning checkpoint:** Before moving on, make sure you can explain why a
database connection comes before query examples. You should also know that a
scaffolded app's local database defaults to `./.build/database`.

**Next course:** Continue with `Connections`. That course shows how app code
gets an engine pointed at a database.
