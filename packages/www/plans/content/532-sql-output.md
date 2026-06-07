# 532 SQL Output

Use generated stores and actions from route or event code instead of hand-writing common CRUD SQL. The example gives the idea a concrete file, command, or code shape.

**Previously:** The previous lesson, `531 Schema Output`, gave you the setup this page builds on. Here, the focus shifts to `SQL Output` so you can place the next Stackpress surface in the course path.

## 532.1. What You Are Looking For

SQL output is where schema turns into data access helpers and actions. Most app code should use those generated paths before reaching for direct builders or raw SQL.

## 532.2. Where SQL Output Lives

Use generated events through the app context:

```ts
const products = await ctx.resolve('product-search', {
  eq: { active: true }
});

res.results({ products: products.results || [] });
```

This example keeps the first version narrow on purpose. Once this shape is clear, the surrounding section can add options without making the first step harder to follow.

## 532.3. Inspect Stores And Actions

The route did not build SQL directly. It called generated behavior that knows the model, fields, and database connection.

## 532.4. Expected Evidence

This part of the SQL Output workflow is easier to follow when the smaller pieces are compared together. The subsections cover Store, Action, Query Selector, so the reader can see how each piece changes the local decision.

### 532.4.1. Store

A generated store is model-facing data access output. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 532.4.2. Action

A generated action is an event-style operation such as search, create, update, detail, or delete. That context prepares the reader for the more specific form that follows.

### 532.4.3. Query Selector

Selectors and filters describe what records or fields the generated action should return. Keep the idea tied to the concrete project surface in this section.

## 532.5. Fix The Source

This part of the SQL Output workflow is easier to follow when the smaller pieces are compared together. The subsections cover Search Records, Create Or Update Records, and Inspect Generated SQL Behavior, so the reader can see how each piece changes the local decision.

### 532.5.1. Search Records

Use `<model>-search` for list pages and filters. The nearby example or check shows the project detail affected by this idea.

### 532.5.2. Create Or Update Records

Use generated create and update events from action routes. Compare the concrete details to see the app-level effect.

### 532.5.3. Inspect Generated SQL Behavior

If behavior is unclear, inspect generated output and run the related terminal event. The following example gives the idea a concrete project shape.

## 532.6. Next Step

The useful shift is recognizing SQL Output as a pattern in files, commands, and runtime behavior. The examples stay practical by tying the idea to something you can run, change, or verify.

Read `533 View Output` to understand schema-driven view pieces. Read it as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `533 View Output`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
