# 600 Built-ins

Learn the framework capabilities that Stackpress can provide after the core app workflow is familiar. Built-ins cover authentication, sessions, account behavior, CSRF, email, language, components, and API/OAuth surfaces.

**Previously:** The previous course, `Custom Generators`, explained how source-driven output can extend a project. This course returns to built-in Stackpress packages that add common app behavior through config, plugins, routes, views, and events.

## 600.1. Why Built-ins Come After The Core

Built-ins are easier to use when you already understand routes, plugins, views, data, config, and generated output. Otherwise, authentication or account pages can feel like a hidden system instead of normal Stackpress pieces working together.

This level introduces built-ins as app capabilities with visible request flows and configuration surfaces. The goal is to know what Stackpress provides and what your app still owns.

## 600.2. A Small Config Anchor

A scaffolded app shows built-ins through config values such as `auth`, `session`, and `csrf`. Those values do not do the whole job by themselves, but they give the built-in packages the settings they read when routes and events are registered.

```ts
export const auth = {
  base: '/auth',
  redirect: '/',
  roles: [ 'USER' ]
};

export const csrf = {
  name: 'csrf'
};
```

This example shows two different kinds of built-in settings. Auth config decides where auth pages live and which roles new signups receive, while CSRF config names the token field used by the CSRF plugin.

## 600.3. What This Level Covers

`610 Authentication`, `620 Roles And Permissions`, and `630 Sessions And Account` cover identity and user-state flows. These pages use `stackpress-session` source to show real route, event, and model surfaces instead of abstract auth language.

`640 CSRF` uses `stackpress-csrf` and the real sign-in page source to explain token generation, validation, clearing, and failure behavior. The later built-in pages continue through email, language, components, and OAuth with source-backed package and scaffold examples, while provider-specific behavior remains intentionally deferred.

## 600.4. Config Plus Flow

Most built-ins have two sides: configuration and request flow. Config enables or shapes behavior, while the request flow shows what happens when a user signs in, submits a form, changes account data, or calls an API.

Read built-in pages with both sides in mind. If you only read config, you may miss what the user sees; if you only read the flow, you may miss the switch that enables it.

## 600.5. How To Approach Built-ins

Use the built-in only when it matches the product need. Stackpress gives you reusable surfaces, but your app still needs clear decisions about routes, roles, feedback, validation, and user experience.

When a built-in behaves unexpectedly, inspect config, generated output, route flow, session state, and visible feedback. Those are the same debugging habits from earlier levels applied to framework-provided behavior.

**Learning checkpoint:** Before moving on, make sure you can explain built-ins as Stackpress-provided capabilities that still connect to config, routes, views, sessions, and generated output. You should also know why this level comes after the core workflow.

**Next course:** Continue with `Authentication`. That course starts the built-in security path with concrete auth routes and events.
