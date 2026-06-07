# 440 Public Assets

Add static images, styles, scripts, icons, and public files where Stackpress can serve or build them. Use the check to make the idea visible before moving to the next topic.

**Previously:** The previous lesson, `430 Plugin Layout`, gave you the setup this page builds on. Here, the focus shifts to `Public Assets` so you can place the next Stackpress surface in the course path.

## 440.1. Goal

Some files should be served as-is instead of passing through a route handler. Public assets are the app's shelf for browser-ready images, icons, downloads, and other static files.

## 440.2. Add An Asset

Add an asset:

```text
public/images/logo.png
```

Reference it in a view:

```tsx
export function Body() {
  return <img src="/images/logo.png" alt="App logo" />;
}
```

This example ties the concept to an actual Stackpress shape. Notice how the file or helper creates behavior the app can later run, inspect, or generate from.

## 440.3. Reference It In A View

The file lives under `public`, so the browser can request it by URL. The view references the public URL, not a local filesystem path.

## 440.4. Run And Check

This part of the Public Assets workflow is easier to follow when the smaller pieces are compared together. The subsections cover Public Folder, Public URL, Build Assets, so the reader can see how each piece changes the local decision.

### 440.4.1. Public Folder

`public` holds static files such as images, icons, stylesheets, and scripts. The same idea shows up through inspectable project surfaces.

### 440.4.2. Public URL

A public URL starts from the site root, such as `/images/logo.png`. Keep that role in mind as the lesson moves into the concrete shape.

### 440.4.3. Build Assets

Build config may copy or emit assets into production output paths. Verify assets after a production build.

## 440.5. Asset Rules

This part of the Public Assets workflow is easier to follow when the smaller pieces are compared together. The subsections cover Add A Favicon, Add A Stylesheet, Verify Asset Paths, so the reader can see how each piece changes the local decision.

### 440.5.1. Add A Favicon

Place favicon files in `public` and reference them from `Head` or config. The nearby example or check shows the project detail affected by this idea.

### 440.5.2. Add A Stylesheet

Place global static styles in `public/styles` when they should be served directly. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 440.5.3. Verify Asset Paths

Open the asset URL in the browser after development and after build. The local example shows why that choice matters in an app.

## 440.6. Next Step

The checkpoint is simple: you can point to where Public Assets shows up and explain why it matters. Compare the concrete details to see the practical meaning.

Move to `500 Idea` when you are ready to model app data and generated output intentionally. The examples stay practical by tying the idea to something you can run, change, or verify.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `511 Syntax`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
