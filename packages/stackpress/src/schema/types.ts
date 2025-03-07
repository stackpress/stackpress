//stackpress
import type { Data } from '@stackpress/idea-parser';
//local
import type Model from './spec/Model';
import type Column from './spec/Column';

export type Assertion = {
  method: string,
  args: unknown[],
  message: string|null
};

export type Relation = {
  local: string,
  foreign: string,
  name?: string
};

export type ColumnInfo = {
  type: string;
  name: string;
  required: boolean;
  multiple: boolean;
  attributes: Record<string, unknown>;
};

export type Component = {
  method: string;
  args: Data[];
  attributes: Record<string, Data>;
}

export type ColumnRelation = { 
  model: Model, 
  column: Column, 
  key: Column, 
  type: number 
};

export type ColumnRelationLink = { 
  parent: ColumnRelation,
  child: ColumnRelation
};

export type SerialOptions = {
  bool?: boolean,
  date?: boolean,
  object?: boolean
};