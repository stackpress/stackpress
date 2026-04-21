//modules
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
import type { StatusResponse, UnknownNest } from '@stackpress/lib/types';
import type { IM, SR } from '@stackpress/ingest/types';
//stackpress-view
import type { ViewConfig as ClientViewConfig } from './client/types.js';

//ie. ctx.config<ViewConfig>('view')
export type ViewConfig = ClientViewConfig & {
  //reactus settings
  //if not provided, disables `reactus`
  engine?: Partial<ReactusConfig>
};

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

export type RollupResults = [ 
  OutputChunk, 
  ...(OutputAsset | OutputChunk)[]
];

export type FileMeta = {
  filepath: string,
  basepath: string,
  extname: string
};

export type {
  Trace,
  UnknownNest,
  NestedObject,
  SuccessResponse, 
  ErrorResponse, 
  ResponseStatus, 
  StatusResponse,
  ServerUrlProps,
  ServerSessionRoute,
  ServerSessionPermission,
  ServerSessionProps,
  ServerRequestProps,
  ServerResponseProps,
  ServerProps,
  ServerContextProps,
  ServerProviderProps,
  ThemeContextProps,
  ThemeProviderProps,
  ProviderProps,
  BrandConfig,
  LanguageConfig,
  ServerConfigProps,
  ServerPageProps,
  NotifyConfig
} from './client/types.js';