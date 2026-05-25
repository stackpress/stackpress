# `stackpress/types`

`stackpress/types` is the shared type shelf for application code, config code, and tooling. This page stays curated by type family so it remains readable, but each family includes the main types a consumer is most likely to annotate directly.

## Import

```ts
import type {
  Config,
  SchemaConfig,
  HttpAction,
  ServerConfigProps
} from 'stackpress/types';
```

## When To Use It

Use this path when you want one shared type import path instead of several narrower `stackpress/.../types` imports.

## Type Families

### Config And Plugin Types

- `Config`
- `ClientConfig`
- `ServerConfig`
- `ViewConfig`
- `SessionConfig`
- `LanguageConfig`
- `DatabaseConfig`
- plugin types such as `ClientPlugin`, `DatabasePlugin`, `SessionPlugin`, `ViewPlugin`

These types describe the top-level config object and the plugin/config subsections that Stackpress reads during bootstrap.

```ts
import type { Config } from 'stackpress/types';
```

### Server And Runtime Types

- `HttpAction`
- `HttpServer`
- `HttpServerOptions`
- `WhatwgAction`
- `ServerOptions`
- route and router families such as `Route`, `RouteMap`, `RouterArgs`

Use these when typing handlers, server instances, or route-aware utilities.

Important exports:

- `RouteProps`
  - describes the props object passed into props-style handlers such as `action(async function Name({ req, res, ctx }) { ... })`
  - use it when you want to type the full handler payload in one import

```ts
import { action } from 'stackpress/server';
import type { RouteProps } from 'stackpress/types';

export default action(async function HomePage({ req, res, ctx }: RouteProps) {
  res.results({ path: req.url.pathname, mode: ctx.config.path('server.mode') });
});
```

### Request And Response Types

- `RequestOptions`
- `ResponseOptions`
- `StatusResponse`
- `SuccessResponse`
- `ErrorResponse`
- `Headers`
- `Data`
- `Query`

Use these when you need to type inbound or outbound request/response payloads.

### Schema And Model Types

- `SchemaConfig`
- `ModelConfig`
- `TypeConfig`
- `EnumConfig`
- attribute token families such as `AttributeDataMap`, `AttributeDefinitionToken`

Use these when working with interpreted schema metadata or schema-generation tooling.

### SQL And Store Types

- `QueryObject`
- `Connection`
- `Dialect`
- `StoreSelector`
- `StoreSelectQuery`
- `StoreSearchQuery`
- `StoreWhere`

Use these when typing store/search flows or direct SQL integrations.

### Session And Auth Types

- `SessionData`
- `SessionPermission`
- `SigninInput`
- `SignupInput`
- `Profile`
- `Auth`

Use these when typing session-aware actions, auth forms, or protected route logic.

### View And Client Types

- `ServerConfigProps`
- `ServerPageProps`
- `ServerProviderProps`
- layout prop families such as `LayoutHeadProps`
- `NotifyConfig`

Use these when typing React page props, provider state, or layout components.

## Related

 - [Config Reference](./config-reference.md)
 - [Server](./server.md)
 - [Schema](./schema.md)
 - [View](./view.md)
