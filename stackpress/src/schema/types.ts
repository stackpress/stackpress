//modules
import type { Data } from '@stackpress/idea-parser';
export type { 
  EnumConfig,
  ModelConfig,
  TypeConfig,
  PropConfig,
  PluginConfig,
  SchemaConfig
} from '@stackpress/idea-parser/types';
import type DefinitionInterface from './interface/DefinitionInterface.js';

//used in config/attributes
export type AttributeData<
  D extends Record<string, unknown> = Record<string, unknown>
> = {
  type: Array<string>,
  name: string,
  description?: string,
  args: Array<{
    spread: boolean,
    type: Array<string | Record<string, unknown>>,
    name?: string,
    required: boolean,
    description: string,
    examples: Array<unknown>
  }>,
  data?: D
};
export type AttributeDataMap<
  D extends Record<string, unknown> = Record<string, unknown>
> = Record<string, Required<AttributeData<D>>>;

export type AttributeDataComponent = {
  name: string,
  import: { from: string, default: boolean },
  attributes: Record<string, unknown>
};
export type AttributeDataAssertion = {
  name: string,
  message: string
};

export type TypeAssertionMap = Record<string, AttributeDataAssertion>;

//used in config/definitions
export type DefinitionBook = Map<string, Record<string, unknown>>;
export type AttributeDefinitionInput = {
  method: boolean,
  flag: boolean,
  description: string,
    args: Array<{
    spread: boolean,
    type: Array<string | Record<string, unknown>>,
    required: boolean,
    description: string,
    examples: Array<unknown>
  }>
};
export type AttributeDefinitionToken = AttributeDefinitionInput & {
  kind: string
};
export type AttributeComponentInput = AttributeDataComponent & {
  props: Record<string, {
    type: string[],
    required: boolean,
    description: string,
    examples: unknown[]
  }>
};
export type AttributeComponentToken = AttributeComponentInput & {
  kind: string
};
export type AttributeAssertionInput = AttributeDataAssertion;
export type AttributeAssertionToken = AttributeAssertionInput;

//used in attribute class
export type AttributeMapToken = Record<string, Data[] | boolean>;
export type AttributesEntriesToken = Array<[ string, Data[] | boolean ]> ;
export type AttributesToken = AttributesEntriesToken | AttributeMapToken;

//used in column class
export type ColumnTypeToken = {
  name: string,
  required: boolean,
  multiple: boolean
};
export type ColumnToken = {
  name: string, 
  type: ColumnTypeToken,
  attributes?: AttributesToken
};
export type ColumnAssertionToken = AttributeAssertionToken & {
  args: unknown[]
};
export type ColumnRelationProps = {
  local: string,
  foreign: string,
  name?: string
};

//used in schema interface
export type IsArrayOrObject<T> = T extends any[]
  ? true
  : T extends object
  ? (T extends Function ? false : true)
  : false;

export type DefinitionInterfaceMap = { [key: string]: DefinitionInterface };

//Extracts the assert type (A) from each DefinitionInterface in C.
export type AssertInterfaceMap<C extends DefinitionInterfaceMap> = {
  [K in keyof C]: C[K] extends DefinitionInterface<unknown, infer A> 
    ? A 
    : unknown;
};

//Extracts the serialized type (S) from each DefinitionInterface in C.
export type SerializeInterfaceMap<C extends DefinitionInterfaceMap> = {
  [K in keyof C]: C[K] extends DefinitionInterface<unknown, unknown, infer S> 
    ? (IsArrayOrObject<S> extends true ? string : S)
    : unknown;
};

//Extracts the unserialized type (U) from each DefinitionInterface in C.
export type UnserializeInterfaceMap<C extends DefinitionInterfaceMap> = {
  [K in keyof C]: C[K] extends DefinitionInterface<unknown, unknown, unknown, infer U> 
    ? U 
    : unknown;
};