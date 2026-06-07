//modules
import type { SchemaConfig } from '@stackpress/idea-parser';
import type { Request, Response, Server } from '@stackpress/ingest';
import type { Field, FlatValue } from '@stackpress/inquire/types';
import type Engine from '@stackpress/inquire/Engine';
import type Create from '@stackpress/inquire/Create';
//stackpress-schema
import type { 
  DefinitionInterfaceMap, 
  ClientFieldset 
} from 'stackpress-schema/types';
import type SchemaInterface from 'stackpress-schema/SchemaInterface';
//stackpress-sql
import type StoreInterface from './interface/StoreInterface.js';
import type ActionsInterface from './interface/ActionsInterface.js';
import { makeCreateQuery } from './transform/helpers.js';

export type ValueScalar = string | number | boolean | null;
export type ValuePrimitive = ValueScalar | Date | Record<string, any>;

export type StoreRelation<
  //the basic type of the records in the store
  T extends Record<string, unknown> = Record<string, unknown>,
  //the extended type of the records in the store, with relations included
  E extends Record<string, unknown> = Record<string, unknown>
> = {
  type: [ number, number ],
  local: string,
  foreign: string,
  store: StoreInterface<T, E>
};

export type StoreSelectRelationMap<
  //the basic type of the records in the store
  T extends Record<string, unknown>,
  //the extended type of the records in the store, with relations included
  E extends Record<string, unknown>
> = Record<string, StoreRelation<T, E>>;

//IF: category.article.ratings.feedbackNote.author.data:references.googleId
//                                  ^
//   |                           expression                                |
//   |                    selector                     |        json       |
//   |    parents     | table |   column   | children  |        json       |

export type AliasPath = {
  //feedback_note__author__data__references__google_id
  expression: string,
  //[ feedback_note, author, data ]
  selector: string[],
  //[ category, article ]
  parents: string[],
  //ratings
  table: string,
  //feedback_note
  column: string,
  //[ author, data ]
  children: string[],
};

export type StorePath<
  //the basic type of the records in the store
  T extends Record<string, unknown> = Record<string, unknown>,
  //the extended type of the records in the store, with relations included
  E extends Record<string, unknown> = Record<string, unknown>,
  //the column map
  C extends DefinitionInterfaceMap = DefinitionInterfaceMap,
  //the relation map
  R extends Record<string, StoreRelation> = Record<string, StoreRelation<{}, {}>>
> = {
  //column, relation, wildcard
  type: string,
  //feedbackNote.author.data:references.googleId
  expression: string,
  //[ feedbackNote, author, data ]
  selector: string[],
  //[ category, article ]
  parents: string[],
  //ratings
  table: string,
  //feedbackNote
  column: string,
  //[ author, data ]
  children: string[],
  //[]
  json: string[]
  store: StoreInterface<T, E, C, R>
};

export type StoreSelector = {
  //category__article__ratings__feedback_note__author__data__references__google_id
  alias: string,
  //[ category, article, ratings, feedback_note, author, data ]
  selector: string[],
  //[ category, article, ratings, feedback_note ]
  parents: string[],
  //author
  table: string,
  //data
  column: string,
  //[ references, googleId ]
  json: string[],
  path: StorePath
};

export type StoreJoin = {
  //inner, left, right, outer, etc
  type: string, 
  //ex. user_profile
  table: string, 
  //ex. auth__user_profile
  alias: string,
  //ex. category__article__ratings__feedback_note.author_id
  //NOTE: there should only be 2 selectors
  from: { table: string, column: string },
  //ex. category__article__ratings__feedback_note__author.id
  //NOTE: there should only be 2 selectors
  to: { table: string, column: string }
};

export type StoreWhere = { 
  clause: string, 
  values: FlatValue[] 
};

export type StoreSelectOrWhere = {
  clause: string[],
  values: FlatValue[]
};

export type StoreSelectFilters = {
  q?: string,
  eq?: Record<string, ValueScalar>,
  ne?: Record<string, ValueScalar>,
  ge?: Record<string, ValueScalar>,
  le?: Record<string, ValueScalar>,
  has?: Record<string, ValueScalar>,
  like?: Record<string, ValueScalar>,
  hasnt?: Record<string, ValueScalar>
};

export type StoreSelectQuery = StoreSelectFilters & {
  columns?: string[],
  sort?: Record<string, string>,
  skip?: number,
  take?: number
};

export type StoreSearchQuery = StoreSelectQuery & {
  total?: boolean
};

//for ingest

export type SerializedEvent = {
  event: string,
  data: Record<string, any>
};

