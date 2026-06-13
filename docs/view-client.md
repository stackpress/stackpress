# `stackpress/view/client`

`stackpress/view/client` is the browser-safe view shelf. It re-exports the client-safe hooks, provider components, layout components, notifier helpers, and selected admin client helpers that are safe to import into browser-facing code.

## Import

```ts
import {
  useResponse,
  useConfig,
  notify,
  LayoutPanel
} from 'stackpress/view/client';
```

## When To Use It

Use this path when your code runs in the browser and you want to avoid pulling in server-side rendering helpers from the broader `stackpress/view` path.

## Export Inventory

| Export | Kind | Purpose |
| --- | --- | --- |
| `useRequest`, `useResponse`, `useConfig`, `useSession`, `useServer` | hooks | Read current request, response, config, session, or server context |
| `useTheme`, `useLanguage` | hooks | Read theme and language context |
| `ServerProvider`, `ThemeProvider` and related context components | components | Provide current request/session/config/theme data |
| layout components | components | Build standard view layouts |
| `flash`, `notify`, `unload`, `NotifierContainer` | helpers/components | Render and manage notifications |
| `filter`, `order`, `paginate` | helpers | Client-side admin query helpers |

## Detailed Exports

### `useResponse`

- Kind: hook
- Use it to read the current response payload inside a client-side React view.
- **Returns** the response object currently provided by the Stackpress view tree.

```tsx
import { useResponse } from 'stackpress/view/client';

const response = useResponse<{ title: string }>();
```

### `useConfig`

- Kind: hook
- Use it to read the config payload exposed to the current page tree.

```tsx
import { useConfig } from 'stackpress/view/client';
```

### `useSession`

- Kind: hook
- Use it to read session data from the current page tree.

```tsx
import { useSession } from 'stackpress/view/client';
```

### `useServer`

- Kind: hook
- Use it to read the broader server payload exposed to the current view tree.

```tsx
import { useServer } from 'stackpress/view/client';
```

### `notify`, `flash`, `unload`

- Kind: functions
- Use them to create, push, or clear notification entries in the browser-safe view layer.

```ts
import { notify, flash, unload } from 'stackpress/view/client';
```

### `NotifierContainer`

- Kind: component
- Use it to render active notifications.

```tsx
import { NotifierContainer } from 'stackpress/view/client';
```

### `ServerProvider`

- Kind: component
- Use it to make request, response, config, and session data available to nested hooks and components.

```tsx
import { ServerProvider } from 'stackpress/view/client';
```

### `filter`, `order`, `paginate`

- Kind: functions
- Use them when building or transforming admin/client query state in browser-safe code.

```ts
import { filter, order, paginate } from 'stackpress/view/client';
```

## Related

 - [View Client Hooks](./view/hooks.md)
 - [View](./view.md)
 - [Client Output](../guides/300/334-client-output.md)
