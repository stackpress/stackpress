# 224 Delete

Delete a row from an action route and require a clear confirmation before the destructive change. The nearby example or check shows the project detail affected by this idea.

**Previously:** The previous lesson, `223 Update`, gave you the setup this page builds on. Here, the focus shifts to `Delete` so you can place the next Stackpress surface in the course path.

## 224.1. Operation Goal

Delete routes deserve extra caution because they remove something the user may not be able to recover. A good delete flow slows down long enough to confirm intent before it writes.

## 224.2. Inputs

Use a generated delete event:

```ts
import { action } from 'stackpress/server';

export default action(async function DeleteProductPage({ req, res, ctx }) {
  if (req.method !== 'POST') {
    return;
  }

  const id = req.data('id');
  const confirmed = req.data('confirm') === 'delete';

  if (!confirmed) {
    res.setError('Confirmation is required.', {
      confirm: 'Type delete to confirm.'
    }, [], 400);
    return;
  }

  await ctx.resolve('product-delete', { id });
  res.redirect('/products');
});
```

This example gives the idea something concrete to inspect. Look for the file, helper, or value that changed; that is the part you would adjust first in your own app.

## 224.3. Find The Row

The route refused to delete until confirmation was present. After the generated delete event ran, the browser redirected away from the deleted record.

## 224.4. Delete Or Soft Delete

This part of the Delete workflow is easier to follow when the smaller pieces are compared together. The subsections cover Destructive Action, Confirmation, Cascades, so the reader can see how each piece changes the local decision.

### 224.4.1. Destructive Action

A destructive action removes data or makes it unavailable. Treat it as higher risk than update.

### 224.4.2. Confirmation

Confirmation can be a form field, button flow, role check, or separate page. The important point is that accidental deletes should be hard.

### 224.4.3. Cascades

Relations may have database cascade rules. Check schema config before deleting records that other records depend on.

## 224.5. Verify Data

This part of the Delete workflow is easier to follow when the smaller pieces are compared together. The subsections cover Delete By ID, Redirect After Delete, Audit Related Data, so the reader can see how each piece changes the local decision.

### 224.5.1. Delete By ID

Send the ID from the page or form and delete only that row. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 224.5.2. Redirect After Delete

Redirect to a list or parent page after deletion. Do not leave the browser on a detail page for a missing record.

### 224.5.3. Audit Related Data

Before deleting important records, inspect related models and relation rules. The local example shows why that choice matters in an app.

## 224.6. Common Mistakes

Delete mistakes usually happen when the route forgets the product rule behind the database operation. Keep the query narrow, keep user input controlled, and make the response show what happened.

### 224.6.1. Deleting Without A Guard

```ts
await ctx.resolve('product-delete', { id: req.data('id') });
```

A delete route should confirm that the target exists and that the current user may remove it. Treat destructive writes as a permission decision, not just a database call.

### 224.6.2. Using Hard Delete When Soft Delete Fits

```ts
await ctx.resolve('product-delete', { id });
```

Hard delete removes the record from normal recovery paths. If the product needs history, moderation, or undo behavior, update a status field instead of removing the row immediately.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `231 Raw SQL`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
