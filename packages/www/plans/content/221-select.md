# 221 Select

Query records for page rendering and return the results through the route response. A select operation is the read side of an app: the user asks to see records, and the route decides which records belong in the answer.

**Previously:** The previous lesson, `214 MySQL`, gave you the setup this page builds on. Here, the focus shifts to `Select` so you can place the next Stackpress surface in the course path.

## 221.1. Operation Goal

A page becomes useful when it can show real records. Selecting data is the read side of the app: choose the records, store them in the response, and let the view render them.

## 221.2. Inputs

Use a generated search event:

```ts
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';

export default action(async function ProductIndexPage({ req, res, ctx }) {
  const products = await ctx.resolve('product-search', {
    eq: { active: true }
  });

  res.results({ products: products.results || [] });
  setViewProps(req, res, ctx);
});
```

The handler asks the app context to run `product-search` with a filter for active products. After the event returns, the route stores the selected records in `res.results()` so the view has a predictable payload to read.

## 221.3. Build The Select

The route asked the app context to run `product-search`. The generated event queried the database and returned results. The route then stored those records in the response.

## 221.4. Return Results

This section separates the three jobs inside a list route. The search event fetches records, the filter input narrows those records, and response results make the selected records available to the next rendering step.

### 221.4.1. Search Event

A generated search event is the normal starting point for listing records from a model. Use it before reaching for raw SQL because the generated event already understands the model shape.

### 221.4.2. Filter Input

Filter input such as `eq: { active: true }` narrows the result set. Without a filter, the route may return records that do not belong on the current page.

### 221.4.3. Response Results

Use `res.results(...)` to make selected records available to the view or API response. The response should name the payload clearly so the view can read `products` without guessing what the route returned.

## 221.5. Verify Data

This section shows how to check a select route from three angles. Confirm the filter, confirm the response payload, then inspect the query path when the records are not what you expected.

### 221.5.1. Filter Active Records

```ts
await ctx.resolve('product-search', {
  eq: { active: true }
});
```

This filter is the part that turns a broad product search into a page-specific product list. Change the filter and you change which records the route is allowed to return.

### 221.5.2. Render Later

Return records through `res.results(...)`, then read them with `useResponse()` in the view. Keeping that handoff explicit makes it easier to debug whether a missing record is a data problem or a rendering problem.

### 221.5.3. Inspect The Query

If results are wrong, emit the search event from the terminal or run `stackpress query --b config -v`. That check moves the question away from the page and toward the data operation itself.

## 221.6. Common Mistakes

Select mistakes usually happen when the route forgets the product rule behind the database operation. Keep the query narrow, keep user input controlled, and make the response show what happened.

### 221.6.1. Forgetting Filters

```ts
const products = await ctx.resolve('product-search');
```

This reads every matching product the event allows, which can be too broad for a page. Add filters such as `eq: { active: true }` when the page should show only a specific slice of records.

### 221.6.2. Returning Raw Event Output

```ts
res.results(products);
```

The generated event may include metadata the view does not need. Put the records into a named payload, such as `res.results({ products: products.results || [] })`, so the view reads a clear shape.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `222 Insert`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
