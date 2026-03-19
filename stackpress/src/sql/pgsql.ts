//@ts-ignore
export type { Results, Resource, Connector } from '@stackpress/inquire-pg';

export type {
  //inquire types
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
  Connection,
  //for store interface
  ValueScalar,
  ValuePrimitive,
  StoreRelation,
  StoreSelectColumnPath,
  StoreSelectRelation,
  StoreSelectRelationMap,
  StoreSelectJoin,
  StoreSelectJoinMap,
  StoreSelectFilters,
  StoreSelectQuery,
  StoreSearchQuery,
  //for ingest
  DatabaseConfig,
  DatabasePlugin
} from './types.js';

export {
  Alter,
  Create,
  Delete,
  Insert,
  Select,
  Update,
  Mysql,
  Pgsql,
  Sqlite,
  Engine,
  Exception,
  joins
} from '@stackpress/inquire';

//@ts-ignore
export { PGConnection, connect } from '@stackpress/inquire-pg';

export {
  toSqlString,
  toSqlBoolean,
  toSqlDate,
  toSqlInteger,
  toSqlFloat,
  getAlias
} from './helpers.js';

import AbstractActions from './interface/AbstractActions.js';
import ActionsInterface from './interface/ActionsInterface.js';
import StoreInterface from './interface/StoreInterface.js';

export type { AbstractActions, ActionsInterface, StoreInterface };