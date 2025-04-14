//modules
import type { JSX, ReactNode } from 'react';
import type { 
  OutputChunk, 
  OutputAsset, 
  RollupOutput 
} from 'rollup';
import type { 
  PluginOption, 
  InlineConfig, 
  ViteDevServer, 
  Connect as ViteConnect 
} from 'vite';
import type { 
  DocumentImport, 
  DocumentIterator,
  ServerManifest,
  BuildResults,
  Builder as ReactusBuilder, 
  ServerConfig as ReactusConfig 
} from 'reactus';
import type ReactusPreview from 'reactus/server/Server';
//stackpress
import type { UnknownNest, StatusResponse } from '@stackpress/lib/types';
import type { IM, SR, Method } from '@stackpress/ingest/types';
//language
import { LanguageConfig } from '../language/types';
//session
import type { SessionTokenData } from '../session/types';

//--------------------------------------------------------------------//
// Server Prop Types

export type ServerUrlProps = {
  hash: string,
  host: string,
  hostname: string,
  href: string,
  origin: string,
  pathname: string,
  port: string,
  protocol: string,
  search: string
};
export type ServerSessionProps = SessionTokenData;
export type ServerRequestProps<
  I extends UnknownNest = UnknownNest
> = {
  url: ServerUrlProps,
  headers: Record<string, string|string[]>,
  session: Record<string, string|string[]>,
  method: Method,
  mime: string,
  data: I
};
export type ServerResponseProps<
  O = UnknownNest
> = Partial<StatusResponse<O>>;

export type ServerProps<
  C extends UnknownNest = UnknownNest,
  I extends UnknownNest = UnknownNest,
  O = UnknownNest
> = {
  data: C,
  session: ServerSessionProps,
  request: ServerRequestProps<I>,
  response: ServerResponseProps<O>
}

export type ServerContextProps = ServerProps<
  UnknownNest, 
  UnknownNest, 
  any
>;
export type ServerProviderProps<
  C extends UnknownNest = UnknownNest,
  I extends UnknownNest = UnknownNest,
  O = UnknownNest
> = Partial<ServerProps<C, I, O>> & { 
  children: ReactNode 
};

export type ServerConfigProps<
  C extends UnknownNest = UnknownNest
> = C & {
  language: LanguageConfig,
  view: ViewConfig,
  brand: BrandConfig
};

export type ServerPageProps<
  C extends UnknownNest = UnknownNest,
  I extends UnknownNest = UnknownNest,
  O = UnknownNest
> = ServerProps<C, I, O> & { styles?: string[] };

//--------------------------------------------------------------------//
// Element Types

export type Crumb = { 
  href?: string, 
  label: string|JSX.Element, 
  icon?: string,
  permit?: string[]
};

export type CrumbsProps = {
  crumbs: Crumb[], 
  className?: string
};

export type PaginationProps = {
  total?: number,
  skip?: number, 
  take?: number, 
  radius?: number,
  paginate?: Function
};

//--------------------------------------------------------------------//
// Layout Types

export type LayoutHeadProps = {
  open?: boolean,
  theme: string,
  base?: string,
  logo?: string,
  brand?: string,
  toggleLeft?: () => void,
  toggleRight?: () => void,
  toggleTheme?: () => void
};

export type LayoutLeftProps = {
  brand?: string,
  base?: string,
  logo?: string,
  open: boolean,
  toggle: () => void,
  children: ReactNode
};

export type LayoutMainProps = {
  head?: boolean,
  open?: boolean,
  children: ReactNode
};

export type LayoutMenuProps = {
  path?: string,
  menu: {
    name: string;
    icon: string;
    path: string;
    match: string;
  }[]
};

export type LayoutRightProps = {
  open: boolean
  children: ReactNode
};

export type LayoutProviderProps = Partial<ServerProps<ServerConfigProps>> & {
  children: ReactNode
};

export type BlankAppProps = {
  head?: boolean,
  children: ReactNode
};

export type LayoutBlankProps = LayoutProviderProps & {
  head?: boolean
};

export type PanelAppProps = { 
  menu?: {
    name: string;
    icon: string;
    path: string;
    match: string;
  }[],
  left?: ReactNode,
  right?: ReactNode,
  children: ReactNode
};

export type LayoutPanelProps = LayoutProviderProps & PanelAppProps;

//--------------------------------------------------------------------//
// Modal Types

export type ModalConfirmProps = { 
  open: Function,
  message: ReactNode
  confirmed: Function
};

export type ModalContextProps = { 
  _title: string,
  _className: string,
  _body?: ReactNode,
  opened: boolean,
  title: (title: string) => void,
  open: (opened: boolean) => void,
  className: (className: string) => void,
  body: (body: ReactNode) => void
};

export type ModalProviderProps = { 
  title?: string,
  className?: string,
  children: ReactNode
};

//--------------------------------------------------------------------//
// Notify Types

export type NotifyContextProps = {
  config: {
    position: string,
    autoClose: number,
    hideProgressBar: boolean,
    closeOnClick: boolean,
    pauseOnHover: boolean,
    draggable: boolean,
    theme: string,
  }
};

