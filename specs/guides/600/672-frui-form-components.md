# 672 frui Form Components

Forms are where a model stops being an abstract shape and starts asking a user
for input. Stackpress can generate form components from idea metadata, which
means the field definition becomes the source of labels, input type, default
value handling, relation search behavior, and validation messages.

## 672.1. Use Case

Use form components when the page needs a user to enter or choose data. In a
generated admin surface, the app should not guess whether `banner` is plain
text, a URL, a date, a select box, or a relation picker.

A scaffolded app shows this in `schema.idea`:

```idea
title       String
            @label("Title")
            @searchable
            @field.string
            @is.required("Title is required")
            @list.string @view.string
```

This field says that `title` is a string, should render as a string input, and
must be present. The generated form component uses that metadata to create a
field control with a translated label and an input that reports updates under
the `title` name.

## 672.2. Generated Field Shape

After generation, the title field becomes a component in
`client-source/Article/components/form/TitleFormField.tsx`. The
field component handles the actual input, while the control component wraps it
with a label and error display.

```tsx
export function TitleFormField(props: TitleFormFieldProps) {
  const { className, name = 'title', value, onUpdate, error = false } = props;
  const attributes = {};

  return (
    <Input
      {...attributes}
      name={name}
      className={className}
      error={error}
      defaultValue={value}
      onUpdate={(value) => onUpdate && onUpdate('title', value)}
    />
  );
}
```

This generated component uses `Input` from `frui/form/Input`. The key detail is
the `onUpdate` callback: when the input changes, the form receives the value
under the schema field name `title`.

The paired control adds the label and error wrapper:

```tsx
export function TitleFormFieldControl(props: TitleFormFieldControlProps) {
  const { className, name, value, onUpdate, error, required } = props;
  const { _ } = useLanguage();
  const label = _('Title') + (required ? '*' : '');

  return (
    <FieldControl label={label} error={error} className={className}>
      <TitleFormField
        error={typeof error === 'string'}
        name={name}
        value={value}
        onUpdate={onUpdate}
      />
    </FieldControl>
  );
}
```

This wrapper explains why labels and error messages belong to the form
component family. The input collects the value, and `FieldControl` gives the
value a readable label and a place to show validation feedback.

## 672.3. Field Metadata Changes The Input

Different `@field.*` attributes generate different Frui form components. A
URL field still uses `Input`, but it passes URL-specific attributes. A select
field uses `Select`, and an editor field uses `TextEditor`.

```idea
banner      String?
            @label("Banner")
            @field.url
```

This metadata does not only describe the database value. It tells generated UI
that the value should be entered as a URL, so the generated component sets
`type: 'url'`.

```tsx
const attributes = { type: 'url' };

return (
  <Input
    {...attributes}
    name={name}
    className={className}
    error={error}
    defaultValue={value}
    onUpdate={(value) => onUpdate && onUpdate('banner', value)}
  />
);
```

The example shows a small but important change. The same Frui input family is
used, but the generated attributes now match the shape of a URL instead of an
ordinary text value.

## 672.4. Relation Fields Need More Behavior

Relation fields need more than a text box because the user should choose a
related record, not memorize an ID. The `Article.profileId` field uses
relation metadata with a search route and a display template.

```idea
profileId   String
            @label("Profile")
            @field.relation({
              id "id"
              search "/admin/profile/search?json&q={{query}}"
              template "{{name}}"
            })
            @is.required("Profile is required")
```

This metadata gives the generated component enough information to fetch
options from the profile search route. It also tells the component to show the
profile `name` while storing the selected profile `id`.

```tsx
fetch(
  '/admin/profile/search?json&q={{query}}'.replace('{{query}}', query)
)
  .then((response) => response.json())
  .then((response) => {
    updateOptions(
      response.results.map((row: Record<string, unknown>) => ({
        label: template.render('{{name}}', row),
        value: row.id
      }))
    );
  });
```

This generated code turns the relation metadata into a searchable select. The
visible option label comes from the template, while the stored value stays tied
to the related row's `id`.

## 672.5. Mistakes To Avoid

Form mistakes usually come from choosing an input by appearance instead of by
data behavior. The right field component should communicate what the user is
entering, how the value is validated, and how the form stores the result.

### 672.5.1. Use A Generic String For A URL

```idea
banner String
        @field.string
```

This would let the field render as ordinary text, but the source material shows
`banner` as `@field.url`. Use URL metadata when the value is expected to be a
URL, because the generated component can pass URL-specific input attributes.

### 672.5.2. Treat A Relation Like Plain Text

```idea
profileId String
          @field.string
```

This would ask the user to type an ID, which is not how most users think about
related records. Use `@field.relation` when the UI should search for another
model and store that model's ID behind a readable label.

### 672.5.3. Forget The Control Wrapper

```tsx
return <TitleFormField value={value} onUpdate={onUpdate} />;
```

This renders the input but skips the label and error wrapper generated by
`TitleFormFieldControl`. Use the control when the page needs the complete
field experience, because `FieldControl` is where the user sees what the input
means and whether validation failed.

## 672.6. Reference Pointers

Start with `schema.idea` when you need to understand why a form
component was generated. Then inspect
`client-source/Article/components/form` to see the concrete
Frui component, props, and update behavior.

The generator code lives under `packages/stackpress-view/src/transform/form`.
Use it when you need to understand generation rules, but use generated output
first when you are learning what a real app receives.

**Learning checkpoint:** You should now be able to trace a form input from
`@field.*` metadata to generated React code. The important shift is that the
schema field is not only a data field; it also becomes the source for the
input component the user sees.

**Next course:** Continue with `frui View Components`. The next page uses the
same source-to-output habit, but it focuses on displaying values instead of
collecting them.
