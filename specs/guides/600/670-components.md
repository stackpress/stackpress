# 670 Components

Components are the pieces a Stackpress page uses after the route has already
decided what to show. Some pieces come from Stackpress view helpers, some come
from Frui, and some are generated from `schema.idea` metadata. This group
teaches how to tell those pieces apart before you try to change them.

## 670.1. Why The Choice Matters

A component is not just a visual block on the screen. It also carries a small
decision about ownership: should the UI be controlled by a handwritten view, by
the Stackpress layout layer, or by generated output that came from an idea
file?

That distinction matters when something looks wrong. If a custom sign-in page
uses the wrong hook, you inspect the handwritten view. If an article form uses
the wrong input, you inspect the schema metadata that generated the field
component.

## 670.2. The Three Component Families

The component courses are grouped by the job each family performs. Base
components help with layout, buttons, notifications, menus, and common UI
pieces. Form components help users enter data, while view components help the
app display typed values in lists and detail pages.

Stackpress exposes browser-safe helpers through `stackpress-view/client`:

```ts
export {
  useRequest,
  useResponse,
  useConfig,
  useSession,
  useServer
} from './server/hooks.js';
```

This export list shows the client-side surface a view can safely import from
Stackpress. The important detail is that view code should reach for this client
entrypoint when it needs Stackpress request, response, session, config, theme,
layout, language, or notifier helpers.

Generated components use a different kind of source. A scaffolded app has
generated article components under `client-source/Article`,
including `components/form`, `components/list`, and `components/view`.

```txt
Article/components/form/TitleFormField.tsx
Article/components/list/BannerListFormat.tsx
Article/components/view/ProfileIdViewFormat.tsx
```

These paths show that generated UI is split by purpose. A form field controls
input, a list formatter controls table-style display, and a view formatter
controls detail-style display.

## 670.3. Generated And Handwritten UI

Handwritten views are ordinary React files that choose components directly.
For example, the session account helpers import `LayoutPanel` and wrap account
pages with a shared menu. That is handwritten ownership because the page author
decides which layout helper to use.

Generated UI starts from metadata in `schema.idea`. In a scaffolded app,
`Article.banner` uses `@field.url`, `@list.image`, and `@view.image`, so the
generated output creates a URL input and image display components.

```idea
banner      String?
            @label("Banner")
            @field.url
            @list.image({ width 20 height 20 })
            @view.image({ width 100 height 100 })
```

This example gives one field three UI decisions. The field editor should accept
a URL, the list page should show a small image, and the detail page should show
a larger image.

## 670.4. Where To Inspect

When a component is handwritten, inspect the view file that imports it. The
sign-in view in `packages/stackpress-session/src/auth/views/signin/index.tsx`
imports `LayoutBlank`, `useConfig`, `useLanguage`, `useRequest`, and
`useTheme` from `stackpress-view/client`.

When a component is generated, inspect both the source metadata and the
generated output. The source explains why the component was chosen, while the
generated file shows the exact Frui component and props that Stackpress
created.

```tsx
import Image from 'frui/view/Image';

export default function BannerListFormat(props: BannerListFormatProps) {
  const { data, value } = props;
  const attributes = { data, ...{ width: 20, height: 20 } };
  return <Image {...attributes} value={value} />;
}
```

This generated list formatter came from `@list.image({ width 20 height 20 })`.
The schema metadata chose image display, and the generated component turned
that decision into an `Image` component with the configured size.

## 670.5. Verify Component Use

Verify components in the browser whenever possible because UI succeeds through
visible behavior. A correct import is not enough if the label is wrong, the
menu does not open, the notification never appears, or the generated field
sends the wrong value.

For generated components, also verify the source-to-output chain. If you change
`@field.*`, `@list.*`, or `@view.*`, the generated component should change in a
way that matches the metadata.

**Learning checkpoint:** You should now be able to separate base, form, and
view component work. The main habit is to ask whether the component was chosen
by handwritten React code or generated from schema metadata.

**Next course:** Continue with `frui Base Components`. The next lesson focuses
on reusable layout, notification, and control pieces before moving into
schema-driven forms.
