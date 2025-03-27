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
//stackpress
import type { UnknownNest, StatusResponse } from '@stackpress/lib/types';
import type { IM, SR } from '@stackpress/ingest/types';
//session
import type { SessionPermission } from '../session/types';

//--------------------------------------------------------------------//
// View Types

export type RollupResults = [ OutputChunk, ...(OutputAsset | OutputChunk)[]];

export type FileMeta = {
  filepath: string,
  basepath: string,
  extname: string
};

export type PageBodyProps<
  C extends UnknownNest = UnknownNest,
  I extends UnknownNest = UnknownNest,
  O = undefined
> = {
  data: C,
  session: {
    token: string;
    permits: SessionPermission[];
    id: string | number;
    name?: string | undefined;
    image?: string;
    roles: string[];
  },
  request: {
    url: {
      hash: string,
      host: string,
      hostname: string,
      href: string,
      origin: string,
      pathname: string,
      port: string,
      protocol: string,
      search: string
    },
    headers: UnknownNest,
    session: UnknownNest,
    method: string,
    mime: string,
    data: I
  },
  response: StatusResponse<O>
}

export type PageHeadProps<
  C extends UnknownNest = UnknownNest,
  I extends UnknownNest = UnknownNest,
  O = undefined
> = PageBodyProps<C, I, O> & { styles?: string[] }; 

export type FieldProps = {
  className?: string,
  error?: boolean,
  value: any,
  change: (name: string, value: any) => void
};

export type ControlProps = {
  className?: string,
  error?: string,
  value: any,
  change: (name: string, value: any) => void
}

export type AdminDataProps = {
  icon?: string,
  logo?: string,
  brand?: string,
  base?: string,
  admin: { 
    root: string,
    name: string, 
    logo: string,
    menu: {
      name: string,
      icon: string,
      path: string,
      match: string
    }[]
  }
};

//ie. ctx.config<ViewConfig>('view')
export type ViewConfig = {
  props: Record<string, unknown> & {
    icon?: string,
    logo?: string,
    brand?: string,
    base?: string
  },
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