//modules
import type { FlatValue } from '@stackpress/inquire/types';
import type Engine from '@stackpress/inquire/Engine';
//stackpress/sql
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

export type StoreSelectColumnPath = {
  type: string,
  column: string,
  store: StoreInterface<
    Record<string, unknown>, 
    Record<string, unknown>
  >
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

export type StoreSelectJoin = {
  table: string,
  from: string,
  to: string,
  alias: string
};

export type StoreSelectJoinMap = Record<string, StoreSelectJoin>;

export type StoreSelectWhere = {
  clause: string,
  values: FlatValue[]
};

export type StoreSelectOrWhere = {
  clause: string[],
  values: FlatValue[]
};

export type StoreSelectFilters = {
  q?: string,
  filter?: Record<string, ValueScalar | ValueScalar[]>,
  span?: Record<string, ValueScalar[]>,
  where?: StoreSelectWhere
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
  JSONScalarValue,
  Value,
  Resolve,
  Reject,
  Order,
  Join,
  Dialect,
  QueryObject,
  OrQueryObject,
  Transaction,
  WhereBuilder,
  Connection
} from '@stackpress/inquire/types';