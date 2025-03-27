//stackpress
import type { Data } from '@stackpress/idea-parser/types';
//spec
import type Column from './spec/Column';
import type Model from './spec/Model';

export type { 
  EnumConfig,
  ModelConfig,
  TypeConfig,
  PropConfig,
  PluginConfig,
  SchemaConfig
} from '@stackpress/idea-parser/types';

export type SchemaAssertion = {
  method: string,
  args: unknown[],
  message: string|null
};

export type SchemaRelation = {
  local: string,
  foreign: string,
  name?: string
};

export type SchemaColumnInfo = {
  type: string,
  name: string,
  required: boolean,
  multiple: boolean,
  attributes: Record<string, unknown>
};

export type SchemaComponent = {
  component: string|false,
  method: string,
  args: Data[],
  attributes: Record<string, Data>
}

export type SchemaColumnRelation = { 
  model: Model, 
  column: Column, 
  key: Column, 
  type: number 
};

export type SchemaColumnRelationLink = { 
  parent: SchemaColumnRelation,
  child: SchemaColumnRelation
};

export type SchemaSerialOptions = {
  bool?: boolean,
  date?: boolean,
  object?: boolean
};

export type ColumnOption = { 
  name: string|false, 
  attributes: Record<string, any>
};