//modules
import type Engine from '@stackpress/inquire/Engine';
//stackpress/schema
import type { DefinitionInterfaceMap } from '../schema/types.js';
import type ColumnInterface from '../schema/interface/ColumnInterface.js';
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

export type StoreSelector = {
  //if auth.userProfile.addressLocation.references.googleId
  //WHERE:
  // - auth is this store's table
  // - userProfile is a relation on the auth store
  // - addressLocation is a json column in the related profile store
  // - references is a key in the json column that is also an object
  // - googleId is a key in the references object that is a scalar value
  //THEN:
  // - expression should be auth.userProfile.addressLocation.references.googleId
  expression: string,
  // - column should be [ auth, user_profile, address_location ]
  column: string[],
  // - json should be [ references', googleId ]
  json: string[],
  // - alias should be [ auth, user_profile, address_location, references, google_id ]
  alias: string[]
  //whatever uses this should add quotes and merge strings on their own...
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
  selector: StoreSelector,
  store: StoreInterface<T, E, C, R>,
  column: ColumnInterface
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
  clause: (q?: string) => string, 
  values: FlatValue[] 
};

export type StoreSelectFilters = {
  q?: string,
  filter?: Record<string, ValueScalar>,
  span?: Record<string, ValueScalar[]>
};

export type StoreSelectQuery = StoreSelectFilters & {
  columns?: string[],
  include?: string[],
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
  Relation,
  ForeignKey,
  AlterFields,
  AlterKeys,
  AlterUnqiues,
  AlterPrimaries,
  AlterForeignKeys,
  StrictValue,
  StrictOptValue,
  FlatValue,
  Value,
  Resolve,
  Reject,
  Order,
  Join,
  Dialect,
  QueryObject,
  Transaction,
  Connection
} from '@stackpress/inquire/types';