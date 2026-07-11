# Stackpress Views

`stackpress/view` joins server-side route handling with Reactus rendering and a
browser snapshot runtime. It exposes template helpers, Reactus classes and
plugins, view lifecycle support, providers, layouts, hooks, notifications, and
the `setViewProps` bridge used before rendering.

```ts
server.get('/profile', async (req, res) => {
  res.setResults({ profile: await loadProfile(req) })
  setViewProps(req, res, server)
  return server.view.render('profile', req, res)
})
```

The rendered document includes a controlled snapshot of request, response,
configuration, session, language, and server-facing values. Browser providers
hydrate that snapshot so components can use `useRequest`, `useResponse`,
`useConfig`, `useSession`, and related helpers without a second bootstrap API
request.

## Safe View Properties

`setViewProps(req, res, ctx)` copies the view, brand, and language subsets needed
by the client. It skips responses that do not select a view. It does not copy the
database engine or unrestricted server configuration. Everything placed in
`res.data` can become browser-visible and must be treated as public output.

Client authorization helpers describe the delivered session snapshot and are
appropriate for user-interface decisions. They are not a substitute for
server-side route or event authorization.

## Entrypoints

The server-facing aggregate includes Reactus rendering and development
integration, some of which is Node-specific. The browser-safe client entrypoint
contains hooks, providers, wrappers, layouts, themes, r22n integration, and the
notifier. The top-level `stackpress/view-client` facade additionally exposes
aggregate admin filtering, ordering, pagination, and `LayoutAdmin` helpers that
are not guaranteed by the narrower package client entrypoint.

Pages, REST actions, and MCP tools are distinct exposure surfaces. A view route
may call the same domain event as another surface, but rendering, transport,
authorization, and response shaping remain the responsibility of each adapter.

