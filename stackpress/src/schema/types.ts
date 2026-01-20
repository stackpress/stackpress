//modules
import type { NestedObject } from '@stackpress/lib';
import type { AttributeValue } from '@stackpress/idea-parser';

export type { 
  EnumConfig,
  ModelConfig,
  TypeConfig,
  PropConfig,
  PluginConfig,
  SchemaConfig
} from '@stackpress/idea-parser/types';

//data structure for attribute info
// this is hard coded in a separate file
export type AttributeConfigArgument = {
  spread: boolean,
  type: Array<string | Record<string, unknown>>,
  name?: string,
  required: boolean,
  description: string,
  examples: Array<unknown>
};

export type AttributeConfigComponent = {
  component: string,
  virtual: boolean,
  import: { from: string, default: boolean },
  props: Record<string, unknown>
};

export type AttributeData = {
  type: Array<string>,
  name: string,
  description?: string,
  args: Array<AttributeConfigArgument>,
  data?: Record<string, unknown>
};

export type AttributeConfig = AttributeData & {
  key: string,
  kind: string
};

export type AttributeValues = Iterable<[string, AttributeValue]> 
  | Record<string, AttributeValue>;

export type SchemaComponent = AttributeConfigComponent & {
  name: string
};

export type SchemaAssertion = {
  method: string,
  args: unknown[],
  message: string|null
  config: AttributeConfig
};

export type SchemaRelation = {
  local: string,
  foreign: string,
  name?: string
};

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