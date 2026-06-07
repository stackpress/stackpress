# 233 JSON Fields

Store metadata in JSON fields and filter it carefully when structured columns are not the right fit. Use the check to make the idea visible before moving to the next topic.

**Previously:** The previous lesson, `232 Transactions`, gave you the setup this page builds on. Here, the focus shifts to `JSON Fields` so you can place the next Stackpress surface in the course path.

## 233.1. Modeling Goal

Not every useful value deserves its own column on day one. JSON fields are a flexible pocket for metadata and small nested structures, but they should still be used intentionally.

## 233.2. Idea Example

Add a JSON-like field in `schema.idea`:

```text
references Hash?
          @label("References")
          @default({})
          @field.metadata({ add "Add Reference" })
          @view.metadata The examples stay practical by tying the idea to something you can run, change, or verify.
```

Use it as metadata:

```ts
await ctx.resolve('article-update', {
  id,
  references: {
    fbid: 'abc123'
  }
});
```

This is the smallest useful version of the idea. Once you can name the moving parts here, the larger version is easier to inspect and debug.

## 233.3. Generated Effect

The schema stores flexible key-value data in one field. The field component metadata can also tell generated views how to edit or display it.

## 233.4. Query JSON Data

This part of the JSON Fields workflow is easier to follow when the smaller pieces are compared together. The subsections cover JSON-Like Field, Metadata, Filtering, so the reader can see how each piece changes the local decision.

### 233.4.1. JSON-Like Field

Stackpress idea files can model flexible structures such as `Hash`. Use them when the shape is intentionally open.

### 233.4.2. Metadata

Metadata is supporting data about a record. It should not replace important first-class fields such as status, title, owner, or price.

### 233.4.3. Filtering

Filtering nested JSON values can be more database-specific than filtering normal columns. Verify the query against the configured dialect.

## 233.5. Inspect Output

This part of the JSON Fields workflow is easier to follow when the smaller pieces are compared together. The subsections cover Store References, Promote Important Keys, Inspect Output, so the reader can see how each piece changes the local decision.

### 233.5.1. Store References

Use a hash field for external IDs or source references that vary by integration. That context prepares the reader for the more specific form that follows.

### 233.5.2. Promote Important Keys

If a JSON key becomes central to search, permissions, or reporting, promote it to a real field. Keep the idea tied to the concrete project surface in this section.

### 233.5.3. Inspect Output

After changing a JSON-like field, rerun generation and inspect client output. The nearby example or check shows the project detail affected by this idea.

## 233.6. Next Step

Use JSON Fields as a guide for choosing which file, command, or generated output to inspect next. Compare the concrete details to see the app-level effect.

Read `522 Fields` and `526 Attributes` when deciding whether a value belongs as a normal field or metadata. Use that page to keep moving through the learning path before switching into reference mode.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `234 Schema Changes`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
