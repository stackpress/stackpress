//Desktop runtime modes supported by config. Protocol is reserved by config
// validation for a later milestone.
export type DesktopRuntime = 'http' | 'protocol';

//HTTP methods accepted by desktop route allowlist rules.
export type DesktopRouteMethod = (
  | 'ALL'
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
);

//One configured desktop route allowlist rule.
export type DesktopRouteRule = {
  method?: DesktopRouteMethod;
  route: string;
};

//User-authored desktop config read from the Stackpress config tree and from
// plugin lifecycle contributions.
export type DesktopConfig = {
  runtime?: DesktopRuntime;
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
    nativeCapabilities?: string[];
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

//Fully defaulted desktop config used by runtime, build, manifest, and packaging
// code after normalizeDesktopConfig() succeeds.
export type NormalizedDesktopConfig = Required<
  Pick<DesktopConfig, 'runtime' | 'app' | 'server' | 'window' | 'menu' | 'updater' | 'data' | 'build'>
> & {
  security: {
    externalNavigation: 'deny' | 'open-external';
    allowDevTools: boolean;
    nativeCapabilities: string[];
  };
  routes: DesktopRouteRule[];
  package: {
    tool: 'electron-builder';
    icon?: string;
    output: string;
  };
  electron: Record<string, unknown>;
};

//Route metadata record collected from Stackpress routes and written to desktop
// build manifests.
export type DesktopRouteRecord = {
  route: string;
  method?: DesktopRouteMethod | string;
};

//Summary of registered routes excluded by the desktop route allowlist.
export type DesktopBlockedRoutesSummary = {
  count: number;
  reasons: string[];
};

//Menu contribution shape used by app plugins to add native desktop menu items.
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

//Electron-compatible menu item shape compiled from desktop menu contributions.
export type DesktopElectronMenuItem = {
  id?: string;
  label?: string;
  role?: string;
  enabled?: boolean;
  submenu?: DesktopElectronMenuItem[];
  click?: () => void | Promise<void>;
};

//Electron-compatible menu group shape compiled from registry groups.
export type DesktopElectronMenuGroup = {
  label: string;
  submenu: DesktopElectronMenuItem[];
};

//Compiled registry group shape shared between runtime compilation and generated
// Electron main source generation.
export type DesktopCompiledMenuGroup = {
  menu: string;
  items: DesktopMenuContribution[];
};

//Plugin-held desktop state registered on the Stackpress server.
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
  menu: unknown;
  initialized?: boolean;
};

//Build manifest contract written to disk for packaging and diagnostics.
export type DesktopBuildManifest = {
  schemaVersion: 1;
  app: {
    id: string;
    name: string;
    version: string;
  };
  runtime: {
    mode: 'http';
    host: '127.0.0.1';
    open: string;
  };
  window: {
    width: number;
    height: number;
    title: string;
  };
  routes: {
    mode: 'allow-all' | 'allowlist';
    rules: DesktopRouteRule[];
    allowed: DesktopRouteRecord[];
    blockedSummary: DesktopBlockedRoutesSummary;
  };
  files: {
    main: string;
    preload: string;
    assets: string;
  };
  package: {
    tool: 'electron-builder';
    output: string;
  };
};

//Build command output returned by desktop build actions and helper scripts.
export type DesktopBuildOutput = {
  manifestPath: string;
  mainPath: string;
  preloadPath: string;
  appMetadata: DesktopBuildManifest['app'];
  startRoute: string;
  allowedRoutes: DesktopRouteRecord[];
  blockedRoutesSummary: {
    count: number;
    reasons: string[];
  };
  packagingInputs: DesktopBuildManifest['files'];
  generatedAt: string;
};

//Package command artifact returned on successful or failed packaging attempts.
export type DesktopPackageArtifact = {
  status: 'created' | 'failed';
  tool: 'electron-builder';
  platform: string;
  outputPath?: string;
  message: string;
};
