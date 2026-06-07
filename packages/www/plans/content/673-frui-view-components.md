# 673 frui View Components

Render typed data with the display component that matches its schema metadata. The same idea shows up through inspectable project surfaces.

**Previously:** The previous lesson, `672 frui Form Components`, gave you the setup this page builds on. Here, the focus shifts to `frui View Components` so you can place the next Stackpress surface in the course path.

## 673.1. Use Case

Display components answer a different question than forms: how should this value be shown? View attributes help generated output render dates, prices, images, templates, and other value types consistently.

## 673.2. Minimal View Component

Add display metadata:

```idea
price Float
      @label("Price")
      @field.price
      @list.price
      @view.price
```

Regenerate and inspect the generated view output. Keep the idea tied to the concrete project surface in this section.

## 673.3. Data And Props

The field now has form, list, and detail display behavior. Generated view code can render the value using a matching component.

## 673.4. Common Patterns

This part of the frui View Components workflow is easier to follow when the smaller pieces are compared together. The subsections cover View Component, List Component, Template View, so the reader can see how each piece changes the local decision.

### 673.4.1. View Component

`@view.*` describes detail or display rendering. The example gives the decision enough context to evaluate it.

### 673.4.2. List Component

`@list.*` describes list/search rendering. Use the check to make the idea visible before moving to the next topic.

### 673.4.3. Template View

Template components can render related data or combined values such as `{{profile.name}}`. The same idea shows up through inspectable project surfaces.

## 673.5. Mistakes To Avoid

View component mistakes usually come from displaying raw values when the user needs formatted values. Pick display metadata that explains how the value should appear.

### 673.5.1. Render A Date As Raw Text

```tsx
<span>{row.createdAt}</span>
```

Raw date values are often hard for users to scan. Use `@view.date(...)` or `@list.date(...)` with a format when generated display should format dates.

### 673.5.2. Render An Image URL As Text

```tsx
<span>{row.image}</span>
```

The URL may be useful to a developer, but the user expects to see the image. Use image view or list metadata when a field stores an image URL.

### 673.5.3. Display A Related ID Instead Of A Label

```tsx
<span>{row.categoryId}</span>
```

An ID is usually not meaningful to the user. Use template metadata when the field should display a related model's readable value.

## 673.6. Reference Pointers

The checkpoint is simple: you can point to where frui View Components shows up and explain why it matters. The nearby check shows the project-level consequence.

**Next step:** Read `533 View Output` to trace display metadata into generated files. It should feel like the next course step, not a separate reference detour.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `680 API / OAuth`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
