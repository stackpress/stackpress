# 231 Raw SQL

Use raw SQL only when generated events or builders do not cover the query you need. Keep the idea tied to the concrete project surface in this section.

**Previously:** The previous lesson, `224 Delete`, gave you the setup this page builds on. Here, the focus shifts to `Raw SQL` so you can place the next Stackpress surface in the course path.

## 231.1. Operation Goal

Raw SQL is the sharp tool in the drawer. It solves problems builders and generated actions cannot express cleanly, but it also makes dialect mistakes and unsafe inputs easier to introduce.

## 231.2. When Raw SQL Is Appropriate

Use this decision order:

 1. Try a generated search, create, update, or delete event.
 2. Try the SQL builder surface.
 3. Use raw SQL only for a specific query that cannot be expressed cleanly above.

Then verify the query against the actual configured database. That is why this detail appears in the lesson before reference material.

## 231.3. Write The Query

You kept the app-facing workflow first and treated raw SQL as an escape hatch. That lowers the chance of dialect drift and unsupported assumptions.

## 231.4. Bind Inputs

This part of the Raw SQL workflow is easier to follow when the smaller pieces are compared together. The subsections cover Raw SQL, Dialect Risk, Verification, so the reader can see how each piece changes the local decision.

### 231.4.1. Raw SQL

Raw SQL is a statement you write directly for the database. It may depend on PostgreSQL, MySQL, SQLite, or PGlite syntax.

### 231.4.2. Dialect Risk

Raw SQL can break when the app changes database family. It also bypasses some generated conventions.

### 231.4.3. Verification

Always run raw SQL in the target environment before relying on it in app code. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 231.5. Verify Data

This part of the Raw SQL workflow is easier to follow when the smaller pieces are compared together. The subsections cover Inspect Data, Keep Raw SQL Localized, Document The Reason, so the reader can see how each piece changes the local decision.

### 231.5.1. Inspect Data

Use terminal query mode for inspection:

```bash
stackpress query "SELECT * FROM product" --b config -v
```

In this example, the useful part is the value being passed, returned, or configured. That is usually the first thing a developer changes when adapting the pattern.

### 231.5.2. Keep Raw SQL Localized

Put raw SQL in a focused event or helper. Do not scatter raw statements across view files.

### 231.5.3. Document The Reason

Add a short comment explaining why generated events or builders were not enough. The same idea shows up through inspectable project surfaces.

## 231.6. Common Mistakes

Raw SQL mistakes usually happen when the route forgets the product rule behind the database operation. Keep the query narrow, keep user input controlled, and make the response show what happened.

### 231.6.1. Building SQL With String Concatenation

```ts
const sql = `select * from users where email = '${email}'`;
```

This mixes user input into SQL text, which is unsafe. Bind inputs through the query API instead of concatenating values into the SQL string.

### 231.6.2. Scattering Raw SQL Everywhere

```ts
await db.query(customSql);
```

Raw SQL is easier to review when it stays close to the special case that needs it. Keep it localized so most data access can still use generated events or query builders.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `232 Transactions`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
