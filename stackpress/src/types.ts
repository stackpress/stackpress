//modules
import type { Directory } from 'ts-morph';
import type { TransportOptions } from 'nodemailer';
import type { Options as JSONOptions } from 'nodemailer/lib/json-transport';
import type { Options as MailOptions } from 'nodemailer/lib/sendmail-transport';
import type { Options as SESOptions } from 'nodemailer/lib/ses-transport';
import type { Options as PoolOptions } from 'nodemailer/lib/smtp-pool';
import type { Options as SMTPOptions } from 'nodemailer/lib/smtp-transport';
import type { Options as StreamOptions } from 'nodemailer/lib/stream-transport';
import type { RollupOutput, OutputChunk, OutputAsset } from 'rollup';
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
import type { 
  Method, 
  UnknownNest, 
  StatusResponse
} from '@stackpress/lib/types';
import type { Data, SchemaConfig } from '@stackpress/idea-parser/types';
import type { PluginProps } from '@stackpress/idea-transformer/types';
import type { IM, SR, CookieOptions } from '@stackpress/ingest/types';
import type Server from '@stackpress/ingest/Server';
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Engine from '@stackpress/inquire/Engine';
import type Create from '@stackpress/inquire/Create';
//schema
import type Model from './schema/spec/Model';
import type Column from './schema/spec/Column';
import type Fieldset from './schema/spec/Fieldset';
import type Registry from './schema/Registry';
//local
import type InceptTerminal from './terminal/Terminal';
import type SessionRegistry from './session/Session';
import type SessionLanguage from './session/Language';

import type { Actions } from './sql/actions';

//--------------------------------------------------------------------//
// General Types

export type Scalar = string | number | boolean | null | undefined;

//--------------------------------------------------------------------//
// Schema Types

export type IdeaProjectProps = {
  cli: InceptTerminal,
  project: Directory
};

export type IdeaPluginWithProject = PluginProps<IdeaProjectProps>;

export type SchemaAssertion = {
  method: string,
  args: unknown[],
  message: string|null
};

export type SchemaRelation = {
  local: string,
  foreign: string,
  name?: string
};

export type SchemaColumnInfo = {
  type: string;
  name: string;
  required: boolean;
  multiple: boolean;
  attributes: Record<string, unknown>;
};

export type SchemaComponent = {
  method: string;
  args: Data[];
  attributes: Record<string, Data>;
}

export type SchemaColumnRelation = { 
  model: Model, 
  column: Column, 
  key: Column, 
  type: number 
};

export type SchemaColumnRelationLink = { 
  parent: SchemaColumnRelation,
  child: SchemaColumnRelation
};

export type SchemaSerialOptions = {
  bool?: boolean,
  date?: boolean,
  object?: boolean
};

//--------------------------------------------------------------------//
// Language Types

export type Language = {
  label: string,
  translations: Record<string, string>
};

export type LanguageMap = Record<string, Language>;

export type LanguageConstructor = {
  get key(): string;
  get locales(): string[];
  set languages(languages: LanguageMap);
  configure(key: string, languages: LanguageMap): LanguageConstructor;
  language(name: string): Language | null;
  load(req: Request, defaults?: string): SessionLanguage;
  new (): SessionLanguage; 
}

//--------------------------------------------------------------------//
// SQL Types

export type SearchParams = {
  q?: string,
  columns?: string[],
  include?: string[],
  filter?: Record<string, string|number|boolean>,
  span?: Record<string, (string|number|null|undefined)[]>,
  sort?: Record<string, any>,
  skip?: number,
  take?: number,
  total?: boolean
};

export type SearchJoin = {
  table: string,
  from: string,
  to: string,
  alias: string
}

export type SearchJoinMap = Record<string, SearchJoin>;

export type SearchPath = {
  model: Model,
  column: Column
};

//--------------------------------------------------------------------//
// API Types

export type ApiEndpoint = {
  name?: string,
  description?: string,
  example?: string,
  method: Method,
  route: string,
  type: 'public'|'app'|'session',
  scopes?: string[],
  event: string,
  priority?: number,
  data: Record<string, Data>
};

export type ApiScope = {
  icon?: string,
  name: string,
  description: string
};

export type ApiWebhook = {
  //ie. auth-signin
  event: string, 
  //ie. http://localhost:3000/api/webhook
  uri: string,
  method: Method,
  validity: UnknownNest,
  data: UnknownNest
};

//--------------------------------------------------------------------//
// Session Types

export type SessionRoute = { method: string, route: string };
export type SessionPermission = string | SessionRoute;
export type SessionPermissionList = Record<string, SessionPermission[]>;
export type SessionData = Record<string, any> & { 
  id: string, 
  name: string,
  image?: string,
  roles: string[]
};
export type SessionTokenData = SessionData & {
  token: string
};

export type SessionConstructor = { 
  get access(): SessionPermissionList;
  get seed(): string;
  get key(): string;
  set expires(value: number);
  configure(key: string, seed: string, access: SessionPermissionList): void;
  authorize(req: Request, res: Response, permits?: SessionPermission[]): boolean;
  create(data: SessionData): string;
  token(req: Request): string | null;
  load(token: string | Request): SessionRegistry;
  new (): SessionRegistry 
};

