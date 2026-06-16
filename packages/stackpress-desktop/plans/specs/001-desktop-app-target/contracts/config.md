# Contract: Desktop Configuration

## Purpose

Defines the public configuration shape app authors use to mark an existing
Stackpress app as desktop-capable.

## Owner

`stackpress-desktop` owns validation and normalization. Existing Stackpress app
config remains the source of truth for routes, plugins, views, sessions, local
stores, and service behavior.

## Public Shape

```ts
export type DesktopConfig = {
  runtime?: 'http' | 'protocol';
  app?: {
    id?: string;
    name?: string;
    version?: string;
  };
  server?: {
    host?: '127.0.0.1';
    port?: number;
    open?: string;
  };
  protocol?: {
    scheme?: string;
    host?: string;
  };
  window?: {
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    title?: string;
  };
  routes?: DesktopRouteRule[];
  security?: {
    externalNavigation?: 'deny' | 'open-external';
    allowDevTools?: boolean;
  };
  menu?: {
    enabled?: boolean;
  };
  updater?: {
    enabled?: false;
    autoCheck?: boolean;
    autoDownload?: boolean;
    menu?: boolean;
  };
  data?: {
    directory?: 'userData' | string;
    database?: string;
  };
  build?: {
    directory?: string;
    main?: string;
    preload?: string;
    manifest?: string;
  };
  package?: {
    tool?: 'electron-builder';
    icon?: string;
    output?: string;
  };
  electron?: Record<string, unknown>;
};

export type DesktopRouteRule = {
  method?: 'ALL' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
  route: string;
};
```

## Required Behavior

- Missing or empty `routes` means allow all registered routes.
- Non-empty `routes` means allowlist mode.
- `runtime: 'http'` is the only supported runtime in the first milestone.
- `runtime: 'protocol'` must produce a clear unsupported-runtime error.
- The configured `server.open` route must be allowed by route rules.
- Normal non-desktop Stackpress config must continue to work unchanged.
