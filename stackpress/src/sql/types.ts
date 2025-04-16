//stackpress
import type Engine from '@stackpress/inquire/Engine';
//schema
import type Model from '../schema/spec/Model.js';
import type Column from '../schema/spec/Column.js';

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

export type DatabaseConfig = {
  migrations: string,
  schema: {
    onDelete: 'CASCADE'|'SET NULL'|'RESTRICT',
    onUpdate: 'CASCADE'|'SET NULL'|'RESTRICT'
  }
};

export type DatabasePlugin = Engine;