# Contract: Desktop Plugin And Menu Contributions

## Desktop Plugin

`stackpress-desktop` registers a `desktop` plugin value before native desktop
initialization.

```ts
export type DesktopPlugin = {
  app: unknown;
  BrowserWindow: unknown;
  Menu: unknown;
  shell: unknown;
  dialog: unknown;
  ipcMain: unknown;
  nativeImage: unknown;
  autoUpdater?: unknown;
  config: DesktopConfig;
  menu: DesktopMenuRegistry;
};
```

Electron types should be used in implementation. The contract keeps this
document focused on the public boundary rather than exact imports.

## Menu Contribution Shape

```ts
export type DesktopMenuContribution = {
  id: string;
  menu: 'app' | 'file' | 'edit' | 'view' | 'window' | 'help' | string;
  label?: string;
  priority?: number;
  role?: string;
  event?: string;
  enabled?: boolean;
  submenu?: DesktopMenuContribution[];
};
```

## Required Behavior

- Contributions target common desktop menu groups.
- Contributions compile in deterministic order.
- Duplicate ids produce a clear failure.
- Items with `event` trigger app-defined desktop behavior through Stackpress.
- The update placeholder appears disabled when updater providers are not
  configured for this milestone.
- Plugins contribute through `desktop:config` and `desktop:menu`; replacing the
  full desktop setup is not required.
