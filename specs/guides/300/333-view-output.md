# 333 View Output

Inspect generated view-facing files when a generated form, list cell, detail field, or admin page looks wrong. View output matters because schema metadata such as `@field.*`, `@list.*`, and `@view.*` becomes concrete React components after generation.

**Previously:** The previous course, `SQL Output`, followed `Article` into store, action, and event files. This course follows the same model into generated UI surfaces.

## 333.1. Where To Look

A scaffolded app generates view-facing Article files under `components` and `admin`. Start with one field so the amount of output stays understandable.

```text
client-source/Article/components/form/TitleFormField.tsx
client-source/Article/components/list/TitleListFormat.tsx
client-source/Article/components/view/TitleViewFormat.tsx
client-source/Article/admin/routes.ts
```

The form file comes from field/input metadata, the list file comes from list display metadata, the view file comes from detail display metadata, and the admin routes file wires generated pages and views into admin URLs. Reading those files together shows which part of the schema affected each visible surface.

## 333.2. Form Output

`TitleFormField.tsx` renders a generated input and a field control label. The file uses the field name `title`, passes updates back through `onUpdate`, and builds the label from the generated `Title` label.

```tsx
<Input
  name={name}
  className={className}
  error={error}
  defaultValue={value}
  onUpdate={(value) => onUpdate && onUpdate('title', value)}
/>
```

This example shows what `@field.string` becomes for the title field. The generated form component knows which model property to update, so the form can write `title` without handwritten input wiring.

## 333.3. List And Detail Output

The generated title list and view format files both use `TextTransform`. They receive the row data and the current field value, then render the formatted value.

```tsx
const attributes = { data, ...{ format: 'none' } };
return <TextTransform {...attributes} value={value} />;
```

This example is the generated result of string display metadata. If a list cell or detail display looks wrong, trace the generated formatter back to the field's `@list.*` or `@view.*` metadata before editing the component.

## 333.4. Admin Route Output

`Article/admin/routes.ts` registers generated admin page routes such as create, search, detail, remove, restore, and update. When `client.module` is configured, the same file also registers generated view modules for those routes.

```ts
server.import.get(`${base}/article/search`, () => import('./pages/search.js'));
server.view.get(
  `${base}/article/search`,
  `${module}/Article/admin/views/search`,
  -100
);
```

This example shows the page-handler side and view-module side working together. A generated admin page is incomplete if the route handler exists but the matching view is not registered for the client module path.

## 333.5. Mistakes To Avoid

Generated view files are useful because they show what the field metadata
became. Treat them as inspection targets first, then fix the idea attributes
that produced the wrong UI.

### 333.5.1. Patch The Generated Input

```tsx
<Input name={name} placeholder="Article title" />
```

Adding a placeholder directly to `TitleFormField.tsx` may appear to solve the
current form, but generated TSX can be replaced. If the label, input type, list
formatter, or detail formatter is wrong, fix the idea attribute that generated
it and run generation again.

### 333.5.2. Inspect Only The Admin Page

```text
/admin/article/update/:id shows the wrong title field.
```

The visible page is only the final symptom. Check the generated form, list, and
view files for the field so you can identify whether the problem came from
`@field.*`, `@list.*`, `@view.*`, or the admin route/view wiring.

### 333.5.3. Mix Up Generated And Handwritten Views

```text
plugins/app/views/home.tsx
client-source/Article/admin/views/search.tsx
```

These files live in different ownership areas. Handwritten app views belong to
local plugins, while generated admin views live in `client-source` and should
be fixed through idea source or generator behavior.

**Learning checkpoint:** Before moving on, make sure you can point from a field's `@field.*`, `@list.*`, and `@view.*` metadata to generated form, list, and detail files. You should also know where generated admin routes bind page handlers and view modules.

**Next course:** Continue with `Client Output`. That course zooms out from one model and shows the generated client package surface.
