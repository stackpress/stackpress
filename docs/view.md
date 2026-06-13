# `stackpress/view`

`stackpress/view` is the main rendering and page-composition API shelf. It combines server-rendering templates, Reactus rendering helpers, browser-safe provider exports, layout components, notifier helpers, and Stackpress-specific helpers such as `setViewProps`.

## Import

```ts
import {
  CLIENT_TEMPLATE,
  DOCUMENT_TEMPLATE,
  ServerProvider,
  notify,
  setViewProps
} from 'stackpress/view';
```

## When To Use It

Use this path when you are configuring rendering, wiring page props, building Stackpress pages, or consuming the framework-provided view helpers and components.

## Export Inventory

| Export | Kind | Purpose |
| --- | --- | --- |
| `DOCUMENT_TEMPLATE`, `PAGE_TEMPLATE`, `CLIENT_TEMPLATE` | constants | Default template entrypoints |
| `renderJSX`, `fileHash`, Vite plugins | functions | Rendering and build helpers |
| `DocumentBuilder`, `DocumentLoader`, `DocumentRender`, `ServerLoader`, `VirtualServer` | classes | Rendering/build runtime classes |
| provider hooks such as `useResponse`, `useConfig`, `useSession` | hooks | Read request, response, config, session, and theme data |
| layout components such as `LayoutHead`, `LayoutPanel`, `LayoutProvider` | components | Build Stackpress page layouts |
| `flash`, `notify`, `unload`, `NotifierContainer` | helpers/components | Client notification helpers |
| `setViewProps` | function | Copy view, brand, and language config into `res.data` |

## Detailed Exports

### Template Constants

#### `DOCUMENT_TEMPLATE`

- Kind: constant
- Use it as the default document template entrypoint for server-side rendering.

```ts
import { DOCUMENT_TEMPLATE } from 'stackpress/view';
```

#### `PAGE_TEMPLATE`

- Kind: constant
- Use it as the page template entrypoint when rendering one page surface.

```ts
import { PAGE_TEMPLATE } from 'stackpress/view';
```

#### `CLIENT_TEMPLATE`

- Kind: constant
- Use it as the client bundle template entrypoint during view/client generation or development bootstraps.

```ts
import { CLIENT_TEMPLATE } from 'stackpress/view';
```

### Rendering Helpers

#### `renderJSX`

- Kind: function
- Use it to render JSX into the output expected by the Stackpress view pipeline.
- **Returns** rendered markup or rendering output compatible with the current rendering stage.

```ts
import { renderJSX } from 'stackpress/view';
```

#### `fileHash`

- Kind: function
- Use it to generate a stable content hash for file-oriented rendering assets.
- **Returns** a short hash string.

```ts
import { fileHash } from 'stackpress/view';
```

#### `viteCSSPlugin`, `viteFilePlugin`, `viteHMRPlugin`, `viteVFSPlugin`

- Kind: plugin factory functions
- Use them when wiring Vite around the Stackpress view build/runtime layer.

```ts
import { viteCSSPlugin, viteVFSPlugin } from 'stackpress/view';
```

### Runtime Classes

#### `DocumentBuilder`, `DocumentLoader`, `DocumentRender`

- Kind: classes
- Use them when working directly with the server-rendered document build pipeline.

```ts
import { DocumentBuilder, DocumentLoader } from 'stackpress/view';
```

#### `ServerLoader`, `ServerManifest`, `ServerResource`, `VirtualServer`

- Kind: classes
- Use them when working with server-side resource resolution, manifest loading, or virtualized rendering resources.

```ts
import { ServerLoader, VirtualServer } from 'stackpress/view';
```

### Provider Hooks

#### `useRequest`

- Kind: hook
- Use it in React views when you need access to request data passed through the server provider.

```tsx
import { useRequest } from 'stackpress/view';
```

#### `useResponse`

- Kind: hook
- Use it in React views when you need the response payload, including `response.results`, status, and error data.

```tsx
import { useResponse } from 'stackpress/view';

const response = useResponse<{ title: string }>();
```

#### `useConfig`

- Kind: hook
- Use it to read view-facing config values already made available to the client view tree.

```tsx
import { useConfig } from 'stackpress/view';
```

#### `useSession`

- Kind: hook
- Use it to read session data made available to the current view tree.

```tsx
import { useSession } from 'stackpress/view';
```

#### `useServer`

- Kind: hook
- Use it when you need the broader server-facing context exposed to the view layer.

```tsx
import { useServer } from 'stackpress/view';
```

#### `useTheme`

- Kind: hook
- Use it to read or respond to theme state.

```tsx
import { useTheme } from 'stackpress/view';
```

#### `useLanguage`

- Kind: hook
- Use it to read language or translation state from the view layer.

```tsx
import { useLanguage } from 'stackpress/view';
```

### Layout Components

- `LayoutHead`
- `LayoutLeft`
- `LayoutMain`
- `LayoutMenu`
- `LayoutRight`
- `LayoutUser`
- `LayoutProvider`
- `LayoutBlank`
- `LayoutPanel`

Kind: components

Use these to assemble Stackpress page layouts from the shared view layer instead of rebuilding every page shell by hand.

```tsx
import { LayoutHead, LayoutMain, LayoutPanel } from 'stackpress/view';
```

### Notification Helpers

#### `flash`

- Kind: function
- Use it to create a short-lived notification entry.

```ts
import { flash } from 'stackpress/view';
```

#### `notify`

- Kind: function
- Use it to push a notification into the active notifier system.

```ts
import { notify } from 'stackpress/view';
```

#### `unload`

- Kind: function
- Use it to clear or dismiss notification state when the notifier flow requires it.

```ts
import { unload } from 'stackpress/view';
```

#### `NotifierContainer`

- Kind: component
- Use it to render the notification UI for the current page tree.

```tsx
import { NotifierContainer } from 'stackpress/view';
```

### `setViewProps`

- Kind: function
- Signature:

```ts
setViewProps(req: Request, res: Response, ctx: Server): void
```

- Arguments:
  - `req`: current request
  - `res`: current response
  - `ctx`: current server context
- **Returns** nothing
- Behavior:
  - skips work when the no-view flag is present
  - copies `view`, `brand`, and `language` config into `res.data`
  - ensures the rendering layer receives common page props

```ts
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
import type { RouteProps } from 'stackpress/types';

export default action(async function HomePage({ req, res, ctx }: RouteProps) {
  res.results({ title: 'Hello' });
  setViewProps(req, res, ctx);
});
```

## Related

 - [View Detail Pages](./view/README.md)
 - [setViewProps](./view/setViewProps.md)
 - [View Client Hooks](./view/hooks.md)
 - [View Client](./view-client.md)
 - [Config Reference](./config-reference.md)
 - [Views](../guides/100/140-views.md)