export type SignupInput = {
  name: string,
  type?: string,
  username?: string,
  email?: string,
  phone?: string,
  secret: string,
  roles: string[]
};

export type SigninInput = {
  username?: string,
  email?: string,
  phone?: string,
  secret: string
};

export type SigninType = 'username' | 'email' | 'phone';

//--------------------------------------------------------------------//
// View Types

export type RollupResults = [ OutputChunk, ...(OutputAsset | OutputChunk)[]];
export type FileMeta = {
  filepath: string,
  basepath: string,
  extname: string
};

//--------------------------------------------------------------------//
// Server Configuration Types

export type ServerConfig = {
  cwd: string,
  mode: string,
  port: number,
  build: string,
  bodySize: number
};

export type ClientConfig = {
  lang: string,
  revisions: string,
  build: string,
  module: string,
  tsconfig: string
};

export type AdminConfig = {
  root: string,
  name: string,
  logo: string,
  menu: {
    name: string,
    icon: string,
    path: string,
    match: string
  }[]
};

export type ApiConfig = {
  expires: number,
  scopes: Record<string, ApiScope>,
  endpoints: ApiEndpoint[],
  webhooks: ApiWebhook[]
};

export type EmailConfig = TransportOptions
  | JSONOptions
  | MailOptions
  | SESOptions
  | PoolOptions
  | SMTPOptions
  | StreamOptions
  | string ;

export type LanguageConfig = {
  key: string,
  locale: string,
  languages: LanguageMap
};

export type DatabaseConfig = {
  migrations: string,
  schema: {
    onDelete: 'CASCADE'|'SET NULL'|'RESTRICT',
    onUpdate: 'CASCADE'|'SET NULL'|'RESTRICT'
  }
};

export type ViewConfig = Partial<ReactusConfig>;

export type AuthConfig = {
  name: string,
  logo: string,
  '2fa': {},
  captcha: {},
  roles: string[],
  username: boolean,
  email: boolean,
  phone: boolean,
  password: {
    min: number,
    max: number,
    upper: boolean,
    lower: boolean,
    number: boolean,
    special: boolean
  }
};

export type SessionConfig = {
  key: string,
  seed: string,
  access: SessionPermissionList
};

export type Config = UnknownNest & {
  server: ServerConfig,
  client?: ClientConfig,
  cookie?: CookieOptions,
  admin?: AdminConfig,
  api?: ApiConfig,
  email?: EmailConfig,
  language?: LanguageConfig,
  database?: DatabaseConfig,
  view?: ViewConfig,
  auth?: AuthConfig,
  session?: SessionConfig
};

//--------------------------------------------------------------------//
// Server Plugin Types

export type ClientPlugin<
  M extends Record<string, unknown> = {},
  F extends Record<string, unknown> = {}
> = {
  config: SchemaConfig,
  registry: Registry,
  fieldset: Record<string, F & { config: Fieldset }>,
  model: Record<string, M & { 
    config: Model,
    events: Server,
    schema: Create,
    actions: (engine: Engine) => Actions<M>,
    admin(server: Server<any, any, any>): void
  }>
};

export type LanguagePlugin = LanguageConstructor;
export type DatabasePlugin = Engine;
export type SessionPlugin = SessionConstructor;

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

//--------------------------------------------------------------------//
// Model Types

export type Profile = {
  id: string;
  name: string;
  image?: string;
  type: string;
  roles: string[];
  tags: string[];
  references?: Record<string, string | number | boolean | null>;
  active: boolean;
  created: Date;
  updated: Date;
};
export type ProfileExtended = Profile;
export type ProfileInput = {
  id?: string;
  name: string;
  image?: string;
  type?: string;
  roles: string[];
  tags?: string[];
  references?: Record<string, string | number | boolean | null>;
  active?: boolean;
  created?: Date;
  updated?: Date;
};
export type Auth = {
  id: string;
  profileId: string;
  type: string;
  nonce: string;
  token: string;
  secret: string;
  verified: boolean;
  consumed: Date;
  active: boolean;
  created: Date;
  updated: Date;
};
export type AuthExtended = Auth & {
  profile: Profile;
};
export type AuthInput = {
  id?: string;
  profileId: string;
  type?: string;
  token: string;
  secret: string;
  verified?: boolean;
  consumed?: Date;
  active?: boolean;
  created?: Date;
  updated?: Date;
};
export type ProfileAuth = Profile & { auth: Record<string, Partial<Auth>> };

export type Application = {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  secret: string;
  scopes: string[];
  active: boolean;
  expires: Date;
  created: Date;
  updated: Date;
};
export type ApplicationExtended = Application;
export type ApplicationInput = {
  id?: string;
  name: string;
  logo?: string;
  website?: string;
  secret?: string;
  scopes?: string[];
  active?: boolean;
  expires: Date;
  created?: Date;
  updated?: Date;
};

export type Session = {
  id: string;
  applicationId: string;
  profileId: string;
  secret: string;
  scopes: string[];
  active: boolean;
  expires: Date;
  created: Date;
  updated: Date;
};
export type SessionExtended = Session & {
  application: Application;
  profile: Profile;
};
export type SessionInput = {
  id?: string;
  applicationId: string;
  profileId: string;
  secret?: string;
  scopes?: string[];
  active?: boolean;
  expires: Date;
  created?: Date;
  updated?: Date;
};