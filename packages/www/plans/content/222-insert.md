# 222 Insert

Create a record from a route action and redirect after the write succeeds. Keep that role in mind as the lesson moves into the concrete shape.

**Previously:** The previous lesson, `221 Select`, gave you the setup this page builds on. Here, the focus shifts to `Insert` so you can place the next Stackpress surface in the course path.

## 222.1. Operation Goal

Writing data is where routes start to affect the app's state. Insert actions take user input, validate the shape enough to trust it, create a record, and move the browser away from accidental resubmission.

## 222.2. Inputs

Handle a form submission:

```ts
import { action } from 'stackpress/server';

export default action(async function CreateProductPage({ req, res, ctx }) {
  if (req.method !== 'POST') {
    return;
  }

  const title = req.data('title');
  const slug = req.data('slug');

  await ctx.resolve('product-create', {
    title,
    slug,
    active: true
  });

  res.redirect('/products');
});
```

This example keeps the first version narrow on purpose. Once this shape is clear, the surrounding section can add options without making the first step harder to follow.

## 222.3. Build The Insert

The route read form data, called a generated create event, and redirected after the write. The redirect prevents the browser from resubmitting the form on refresh.

## 222.4. Return Or Redirect

This part of the Insert workflow is easier to follow when the smaller pieces are compared together. The subsections cover Create Event, Request Validation, Redirect After Write, so the reader can see how each piece changes the local decision.

### 222.4.1. Create Event

A create event writes a new record for a model. Generated app events usually follow names such as `<model>-create`.

### 222.4.2. Request Validation

Do not insert unvalidated user input. Use required checks, schema validation, or action-level validation before writing.

### 222.4.3. Redirect After Write

Redirect after successful writes to keep browser behavior predictable. The nearby example or check shows the project detail affected by this idea.

## 222.5. Verify Data

This part of the Insert workflow is easier to follow when the smaller pieces are compared together. The subsections cover Create With Defaults, Show A Validation Error, Verify The Row, so the reader can see how each piece changes the local decision.

### 222.5.1. Create With Defaults

Only pass values the action needs. Defaults from `schema.idea` can fill generated fields such as IDs or timestamps when configured.

### 222.5.2. Show A Validation Error

If required data is missing, set an error response and render the form again instead of calling the create event. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 222.5.3. Verify The Row

Use `stackpress query --b config -v` or emit the generated search event. The local example shows why that choice matters in an app.

## 222.6. Common Mistakes

Insert mistakes usually happen when the route forgets the product rule behind the database operation. Keep the query narrow, keep user input controlled, and make the response show what happened.

### 222.6.1. Writing Unvalidated Body Data

```ts
await ctx.resolve('product-create', req.data());
```

This sends every submitted value into the create action, including fields the route may not expect. Read the specific fields you need, validate them, then pass a controlled object to the action.

### 222.6.2. Forgetting The Post-Create Response

```ts
await ctx.resolve('product-create', input);
```

The insert can succeed while the browser still has no clear next page. Return a result or redirect after the write so the user sees what changed.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `223 Update`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
