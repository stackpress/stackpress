# 01. Hello World Route

This tutorial proves the smallest possible Stackpress consumer app can boot and respond to a route.

## 1. Overview

In this step you will:

 - create a new npm app
 - install `stackpress`
 - write one plugin file with one inline route and one inline handler
 - register that plugin in `package.json`
 - run `npx stackpress develop -v`

The visible goal is simple: return `Hello World`.

## 2. Setting Up / Coding

Start in an empty folder:

```bash
npm init -y
npm i stackpress
```

Command guide:

 - `npm init -y` creates the starting `package.json`
 - `npm i stackpress` installs the framework and its default runtime pieces

Create `plugin.ts`:

```ts
import type { HttpServer } from 'stackpress/http';

export default function plugin(server: HttpServer) {
  server.get('/', (_req, res) => {
    res.set('text/plain', 'Hello World');
  });
}
```

Now update `package.json` last by adding the plugin list:

```json
{
  "type": "module",
  "plugins": [
    "./plugin"
  ]
}
```

## 3. Viewing Results

Run:

```bash
npx stackpress develop -v
```

Command guide:

 - `npx stackpress develop -v` starts the Stackpress development server
 - `-v` enables verbose logging so you can see what Stackpress is loading

Then open the home route. Success means the response body shows:

```text
Hello World
```

## 4. What Was Learned

You now have the smallest Stackpress app contract:

 - npm project
 - one installed Stackpress package
 - one local plugin file
 - one registered plugin entry

You have not added React, config, schema, or SQL yet. This step only proves that Stackpress can boot and serve one route from a local plugin.
