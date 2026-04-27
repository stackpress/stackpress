//@ts-ignore
export type { Results, Resource, Connector } from '@stackpress/inquire-sqlite3';

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
  StoreSelectOrWhere,
  StoreSelectRelationMap,
  StoreSelectFilters,
  StoreSelectQuery,
  StoreSearchQuery,
  StoreWhere,
  //for ingest
  SerializedEvent,
  DatabaseConfig,
  DatabasePlugin,
  //client
  GenericEventHandler,
  GenericEvents,
  GenericListener,
  GenericAdminRouter,
  ClientModel,
  ClientScripts,
  ClientPlugin,
  Client
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
  joinTypes,
  isIndex,
  backSlashes,
  doubleQuotes,
  escapeBackSlashes,
  escapeDoubleQuotes,
  safeJsonValue,
  jsonCompare
} from '@stackpress/inquire';

//@ts-ignore
export { BetterSqlite3Connection, connect } from '@stackpress/inquire-sqlite3';

export {
  toSqlString,
  toSqlBoolean,
  toSqlDate,
  toSqlInteger,
  toSqlFloat,
  getAlias,
  storePathToAlias,
  storeSelectorToSqlSelector
} from './helpers.js';

import ActionsInterface from './interface/ActionsInterface.js';
import StoreInterface from './interface/StoreInterface.js';

export type { ActionsInterface, StoreInterface };