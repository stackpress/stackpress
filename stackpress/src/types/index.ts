//modules
import type { Directory } from 'ts-morph';
import type { PluginProps } from '@stackpress/idea-transformer/types';
//stackpress
import type { UnknownNest } from '@stackpress/lib/types';
import type { CookieOptions } from '@stackpress/ingest/types';
//plugins
import type { ClientConfig } from '../client/types.js';
import type { ServerConfig } from '../server/types.js';
import type { ApiConfig } from '../api/types.js';
import type { AdminConfig } from '../admin/types.js';
import type { EmailConfig } from '../email/types.js';
import type { LanguageConfig } from '../language/types.js';
import type { DatabaseConfig } from '../sql/types.js';
import type { CLIConfig } from '../terminal/types.js';
import type { ViewConfig, BrandConfig } from '../view/types.js';
import type { AuthConfig, SessionConfig } from '../session/types.js';
import type StackpressTerminal from '../terminal/Terminal.js';

export type { AdminConfig } from '../admin/types.js';

export type {
  ApiType,
  APIType,
  ApiOauthInputProps,
  ApiOauthFormProps,
  Scopes,
  ApiEndpoint,
  ApiScope,
  ApiWebhook,
  ApiConfig,
  Application,
  ApplicationExtended,
  ApplicationInput,
  Session,
  SessionExtended,
  SessionInput
} from '../api/types.js';

export type {
  ClientConfig,
  ClientPlugin
} from '../client/types.js';

export type {
  Language as LanguageData,
  LanguageMap,
  LanguageConstructor,
  LanguageConfig,
  LanguagePlugin
} from '../language/types.js';

export type {
  SchemaAssertion,
  SchemaRelation,
  SchemaColumnInfo,
  SchemaComponent,
  SchemaColumnRelation,
  SchemaColumnRelationLink,
  SchemaSerialOptions,
  ColumnOption
} from '../schema/types.js';

export type {
  CLIConfig,
  CLIPlugin
} from '../terminal/types.js';

export type { ServerConfig } from '../server/types.js';

export type {
  SessionServerConstructor,
  SignupInput,
  SigninInput,
  SigninType,
  AuthConfig,
  SessionConfig,
  SessionPlugin,
  Profile,
  ProfileExtended,
  ProfileInput,
  Auth,
  AuthExtended,
  AuthInput,
  ProfileAuth
} from '../session/types.js';

export type {
  SearchParams,
  SearchJoin,
  SearchJoinMap,
  SearchPath,
  DatabaseConfig,
  DatabasePlugin
} from '../sql/types.js';

export type {
  ServerUrlProps,
  ServerSessionProps,
  ServerRequestProps,
  ServerResponseProps,
  ServerProps,
  ServerContextProps,
  ServerProviderProps,
  ServerConfigProps,
  ServerPageProps,
  Crumb,
  CrumbsProps,
  PaginationProps,
  LayoutHeadProps,
  LayoutLeftProps,
  LayoutMenuProps,
  LayoutMainProps,
  LayoutRightProps,
  LayoutBlankProps,
  LayoutPanelProps,
  LayoutProviderProps,
  BlankAppProps,
  PanelAppProps,
  ModalConfirmProps,
  ModalContextProps,
  ModalProviderProps,
  NotifyContextProps,
  NotifyProviderProps,
  ThemeContextProps,
  ThemeProviderProps,
  AdminConfigProps,
  ApiConfigProps,
  SessionRoute,
  AuthConfigProps,
  SessionData,
  SessionTokenData,
  SessionPermission,
  SessionPermissionList,
  CSVParseError,
  CSVParseResults,
  BatchSendResults,
  BatchSendResponse,
  RollupResults,
  FieldProps,
  ControlProps,
  NotifyConfig,
  ViewConfig,
  BrandConfig,
  ViewPlugin,
  PreviewPlugin
} from '../view/types.js';

export type {
  TypeOf,
  Key,
  NestedObject,
  UnknownNest,
  Hash,
  ScalarInput,
  FileMeta,
  CallableSet,
  CallableMap,
  CallableNest,
  ResponseStatus,
  Trace,
  ErrorResponse,
  SuccessResponse,
  StatusResponse,
  Item,
  TaskResult,
  TaskAction,
  TaskItem,
  EventMap,
  EventName,
  EventMatch,
  Event,
  EventHook,
  Method,
  Route,
  RouterMap,
  RouterAction,
  FileStat,
  FileStream,
  FileSystem,
  CallSite
} from '../lib.js';

export type { 
  EnumConfig,
  ModelConfig,
  TypeConfig,
  PropConfig,
  PluginConfig,
  SchemaConfig
} from '@stackpress/idea-parser/types';

export type {
  BuildStatus,
  BuildResults,
  ViteConfig,
  DevelopConfig,
  BuildConfig,
  ProductionConfig,
  ServerConfig as ReactusConfig
} from 'reactus/types';

//--------------------------------------------------------------------//
// General Types

export type Scalar = string | number | boolean | null | undefined;
export type ExtendsType<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

//--------------------------------------------------------------------//
// Idea Types

export type IdeaProjectProps = {
  cli: StackpressTerminal,
  project: Directory
};

export type IdeaPluginWithProject = PluginProps<IdeaProjectProps>;

//--------------------------------------------------------------------//
// Server Configuration Types

export type Config = UnknownNest & {
  brand?: BrandConfig,
  cli?: CLIConfig,
  server?: ServerConfig,
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