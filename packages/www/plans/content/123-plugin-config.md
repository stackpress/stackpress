# 123 Plugin Config

Read app configuration from plugin code so behavior can change without hard-coding every value. Keep the idea tied to the concrete project surface in this section.

**Previously:** The previous lesson, `122 Local Plugins`, gave you the setup this page builds on. Here, the focus shifts to `Plugin Config` so you can place the next Stackpress surface in the course path.

## 123.1. Use Case

Hard-coded values are easy at first and expensive later. Plugin config gives behavior a place to read settings, so the route stays focused on what it does while config decides how it should behave in this app.

## 123.2. Minimal Config

Add a config value:

```ts
export const config = {
  app: {
    healthText: 'OK'
  }
};
```

Read it in a plugin:

```ts
import type { HttpServer } from 'stackpress/http';

type AppConfig = {
  app?: {
    healthText?: string
  }
};

export default function plugin(server: HttpServer<AppConfig>) {
  server.on('route', async () => {
    server.get('/health', ({ res }) => {
      const text = server.config.path<string>('app.healthText', 'OK');
      res.json({ ok: true, message: text });
    });
  });
}
```

This example gives the idea something concrete to inspect. Look for the file, helper, or value that changed; that is the part you would adjust first in your own app.

## 123.3. How Config Reaches The Plugin

The plugin asks config for `app.healthText`. If the setting is missing, it falls back to `OK`.

This keeps the behavior in the plugin, while leaving the value in config where it can change per environment. The example gives the decision enough context to evaluate it.

## 123.4. Common Patterns

This part of the Plugin Config workflow is easier to follow when the smaller pieces are compared together. The subsections cover Config Is App Input, Plugin Code Owns Behavior, Defaults Matter, so the reader can see how each piece changes the local decision.

### 123.4.1. Config Is App Input

Config describes how the app should boot or behave. It is a better home for environment-specific values than route handlers.

### 123.4.2. Plugin Code Owns Behavior

The plugin still decides what to do with the setting. Config should not become a second programming language.

### 123.4.3. Defaults Matter

Use a fallback for optional values. A missing optional config value should not break startup unless the feature truly requires it.

## 123.5. Mistakes To Avoid

Mistakes in plugin config usually come from putting values in the wrong place. Use config for values that change by environment, and keep plugin code focused on behavior.

### 123.5.1. Hard-Code A Route Base

```ts
const base = '/app';
server.get(`${base}/health`, ({ res }) => {
  res.json({ ok: true });
});
```

This works, but it hides an app setting inside route code. Prefer `server.config.path<string>('app.base', '/app')` so the base path can change without editing the plugin.

### 123.5.2. Treat Brand Values Like Route Logic

```ts
res.data.set('brand', 'Acme Admin');
```

This example stores a brand value directly inside a handler. Shared view values such as brand name, logo, and favicon usually belong in config, then route or layout code can copy them into view props when needed.

### 123.5.3. Put Secrets In Source Files

```ts
server.config.set('mail.password', 'plain-text-password');
```

This is the dangerous version because the secret becomes part of the project source. Read secrets from environment variables inside config, then pass only the resolved config value into the plugin behavior that needs it.

## 123.6. Reference Pointers

This gives you the first mental handle for Plugin Config; later pages can add more detail without starting from zero. Use that purpose as the anchor for the local example or check.

**Next step:** Read `131 Request` and `132 Response` when you are ready to use plugin settings inside request handlers. For config lookup details, use [Config Reference](/reference/config-reference). Use that page to keep moving through the learning path before switching into reference mode.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `131 Request`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
