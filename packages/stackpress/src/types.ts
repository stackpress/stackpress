export type {
  ApiType,
  ApiConfigProps,
  ApiOauthInputProps,
  ApiOauthFormProps,
  Scopes,
  ApiEndpoint,
  ApiScope,
  ApiWebhook,
  Application,
  ApplicationExtended,
  ApplicationInput,
  Session as ApplicationSession,
  SessionExtended as ApplicationSessionExtended,
  SessionInput as ApplicationSessionInput
} from './api/types.js';

export type {
  Scalar,
  LanguageData,
  LanguageMap,
  LanguageConstructor,
  LanguagePlugin
} from './language/types.js';

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
  EventData,
  EventMatch,
  Event,
  EventHook,
  EventExpression,
  ResponseDispatcher,
  ResponseOptions,
  Headers,
  Data,
  Query,
  Session,
  Post,
  LoaderResults,
  RequestLoader,
  CallableSession,
  RequestOptions,
  Revision,
  CookieOptions,
  Method,
  Route,
  RouteMap,
  RouteAction,
  RouterContext,
  RouterArgs,
  RouterMap,
  RouterAction,
  FileRecursiveOption,
  FileStat,
  FileStream,
  FileSystem,
  CallSite,
  CLIProps,
  PluginProps,
  PluginWithCLIProps
} from './lib/types.js';

export type {
  //from idea
  EnumConfig,
  ModelConfig,
  TypeConfig,
  PropConfig,
  PluginConfig,
  SchemaConfig,
  //used in config/attributes
  AttributeData,
  AttributeDataMap,
  AttributeDataComponent,
  AttributeDataAssertion,
  //used in config/definitions
  DefinitionBook,
  //used in dictionary
  AttributeDefinitionInput,
  AttributeDefinitionToken,
  AttributeComponentInput,
  AttributeComponentToken,
  AttributeAssertionInput,
  AttributeAssertionToken,
  //used in attribute class
  AttributeMapToken,
  AttributesEntriesToken,
  AttributesToken,
  //used in column class
  ColumnTypeToken,
  ColumnToken,
  ColumnAssertionToken,
  ColumnRelationProps,
  //used in schema interface
  IsArrayOrObject,
  DefinitionInterfaceMap,
  AssertInterfaceMap,
  SerializeInterfaceMap,
  UnserializeInterfaceMap
} from './schema/types.js';

export type {  
  TerminalPlugin,
  ConfigLoaderOptions,
  PluginLoaderOptions,
  ActionRouterArgs,
  ActionRouterMap,
  ActionRouterAction,
  ActionRouterListener,
  EntryRouterTaskItem,
  ImportRouterAction,
  ImportRouterTaskItem,
  ViewRouterTaskItem,
  ViewRouterEngine,
  ViewRouterRender,
  AnyRouterAction,
  ServerAction,
  ServerHandler,
  ServerGateway,
  ServerOptions,
  NodeServer, 
  NodeServerOptions,
  NodeRequest,
  NodeResponse,
  NodeOptResponse,
  IM, SR,
  HttpResponse,
  HttpRequest,
  HttpRouter,
  HttpServer,
  HttpServerOptions,
  HttpAction,
  WhatwgResponse,
  WhatwgRequest,
  WhatwgRouter,
  WhatwgServer,
  WhatwgServerOptions,
  WhatwgAction,
  Body
} from './server/types.js';

export type {
  SessionRoute,
  SessionPermission,
  SessionPermissionList,
  SessionData,
  SessionTokenData,
  SessionServerConstructor,
  SignupInput,
  SigninInput,
  SigninType,
  AuthConfigProps,
  SessionPlugin,
  Profile,
  ProfileExtended,
  ProfileInput,
  Auth,
  AuthExtended,
  AuthInput,
  ProfileAuth
} from './session/types.js';

export type {
  //inquire types
  Field,
  ForeignKey,
  AlterFields,
  AlterKeys,
  AlterUnqiues,
  AlterPrimaries,
  AlterForeignKeys,
  SelectColumn,
  JoinType,
  Join,
  Selector,
  Sort,
  OrderType,
  Table,
  Where,
  WhereJson,
  WhereBuilder,
  StrictValue,
  StrictOptValue,
  FlatValue,
  JSONScalarValue,
  Value,
  Resolve,
  Reject,
  JsonDialect,
  Dialect,
  OrQueryObject,
  QueryObject,
  Transaction,
  Connection,
  //for store interface
  ValueScalar,
  ValuePrimitive,
  StoreJoin,
  StorePath,
  StoreRelation,
  StoreSelector,
  StoreSelectRelationMap,
  StoreSelectFilters,
  StoreSelectQuery,
  StoreSearchQuery,
  StoreWhere,
  //for ingest
  DatabasePlugin
} from './sql/types.js';

export type {
  ViewPlugin,
  PreviewPlugin,
  RollupResults,
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
  ServerConfigProps,
  ServerPageProps,
  NotifyConfig
} from './view/types.js';

//modules
import type { UnknownNest } from '@stackpress/lib/types';
import type { CookieOptions } from '@stackpress/ingest/types';
//stackpress
import type { AdminConfig } from 'stackpress-admin/types';
import type { EmailConfig } from 'stackpress-email/types';
//plugins
import type { ClientConfig } from './client/types.js';
import type { ServerConfig } from './server/types.js';
import type { ApiConfig } from './api/types.js';
import type { LanguageConfig } from './language/types.js';
import type { DatabaseConfig } from './sql/types.js';
import type { TerminalConfig } from './server/types.js';
import type { ViewConfig, BrandConfig } from './view/types.js';
import type { AuthConfig, SessionConfig } from './session/types.js';

export {
  BrandConfig,
  TerminalConfig,
  ServerConfig,
  ClientConfig,
  CookieOptions as CookieConfig,
  AdminConfig,
  ApiConfig,
  EmailConfig,
  LanguageConfig,
  DatabaseConfig,
  ViewConfig,
  AuthConfig,
  SessionConfig
};

export type Config = UnknownNest & {
  brand?: BrandConfig,
  terminal?: TerminalConfig,
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