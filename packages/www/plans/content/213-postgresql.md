# 213 PostgreSQL

Switch from local data to a PostgreSQL connection when your deployment or team workflow needs a real PostgreSQL database. Compare the concrete details to see the practical meaning.

**Previously:** The previous lesson, `212 SQLite / PGlite`, gave you the setup this page builds on. Here, the focus shifts to `PostgreSQL` so you can place the next Stackpress surface in the course path.

## 213.1. The Decision

Moving from local data to PostgreSQL should not change the whole app. The connection changes, but the ideas of dialect, generated actions, schema push, and verification stay familiar.

## 213.2. When PostgreSQL Fits

Use the PostgreSQL public path when creating a PostgreSQL connection:

```ts
import { connect } from 'stackpress/pgsql';
```

Register the connection during config just like the local PGlite template does:

```ts
server.on('config', async () => {
  const connection = await connect();
  server.register('database', connection);
});
```

Keep database credentials in environment variables, then read them in the connection helper. The examples below turn the concept into concrete Stackpress project surfaces.

## 213.3. Connection Config

The app still registers one database connection for Stackpress to use. The main change is the connector and connection settings.

## 213.4. Migration Or Push Flow

This part of the PostgreSQL workflow is easier to follow when the smaller pieces are compared together. The subsections cover PostgreSQL Connection, Environment Settings, Same Workflow, so the reader can see how each piece changes the local decision.

### 213.4.1. PostgreSQL Connection

The PostgreSQL connection talks to an external PostgreSQL database instead of a local file-backed PGlite database. That is why this detail appears in the lesson before reference material.

### 213.4.2. Environment Settings

Production database URLs, usernames, passwords, and host settings should come from environment variables or deployment secrets. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 213.4.3. Same Workflow

After the connection is configured, the core commands stay familiar:

```bash
stackpress push --b config -v
stackpress populate --b config -v
stackpress query --b config -v
```

This example keeps the first version narrow on purpose. Once this shape is clear, the surrounding section can add options without making the first step harder to follow.

## 213.5. Tradeoffs

This part of the PostgreSQL workflow is easier to follow when the smaller pieces are compared together. The subsections cover Move From PGlite To PostgreSQL, Verify The Connection, Keep Local And Production Separate, so the reader can see how each piece changes the local decision.

### 213.5.1. Move From PGlite To PostgreSQL

Change the connection helper first. Leave generated schema, routes, and views alone until the connection works.

### 213.5.2. Verify The Connection

Run `stackpress query --b config -v` with a simple query or use the app's known search event. The same idea shows up through inspectable project surfaces.

### 213.5.3. Keep Local And Production Separate

Use separate config files or environment variables so local development does not write to production data. The nearby check shows the project-level consequence.

## 213.6. Verify

The checkpoint is simple: you can point to where PostgreSQL shows up and explain why it matters. The example gives the idea a concrete file, command, or code shape.

**Next step:** Read `234 Schema Changes` before changing production schema. For exact PostgreSQL exports, use [PostgreSQL Reference](/reference/pgsql). That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `214 MySQL`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
