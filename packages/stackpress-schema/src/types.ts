//modules
import type { Directory, Project } from 'ts-morph';
import type { PluginProps } from '@stackpress/idea-transformer/types';
import type { SchemaConfig, Data } from '@stackpress/idea-parser';
export type { 
  EnumConfig,
  ModelConfig,
  TypeConfig,
  PropConfig,
  PluginConfig,
  SchemaConfig
} from '@stackpress/idea-parser/types';
//stackpress-server
import type Terminal from 'stackpress-server/Terminal';
//stackpress-schema
import type DefinitionInterface from './interface/DefinitionInterface.js';
import type SchemaInterface from './interface/SchemaInterface.js';

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

export type ErrorReport =
  | string
  | ErrorReport[]
  | { [key: string]: ErrorReport };

//--------------------------------------------------------------------//
// Client Types

//used in idea generator (transform)

export type ClientProjectProps = {
  terminal: Terminal,
  project: Project,
  directory: Directory
};

export type ClientPluginProps = PluginProps<ClientProjectProps>;

//used in plugin files

export type ClientFieldset<
  //fieldset type
  T extends Record<string, unknown> = Record<string, unknown>, 
  //column map
  C extends DefinitionInterfaceMap = DefinitionInterfaceMap
> = {
  Schema: { 
    new(seed?: string): SchemaInterface<T, C> 
  },
  columns: C
};

//ie. ctx.plugin<ClientPlugin>('client');
//contents from import('stackpress-client')
export type ClientPlugin<
  //exact map of fieldsets
  F extends Record<string, ClientFieldset> = Record<string, ClientFieldset>
> = {
  config: SchemaConfig,
  model: F,
  fieldset: F
};

//ie. ctx.config<ClientConfig>('client');
export type ClientConfig = {
  //where to store the generated client code
  //used by `stackpress/terminal` (for generating client)
  build?: string,
  //whether to compiler client in `js` or `ts`
  //used by client generator
  //defaults to `js`
  lang?: string,
  //used by `stackpress/client` to `import()` 
  //the generated client code to memory
  module: string,
  //name of client package. Used in the generated package.json
  package: string,
  //where to store serialized idea json files for historical 
  //purposes. Revisions are used in conjuction with push and 
  //migrate to determine the changes between each idea change.
  //wont save if not provided (cant create migrations without this)
  revisions?: string,
  //what tsconfig file to base the typescript compiler on
  //used by `stackpress/terminal` (for generating client)
  tsconfig: string,
  //see: https://prettier.io/docs/options
  prettier?: {
    semi?: boolean,
    singleQuote?: boolean,
    jsxSingleQuote?: boolean,
    trailingComma?: 'none' | 'es5' | 'all',
    bracketSpacing?: boolean,
    objectWrap?: 'preserve' | 'collapse',
    bracketSameLine?: boolean,
    requirePragma?: boolean,
    insertPragma?: boolean,
    checkIgnorePragma?: boolean,
    proseWrap?: 'always' | 'never' | 'preserve',
    arrowParens?: 'avoid' | 'always',
    htmlWhitespaceSensitivity?: 'css' | 'strict' | 'ignore',
    endOfLine?: 'auto' | 'lf' | 'crlf' | 'cr',
    quoteProps?: 'as-needed' | 'consistent' | 'preserve',
    embeddedLanguageFormatting?: 'auto' | 'off',
    singleAttributePerLine?: boolean,
    experimentalOperatorPosition?: 'start' | 'end',
    experimentalTernaries?: boolean,
    jsxBracketSameLine?: boolean
  }
};