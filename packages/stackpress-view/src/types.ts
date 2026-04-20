//modules
import type { ReactNode } from 'react';
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
import type { UnknownNest, StatusResponse } from '@stackpress/lib/types';
import type { IM, SR, Method } from '@stackpress/ingest/types';

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
export type ServerSessionRoute = { method: string, route: string };
export type ServerSessionPermission = string | ServerSessionRoute;
export type ServerSessionProps = Record<string, any> & { 
  id: string, 
  name: string,
  image?: string,
  roles: string[],
  token: string,
  permits: ServerSessionPermission[]
};
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
  language: {
    //url flag (ie. ?locale) used to change the user's locale
    //this is also the name of the cookie used to store the locale
    //defaults to `locale`
    key?: string,
    //default locale
    //defaults to `en_US`
    locale?: string,
    //languages and translations
    languages?: Record<string, {
      label: string,
      translations: Record<string, string>
    }>
  },
  view: ViewConfig
};

export type ServerPageProps<
  C extends UnknownNest = UnknownNest,
  I extends UnknownNest = UnknownNest,
  O = UnknownNest
> = ServerProps<C, I, O> & { styles?: string[] };

//--------------------------------------------------------------------//
// Config Types

//ie. ctx.config<ViewConfig>('view')
export type ViewConfig = {
  //url flag (ie. ?json) used to disable template 
  //rendering and show the raw json data instead
  //defaults to `json`
  noview?: string,
  //used by vite and in development mode
  //to determine the root of the project
  //defaults to `/`
  base?: string,
  props?: Record<string, unknown>,
  //reactus settings
  //if not provided, disables `reactus`
  engine?: Partial<ReactusConfig>
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

export type RollupResults = [ 
  OutputChunk, 
  ...(OutputAsset | OutputChunk)[]
];

export type FileMeta = {
  filepath: string,
  basepath: string,
  extname: string
};