export type DatabaseConfig = {
  //used to encrypt/decrypt data in the database
  seed: string,
  //where to store create and alter table migration files
  // - This is used in conjunction with `revisions`
  // - This doesn't update the database, it simply logs the changes
  //used by `stackpress/scripts/migrate`
  //wont save if not provided
  migrations?: string,
  //cascading rules used when generating the database schema
  //defaults to `CASCADE`
  //TODO: implement in transform/schema.ts
  schema?: {
    onDelete?: 'CASCADE'|'SET NULL'|'RESTRICT',
    onUpdate?: 'CASCADE'|'SET NULL'|'RESTRICT'
  },
  populate?: Array<SerializedEvent>
};

export type DatabasePlugin = Engine;

export type {
  Field,
  ForeignKey,
  AlterFields,
  AlterKeys,
  AlterUnqiues,
  AlterPrimaries,
  AlterForeignKeys,
  Column as SelectColumn,
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
  Connection
} from '@stackpress/inquire/types';

//--------------------------------------------------------------------//
// Client Types

export type GenericEventHandler<
  R = unknown,
  S = unknown,
  C extends Record<string, unknown> = Record<string, unknown>
> = (props: {
  req: Request<R>,
  res: Response<S>,
  ctx: Server<R, S, C>,
  request: Request<R>,
  response: Response<S>,
  context: Server<R, S, C>
}) => Promise<void>;

export type GenericEvents<
  R = unknown,
  S = unknown,
  C extends Record<string, unknown> = Record<string, unknown>
> = {
  batch: GenericEventHandler<R, S, C>;
  create: GenericEventHandler<R, S, C>;
  detail: GenericEventHandler<R, S, C>;
  get: GenericEventHandler<R, S, C>;
  purge: GenericEventHandler<R, S, C>;
  remove: GenericEventHandler<R, S, C>;
  restore: GenericEventHandler<R, S, C>;
  search: GenericEventHandler<R, S, C>;
  update: GenericEventHandler<R, S, C>;
  upsert: GenericEventHandler<R, S, C>;
};

export type GenericListener<
  R = unknown,
  S = unknown,
  C extends Record<string, unknown> = Record<string, unknown>
> = (server: Server<R, S, C>) => void;

export type GenericAdminRouter<
  R = unknown,
  S = unknown,
  C extends Record<string, unknown> = Record<string, unknown>
> = (server: Server<R, S, C>) => void;

export type ClientModel<
  //model type
  T extends Record<string, unknown> = Record<string, unknown>, 
  //model type extended
  E extends Record<string, unknown> = Record<string, unknown>, 
  //column map
  C extends DefinitionInterfaceMap = DefinitionInterfaceMap, 
  //relation map
  R extends Record<string, StoreRelation> = Record<string, StoreRelation<{}, {}>>,
  //server context map
  X extends Record<string, unknown> = Record<string, unknown>,
  //server request resource
  Q = any,
  //server response resource
  S = any
> = {
  Schema: { 
    new(seed?: string): SchemaInterface<T, C> 
  },
  Store: { 
    new(seed?: string): StoreInterface<T, E, C, R> 
  },
  Actions: { 
    new(engine: Engine, seed?: string): ActionsInterface<T, E, C, R> 
  },
  columns: C,
  events: GenericEvents<Q, S, X>,
  listen: GenericListener<Q, S, X>,
  admin: GenericAdminRouter<Q, S, X>
};

export type ClientScripts = {
  install(engine: Engine): Promise<void>,
  purge(engine: Engine): Promise<void>,
  uninstall(engine: Engine): Promise<void>,
  upgrade(engine: Engine, updates: Record<string, Create>): Promise<void>
};

export type Client<
  //exact map of models
  //ex. { profile: ClientModel<Profile, ProfileExtended, { name: NameSchema, ...}, { auth: {} }> }
  M extends Record<string, ClientModel> = Record<string, ClientModel>,
  //exact map of fieldsets
  F extends Record<string, ClientFieldset> = Record<string, ClientFieldset>
> = {
  config: SchemaConfig,
  model: M,
  fieldset: F,
  scripts: ClientScripts
};

//ie. ctx.plugin<ClientPlugin>('client');
export type ClientPlugin<
  //exact map of models
  //ex. { profile: ClientModel<Profile, ProfileExtended, { name: NameSchema, ...}, { auth: {} }> }
  M extends Record<string, ClientModel> = Record<string, ClientModel>,
  //exact map of fieldsets
  F extends Record<string, ClientFieldset> = Record<string, ClientFieldset>
> = (nullable?: boolean) => Promise<Client<M, F>>;


export type ForeignBuild = {
  table?: string,
  foreign?: string,
  local?: string,
  delete?: string,
  update?: string
};

export type CreateBuild = ReturnType<ReturnType<typeof makeCreateQuery>['build']>;

export type RenameRisk = {
  model: string,
  table: string,
  from: string,
  fromField: string,
  to: string,
  toField: string
};

export type ColumnSignature = {
  field: Field,
  primary: boolean,
  unique: string[],
  keys: string[],
  foreign: Array<Required<ForeignBuild>>
};