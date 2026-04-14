//modules
import type Engine from '@stackpress/inquire/Engine';
//stackpress/schema
import type { DefinitionInterfaceMap } from '../schema/types.js';
//stackpress/sql
import type { FlatValue } from '@stackpress/inquire/types';
import type StoreInterface from './interface/StoreInterface.js';

export type ValueScalar = string | number | boolean | null;
export type ValuePrimitive = ValueScalar | Date | Record<string, any>;

export type StoreRelation<
  //the basic type of the records in the store
  T extends Record<string, unknown> = Record<string, unknown>,
  //the extended type of the records in the store, with relations included
  E extends Record<string, unknown> = Record<string, unknown>
> = {
  store: StoreInterface<T, E>,
  local: string,
  foreign: string,
  multiple: boolean,
  required: boolean
};

export type StoreSelectRelation<
  //the basic type of the records in the store
  T extends Record<string, unknown>,
  //the extended type of the records in the store, with relations included
  E extends Record<string, unknown>
> = {
  local: string,
  foreign: string,
  multiple: boolean,
  required: boolean,
  store: StoreInterface<T, E>
};

export type StoreSelectRelationMap<
  //the basic type of the records in the store
  T extends Record<string, unknown>,
  //the extended type of the records in the store, with relations included
  E extends Record<string, unknown>
> = Record<string, StoreSelectRelation<T, E>>;

//IF: auth.userProfile.addressLocation.references.googleId
//   |                    expression                     |
//   |             selector           |       json       |
//   |     parents    |    column     |       json       |
//   |nav |   table   |    column     |       json       |    
//WHERE:
// - auth (and everything before it) is the Navigation that 
//   leads to the main table.
// - userProfile is the main Table
// - addressLocation is the main Column (also a json column)
// - references.googleId is the json Path
//THEN:
// - expression is the entire expression
// - selector is the parents and column ( userProfile.addressLocation )
// - parents is everything before the column

export type AliasPath = {
  //auth__user_profile__address_location__references__google_id
  format: string,
  //[ auth, user_profile, address_location ]
  selector: string[],
  //[ auth, user_profile ]
  parents: string[],
  //[ auth ]
  navigation: string[],
  //user_profile
  table?: string,
  //address_location
  column: string
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
  //auth.userProfile.addressLocation:references.googleId
  expression: string,
  //[ auth, userProfile, addressLocation ]
  selector: string[],
  //[ auth, userProfile ]
  parents: string[],
  //[ auth ]
  navigation: string[],
  //userProfile
  table?: string,
  //addressLocation
  column: string,
  //[ references, googleId ]
  json: string[]
  store: StoreInterface<T, E, C, R>
};

export type StoreSelector = {
  //auth__user_profile__address_location__references__google_id
  alias: string,
  //[ auth, user_profile, address_location ]
  selector: string[],
  //[ auth, user_profile ]
  parents: string[],
  //[ auth ]
  navigation: string[],
  //user_profile
  table?: string,
  //address_location
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
  //ex. auth__user_profile.id
  //NOTE: there should only be 2 selectors
  from: { table: string, column: string },
  //ex. auth.profile_id
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
  }
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