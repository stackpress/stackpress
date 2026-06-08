# 540 Public Assets

Public assets are files the browser should be able to request directly. They
are not route handlers, generated stores, or config objects. They are the
images, favicons, stylesheets, and browser-ready files that support the pages
your plugins render.

This matters because a static file problem can look like a route problem at
first. If a favicon does not load or a stylesheet is missing, the fix usually
starts with the `public` folder and the URL used by the view, not with the page
handler that loaded data.

**Previously:** `Plugin Layout` showed where page handlers and views live.
This lesson shows where the files referenced by those views live when the
browser should fetch them as public URLs.

## 540.1. Goal

The goal is to place static files where Stackpress can serve them and then
reference those files with browser URLs. In a scaffolded app, public files
already include favicons, brand images, and stylesheets.

```text
public/
  favicon.ico
  favicon.png
  icon.png
  logo.png
  styles/
    article.css
    global.css
```

This example shows the asset shelf for a scaffolded app. The files live on
disk under `public`, but the browser references them from the site root, such
as `/favicon.ico` or `/styles/global.css`.

## 540.2. Add An Asset

When you add a public asset, put the file under `public` using the same URL
shape you want the browser to request. A stylesheet under
`public/styles/article.css` becomes available as `/styles/article.css`.

```text
public/styles/article.css
```

This example is an existing example-app file. It contains article-reading
styles and belongs in `public/styles` because the article page links to it as a
static stylesheet.

If you were adding a new static stylesheet, follow the same pattern:

```text
public/styles/print.css
```

This example would create a browser URL at `/styles/print.css`. The important
part is the relationship between the folder and the URL: `public` is the root
of the public path, not part of the browser URL.

## 540.3. Reference It In A View

Reference public assets from the view's `Head` or markup using root-relative
URLs. The article view links both shared and article-specific stylesheets.

```tsx
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="stylesheet" type="text/css" href="/styles/global.css" />
<link rel="stylesheet" type="text/css" href="/styles/article.css" />
```

This example appears in `plugins/app/views/article.tsx`. The view does not use
`public/styles/article.css` as the URL because the browser cannot fetch local
filesystem paths; it fetches `/styles/article.css` from the running app.

Image assets use the same rule:

```tsx
<meta property="og:image" content="/icon.png" />
<meta name="twitter:image" content="/icon.png" />
```

This example points social preview metadata at the public `icon.png` file. The
view only needs the browser URL, while the actual file lives at
`public/icon.png`.

## 540.4. Run And Check

Check assets in the same environment where the page runs. In development, the
scaffolded config allows public routes such as `/styles/**`, `/favicon.ico`, and
`/favicon.png`, so the browser can request those files while you inspect the
page.

```text
/styles/global.css
/styles/article.css
/favicon.ico
/icon.png
```

This example is the list of URLs a developer can open directly in the browser
after the app is running. A successful check means the request returns the file
content or image, not an app error page.

Build output has a second asset surface. The build config writes generated
view assets and client scripts into folders under `public`.

```ts
engine: {
  assetPath: path.join(common.assets, 'assets'),
  clientPath: path.join(common.assets, 'client'),
  pagePath: path.join(common.cwd, '.build/views')
}
```

This example is build-specific, not a general rule for every static file.
Handwritten public files such as `/styles/global.css` stay under `public`,
while build config controls where generated build assets and client scripts are
emitted.

## 540.5. Asset Rules

Use a few rules to keep public assets predictable. These rules prevent the
common confusion between source files, generated build output, and browser
URLs.

### 540.5.1. Add A Favicon

Put the favicon file under `public`, then reference it with a root-relative URL
from the page head or shared brand config. A scaffolded app has both
`public/favicon.ico` and `public/favicon.png`.

```tsx
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```

This example tells the browser where the favicon is. It does not import the
file into TypeScript because the favicon is a static browser asset, not a view
component dependency.

### 540.5.2. Add A Stylesheet

Put directly served stylesheets under `public/styles` and link them from the
view `Head`. A scaffolded app uses `global.css` for shared page styling and
`article.css` for article-reading styles.

```tsx
<link rel="stylesheet" type="text/css" href="/styles/global.css" />
{styles.map((href, index) => (
  <link key={index} rel="stylesheet" type="text/css" href={href} />
))}
```

This example shows two stylesheet sources working together. The first link is a
handwritten public stylesheet, while `styles.map(...)` renders stylesheet URLs
that Stackpress passes into the page props.

### 540.5.3. Verify Asset Paths

Verify the browser URL, not just the local file path. A file can exist under
`public`, but the page can still point to the wrong URL.

```tsx
<link rel="stylesheet" type="text/css" href="/public/styles/global.css" />
```

This example is wrong because it includes `public` in the URL. The corrected
URL is `/styles/global.css`, because `public` is the server-side folder that
becomes the root of browser-served assets.

## 540.6. Next Step

Public assets complete the project-structure map by giving static browser files
a clear home. Page handlers load data, views render markup, config controls app
settings, and `public` holds files the browser should request directly.

Move to `300 Idea` next. The next section returns to modeling app data and
generation, where source files such as `schema.idea` produce inspectable
generated output.

**Learning checkpoint:** You should be able to explain why
`public/styles/global.css` is referenced as `/styles/global.css`. You should
also be able to tell the difference between handwritten public assets and build
output paths such as `public/assets` or `public/client`.
