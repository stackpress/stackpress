# 223 Update

Update an existing row by ID or another unique value while keeping request validation explicit. The examples stay practical by tying the idea to something you can run, change, or verify.

**Previously:** The previous lesson, `222 Insert`, gave you the setup this page builds on. Here, the focus shifts to `Update` so you can place the next Stackpress surface in the course path.

## 223.1. Operation Goal

Changing existing data is more delicate than creating it because the route must identify the right row first. Update actions combine an identifier, the changed values, and any permission checks needed before writing.

## 223.2. Inputs

Use an update event:

```ts
import { action } from 'stackpress/server';

export default action(async function RenameProductPage({ req, res, ctx }) {
  if (req.method !== 'POST') {
    return;
  }

  const id = req.data('id');
  const title = req.data('title');

  await ctx.resolve('product-update', {
    id,
    title
  });

  res.redirect('/products');
});
```

Use this as the concrete version of the explanation above. The part to copy is the structure; the part to change is the value that matches your app.

## 223.3. Find The Row

The route used request data to identify a row and send changed values to a generated update event. Keep that role in mind as the lesson moves into the concrete shape.

## 223.4. Apply Changes

This part of the Update workflow is easier to follow when the smaller pieces are compared together. The subsections cover Identifier, Partial Change, Permission Check, so the reader can see how each piece changes the local decision.

### 223.4.1. Identifier

An update needs a reliable way to find the row, usually an ID or unique field. The nearby example or check shows the project detail affected by this idea.

### 223.4.2. Partial Change

Only send values the action should change. Avoid overwriting fields just because they were omitted from a form.

### 223.4.3. Permission Check

Update routes should check whether the current visitor can change the selected row before writing. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 223.5. Verify Data

This part of the Update workflow is easier to follow when the smaller pieces are compared together. The subsections cover Update By ID, Update A Cart Line, Verify The Change, so the reader can see how each piece changes the local decision.

### 223.5.1. Update By ID

Use the model ID when the form or route already knows it. The local example shows why that choice matters in an app.

### 223.5.2. Update A Cart Line

The store template updates an existing cart item when the same product is already in the cart, then redirects to `/cart`. Compare the concrete details to see the practical meaning.

### 223.5.3. Verify The Change

Query the row or reload the detail page after the update. The examples below turn the concept into concrete Stackpress project surfaces.

## 223.6. Common Mistakes

Update mistakes usually happen when the route forgets the product rule behind the database operation. Keep the query narrow, keep user input controlled, and make the response show what happened.

### 223.6.1. Updating Without An Identifier

```ts
await ctx.resolve('product-update', { name });
```

An update needs to know which row should change. Include an identifier or filter before applying changes, otherwise the action cannot safely target one record.

### 223.6.2. Trusting Ownership From The Form

```ts
await ctx.resolve('profile-update', { id: req.post.get('id'), role });
```

A hidden form field can be changed by the user. Use session or permission checks to confirm the current visitor can update the selected record.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `224 Delete`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
