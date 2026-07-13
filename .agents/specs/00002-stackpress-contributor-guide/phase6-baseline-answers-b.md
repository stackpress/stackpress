# Phase 6 Baseline Answers B

## RET-004

No, not by default. A mobile integration is an optional adapter/surface, so keep
it as its own package and have applications load its plugin explicitly. The
current aggregate plugin contains the core ordered stack only; optional AI and
desktop packages are deliberately absent. Adding mobile there would make it an
implicit dependency and alter compatibility-sensitive lifecycle ordering.

Only add narrow re-exports to `packages/stackpress` if mobile functionality is
intentionally being promoted into the core public contract. Even then,
aggregation of exports does not imply automatic plugin registration.

## RET-005

For an application-specific account-security form, use these exact local
locations:

- `plugins/app/plugin.ts`: register all route bindings inside the existing
  `server.on('route', ...)`.
- `plugins/app/pages/account-security.ts`: server-side GET/POST action.
- `plugins/app/views/account-security.tsx`: React page and form.

Lifecycle wiring in `plugins/app/plugin.ts`:

```ts
server.on('route', () => {
  const route = '/auth/account/security/custom';

  server.import.get(route, () => import('./pages/account-security.js'));
  server.import.post(route, () => import('./pages/account-security.js'));

  server.view.get(route, '@/plugins/app/views/account-security');
  server.view.post(route, '@/plugins/app/views/account-security');
});
```

The page handler should use `action(...)`, call `setViewProps(req, res, ctx)`,
load and authorize the session, populate safe GET data, and on
`req.method === 'POST'` validate submitted data before invoking the owning
event/capability. Keep domain/security mechanism in that reusable event when
another caller may need it; the page remains the session/form adapter.

The view should render `<form method="post">`, include the project's CSRF fields,
and consume only serialized browser-safe props. The current concrete reference
is:

- route and GET/POST import/view pairing:
  `packages/stackpress-session/src/session/plugin.ts`;
- authorization, GET preparation, POST validation, event calls, flash, and
  redirect: `packages/stackpress-session/src/session/pages/password.ts`;
- form and CSRF composition:
  `packages/stackpress-session/src/session/views/password.tsx`.

Also add the GET and POST route permissions to `session.access` if that allowlist
is configured. Verify authorization, CSRF, invalid input, success redirect/flash,
SSR, hydration, and browser-visible props.

## RET-006

No. Put the reusable maintenance mechanism in a dedicated action/service module;
keep the event handler as the thin capability boundary.

Recommended package-local shape:

```text
src/actions/maintenance.ts   # reusable mechanism
src/events/maintenance.ts    # Ingest action adapter
src/plugin.ts                # lifecycle registration
```

Register the named capability during `listen`:

```ts
ctx.on('listen', ({ ctx }) => {
  ctx.import.on('maintenance-run', () => import('./events/maintenance.js'));
});
```

The CLI can invoke it directly as an event, for example:

```bash
stackpress maintenance-run -b config/develop -v
```

or through the generic adapter:

```bash
stackpress emit maintenance-run -b config/develop -v
```

Another plugin invokes the same capability with `ctx.emit(...)` when it must
preserve the existing request/response context, or `ctx.resolve(...)` for a
result-oriented internal call. The event module maps request data,
authorization/policy, status, and errors onto the reusable operation; it should
not become the only home of the maintenance logic. This preserves the event as
shared capability authority while keeping CLI and plugin callers as separate
adapters.