export type NotifyProviderProps = { 
  config?: {
    position: string,
    autoClose: number,
    hideProgressBar: boolean,
    closeOnClick: boolean,
    pauseOnHover: boolean,
    draggable: boolean,
    theme: string,
  },
  children: ReactNode 
};

//--------------------------------------------------------------------//
// Theme Types

export type ThemeContextProps = { 
  theme: string,
  toggle: () => void
};

export type ThemeProviderProps = { 
  theme?: string,
  children: ReactNode 
};

//--------------------------------------------------------------------//
// View Props Types

export type { AdminConfigProps } from '../admin/types';
export type { ApiConfigProps } from '../api/types';

export type { AuthConfigProps } from '../session/types';

export type FieldProps = {
  className?: string,
  error?: boolean,
  name?: string,
  value: any,
  change?: (name: string, value: any) => void
};

export type ControlProps = {
  className?: string,
  error?: string,
  name?: string,
  value: any,
  change?: (name: string, value: any) => void
}

//--------------------------------------------------------------------//
// Config Types

//ie. ctx.config<NotifyConfig>('view', 'notify')
export type NotifyConfig = {
  position: string,
  autoClose: number,
  hideProgressBar: boolean,
  closeOnClick: boolean,
  pauseOnHover: boolean,
  draggable: boolean,
  theme: string,
};

//ie. ctx.config<ViewConfig>('view')
export type ViewConfig = {
  noview?: string,
  base?: string,
  notify?: NotifyConfig,
  props?: Record<string, unknown>,
  engine?: Partial<ReactusConfig>
};

//ie. ctx.config<BrandConfig>('brand')
export type BrandConfig = {
  name?: string,
  logo?: string,
  icon?: string,
  favicon?: string
};

//--------------------------------------------------------------------//
// Plugin Types

//ie. ctx.plugin<ViewPlugin>('view')
export type ViewPlugin = {
  config: ReactusConfig,
  paths: {
    asset: string,
    client: string,
    css?: string,
    head?: string,
    page: string
  };
  production: boolean,
  routes: { client: string, css: string },
  templates: {
    client: string,
    document: string,
    page: string
  };
  viteConfig: InlineConfig|null,
  size: number,
  builder: ReactusBuilder,
  build: (config: InlineConfig) => Promise<RollupOutput|RollupOutput[]>,
  dev: () => Promise<ViteDevServer>,
  http: (req: IM, res: SR) => Promise<unknown>,
  middlewares: () => Promise<ViteConnect.Server>,
  plugins: () => Promise<PluginOption[]>,
  fetch: <T = any>(url: string) => Promise<T>,
  import: <T = any>(pathname: string, extnames?: string[]) => Promise<T>,
  resolve: (pathname: string, extnames?: string[]) => Promise<FileMeta>,
  buildAllAssets: () => Promise<StatusResponse<BuildResults>[]>,
  buildAllClients: () => Promise<StatusResponse<BuildResults>[]>,
  buildAllPages: () => Promise<StatusResponse<BuildResults>[]>,
  entries: () => [ Document, number ][],
  find: (id: string) => Document | null,
  forEach: (callback: DocumentIterator<unknown>) => void,
  get: (entry: string) => Promise<Document | null>,
  has: (entry: string) => Promise<boolean>,
  load: (hash: Record<string, string>) => ServerManifest,
  open: (file: string) => Promise<ServerManifest>,
  map: <T = unknown>(callback: DocumentIterator<T>) => T[],
  save: (file: string) => Promise<ServerManifest>,
  set: (entry: string) => Promise<Document>,
  toJSON: () => { [k: string]: string },
  values: () => Document[],
  absolute: (entry: string) => Promise<string>,
  id: (entry: string) => Promise<string>,
  importPage: (entry: string) => Promise<DocumentImport>,
  relative: (entry: string, fromFile: string) => Promise<string>,
  buildAssets: (entry: string) => Promise<RollupResults>,
  buildClient: (entry: string) => Promise<RollupResults>,
  buildPage: (entry: string, assets?: BuildResults) => Promise<RollupResults>,
  renderHMR: (entry: string) => Promise<string>,
  render: (entry: string, props?: UnknownNest) => Promise<string>
};

//ie. ctx.plugin<ViewPlugin>('view')
export type PreviewPlugin = {
  config: ReactusConfig,
  paths: {
    asset: string,
    client: string,
    css?: string,
    head?: string,
    page: string
  };
  routes: { client: string, css: string },
  templates: {
    client: string,
    document: string,
    page: string
  };
  server: ReactusPreview,
  render: (entry: string, props?: UnknownNest) => Promise<string>
};

//--------------------------------------------------------------------//
// Other Types

export type {
  Trace,
  UnknownNest,
  NestedObject,
  SuccessResponse, 
  ErrorResponse, 
  ResponseStatus, 
  StatusResponse 
} from '@stackpress/lib/types';

export type { 
  SessionRoute,
  SessionData,
  SessionTokenData,
  SessionPermission,
  SessionPermissionList
} from '../session/types';

export type {
  CSVParseError,
  CSVParseResults,
  BatchSendResults,
  BatchSendResponse
} from './import';

export type RollupResults = [ 
  OutputChunk, 
  ...(OutputAsset | OutputChunk)[]
];

export type FileMeta = {
  filepath: string,
  basepath: string,
  extname: string
};