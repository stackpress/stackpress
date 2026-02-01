//modules
import type { NestedObject } from '@stackpress/lib';
import type { Data } from '@stackpress/idea-parser';

export type { 
  EnumConfig,
  ModelConfig,
  TypeConfig,
  PropConfig,
  PluginConfig,
  SchemaConfig
} from '@stackpress/idea-parser/types';

export type ErrorList = (ErrorMap | null)[];
export type ErrorMap = NestedObject<string | string[] | ErrorList>;

//used in spec/Typemap spec/Serializers
export type SerializerSettings = {
  encrypt?: boolean,
  hash?: boolean,
  require?: boolean, 
  multiple?: boolean
};

export type SerializeOptions = {
  booleanToNumber?: boolean,
  dateToString?: boolean,
  objectToString?: boolean
};

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
  import: { from: string, default: boolean },
  message: string
};

//used in config/typemaps
export type TypeMapDataMap<D = unknown> = Record<string, D>; 
export type TypeMapDataAssertion = AttributeDataAssertion;
export type TypeMapDataSerializer = {
  name: string,
  import: { from: string, default: boolean }
};

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