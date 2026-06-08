# 673 frui View Components

View components answer the question a form does not answer: once the value has
been saved, how should the user see it? A raw date, image URL, relation ID, or
HTML string may be technically correct, but it often needs formatting before
it is useful on a list or detail page.

## 673.1. Use Case

Use view components when generated output needs to present typed data clearly.
In Stackpress idea metadata, `@list.*` describes list-style display and
`@view.*` describes detail-style display.

The `Article.banner` field shows why both can exist on the same field:

```idea
banner      String?
            @label("Banner")
            @field.url
            @list.image({ width 20 height 20 })
            @view.image({ width 100 height 100 })
```

The value is still a string URL, but the UI should not show that string as
plain text. The list page gets a smaller image, and the detail page gets a
larger image because those surfaces have different scanning needs.

## 673.2. List And Detail Output

Generated list components live under `components/list`, while generated detail
components live under `components/view`. The split matters because a table row
often needs a compact version of a value, while a detail page can show more.

```tsx
export default function BannerListFormat(props: BannerListFormatProps) {
  const { data, value } = props;
  const attributes = { data, ...{ width: 20, height: 20 } };
  return <Image {...attributes} value={value} />;
}
```

This list formatter came from `@list.image({ width 20 height 20 })`. The
component still receives the row data and field value, but it renders an image
at the smaller list size.

```tsx
export default function BannerViewFormat(props: BannerViewFormatProps) {
  const { data, value } = props;
  const attributes = { data, ...{ width: 100, height: 100 } };
  return <Image {...attributes} value={value} />;
}
```

This detail formatter came from `@view.image({ width 100 height 100 })`. The
same field value is rendered through the same Frui view component family, but
the generated attributes fit a detail page instead of a list row.

## 673.3. Formatting Typed Values

Typed values often need a display component even when the stored value is
already valid. Dates are a good example because the stored value can be a date
object, timestamp, or string that the user should not have to parse manually.

```idea
published   Datetime?
            @label("Published Date")
            @field.datetime
            @list.date("m d, Y h:iA")
            @view.date("m d, Y h:iA")
```

This metadata says that the value is edited as a datetime and displayed as a
formatted date in both list and detail views. The exact generated component
uses `DateFormat` from Frui view output.

```tsx
import DateFormat from 'frui/view/DateFormat';

export default function PublishedViewFormat(props: PublishedViewFormatProps) {
  const { data, value } = props;
  const attributes = { data, ...{} };
  return <DateFormat {...attributes} value={value} />;
}
```

This generated component is small because most of the decision already lives
in the metadata. The important part is the mapping from `@view.date` to a
display component that knows how to render a date-shaped value.

## 673.4. Relation And Template Display

Relations need display help for the same reason they need form help: an ID is
useful to the database, but a readable label is useful to the person using the
app. The `Article.profileId` field uses template metadata for both list and
detail output.

```idea
profileId   String
            @label("Profile")
            @list.template({ template "{{profile.name}}" })
            @view.template({ template "{{profile.name}}" })
```

This metadata says the stored field is `profileId`, but the display should use
the related profile name. The generated component renders the template against
the extended article data.

```tsx
export default function ProfileIdViewFormat(props: ProfileIdViewFormatProps) {
  const { data } = props;
  const value = template.render('{{profile.name}}', data);
  return <>{value}</>;
}
```

This example is a good reminder that display components can use more than the
raw field value. The generated formatter reads the related `profile` data so
the user sees a name instead of an internal ID.

## 673.5. Mistakes To Avoid

View component mistakes usually come from showing the stored value instead of
the useful value. Generated metadata should tell Stackpress how the user should
read the field, not only how the database stores it.

### 673.5.1. Render An Image URL As Text

```tsx
<span>{article.banner}</span>
```

This shows the stored URL, but it does not show the image the user expects to
inspect. Use `@list.image` or `@view.image` when the value is an image URL and
the generated surface should render the image.

### 673.5.2. Display A Relation ID

```tsx
<span>{article.profileId}</span>
```

This might help a developer debug a record, but it is rarely the best user
display. Use template display metadata when the page should show a related
model's readable field, such as `{{profile.name}}`.

### 673.5.3. Use Detail Formatting In A List

```idea
banner String?
       @list.image({ width 100 height 100 })
       @view.image({ width 100 height 100 })
```

This makes the list image as large as the detail image, which can make a table
harder to scan. Use smaller list formatting when the value appears in a dense
row, and reserve larger formatting for a detail view.

## 673.6. Reference Pointers

Start with the field metadata in `schema.idea`, then inspect
`client-source/Article/components/list` and
`client-source/Article/components/view`. The source metadata
explains the decision, while the generated files prove which Frui component
Stackpress produced.

The view generation rules live under `packages/stackpress-view/src/transform`.
Use that source when you need generator behavior, but keep this lesson focused
on reading generated output in a scaffolded app.

**Learning checkpoint:** You should now be able to explain the difference
between `@field.*`, `@list.*`, and `@view.*`. The key idea is that form
metadata collects values, while list and view metadata display values.

**Next course:** Continue with `API / OAuth`. The next lesson moves from UI
components to built-in API routes and authorization flows.
