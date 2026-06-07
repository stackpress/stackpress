# 110 Scaffold

Create the smallest useful Stackpress app, add one route, and verify that the development server can return a response. This lesson is the first hands-on proof that Stackpress can load your code and answer a browser request.

**Previously:** The previous lesson, `001 What Stackpress Is`, gave you the setup this page builds on. Here, the focus shifts to `Scaffold` so you can place the next Stackpress surface in the course path.

## 110.1. Goal

Every framework has a smallest useful shape: the few files needed before anything can run. In Stackpress, that first shape is an npm project, one plugin file, and one route that proves the server can answer.

The first success is small on purpose: a route that returns `Hello Stackpress`. Once that works, every later feature has a known-good starting point.

You do not need React, schema files, generated code, or a database yet. Those come later in the course after the runtime loop is working.

## 110.2. Create the App

Before you start, make sure you have Node.js installed and can run commands from a terminal. Use an empty folder so every file created in this lesson has an obvious purpose.

Start in an empty folder for your app:

```bash
npm init -y
npm i stackpress
```

Those two commands give the folder a `package.json` and install Stackpress.
Nothing app-specific exists yet; you have only prepared the room where the
first route will live.

Next, create `plugin.ts`:

```ts
import type { HttpServer } from 'stackpress/http';

export default function plugin(server: HttpServer) {
  server.get('/', ({ res }) => {
    res.set('text/plain', 'Hello Stackpress');
  });
}
```

This file is the first piece of app behavior. The default export receives the
Stackpress server, `server.get('/')` listens for the home route, and
`res.set('text/plain', 'Hello Stackpress')` sends a plain text answer back to
the browser.

Now update `package.json` last. Add the module type and the plugin list. This is the step that tells Stackpress which local file should be loaded when the app starts:

```json
{
  "type": "module",
  "plugins": [
    "./plugin"
  ]
}
```

Keep the other fields that `npm init -y` created. The important part is that `type` and `plugins` are present.

The plugin list is the bridge between the package file and your app code. By
adding `"./plugin"`, you tell Stackpress to load the file you just created
when the app starts.

Once that is in place, run the development server:

```bash
npx stackpress develop -v
```

Open:

```text
http://localhost:3000/
```

You should see:

```text
Hello Stackpress
```

If you prefer the terminal, you can verify the route with:

```bash
curl http://localhost:3000/
```

The visible result proves three things at once. The package installed, Stackpress found your plugin, and the route returned the text you wrote.

## 110.3. Open the Project

You created the smallest Stackpress app contract:

 - `package.json` defines the app as an ES module project.
 - `stackpress` provides the local development server.
 - `plugin.ts` contains app-specific behavior.
 - `plugins` tells Stackpress which local plugin file to load.
 - `server.get('/', handler)` registers a route for the home path.

When you ran `npx stackpress develop -v`, Stackpress started the development server, loaded the plugin list from `package.json`, registered your route, and served the response from the route handler. The following example gives the idea a concrete project shape.

The `-v` flag turns on verbose logging. Use it while learning because it makes startup and loading problems easier to see.

## 110.4. Run the First Command

This section names the pieces you just created so later lessons can build on them. The scaffold, local plugin, route, and plugin list are small, but each one owns a different part of the first working app.

### 110.4.1. Scaffold

A scaffold is the smallest project shape that lets the framework boot. For this page, the scaffold has only three pieces, and each one has a job. The list below names the pieces you just created:

 - `package.json`
 - `node_modules`
 - `plugin.ts`

That is enough to prove the runtime works. It is not the full project shape you will use for a larger app.

### 110.4.2. Local Plugin

A local plugin is a file owned by your app. It receives the Stackpress server and registers behavior on it.

In this scaffold, `plugin.ts` owns one route. Later pages use local plugins for page handlers, views, events, stores, and app integrations.

### 110.4.3. Route

A route connects an HTTP path to a handler function. In this example, the path is `/` and the handler writes the response, so the browser has something visible to show. The handler looks like this:

```ts
server.get('/', ({ res }) => {
  res.set('text/plain', 'Hello Stackpress');
});
```

The route listens for `GET /`. The handler receives a request object and a response object. This first handler ignores the request and writes a plain text response.

### 110.4.4. Plugin List

The `plugins` array in `package.json` is how Stackpress finds your app behavior:

```json
{
  "plugins": [
    "./plugin"
  ]
}
```

Create the plugin file before you register it. That order makes startup errors easier to understand because Stackpress will only try to load files that already exist.

## 110.5. Check the Files

This section checks whether you understand the scaffold well enough to change it. Small edits are useful here because they show which file controls the response and which file controls plugin loading.

### 110.5.1. Change The Response

Edit the text in `plugin.ts`:

```ts
res.set('text/plain', 'Hello from my app');
```

Restart the development server if it does not pick up the change automatically, then refresh the browser. If the browser shows the new text, you know the route is coming from your local plugin.

### 110.5.2. Add Another Route

Add a second route inside the same plugin function:

```ts
server.get('/about', ({ res }) => {
  res.set('text/plain', 'About this app');
});
```

Then open:

```text
http://localhost:3000/about
```

This second route proves the plugin can register more than one handler. The important change is the path, because `/about` now points to a different response than `/`.

### 110.5.3. Fix A Plugin Loading Error

If Stackpress cannot load your plugin, check these first:

 - `package.json` includes `"type": "module"`.
 - The `plugins` entry points to `"./plugin"`.
 - The file is named `plugin.ts`.
 - The file has a default export.
 - The development command is running from the app folder.

## 110.6. What You Now Have

The main idea to carry forward is that a scaffold is not the finished app. It
is the smallest contract that proves Stackpress can load your code and answer a
request.

You now have a running Stackpress app with one handwritten route. More importantly, you have seen the loop you will repeat often: edit a file, run the server, inspect the result, and adjust the source.

Next, learn how the development server fits into the local workflow in `113 Dev Server`. After that, the plugin lessons show how to organize more app behavior without turning the first scaffold file into a dumping ground.

For lookup details, use the reference pages:

 - [CLI command details](/reference/cli-reference)
 - [HTTP route exports](/reference/http)
 - [Plugin export details](/reference/plugin)

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `113 Dev Server`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
