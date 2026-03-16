//modules
import type { SchemaConfig } from '@stackpress/idea-parser';
import type { Request, Response, Server } from '@stackpress/ingest';
import type Create from '@stackpress/inquire/Create';
import type Engine from '@stackpress/inquire/Engine';
//stackpress/schema
import type { DefinitionInterfaceMap } from '../schema/types.js';
import SchemaInterface from '../schema/interface/SchemaInterface.js';
//stackpress/sql
import type { StoreRelation } from '../sql/types.js';
import ActionsInterface from '../sql/interface/ActionsInterface.js';
import StoreInterface from '../sql/interface/StoreInterface.js';

export type GenericEventHandler<
  C extends Record<string, unknown> = Record<string, unknown>,
  R = any,
  S = any
> = (req: Request<R>, res: Response<S>, ctx: Server<C, R, S>) => Promise<void>;

export type GenericEvents<
  C extends Record<string, unknown> = Record<string, unknown>,
  R = any,
  S = any
> = {
  batch: GenericEventHandler<C, R, S>;
  create: GenericEventHandler<C, R, S>;
  detail: GenericEventHandler<C, R, S>;
  get: GenericEventHandler<C, R, S>;
  purge: GenericEventHandler<C, R, S>;
  remove: GenericEventHandler<C, R, S>;
  restore: GenericEventHandler<C, R, S>;
  search: GenericEventHandler<C, R, S>;
  update: GenericEventHandler<C, R, S>;
  upsert: GenericEventHandler<C, R, S>;
};

export type GenericListener<
  C extends Record<string, unknown> = Record<string, unknown>,
  R = any,
  S = any
> = (server: Server<C, R, S>) => void;

export type GenericAdminRouter<
  C extends Record<string, unknown> = Record<string, unknown>,
  R = any,
  S = any
> = (server: Server<C, R, S>) => void;

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
  events: GenericEvents<X, Q, S>,
  listen: GenericListener<X, Q, S>,
  admin: GenericAdminRouter<X, Q, S>
};

export type ClientFieldset<
  //fieldset type
  T extends Record<string, unknown> = Record<string, unknown>, 
  //column map
  C extends DefinitionInterfaceMap = DefinitionInterfaceMap
> = {
  Schema: { 
    new(seed?: string): SchemaInterface<T, C> 
  },
  columns: C
};

export type ClientScripts = {
  install(engine: Engine): Promise<void>,
  purge(engine: Engine): Promise<void>,
  uninstall(engine: Engine): Promise<void>,
  upgrade(engine: Engine, updates: Record<string, Create>): Promise<void>
};

//ie. ctx.plugin<ClientPlugin>('client');
//contents from import('stackpress-client')
export type ClientPlugin<
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

//ie. ctx.config<ClientConfig>('client');
export type ClientConfig = {
  //where to store the generated client code
  //used by `stackpress/terminal` (for generating client)
  build?: string,
  //whether to compiler client in `js` or `ts`
  //used by client generator
  //defaults to `js`
  lang?: string,
  //used by `stackpress/client` to `import()` 
  //the generated client code to memory
  module: string,
  //name of client package. Used in the generated package.json
  package: string,
  //where to store serialized idea json files for historical 
  //purposes. Revisions are used in conjuction with push and 
  //migrate to determine the changes between each idea change.
  //wont save if not provided (cant create migrations without this)
  revisions?: string,
  //what tsconfig file to base the typescript compiler on
  //used by `stackpress/terminal` (for generating client)
  tsconfig: string
};